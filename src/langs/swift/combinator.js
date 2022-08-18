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
  BehaviorToModel,
  TypeInteger,
} = require('../common/items');

class Combinator extends CombinatorBase {
  constructor(config, imports) {
    super(config, imports);
    this.eol = '';
    this.classMap = {};
    this.packageInfo = this.config.packageInfo || {};
    let name = _upperFirst(_camelCase(_name(this.config.name)));
    let scope = _upperFirst(_camelCase(_name(this.config.scope)));
    this.package = this.packageInfo.name ? _upperFirst(_camelCase(_name(this.packageInfo.name))) : `${scope}_${name}`;
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
      full_name = `${_upperFirst(_camelCase(item.package_name))}.${item.client_name}`;
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
      full_name = `${_upperFirst(_camelCase(item.package_name))}.${_name(access.slice(1).join('.'))}`;
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
    let models = objects.filter(obj => obj.type === object_type);
    if (!models.length) {
      return;
    }
    const outputPars = { head: '', body: '', foot: '' };

    /***************************** body ******************************/
    this.level = 0;
    let emitter = new Emitter(this.config);
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
    if (this.config.exec) {
      emitter.emitln('#!/usr/bin/env xcrun swift');
      emitter.emitln();
      emitter.emitln('import Cocoa');
    }
    this.emitInclude(emitter);
    outputPars.head = emitter.output;

    /***************************** foot ******************************/
    emitter = new Emitter(this.config);
    if (this.config.exec) {
      emitter.emitln();
      emitter.emitln('Client.main(CommandLine.arguments)');
    }
    outputPars.foot = emitter.output;

    /***************************** combine output ******************************/
    const config = _deepClone(this.config);
    config.ext = '.swift';
    config.dir = `${config.dir}`;
    if (!this.config.exec) {
      config.dir = `${config.dir}/Sources/${this.package}`;
    }
    config.filename = object_type === 'model' ? 'Models' : config.clientName || 'Client';
    this.combineOutputParts(config, outputPars);
  }

  emitInclude(emitter) {
    emitter.emitln('import Foundation');
    emitter.emitln('import Tea');
    Object.keys(this.dependencies).forEach(pack => {
      emitter.emitln(`import ${_upperFirst(_camelCase(_name(this.dependencies[pack].package_name)))}`);
    });
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
    this.levelUp();
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
    this.levelDown();

    /***************************** emit class body ******************************/
    this.levelUp();
    if (object.annotations.length > 0) {
      this.emitAnnotations(emitter, object.annotations);
    }

    object.body.forEach((node, index) => {
      this.statements = _deepClone(this.properties);
      if (is.func(node)) {
        this.emitFunc(emitter, node);
      } else if (is.construct(node)) {
        this.emitConstruct(emitter, node, object.extends.length > 0);
      } else if (is.prop(node)) {
        this.emitProp(emitter, node);
      } else if (is.annotation(node)) {
        this.emitAnnotation(node);
      } else {
        debug.stack('Unsupported object.body node', node);
      }
      if (index !== object.body.length - 1) {
        emitter.emitln();
      }
    });

    if (object.type === 'model') {
      let props = object.body.filter(node => is.prop(node));
      this.emitInitForModel(emitter);
      this.emitValidate(emitter, props);
      this.emitToMap(emitter, props);
      this.emitFromMap(emitter, object.name, props);
    }

    this.levelDown();

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
      type_str = !type.length ? 'Int' : type.length > 32 ? 'Int64' : 'Int32';
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
      type_str = `[${this.emitType(type.keyType)}: ${this.emitType(type.valType)}]`;
    } else if (is.inputStream(type)) {
      type_str = this.addInclude('$InputStream');
    } else if (is.outputStream(type)) {
      type_str = this.addInclude('$OutputStream');
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

  emitConstruct(emitter, node, hasExtends) {
    emitter.emitln(`public${hasExtends ? ' override ' : ' '}init(${this.resolveFuncParams(node.params)}) throws {`, this.level);
    this.levelUp();
    node.body.forEach(element => {
      this.grammer(emitter, element);
    });
    this.levelDown();
    emitter.emitln('}', this.level);
  }

  emitInitForModel(emitter) {
    emitter.emitln();
    emitter.emitln('public override init() {', this.level);
    this.levelUp();
    emitter.emitln('super.init()', this.level);
    this.levelDown();
    emitter.emitln('}', this.level);
    emitter.emitln();
    emitter.emitln('public init(_ dict: [String: Any]) {', this.level);
    this.levelUp();
    emitter.emitln('super.init()', this.level);
    emitter.emitln('self.fromMap(dict)', this.level);
    this.levelDown();
    emitter.emitln('}', this.level);
  }

  emitFunc(emitter, func) {
    this.funcReturnType = func.return[0];
    let func_name = _avoidKeywords(func.name);
    let return_type = this.emitType(this.funcReturnType);
    let isAsync = Array.isArray(func.modify) && func.modify.includes('ASYNC');
    if (isAsync) {
      emitter.emitln('@available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)', this.level);
    }
    emitter.emit(`${_modify(func.modify)} func ${func_name}(${this.resolveFuncParams(func.params)}) `, this.level);
    emitter.emit(`${isAsync ? 'async ' : ''}`);
    emitter.emit(`${isAsync || func.hasThrow || (Array.isArray(func.throws) && func.throws.length > 0) ? 'throws ' : ''}`);
    emitter.emit(`-> ${return_type ? `${return_type} ` : ''}{`);
    emitter.emitln();
    this.levelUp();
    func.body.forEach(element => {
      this.grammer(emitter, element);
    });
    this.levelDown();
    emitter.emitln('}', this.level);
  }

  // TODO emitFuncComment

  emitMap(emitter, gram) {
    let items = [];
    let expandItems = [];
    if (!Array.isArray(gram.value) && !(gram.value instanceof GrammerValue)) {
      this.grammer(emitter, gram.value, false, false);
      return;
    }
    items = gram.value.filter(i => !i.isExpand);
    expandItems = gram.value.filter(i => i.isExpand);
    if (!items.length && !expandItems.length) {
      emitter.emit('[:]');
      return;
    }
    if (expandItems.length) {
      emitter.emit(`${this.config.tea.converter.name}.${this.config.tea.converter.merge}(`);
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
      emitter.emit('[:]');
    }
    if (expandItems.length) {
      expandItems.forEach((item, index) => {
        let emit = new Emitter(this.config);
        this.grammer(emit, item, false, false, true);
        emitter.emit(`, ${emit.output}`);
      });
    }
    if (expandItems.length) {
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

  resolveParams(params, isStatic) {
    if (!params || !params.length) {
      return '';
    }
    let tmp = [];
    params.forEach((p) => {
      let emitter = new Emitter(this.config);
      if (isStatic) {
        p.needCast = false;
      }
      this.grammer(emitter, p, false, false, isStatic);
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
      tmp.push(`_ ${this.resolveName(param.key)}: ${this.emitType(param.type)}${param.isOptional ? '?' : ''}`);
      this.addStatement(this.resolveName(param.key), param.type);
    });
    return tmp.join(', ');
  }

  resolveCallPath(paths, params, grammer) {
    // path type: parent | object | object_static | call | call_static | prop | prop_static | map | list
    if (!paths || !paths.length) {
      return '';
    }
    let SEPARATOR = '';
    let res = [];
    let resolver = {
      parent: () => res = ['self'],
      class: () => res = [`${this.config.client.name || 'Client'}`],
      object: (p) => res.push(`.${this.resolveName(p.name)}${p.needCast ? SEPARATOR : ''}`),
      object_static: (p) => res.push(`.${this.resolveName(p.name)}`),
      call: (p) => res.push(`.${p.name}(${params})`),
      call_static: (p) => res.push(`.${this.resolveName(p.name)}(${params})`),
      prop: (p) => res.push(`.${this.resolveName(p.name)}${p.needCast ? SEPARATOR : ''}`),
      prop_static: (p) => res.push(`.${this.resolveName(p.name)}`),
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
    for (const p of paths) {
      if (resolver[p.type]) {
        resolver[p.type].call(this, p);
      } else {
        debug.stack('Unsupported call path type', p);
      }
      SEPARATOR = '!';
    }
    let str = res.join('');
    if (str[0] && str[0] === '.') {
      str = str.substr(1);
    }
    return str;
  }

  /**************************************** grammer ****************************************/
  grammerVar(emitter, gram, ignoreCast, emitType = true) {
    let name = gram.name ? gram.name : gram.key;
    name = _name(name);
    let st = gram.varType === 'var' ? 'var' : 'let';
    if (gram.varType === 'static_class') {
      emitter.emit(`${this.resolveName(name)}`);
    } else if (gram.varType === 'var' || gram.varType === 'const') {
      if (!this.hasStatement(name) && emitType) {
        emitter.emit(`${st} ${name}: ${this.emitType(gram.type)}${gram.isOptional ? '?' : ''}`);
        this.addStatement(name, gram.type);
      } else {
        if (gram.needToReadable) {
          emitter.emit(`${this.config.tea.core.name}.${this.config.tea.core.toReadable}(`);
        }
        var resolve = false;
        if (gram.expected instanceof TypeInteger && gram.type instanceof TypeInteger) {
          emitter.emit(`${this.emitType(gram.expected)}(`);
          resolve = true;
        }
        emitter.emit(`${name}`);
        if (resolve) {
          emitter.emit(')');
        }
        if (gram.needToReadable) {
          emitter.emit(')');
        } else if (!resolve && !ignoreCast && gram.type && gram.needCast) {
          emitter.emit(` as! ${this.emitType(gram.type)}`);
        }
      }
      if (!this.hasStatement(name)) {
        this.addStatement(name, gram.type);
      }
    } else {
      debug.stack(gram);
    }
  }

  grammerValue(emitter, gram, ignoreCast) {
    if (is.annotation(gram)) {
      this.emitAnnotation(emitter, gram);
      return;
    }
    if (gram.needToReadable) {
      emitter.emit(`${this.config.tea.core.name}.${this.config.tea.core.toReadable}(`);
    }
    if (gram.type === 'map' || gram.type === 'model_construct_params') {
      if (gram.type === 'model_construct_params') {
        gram.dataType = new TypeMap(
          new TypeString(), new TypeGeneric()
        );
      }
      this.emitMap(emitter, gram);
    } else if (gram.type === 'string') {
      emitter.emit(`"${gram.value}"`);
    } else if (gram.type === 'null') {
      emitter.emit('nil');
    } else if (gram.type === 'behavior' || gram.type === 'call'
      || gram.type === 'var' || gram.type === 'instance') {
      this.grammer(emitter, gram.value, false, false, ignoreCast);
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
    if (gram.dataType && gram.needCast) {
      if (is.array(gram.dataType)) {
        emitter.emit(' ?? []');
      } else if (is.map(gram.dataType)) {
        emitter.emit(' ?? [:]');
      } else if (is.string(gram.dataType)) {
        emitter.emit(' ?? ""');
      } else {
        emitter.emit('!');
      }
    }
    if (gram.needToReadable) {
      emitter.emit(')');
    }
  }

  grammerCall(emitter, gram) {
    if (gram.type === 'sys_func' || gram.type === 'method') {
      if (gram.isAsync) {
        emitter.emit('try await ');
      } else if (gram.hasThrow) {
        emitter.emit('try ');
      }
      const resolve_method = _resolveGrammerCall(gram, this.dependencies);
      if (resolve_method !== null) {
        if (!modules[resolve_method]) {
          debug.stack(`Unsupported method : ${resolve_method}`);
        }
        modules[resolve_method].call(this, emitter, gram);
        return;
      }
      let params = gram.params.length > 0 ? this.resolveParams(gram.params, gram.isStatic) : '';
      emitter.emit(this.resolveCallPath(gram.path, params, gram));
    } else if (gram.type === 'prop' || gram.type === 'key') {
      emitter.emit(this.resolveCallPath(gram.path, '', gram));
    } else if (gram.type === 'super') {
      emitter.emit(`try super.init(${this.resolveParams(gram.params)})`);
    } else {
      debug.stack(gram);
    }
  }

  grammerExpr(emitter, gram, ignoreCast) {
    if (!gram.left && !gram.right) {
      emitter.emit(` ${_symbol(gram.opt)} `);
      return;
    }
    this.grammer(emitter, gram.left, false, false);
    emitter.emit(` ${_symbol(gram.opt)} `);
    this.grammer(emitter, gram.right, false, false);
    if (gram.as && !ignoreCast) {
      emitter.emit(` as! ${this.emitType(gram.as.type)}`);
    }
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
      emitter.emitln('catch { throw error }', this.level);
    }
    if (gram.finallyBody) {
      this.grammer(emitter, gram.finallyBody, false, false);
    }
  }

  grammerCatch(emitter, gram) {
    if (gram.exceptions.type) {
      emitter.emitln('catch {', this.level);
      this.levelUp();
      emitter.emitln(`if error is ${this.emitType(gram.exceptions.type)} {`, this.level);
      this.levelUp();
      if (gram.exceptions.exceptionVar.name !== 'error') {
        emitter.emitln(`var ${gram.exceptions.exceptionVar.name} = error as! ${this.emitType(gram.exceptions.type)}`, this.level);
      }
      this.addStatement(gram.exceptions.exceptionVar.name, gram.exceptions.exceptionVar.type);
      gram.body.forEach(node => this.grammer(emitter, node));
      this.levelDown();
      emitter.emitln('} else {', this.level);
      this.levelUp();
      emitter.emitln('throw error', this.level);
      this.levelDown();
      emitter.emitln('}', this.level);
      this.levelDown();
      emitter.emitln('}', this.level);
    } else {
      emitter.emitln('catch {', this.level);
      this.addStatement('error', gram.exceptions.exceptionVar.type);
      this.levelUp();
      gram.body.forEach(node => this.grammer(emitter, node));
      this.levelDown();
      emitter.emitln('}', this.level);
    }
  }

  grammerFinally(emitter, gram) {
    emitter.emitln('defer {', this.level);
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
        let msg = gram.message ? `"${gram.message}"` : '';
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
    if (gram.expr instanceof BehaviorToModel) {
      this.behaviorToModel(emitter, gram.expr);
      return;
    }
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
    emitter.emit(`${this.addInclude('$Core')}.${this.config.tea.core.timeNow}()`);
  }

  behaviorDoAction(emitter, behavior) {
    emitter.emit('', this.level);
    this.grammerVar(emitter, behavior.var);
    emitter.emit(` = try await ${this.addInclude('$Core')}.${this.config.tea.core.doAction}(`);
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
    emitter.emit('var tmp: [String: Any] = ');
    this.grammer(emitter, behavior.grammer, false, false);
    emitter.emit('\n');
    emitter.emit(`return ${this.config.tea.converter.name}.${this.config.tea.model.fromMap}(`, this.level);
    emitter.emit(`${this.addModelInclude(behavior.expected)}(), tmp)`);
  }

  behaviorSetMapItem(emitter, behavior) {
    let emit = new Emitter();
    this.grammerCall(emit, behavior.call);
    // TODO 变量
    emitter.emit(`${emit.output}["${behavior.key}"] = `, this.level);
    this.grammerValue(emitter, behavior.value);
    emitter.emitln(';');
  }

  behaviorRetry(emitter, behavior) {
    emitter.emitln('throw Tea.RetryableError()', this.level);
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

  emitComplexToMap(emitter, prop, carrier, depth) {
    const name = prop.name;
    const fieldName = prop.fieldName;
    const type = prop.type;
    const parentType = prop.parentType;

    if (is.array(type)) {
      if (depth > 0) {
        emitter.emitln(`var l${depth} : [Any] = []`, this.level);
        emitter.emitln(`for k${depth} in ${name}! {`, this.level);
        this.levelUp();
        const propInfo = {
          name: `k${depth}`,
          fieldName: fieldName,
          type: type.itemType,
          parentType: type
        };
        this.emitComplexToMap(emitter, propInfo, `l${depth}`, depth + 1);
        this.levelDown();
        emitter.emitln('}', this.level);
        if (is.array(parentType)) {
          emitter.emitln(`${carrier}.append(l${depth})`, this.level);
        } else if (is.map(parentType)) {
          const num = depth - 1 > 0 ? depth - 1 : '';
          emitter.emitln(`${carrier}[k${num}] = l${depth}`, this.level);
        }
      } else {
        emitter.emitln(`if self.${_name(name)} != nil {`, this.level);
        this.levelUp();
        emitter.emitln('var tmp : [Any] = []', this.level);
        emitter.emitln(`for k in self.${_name(name)}! {`, this.level);
        this.levelUp();
        if (is.array(type.itemType) || is.map(type.itemType)) {
          const propInfo = {
            name: 'k',
            fieldName: fieldName,
            type: type.itemType,
            parentType: type
          };
          this.emitComplexToMap(emitter, propInfo, 'tmp', depth + 1);
        } else {
          if (is.object(type.itemType) && type.itemType.objectName && type.itemType.objectName.indexOf('#') === 0) {
            emitter.emitln('tmp.append(k.toMap())', this.level);
            emitter.needSave = true;
          } else {
            emitter.needSave = false;
          }
        }
        this.levelDown();
        emitter.emitln('}', this.level);
        emitter.emitln(`map["${fieldName}"] = tmp`, this.level);
        this.levelDown();
        emitter.emitln('}', this.level);
      }
    } else if (is.map(type)) {
      if (depth > 0) {
        emitter.emitln(`var d${depth} : [String: Any] = [:]`, this.level);
        emitter.emitln(`for (k${depth} ,v${depth}) in ${name}! {`, this.level);
        this.levelUp();
        const propInfo = {
          name: `v${depth}`,
          fieldName: fieldName,
          type: type.valType,
          parentType: type.lexeme
        };
        this.emitComplexToMap(emitter, propInfo, `d${depth}`, depth + 1);
        this.levelDown();
        emitter.emitln('}', this.level);
        if (is.array(parentType)) {
          emitter.emitln(`${carrier}.append(d${depth})`, this.level);
        } else if (is.map(parentType)) {
          const num = depth - 1 > 0 ? depth - 1 : '';
          emitter.emitln(`${carrier}[k${num}] = d${depth}`, this.level);
        }
      } else {
        emitter.emitln(`if self.${_name(name)} != nil {`, this.level);
        this.levelUp();
        emitter.emitln('var tmp : [String: Any] = [:]', this.level);
        emitter.emitln(`for (k, v) in self.${_name(name)}! {`, this.level);
        this.levelUp();
        if (is.array(type.valType) || is.map(type.valType)) {
          const propInfo = {
            name: 'v',
            fieldName: fieldName,
            type: type.valType,
            parentType: type
          };
          this.emitComplexToMap(emitter, propInfo, 'tmp', depth + 1);
        } else {
          if (is.object(type.valType) && type.valType.objectName && type.valType.objectName.indexOf('#') === 0) {
            emitter.emitln('tmp[k] = v.toMap()', this.level);
            emitter.needSave = true;
          } else {
            emitter.needSave = false;
          }
        }
        this.levelDown();
        emitter.emitln('}', this.level);
        emitter.emitln(`map["${fieldName}"] = tmp`, this.level);
        this.levelDown();
        emitter.emitln('}', this.level);
      }
    } else if (is.object(type) && type.objectName && type.objectName.indexOf('#') === 0) {
      const num = depth - 1 > 0 ? depth - 1 : '';
      if (is.array(parentType)) {
        emitter.emitln(`l${num}.append(k${num}.toMap())`, this.level);
      } else if (is.map(parentType)) {
        emitter.emitln(`d${num}[k${num}] = v${num}.toMap()`, this.level);
      }
      emitter.needSave = true;
    }
  }

  emitToMap(emitter, props) {
    emitter.emitln('public override func toMap() -> [String : Any] {', this.level);
    this.levelUp();
    emitter.emitln('var map = super.toMap()', this.level);
    props.forEach(prop => {
      let noteName = prop.notes.filter(item => item.key === 'name');
      let name = noteName.length > 0 ? noteName[0].value : prop.name;
      if (is.array(prop.type) || is.map(prop.type)) {
        let emt = new Emitter(emitter.config);
        const propInfo = {
          name: prop.name,
          fieldName: name,
          parentType: prop,
          type: prop.type,
        };
        this.emitComplexToMap(emt, propInfo, null, 0);
        if (emt.needSave === true) {
          emitter.emit(emt.output);
        } else {
          emitter.emitln(`if self.${_name(prop.name)} != nil {`, this.level);
          this.levelUp();
          emitter.emitln(`map["${name}"] = self.${_name(prop.name)}!`, this.level);
          this.levelDown();
          emitter.emitln('}', this.level);
        }

      } else {
        emitter.emitln(`if self.${_name(prop.name)} != nil {`, this.level);
        this.levelUp();
        if (is.object(prop.type) && prop.type.objectName && prop.type.objectName.indexOf('#') === 0) {
          emitter.emitln(`map["${name}"] = self.${_name(prop.name)}?.toMap()`, this.level);
        } else {
          emitter.emitln(`map["${name}"] = self.${_name(prop.name)}!`, this.level);
        }
        this.levelDown();
        emitter.emitln('}', this.level);
      }
    });

    emitter.emitln('return map', this.level);
    this.levelDown();
    emitter.emitln('}', this.level);
    emitter.emitln();
  }

  emitComplexFromMap(emitter, prop, carrier, depth) {
    const name = prop.name;
    const fieldName = prop.fieldName;
    const type = prop.type;
    const parentType = prop.parentType;

    if (is.array(type)) {
      if (depth > 0) {
        const propInfo = {
          name: `k${depth}`,
          fieldName: fieldName,
          type: type.itemType,
          parentType: type
        };

        emitter.emitln(`var l${depth} : [${this.emitType(type.itemType)}] = []`, this.level);
        emitter.emitln(`for k${depth} in ${name} as! [${this.emitType(type.itemType)}] {`, this.level);
        this.levelUp();
        this.emitComplexFromMap(emitter, propInfo, `l${depth}`, depth + 1);
        this.levelDown();
        emitter.emitln('}', this.level);
        if (is.array(parentType)) {
          emitter.emitln(`${carrier}.append(l${depth})`, this.level);
        } else if (is.map(parentType)) {
          const num = depth - 1 > 0 ? depth - 1 : '';
          emitter.emitln(`${carrier}[k${num}] = l${depth}`, this.level);
        }
      } else {
        emitter.emitln(`if dict.keys.contains("${fieldName}") {`, this.level);
        this.levelUp();
        emitter.emitln(`var tmp : [${this.emitType(type.itemType)}] = []`, this.level);
        emitter.emitln(`for k in dict["${fieldName}"] as! [${this.emitType(type.itemType)}] {`, this.level);
        this.levelUp();
        if (is.array(type.itemType) || is.map(type.itemType)) {
          const propInfo = {
            name: 'k',
            fieldName: fieldName,
            type: type.itemType,
            parentType: type
          };
          this.emitComplexFromMap(emitter, propInfo, 'tmp', depth + 1);
        } else {
          if (type.itemType.objectType === 'model') {
            emitter.emitln(`var model = ${this.emitType(type.itemType)}()`, this.level);
            emitter.emitln('model.fromMap(v as! [String: Any])', this.level);
            emitter.emitln('tmp.append(model)', this.level);
            emitter.needSave = true;
          } else {
            emitter.needSave = false;
          }
        }
        this.levelDown();
        emitter.emitln('}', this.level);
        emitter.emitln(`self.${_name(name)} = []`, this.level);
        this.levelDown();
        emitter.emitln('}', this.level);
      }
    } else if (is.map(type)) {
      if (depth > 0) {
        const propInfo = {
          name: `v${depth}`,
          fieldName: fieldName,
          type: type.valType,
          parentType: type
        };

        emitter.emitln(`d${depth} : [String: ${this.emitType(type.valType)}] = {}`, this.level);
        emitter.emitln(`for (k${depth}, v${depth}) in ${name} {`, this.level);
        this.levelUp();
        this.emitComplexFromMap(emitter, propInfo, `d${depth}`, depth + 1);
        this.levelDown();
        emitter.emitln('}', this.level);
        if (is.array(parentType)) {
          emitter.emitln(`${carrier}.append(d${depth})`, this.level);
        } else if (is.map(parentType)) {
          const num = depth - 1 > 0 ? depth - 1 : '';
          emitter.emitln(`${carrier}[k${num}] = d${depth}`, this.level);
        }
      } else {
        emitter.emitln(`if dict.keys.contains("${fieldName}") {`, this.level);
        this.levelUp();
        emitter.emitln(`var tmp : [String: ${this.emitType(type.valType)}] = [:]`, this.level);
        emitter.emitln(`for (k, v) in dict["${fieldName}"] as! [String: ${this.emitType(type.valType)}] {`, this.level);
        this.levelUp();
        if (is.array(type.valType) || is.map(type.valType)) {
          const propInfo = {
            name: 'v',
            fieldName: fieldName,
            type: type.valType,
            parentType: type
          };
          this.emitComplexFromMap(emitter, propInfo, 'tmp', depth + 1);
        } else {
          if (is.object(type.valType) && type.valType.objectName && type.valType.objectName.indexOf('#') === 0) {
            emitter.emitln(`var model = ${this.emitType(type.valType)}()`, this.level);
            emitter.emitln('model.fromMap(v as! [String: Any])', this.level);
            emitter.emitln('tmp[k] = model', this.level);
            emitter.needSave = true;
          } else {
            emitter.needSave = false;
          }
        }
        this.levelDown();
        emitter.emitln('}', this.level);
        emitter.emitln(`self.${_name(name)} = tmp`, this.level);
        this.levelDown();
        emitter.emitln('}', this.level);
      }
    } else if (is.object(type) && type.objectName && type.objectName.indexOf('#') === 0) {
      const num = depth - 1 > 0 ? depth - 1 : '';
      if (is.array(parentType)) {
        emitter.emitln(`var model = ${this.emitType(type)}()`, this.level);
        emitter.emitln(`model.fromMap(${name} as! [String: Any])`, this.level);
        emitter.emitln(`l${num}.append(model)`, this.level);
      } else if (is.map(parentType)) {
        emitter.emitln(`var model = ${this.emitType(type)}()`, this.level);
        emitter.emitln(`model.fromMap(${name} as! [String: Any])`, this.level);
        emitter.emitln(`d${num}[k${num}] = model`, this.level);
      }
      emitter.needSave = true;
    }
  }

  emitFromMap(emitter, modelName, props) {
    emitter.emitln('public override func fromMap(_ dict: [String: Any]) -> Void {', this.level);
    this.levelUp();
    props.forEach(prop => {
      let noteName = prop.notes.filter(item => item.key === 'name');
      let name = noteName.length > 0 ? noteName[0].value : prop.name;

      if (is.array(prop.type) || is.map(prop.type)) {
        let emt = new Emitter(emitter.config);
        const propInfo = {
          name: prop.name,
          fieldName: name,
          parentType: prop,
          type: prop.type,
        };
        this.emitComplexFromMap(emt, propInfo, null, 0);
        if (emt.needSave === true) {
          emitter.emit(emt.output);
        } else {
          emitter.emitln(`if dict.keys.contains("${name}") {`, this.level);
          this.levelUp();
          emitter.emitln(`self.${_name(prop.name)} = dict["${name}"] as! ${this.emitType(prop.type)}`, this.level);
          this.levelDown();
          emitter.emitln('}', this.level);
        }
      } else {
        emitter.emitln(`if dict.keys.contains("${name}") {`, this.level);
        this.levelUp();
        if (is.object(prop.type) && prop.type.objectName && prop.type.objectName.indexOf('#') === 0) {
          emitter.emitln(`var model = ${this.emitType(prop.type)}()`, this.level);
          emitter.emitln(`model.fromMap(dict["${name}"] as! [String: Any])`, this.level);
          emitter.emitln(`self.${_name(prop.name)} = model`, this.level);
        } else {
          emitter.emitln(`self.${_name(prop.name)} = dict["${name}"] as! ${this.emitType(prop.type)}`, this.level);
        }
        this.levelDown();
        emitter.emitln('}', this.level);
      }
    });
    this.levelDown();
    emitter.emitln('}', this.level);
  }

  emitComplexValidate(emitter, name, fieldType, depth) {
    if (fieldType.objectType) {
      if (is.array(fieldType)) {
        if (depth > 0) {
          emitter.emitln(`for k${depth} in ${name} {`, this.level);
          this.levelUp();
          this.emitComplexValidate(emitter, `k${depth}`, fieldType.itemType, depth + 1);
          this.levelDown();
          emitter.emitln('}', this.level);
        } else {
          emitter.emitln(`if self.${_name(name)} != nil {`, this.level);
          this.levelUp();
          emitter.emitln(`for k in self.${_name(name)} {`, this.level);
          this.levelUp();
          this.emitComplexValidate(emitter, 'k', fieldType.itemType, depth + 1);
          this.levelDown();
          emitter.emitln('}', this.level);
          this.levelDown();
          emitter.emitln('}', this.level);
        }
      } else if (is.map(fieldType)) {
        if (depth > 0) {
          emitter.emitln(`for v${depth} in ${name}.values {`, this.level);
          this.levelUp();
          this.emitComplexValidate(emitter, `v${depth}`, fieldType.valType, depth + 1);
          this.levelDown();
          emitter.emitln('}', this.level);
        } else {
          emitter.emitln(`if self.${_name(name)} != nil {`, this.level);
          this.levelUp();
          emitter.emitln(`for v in self.${_name(name)}.values {`, this.level);
          this.levelUp();
          this.emitComplexValidate(emitter, 'v', fieldType.valType, depth + 1);
          this.levelDown();
          emitter.emitln('}', this.level);
          this.levelDown();
          emitter.emitln('}', this.level);
        }
      } else if (is.object(fieldType) && fieldType.objectName && fieldType.objectName.indexOf('#') === 0) {
        emitter.emitln(`try ${name}?.validate()`, this.level);
        emitter.needSave = true;
      }
    }
  }

  emitValidate(emitter, props) {
    //print validate
    emitter.emitln('');
    emitter.emitln('public override func validate() throws -> Void {', this.level);
    this.levelUp();
    props.forEach(prop => {

      let required = prop.notes.filter(item => item.key === 'required');
      let maxLength = prop.notes.filter(item => item.key === 'maxLength');
      let minLength = prop.notes.filter(item => item.key === 'minLength');
      let pattern = prop.notes.filter(item => item.key === 'pattern');
      let maximum = prop.notes.filter(item => item.key === 'maximum');
      let minimum = prop.notes.filter(item => item.key === 'minimum');

      if (required.length > 0) {
        emitter.emitln(
          `try self.validateRequired(self.${_name(prop.name)}, "${_name(prop.name)}")`,
          this.level
        );
      }
      if (maxLength.length > 0 || minLength.length > 0 || pattern.length > 0 || maximum.length > 0 || minimum.length > 0) {
        emitter.emitln(`if self.${_name(prop.name)} != nil {`, this.level);
        this.levelUp();

        if (maxLength.length > 0) {
          emitter.emitln(`try self.validateMaxLength(self.${_name(prop.name)}, "${_name(prop.name)}", ${maxLength[0].value})`, this.level);
        }

        if (minLength.length > 0) {
          emitter.emitln(`try self.validateMinLength(self.${_name(prop.name)}, "${_name(prop.name)}", ${minLength[0].value})`, this.level);
        }

        if (pattern.length > 0) {
          emitter.emitln(`try self.validatePattern(self.${_name(prop.name)}, "${_name(prop.name)}", "${pattern[0].value}")`, this.level);
        }

        if (maximum.length > 0) {
          emitter.emitln(`try self.validateMaximum(self.${_name(prop.name)} as! NSNumber, "${_name(prop.name)}", ${maximum[0].value})`, this.level);
        }

        if (minimum.length > 0) {
          emitter.emitln(`try self.validateMinimum(self.${_name(prop.name)} as! NSNumber, "${_name(prop.name)}", ${minimum[0].value})`, this.level);
        }
        this.levelDown();
        emitter.emitln('}', this.level);
      }


      if (is.array(prop.type) || is.map(prop.type)) {
        let emt = new Emitter(emitter.config);
        this.emitComplexValidate(emt, prop.name, prop.type, 0);
        if (emt.needSave === true) {
          emitter.emit(emt.output);
        }
      } else if (is.object(prop.type) && prop.type.objectName && prop.type.objectName.indexOf('#') === 0) {
        emitter.emitln(`try self.${_name(prop.name)}?.validate()`, this.level);
      }
    });
    this.levelDown();
    emitter.emitln('}', this.level);
    emitter.emitln();
  }
}
module.exports = Combinator;
