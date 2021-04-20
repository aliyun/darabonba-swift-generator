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
  _contain,
  _deepClone,
  _upperFirst,
  _toSnakeCase,
  _avoidKeywords,
  _camelCase,
  _name,
  _resolveGrammerCall
} = require('../../lib/helper');
const Emitter = require('../../lib/emitter');

const {
  PropItem,
  AnnotationItem,

  GrammerNewObject,
  GrammerThrows,
  GrammerCatch,
  GrammerValue,
  GrammerCall,
  GrammerVar,

  BehaviorToMap,

  TypeItem,
  TypeMap,
  TypeString,
  TypeGeneric,
  BehaviorTamplateString,
  GrammerReturn,
  TypeVoid
} = require('../common/items');

const assert = require('assert');

function _names(notes) {
  let nameMap = {};
  if (notes['name']) {
    notes['name'].forEach(note => {
      if (note.prop !== note.value) {
        nameMap[note.prop] = note.value;
      }
    });
  }
  return nameMap;
}

function _needRecur(prop_type) {
  if (is.undefined(prop_type) || !is.tree(prop_type)) {
    return false;
  }
  let itemType = prop_type.itemType ? prop_type.itemType : prop_type.valType;
  if (is.undefined(itemType)) {
    return false;
  }
  if (is.tree(itemType)) {
    return _needRecur.call(this, itemType);
  }
  if (is.object(itemType) && !this.isClient(itemType)) {
    return true;
  }
  return false;
}

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
      full_name = `${_upperFirst(_camelCase(item.scope))}_${_upperFirst(_camelCase(item.package_name))}`;
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
    const outputPars = { head: '', body: '', foot: '' };

    /***************************** body ******************************/
    this.level = 0;
    let emitter = new Emitter(this.config);
    objects.filter(obj => obj.type === 'model').forEach((object) => {
      this.properties = {};
      object.body.filter(node => is.prop(node)).forEach(node => {
        this.properties[node.name] = node;
      });
      this.emitClass(emitter, object, object.subObject);
    });
    objects.filter(obj => obj.type === 'client').forEach((object) => {
      this.properties = {};
      object.body.filter(node => is.prop(node)).forEach(node => {
        this.properties[node.name] = node;
      });
      this.emitClass(emitter, object, object.subObject);
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
    config.filename = this.namespace;
    this.combineOutputParts(config, outputPars);
  }

  emitInclude(emitter) {
    emitter.emitln('import Foundation');
    emitter.emitln('import Tea');
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
        tmp.push(baseClass);
      });
      parent = ': ' + tmp.join(', ') + ' ';
    }
    let tmp = object.name.split('.');
    let className = _upperFirst(tmp[tmp.length - 1]);
    if (object.type === 'model' || object.body.some(item => !(item instanceof PropItem))) {
      emitter.emitln(`public struct ${_avoidKeywords(className)} ${parent}{`, this.level);
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
    } else {
      emitter.emitln(`open class ${_avoidKeywords(className)} ${parent}{`, this.level);
    }

    /***************************** emit class body ******************************/
    this.level++;
    object.body.forEach((node) => {
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
    emitter.emitln(`${_modify(func.modify)} func ${func_name}(${this.resolveFuncParams(func.params)}) -> ${this.emitType(this.funcReturnType)}{`, this.level);
    this.level++;
    func.body.forEach(element => {
      this.grammer(emitter, element);
    });
    this.level--;
    emitter.emitln('}', this.level);
  }

  emitMap(emitter, gram, layer = 0) {

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

  getStatementType(name) {
    if (!this.statements[name]) {
      debug.stack('Undefined statement', name, this.statements);
    }
    return this.statements[name].type;
  }

  resolveParams(grammer) {
    debug.halt('resolve params', grammer);
  }

  resolveFuncParams(params) {
    if (!params || !params.length) {
      return '';
    }
    let tmp = [];
    params.forEach(param => {
      tmp.push(`_ ${param.key}: ${this.emitType(param.type)}`);
    });
    return tmp.join(', ');
  }

  resolveCallPath(paths, params, grammer) {
    // path type: parent | object | object_static | call | call_static | prop | prop_static | map | list
    debug.halt('resolveCallPath', paths, params, grammer);
  }

  /**************************************** grammer ****************************************/
  grammerVar(emitter, gram, emitType = true) {
    emitter.emitln('Grammer Var');
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
      let params = gram.params.length > 0 ? this.resolveParams(gram) : '';
      emitter.emit(this.resolveCallPath(gram.path, params, gram));
    } else if (gram.type === 'prop' || gram.type === 'key') {
      emitter.emit(this.resolveCallPath(gram.path, '', gram));
    } else if (gram.type === 'super') {
      emitter.emit(`super.init(${this.resolveParams})`);
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
    debug.halt('Grammer Loop');
  }

  grammerBreak(emitter, gram) {
    emitter.emit('break');
  }

  grammerCondition(emitter, gram) {
    debug.halt('Grammer Condition');
  }

  grammerTryCatch(emitter, gram) {
    debug.halt('Grammer Try Catch');
  }

  grammerCatch(emitter, gram) {
    debug.halt('Grammer Catch');
  }

  grammerFinally(emitter, gram) {
    debug.halt('Grammer Finaly');
  }

  grammerContinue(emitter, gram) {
    emitter.emit('continue');
  }

  grammerThrows(emitter, gram) {
    debug.halt('Grammer Throws');
  }

  grammerNewObject(emitter, gram, isAssign = true, isPtrParam = false) {
    debug.halt('Grammer New Object');
  }

  grammerReturn(emitter, gram) {
    debug.halt('Grammer Return');
  }

  /**************************************** behavior ****************************************/
  behaviorTimeNow(emitter, behavior) {
    debug.halt('BehaviorTimeNow');
  }

  behaviorDoAction(emitter, behavior) {
    debug.halt('behaviorDoAction');
  }

  behaviorToMap(emitter, behavior) {
    debug.halt('behaviorToMap');
  }

  behaviorToModel(emitter, behavior) {
    debug.halt('behaviorToModel');
  }

  behaviorSetMapItem(emitter, behavior) {
    debug.halt('behaviorSetMapItem');
  }

  behaviorRetry(emitter, behavior) {
    debug.halt('behaviorRetry');
  }

  behaviorTamplateString(emitter, behavior) {
    debug.halt('behaviorTamplateString');
  }
}
module.exports = Combinator;
