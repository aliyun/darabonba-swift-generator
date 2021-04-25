'use strict';

const debug = require('../../lib/debug');
const CombinatorBase = require('../common/combinator');
const PackageInfo = require('./package_info');
const modules = require('./modules');

const {
  Symbol,
} = require('../common/enum');

const {
  is,
  _symbol,
  _modify,
  _deepClone,
  _upperFirst,
  _avoidKeywords,
  _camelCase,
  _name,
  _resolveGrammerCall
} = require('../../lib/helper');
const Emitter = require('../../lib/emitter');

const {
  AnnotationItem,

  GrammerValue,
  GrammerCall,
  GrammerVar,

  TypeItem,
  TypeMap,
  TypeString,
  TypeGeneric,
} = require('../common/items');

class Combinator extends CombinatorBase {
  constructor(config, imports) {
    super(config, imports);
    this.eol = '';
    this.classMap = {};
    this.package = _upperFirst(_camelCase(_name(this.config.name)));
    this.scope = _upperFirst(_camelCase(_name(this.config.scope)));
    this.namespace = `${this.scope}_${this.package}`;
    this.properties = {};
    this.statements = {};
  }

  addInclude(name) {
    if (this.classMap[name]) {
      return this.classMap[name];
    }
    let full_name = '';
    let access = name.split('.');
    if (name[0] === '$') {
      full_name = this.coreClass(name);
    } else if (access.length === 1 && this.dependencies[access[0]]) {
      const item = this.dependencies[access[0]];
      full_name = `${_upperFirst(_camelCase(item.scope))}_${_upperFirst(_camelCase(item.package_name))}.Client`;
    } else {
      full_name = name;
    }
    full_name = full_name.split('.').map(s => _upperFirst(s)).join('.');
    this.classMap[name] = full_name;
    return full_name;
  }

  addModelInclude(name) {
    if (this.classMap[name]) {
      return this.classMap[name];
    }
    let full_name = '';
    let access = name.split('.');
    if (name[0] === '$') {
      full_name = this.coreClass(name);
    } else if (access.length > 1 && this.dependencies[access[0]]) {
      const item = this.dependencies[access[0]];
      full_name = `${_upperFirst(_camelCase(item.scope))}_${_upperFirst(_camelCase(item.package_name))}.${_name(access.slice(1).join('.'))}`;
    } else {
      full_name = name;
    }
    full_name = full_name.split('.').map(s => _upperFirst(s)).join('.');
    this.classMap[name] = full_name;
    return full_name;
  }

  combine(objects = []) {
    const packageInfo = new PackageInfo(this.config, this.dependencies);
    packageInfo.emit(objects);
    this.combineObject(objects, 'client');
    this.combineObject(objects, 'model');
  }

  combineObject(objects, object_type) {
    this.includeList = [];
    const outputPars = { head: '', body: '', foot: '' };

    /***************************** body ******************************/
    this.level = 0;
    let emitter = new Emitter(this.config);
    let models = objects.filter(obj => obj.type === object_type);
    models.forEach((object, index) => {
      this.properties = {};
      object.body.filter(node => is.prop(node)).forEach(node => {
        this.properties[node.name] = node;
      });
      this.emitClass(emitter, object, object.subObject);
      if (index !== models.length - 1) {
        emitter.emitln();
      }
    });
    outputPars.body = emitter.output;

    /***************************** head ******************************/
    emitter = new Emitter(this.config);
    this.emitInclude(emitter);
    outputPars.head = emitter.output;

    /***************************** combine output ******************************/
    const config = _deepClone(this.config);
    config.ext = '.swift';
    config.dir = `${config.dir}`;
    if (!this.config.exec) {
      config.dir = `${config.dir}/Sources/${this.namespace}`;
    }
    config.filename = object_type === 'model' ? 'Models' : 'Client';
    this.combineOutputParts(config, outputPars);
  }

  emitInclude(emitter) {
    emitter.emitln('import Foundation');
    emitter.emitln();
  }

  emitClass(emitter, object, subObjects) {
    /***************************** emit class header ******************************/
    let parent = '';
    if (object.extends.length > 0) {
      let tmp = [];
      if (!(object.extends instanceof Array)) {
        object.extends = [object.extends];
      }
      object.extends.forEach(baseClass => {
        tmp.push(this.resolveName(baseClass));
      });
      parent = ': ' + tmp.join(', ') + ' ';
    }
    let tmp = object.name.split('.');
    let className = _upperFirst(tmp[tmp.length - 1]);
    if (object.type === 'client') {
      className = 'Client';
    }
    emitter.emitln(`${object.type === 'client' ? 'open' : 'public'} class ${_avoidKeywords(className)} ${parent}{`, this.level);
    this.level++;
    const prefix = object.name + '.';
    const subs = subObjects.filter(obj => {
      if (!obj.name.startsWith(prefix)) {
        return false;
      }
      let str = obj.name.substr(prefix.length);
      return str.indexOf('.') < 0;
    });
    if (subs.length) {
      subs.forEach(obj => this.emitClass(emitter, obj, subObjects));
    }
    this.level--;

    /***************************** emit class body ******************************/
    this.level++;
    object.body.forEach((node, index) => {
      this.statements = _deepClone(this.properties);
      if (is.func(node)) {
        this.emitFunc(emitter, node);
      } else if (is.construct(node)) {
        this.emitConstruct(emitter, node);
      } else if (is.prop(node)) {
        this.emitProp(emitter, node);
      } else {
        debug.stack('Unsupported object.body node', node);
      }
      if (index !== object.body.length - 1) {
        emitter.emitln();
      }
    });
    this.level--;

    /***************************** emit class footer ******************************/
    emitter.emitln('}', this.level);
  }

  emitType(type) {
    if (!is.type(type)) {
      debug.stack('Inavalid type', type);
    }
    let type_str = null;
    if (is.any(type)) {
      type_str = 'Any';
    } else if (is.decimal(type)) {
      type_str = 'Double';
    } else if (is.integer(type)) {
      type_str = type.length > 32 ? 'Int64' : 'Int32';
    } else if (is.number(type)) {
      type_str = 'Int';
    } else if (is.string(type)) {
      type_str = 'String';
    } else if (is.bytes(type)) {
      type_str = '[UInt8]';
    } else if (is.array(type)) {
      let subType = this.emitType(type.itemType);
      type_str = `[${subType}]`;
    } else if (is.bool(type)) {
      type_str = 'Bool';
    } else if (is.void(type)) {
      type_str = 'Void';
    } else if (is.map(type)) {
      type_str = `[${this.emitType(type.keyType)}:${this.emitType(type.valType)}]`;
    } else if (is.stream(type)) {
      type_str = this.addInclude('$Stream');
    } else if (is.object(type)) {
      type_str = !type.objectName ? 'Void' : this.resolveName(type.objectName);
    } else if (is.null(type)) {
      type_str = 'nil';
    }
    if (type_str === null) {
      debug.stack('Unsupported Type', type);
    }
    if (typeof type_str === 'undefined') {
      debug.stack(type);
    }
    return type_str;
  }

  emitProp(emitter, prop) {
    emitter.emitln(`${_modify(prop.modify)} var ${_avoidKeywords(prop.name)}: ${this.emitType(prop.type)}?`, this.level);
  }

  emitAnnotation(emitter, annotation, level) {

  }

  emitConstruct(emitter, node) {
    emitter.emitln(`init(${this.resolveFuncParams(node.params)}) {`, this.level);
    this.level++;
    node.body.forEach(element => {
      this.grammer(emitter, element);
    });
    this.level--;
    emitter.emitln('}', this.level);
  }

  emitFunc(emitter, func) {
    this.funcReturnType = func.return[0];
    let func_name = _avoidKeywords(func.name);
    let return_type = this.emitType(this.funcReturnType);
    emitter.emitln(`${_modify(func.modify)} func ${func_name}(${this.resolveFuncParams(func.params)}) -> ${return_type ? `${return_type} ` : ''}{`, this.level);
    this.level++;
    func.body.forEach(element => {
      this.grammer(emitter, element);
    });
    this.level--;
    emitter.emitln('}', this.level);
  }

  emitMap(emitter, gram, layer = 0) {
    let items = [];
    let expandItems = [];
    if (!Array.isArray(gram.value) && !(gram.value instanceof GrammerValue)) {
      this.grammer(emitter, gram.value, false, false);
      return;
    }
    items = gram.value.filter(i => !i.isExpand);
    expandItems = gram.value.filter(i => i.isExpand);
    if (!items.length && !expandItems.length) {
      emitter.emit('[]');
      return;
    }
    let needCast = gram.needCast;
    if (needCast || expandItems.length) {
      emitter.emit(`${this.config.tea.converter.name}::merge(`);
    }
    if (items.length) {
      emitter.emitln('[');
      this.levelUp();
      items.forEach((item, index) => {
        let emit = new Emitter(this.config);
        this.grammer(emit, item, false, false);
        emitter.emit(`"${item.key}": ${emit.output}`, this.level);
        if (index !== items.length - 1) {
          emitter.emit(',');
        }
        emitter.emitln();
      });
      this.levelDown();
      emitter.emit(']', this.level);
    } else {
      emitter.emit('[]');
    }
    if (expandItems.length) {
      expandItems.forEach((item, index) => {
        let emit = new Emitter(this.config);
        this.grammer(emit, item, false, false);
        emitter.emit(`, ${emit.output}`);
      });
    }
    if (needCast) {
      emitter.emit(')');
    }
  }

  /**************************************** analyze ****************************************/

  resolveDataType(gram) {
    let expectedType = null;
    if (gram.returnType) {
      expectedType = gram.returnType;
    } else if (gram.dataType) {
      expectedType = gram.dataType;
    } else if (gram.type instanceof TypeItem) {
      expectedType = gram.type;
    } else if (gram.type === 'call') {
      expectedType = gram.value.returnType;
    }
    if (expectedType === null) {
      return null;
    }
    return this.emitType(expectedType);
  }

  hasStatement(name) {
    return !this.statements[name] ? false : true;
  }

  addStatement(name, type) {
    this.statements[name] = type;
  }

  getStatementType(name) {
    if (!this.statements[name]) {
      debug.stack('Undefined statement', name, this.statements);
    }
    return this.statements[name];
  }

  resolveParams(params) {
    if (!params || !params.length) {
      return '';
    }
    let tmp = [];
    params.forEach((p) => {
      let emitter = new Emitter(this.config);
      this.grammer(emitter, p, false, false);
      tmp.push(emitter.output);
    });
    return tmp.join(', ');
  }

  resolveFuncParams(params) {
    if (!params || !params.length) {
      return '';
    }
    let tmp = [];
    params.forEach(param => {
      tmp.push(`_ ${param.key}: ${this.emitType(param.type)}`);
      this.addStatement(param.key, param.type);
    });
    return tmp.join(', ');
  }

  resolveCallPath(paths, params, grammer) {
    // path type: parent | object | object_static | call | call_static | prop | prop_static | map | list
    if (!paths || !paths.length) {
      return '';
    }
    let res = [];
    let resolver = {
      parent: () => res = ['super'],
      object: (p) => res.push(`.${p.name}`),
      object_static: (p) => res.push(`.${this.resolveName(p.name)}`),
      call: (p) => res.push(`.${p.name}(${params})`),
      call_static: (p) => res.push(`.${this.resolveName(p.name)}(${params})`),
      prop: (p) => res.push(`.${p.name[0] === '@' ? p.name.substr(1) : p.name}`),
      prop_static: (p) => res.push(`.${p.name[0] === '@' ? p.name.substr(1) : p.name}`),
      map: (p) => {
        if (is.grammer(p.name)) {
          res.push(`[${this.gramRender(p.name)}]`);
        } else {
          res.push(`["${p.name}"]`);
        }
      },
      list: (p) => {
        if (is.grammer(p.name)) {
          res.push(`[${this.gramRender(p.name)}]`);
        } else {
          res.push(`[${p.name}]`);
        }
      }
    };
    paths.forEach((p) => {
      if (resolver[p.type]) {
        resolver[p.type].call(this, p);
      } else {
        debug.stack('Unsupported call path type', p);
      }
    });
    let str = res.join('');
    if (str[0] && str[0] === '.') {
      str = str.substr(1);
    }
    return str;
  }

  /**************************************** grammer ****************************************/
  grammerVar(emitter, gram, emitType = true) {
    let name = gram.name ? gram.name : gram.key;
    name = _name(name);
    let st = gram.varType === 'var' ? 'var' : 'let';
    if (gram.varType === 'static_class') {
      emitter.emit(`${name}::class`);
    } else if (gram.varType === 'var' || gram.varType === 'const') {
      if (!this.hasStatement(name) && emitType) {
        emitter.emit(`${st} ${name}: ${this.emitType(gram.type)}`);
        this.addStatement(name, gram.type);
      } else {
        emitter.emit(`${name}`);
      }
      if (!this.hasStatement(name)) {
        this.addStatement(name, gram.type);
      }
    } else {
      debug.stack(gram);
    }
  }

  grammerValue(emitter, gram, layer = 0) {
    if (is.annotation(gram)) {
      this.emitAnnotation(emitter, gram);
      return;
    }
    if (gram.type === 'map' || gram.type === 'model_construct_params') {
      if (gram.type === 'model_construct_params' && this.emitType(gram.dataType) !== 'map<string, boost::any>') {
        gram.dataType = new TypeMap(
          new TypeString(), new TypeGeneric()
        );
      }
      this.emitMap(emitter, gram, layer);
    } else if (gram.type === 'string') {
      emitter.emit(`"${gram.value}"`);
    } else if (gram.type === 'null') {
      emitter.emit('nil');
    } else if (gram.type === 'behavior' || gram.type === 'call'
      || gram.type === 'var' || gram.type === 'instance') {
      this.grammer(emitter, gram.value, false, false);
    } else if (gram.type === 'number' || gram.type === 'param' || gram.type === 'bool') {
      emitter.emit(gram.value);
    } else if (gram.type === 'expr') {
      if (Array.isArray(gram.value)) {
        gram.value.forEach(gramItem => {
          this.grammer(emitter, gramItem, false, false);
        });
      } else {
        this.grammer(emitter, gram.value, false, false);
      }
    } else if (gram.type === 'array') {
      let itemType = this.emitType(gram.dataType.itemType);
      if (gram.value.length) {
        emitter.emitln('[');
        this.levelUp();
        gram.value.forEach((item, i) => {
          if (item instanceof AnnotationItem) {
            this.emitAnnotation(emitter, item);
            return;
          }
          emitter.emit('', this.level);
          this.grammerValue(emitter, item, false, false);
          if (i < gram.value.length - 1) {
            emitter.emitln(',');
          } else {
            emitter.emitln();
          }
        });
        this.levelDown();
        emitter.emit(']', this.level);
      } else {
        emitter.emit(`[${itemType}]()`);
      }
    } else if (gram.type === 'not') {
      emitter.emit(_symbol(Symbol.reverse()));
      this.grammerValue(emitter, gram.value);
    } else {
      debug.stack(gram);
    }
  }

  grammerCall(emitter, gram) {
    if (gram.type === 'sys_func' || gram.type === 'method') {
      const resolve_method = _resolveGrammerCall(gram, this.dependencies);
      if (resolve_method !== null) {
        if (!modules[resolve_method]) {
          debug.stack(`Unsupported method : ${resolve_method}`);
        }
        modules[resolve_method].call(this, emitter, gram);
        return;
      }
      let params = gram.params.length > 0 ? this.resolveParams(gram.params) : '';
      emitter.emit(this.resolveCallPath(gram.path, params, gram));
    } else if (gram.type === 'prop' || gram.type === 'key') {
      emitter.emit(this.resolveCallPath(gram.path, '', gram));
    } else if (gram.type === 'super') {
      emitter.emit(`super.init(${this.resolveParams(gram.params)})`);
    } else {
      debug.stack(gram);
    }
  }

  grammerExpr(emitter, gram) {
    if (!gram.left && !gram.right) {
      emitter.emit(` ${_symbol(gram.opt)} `);
      return;
    }
    this.grammer(emitter, gram.left, false, false);
    emitter.emit(` ${_symbol(gram.opt)} `);
    this.grammer(emitter, gram.right, false, false);
  }

  grammerLoop(emitter, gram) {
    if (gram.type === 'foreach') {
      emitter.emit('for ');
      this.grammerVar(emitter, gram.item, false, false);
      emitter.emit(' in ');
      this.grammer(emitter, gram.source, false, false);
      emitter.emitln(' {');
    }
    this.levelUp();
    gram.body.forEach(node => {
      this.grammer(emitter, node);
    });
    this.levelDown();
    emitter.emitln('}', this.level);
  }

  grammerBreak(emitter, gram) {
    emitter.emit('break');
  }

  grammerCondition(emitter, gram) {
    if (gram.type === 'elseif') {
      emitter.emit('else if');
    } else {
      emitter.emit(`${gram.type}`);
    }

    if (gram.type !== 'else') {
      emitter.emit(' (');
      let emit = new Emitter(this.config);
      gram.conditionBody.forEach(condition => {
        this.grammer(emitter, condition, false, false);
      });
      emitter.emit(`${emit.output})`);
    }

    if (gram.body.length) {
      emitter.emitln(' {');
      this.levelUp();
      gram.body.forEach(node => {
        this.grammer(emitter, node);
      });
      this.levelDown();
      emitter.emitln('}', this.level);
    } else {
      emitter.emitln(' {}');
    }

    if (gram.elseItem.length && gram.elseItem.length > 0) {
      gram.elseItem.forEach(e => {
        this.grammer(emitter, e);
      });
    }
  }

  grammerTryCatch(emitter, gram) {
    emitter.emitln('do {');
    this.levelUp();
    gram.body.forEach(node => this.grammer(emitter, node));
    this.levelDown();
    emitter.emitln('}', this.level);
    if (gram.catchBody.length) {
      gram.catchBody.forEach(item => this.grammer(emitter, item, false, false));
    } else {
      emitter.emitln('catch Error(e) { throw e}', this.level);
    }
  }

  grammerCatch(emitter, gram) {
    let emitterVar = new Emitter();
    this.grammerVar(emitterVar, gram.exceptions.exceptionVar);
    let varName = emitterVar.output;
    emitter.emit(`catch (${this.emitType(gram.exceptions.type)} `, this.level);
    emitter.emit(varName);
    emitter.emitln(') {');
    this.levelUp();
    gram.body.forEach(node => this.grammer(emitter, node));
    this.levelDown();
    emitter.emitln('}', this.level);
  }

  grammerFinally(emitter, gram) {
    emitter.emitln('catch {', this.level);
    this.levelUp();
    gram.body.forEach(node => this.grammer(emitter, node));
    this.levelDown();
    emitter.emitln('}', this.level);
  }

  grammerContinue(emitter, gram) {
    emitter.emit('continue');
  }

  grammerThrows(emitter, gram) {
    if (gram.exception === null) {
      emitter.emit('throw ');
      this.grammerValue(emitter, gram.params[0]);
    } else {
      if (gram.params.length > 0) {
        emitter.emit(`throw ${this.emitType(gram.exception)}(`);
        if (gram.params.length === 1) {
          this.grammerValue(emitter, gram.params[0]);
        } else {
          let tmp = [];
          gram.params.forEach(p => {
            let emit = new Emitter();
            this.grammerValue(emit, p);
            tmp.push(emit.output);
          });
          emitter.emit(tmp.join(', '));
        }
        emitter.emit(')');
      } else {
        let msg = gram.message ? `'${gram.message}'` : '';
        emitter.emit(`throw ${this.emitType(gram.exception)}(${msg})`);
      }
    }
  }

  grammerNewObject(emitter, gram) {
    let objectName = '';
    objectName = gram.name;
    emitter.emit(`${this.resolveName(objectName)}(`);
    if (!Array.isArray(gram.params)) {
      this.grammerValue(emitter, gram.params);
    } else {
      emitter.emit(this.resolveParams(gram.params));
    }
    emitter.emit(')');
  }

  grammerReturn(emitter, gram) {
    emitter.emit('return ');

    if (gram.type === 'null') {
      this.grammerValue(emitter, new GrammerValue('null'));
    } else if (gram.type === 'grammer') {
      this.grammer(emitter, gram.expr, false, false);
    } else if (gram.type === 'string') {
      emitter.emit('""');
    } else {
      this.grammer(emitter, gram.expr, false, false);
    }
  }

  /**************************************** behavior ****************************************/
  behaviorTimeNow(emitter, behavior) {
    emitter.emit('Tea.timeNow()');
  }

  behaviorDoAction(emitter, behavior) {
    emitter.emit('', this.level);
    this.grammerVar(emitter, behavior.var);
    emitter.emit(`= ${this.addInclude('$Core')}::${this.config.tea.core.doAction}(`);
    let params = [];
    behavior.params.forEach(p => {
      let emit = new Emitter();
      this.grammerValue(emit, p);
      params.push(emit.output);
    });
    emitter.emit(params.join(', '));
    emitter.emitln(')');
    behavior.body.forEach(node => {
      this.grammer(emitter, node);
    });
  }

  behaviorToMap(emitter, behavior) {
    const grammer = behavior.grammer;
    if (grammer instanceof GrammerCall) {
      this.grammerCall(emitter, grammer);
    } else if (grammer instanceof GrammerVar) {
      this.grammerVar(emitter, grammer);
    } else {
      debug.stack(grammer);
    }
  }

  behaviorToModel(emitter, behavior) {
    emitter.emit(`${behavior.expected}.fromMap(`);
    this.grammer(emitter, behavior.grammer, false, false);
    emitter.emit(')');
  }

  behaviorSetMapItem(emitter, behavior) {
    let emit = new Emitter();
    this.grammerCall(emit, behavior.call);
    emitter.emit(`${emit.output}["${behavior.key}"] = `, this.level);
    this.grammerValue(emitter, behavior.value);
    emitter.emitln(';');
  }

  behaviorRetry(emitter, behavior) {
    emitter.emitln(`throw TeaError.runtimeError(${this.config.request}, ${this.config.response})`, this.level);
  }

  behaviorTamplateString(emitter, behavior) {
    let tmp = [];
    behavior.items.forEach(item => {
      let emit = new Emitter(this.config);
      if (item.dataType instanceof TypeString) {
        this.grammer(emit, item, false, false);
      } else {
        emit.emit('String(');
        this.grammer(emit, item, false, false);
        emit.emit(')');
      }
      if (emit.output && emit.output !== '""') {
        tmp.push(emit.output);
      }
    });
    emitter.emit(tmp.join(' + '));
  }
}
module.exports = Combinator;
