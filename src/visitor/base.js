'use strict';

const Emitter = require('../lib/emitter');

const {
  _getLangConfig,
  _getEmitConfig,
  _getCombinator,
  _deepClone
} = require('../lib/helper');

const {
  GrammerValue,
} = require('../langs/common/items');

class BaseVisitor {
  constructor(option = {}, lang, moduleInfo = {}) {
    this.__module = moduleInfo;
    this.option = option;
    this.lang = lang;
    this.langConfig = _deepClone(_getLangConfig(option, lang));
    this.emitConfig = _deepClone(_getEmitConfig(option, lang));
    this.object = null;
    this.combinator = null;

    this.statement = {};
  }

  getCombinator() {
    if (this.combinator === null) {
      this.combinator = _getCombinator(this.lang, this.emitConfig);
    }
    return this.combinator;
  }

  visit(ast) {
    throw new Error('Please override visit(ast)');
  }

  done() {
    const emitter = new Emitter(this.emitConfig);
    this.getCombinator().combine(emitter, this.object);
    return emitter;
  }

  constructorParams(ast) {
    const [init] = ast.moduleBody.nodes.filter((item) => {
      return item.type === 'init';
    });
    var params = [];
    if (init) {
      ast = init;
      for (let i = 0; i < ast.params.params.length; i++) {
        const param = ast.params.params[i];
        params.push(new GrammerValue(param.paramType.lexeme, param.defaultValue, param.paramName.lexeme));
      }
    }
    return params;
  }

  variables(ast) {
    ast.moduleBody.nodes.filter((item) => {
      return item.type === 'type' && item.value.type;
    }).forEach((item) => {
      this.statement[item.vid.lexeme] = {
        type: item.value.type,
        async: item.value.async ? true : false,
        static: item.value.isStatic ? true : false,
        return: item.value.returnType ? item.value.returnType.lexeme : ''
      };
    });
  }
}

module.exports = BaseVisitor;
