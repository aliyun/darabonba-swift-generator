'use strict';

const debug = require('../lib/debug');
const BaseVisitor = require('./base');

const {
  Symbol,
  Modify,
  Exceptions,
  Types
} = require('../langs/common/enum');

const {
  ObjectItem,
  FuncItem,

  GrammerVar,
  GrammerCall,
  GrammerExpr,
  GrammerLoop,
  GrammerBreak,
  GrammerCatch,
  GrammerValue,
  GrammerReturn,
  GrammerThrows,
  GrammerContinue,
  GrammerTryCatch,
  GrammerNewObject,
  GrammerCondition,
  GrammerException,
  GrammerReturnType,

  BehaviorRetry,
  BehaviorTimeNow,
  BehaviorDoAction,
  BehaviorSetMapItem,
} = require('../langs/common/items');

var REQUEST;
var RESPONSE;
var RUNTIME;

const {
  _isBasicType
} = require('../lib/helper');

const systemPackage = ['Util'];

class ApiVisitor extends BaseVisitor {
  init(ast, params) {
    this.layer = this.langConfig.resolvePathByPackage ?
      this.emitConfig.layer : '';

    this.emitConfig = {
      ...this.emitConfig,
      ext: this.langConfig.ext,
      layer: this.layer,
      filename: this.langConfig.client.filename,
      emitType: 'code'
    };
    REQUEST = this.langConfig.request;
    RESPONSE = this.langConfig.response;
    RUNTIME = this.langConfig.runtime;

    this.object = new ObjectItem();
    this.object.name = 'Client';
    this.object.params = params;
    this.object.extends = this.langConfig.baseClient;
    this.variables(ast);

    this.tea = this.langConfig.tea;
    this.getCombinator();
    this.combinator.includeList = this.langConfig.client.include;
    this.combinator.init(ast);
    this.visitInitBody(ast);
  }

  visitInitBody(ast) {
    let [init] = ast.moduleBody.nodes.filter((item) => {
      return item.type === 'init';
    });
    if (init && init.initBody && init.initBody.stmts) {
      init.initBody.stmts.forEach(stmt => {
        let node = this.visitStmt(stmt, this.object);
        this.object.addConstructorBody(node);
      });
    }
  }

  visitApi(ast, predefined) {
    var func = new FuncItem();
    func.name = ast.apiName.lexeme;
    this.visit(func, ast, ast.apiBody, predefined);
  }

  visitWrap(ast, predefined) {
    var func = new FuncItem();
    func.name = ast.wrapName.lexeme;
    this.visit(func, ast, ast.wrapBody, predefined);
  }

  visitFunc(ast) {
    var func = new FuncItem();
    func.name = ast.functionName.lexeme;
    this.visit(func, ast, ast.functionBody);
  }

  visit(func, ast, body, predefined) {
    this.predefined = predefined;
    if (ast.isAsync) {
      func.modify.push(Modify.async());
    }
    if (ast.isStatic) {
      func.modify.push(Modify.static());
    }
    func.modify.push(Modify.public());

    ast.params.params.forEach(p => {
      var param = new GrammerValue();
      if (p.paramType.type && p.paramType.type === 'array') {
        param.type = 'array';
        param.itemType = p.paramType.subType.lexeme;
      } else {
        param.type = p.paramType.lexeme;
      }
      param.key = p.paramName.lexeme;
      if (p.defaultValue) {
        param.value = p.defaultValue;
      }
      if (param.type && param.type !== 'array' && !_isBasicType(param.type)) {
        let alia = this.combinator.addModelInclude(param.type);
        if (alia && alia !== param.type) {
          param.type = alia;
        }
        if (body && body.type === 'apiBody') {
          func.addBodyNode(new GrammerCall('method', [
            { type: 'object', name: param.key },
            { type: 'call', name: 'validate' }
          ], [], null, true)); // validator
        }
      }

      func.params.push(param);
    });

    // func.addBodyNode(new GrammerNewLine());

    if (ast.returnType.type === 'subModel_or_moduleModel') {
      // const [, ...rest] = api.returnType.path;
      // need ast data
    } else {
      func.return.push(new GrammerReturnType(ast.returnType.lexeme));
    }

    if (ast.runtimeBody) {
      this.runtimeMode(func, ast, body);
    } else {
      let nodeList = this.requestBody(ast, body);
      nodeList.forEach(expr => {
        func.addBodyNode(expr);
      });
    }

    this.object.addBodyNode(func);
  }

  runtimeMode(func, ast, body) {
    var val = new GrammerValue('array', []);
    this.renderGrammerValue(val, ast.runtimeBody);

    // _runtime = {}
    func.addBodyNode(new GrammerExpr(
      new GrammerVar(RUNTIME, Types.any.key), Symbol.assign(), val
    ));

    // _lastRequest = null;
    func.addBodyNode(new GrammerExpr(
      new GrammerVar('_lastRequest', this.tea.request.name, 'var'),
      Symbol.assign(),
      new GrammerValue('null')
    ));

    // _now = Date.now();
    func.addBodyNode(new GrammerExpr(
      new GrammerVar('_now', Types.int32.key),
      Symbol.assign(),
      new GrammerValue('behavior', new BehaviorTimeNow())
    ));

    // let _retryTimes = 0;
    func.addBodyNode(new GrammerExpr(
      new GrammerVar('_retryTimes', Types.int16.key, 'var'),
      Symbol.assign(),
      new GrammerValue('number', 0)
    ));

    let whileOperation = new GrammerCondition('while');
    whileOperation.addCondition(
      new GrammerCall('method', [
        { type: 'object_static', name: this.tea.core.name },
        { type: 'call_static', name: this.tea.core.allowRetry }
      ], [
        new GrammerValue('call', new GrammerCall('key', [
          { type: 'object', name: RUNTIME },
          { type: 'map', name: 'retry' }
        ], [], new GrammerReturnType(Types.any.key))),
        new GrammerValue('param', '_retryTimes'),
        new GrammerValue('param', '_now'),
      ])
    );

    let retryTimesIf = new GrammerCondition('if');
    retryTimesIf.addCondition(
      new GrammerExpr(
        new GrammerVar('_retryTimes'),
        Symbol.greater(),
        new GrammerValue('number', 0)
      )
    );
    retryTimesIf.addBodyNode(
      new GrammerExpr(
        new GrammerVar('_backoffTime', Types.int16.key),
        Symbol.assign(),
        new GrammerCall('method', [
          { type: 'object_static', name: this.tea.core.name },
          { type: 'call_static', name: this.tea.core.getBackoffTime }
        ], [
          new GrammerValue('call', new GrammerCall('key', [
            { type: 'object', name: RUNTIME },
            { type: 'map', name: 'backoff' }
          ])),
          new GrammerValue('param', '_retryTimes'),
        ])
      )
    );

    let backoffTimeIf = new GrammerCondition('if');
    backoffTimeIf.addCondition(
      new GrammerExpr(
        new GrammerVar('_backoffTime'),
        Symbol.greater(),
        new GrammerValue('number', 0)
      )
    );
    backoffTimeIf.addBodyNode(
      new GrammerCall('method', [
        { type: 'object_static', name: this.tea.core.name },
        { type: 'call_static', name: this.tea.core.sleep }
      ], [
        new GrammerValue('param', '_backoffTime'),
      ])
    );

    retryTimesIf.addBodyNode(backoffTimeIf);
    whileOperation.addBodyNode(retryTimesIf);

    whileOperation.addBodyNode(new GrammerExpr(
      new GrammerVar('_retryTimes'),
      Symbol.assign(),
      new GrammerExpr(
        new GrammerVar('_retryTimes'),
        Symbol.plus(),
        new GrammerValue('number', 1)
      )
    ));

    let requestTryCatch = new GrammerTryCatch();
    let exceptionVar = new GrammerVar('e');
    let exceptionParam = new GrammerValue('var', exceptionVar);
    let catchException = new GrammerException(Exceptions.base(), exceptionVar);

    let tryCatch = new GrammerCatch([
      new GrammerCondition('if', [
        new GrammerCall('method', [
          { type: 'object_static', name: this.tea.core.name },
          { type: 'call_static', name: this.tea.core.isRetryable }
        ], [exceptionParam])
      ], [
        new GrammerContinue(whileOperation.index)
      ]),
      new GrammerThrows(null, [exceptionParam])
    ], catchException);
    requestTryCatch.addCatch(tryCatch);
    let nodeList = this.requestBody(ast, body, func.index);
    nodeList.forEach(node => {
      requestTryCatch.addBodyNode(node);
    });

    whileOperation.addBodyNode(requestTryCatch);

    func.addBodyNode(whileOperation);

    func.addBodyNode(
      new GrammerThrows(
        this.tea.exceptionUnretryable.name, [
          new GrammerValue('var', new GrammerVar('_lastRequest', this.tea.request.name))
        ]
      )
    );
  }

  renderGrammerValue(valGrammer, object, expectedType) {
    if (!valGrammer) {
      valGrammer = new GrammerValue();
    }
    if (!valGrammer.value && object.type === 'object') {
      valGrammer.value = [];
    }
    if (object.type === 'variable') {
      valGrammer.type = 'var';
      valGrammer.value = new GrammerVar(object.id.lexeme);
    } else if (object.type === 'object') {
      object.fields.forEach(field => {
        var val = null;
        var type = field.expr.type;
        if (field.expr.type === 'object') {
          val = [];
          type = 'array';
        }
        var exprChild = new GrammerValue(type, val);
        if (field.fieldName && field.fieldName.lexeme) {
          exprChild.key = field.fieldName.lexeme;
        }
        this.renderGrammerValue(exprChild, field.expr, expectedType);
        valGrammer.value.push(exprChild);
      });
      valGrammer.type = 'array';
      valGrammer.expected = expectedType ? expectedType.valueType.lexeme : null;

    } else if (object.type === 'string') {
      valGrammer.type = 'string';
      valGrammer.value = object.value.string;
    } else if (object.type === 'property_access') {
      var current = object.id.inferred;

      let call = new GrammerCall('key');
      var paramName = object.id.lexeme;
      if (paramName === '__module') {
        valGrammer.type = object.propertyPathTypes[0].name;
        valGrammer.value = this.__module[object.propertyPath[0].lexeme];
      } else {
        call.addPath({ type: 'object', name: paramName });
        for (var i = 0; i < object.propertyPath.length; i++) {
          var name = object.propertyPath[i].lexeme;

          if (current.type === 'model') {
            call.addPath({ type: 'prop', name: name });
          } else {
            call.addPath({ type: 'map', name: name });
          }
          current = object.propertyPathTypes[i];
        }
        valGrammer.type = 'call';
        valGrammer.value = call;
      }
    } else if (object.type === 'virtualCall') {
      let call_type = this.statement[object.vid.lexeme]
        && this.statement[object.vid.lexeme].static ? '_static' : '';
      let call = new GrammerCall('method', [
        { type: 'parent', name: '' },
        { type: 'call' + call_type, name: object.vid.lexeme }
      ]);
      object.args.forEach(arg => {
        let argCall = new GrammerValue();
        this.renderGrammerValue(argCall, arg);
        if (arg.inferred && arg.inferred.name === 'class') {
          argCall.type = 'class';
        }
        argCall.needCast = arg.needCast;
        call.addParams(argCall);
      });
      valGrammer.type = 'call';
      valGrammer.value = call;
    } else if (object.type === 'number') {
      valGrammer.type = 'number';
      valGrammer.value = object.value.value;
    } else if (object.type === 'virtualVariable') {
      valGrammer.type = 'call';
      let call = new GrammerCall('prop', [
        { type: 'parent', name: '' },
        { type: 'prop', name: object.vid.lexeme },
      ]);
      valGrammer.value = call;
    } else if (object.type === 'template_string') {
      valGrammer.type = 'expr';
      let expr = [];
      let n = 0;
      object.elements.forEach(ele => {
        if (n !== 0) {
          expr.push(new GrammerExpr(null, Symbol.concat()));
        }
        if (ele.type !== 'element') {
          expr.push(this.renderGrammerValue(null, ele.expr));
        } else {
          expr.push(new GrammerValue('string', ele.value.string));
        }
        n++;
      });
      valGrammer.value = expr;
    } else if (object.type === 'variable') {
      valGrammer.type = 'param';
      valGrammer.value = object.id.lexeme;
    } else if (object.type === 'null') {
      valGrammer.type = 'null';
      valGrammer.value = 'null';
    } else if (object.type === 'objectField') {
      valGrammer.key = object.fieldName.lexeme;
      valGrammer.type = 'expr';
      this.renderGrammerValue(valGrammer, object.expr);
    } else if (object.type === 'construct_model') {
      let objectName = object.aliasId ? `${object.aliasId.lexeme}` : '';
      if (object.propertyPath.length > 0 && objectName !== '') {
        objectName = objectName + '.';
      }
      object.propertyPath.forEach((p, i) => {
        objectName += p.lexeme;
        if (i !== object.propertyPath.length - 1) {
          objectName += '.';
        }
      });
      valGrammer.type = 'instance';
      let params = this.renderGrammerValue(null, object.object);
      valGrammer.value = new GrammerNewObject(objectName, params.value);
    } else if (object.type === 'call') {
      let call_type = 'method';
      valGrammer.type = 'call';
      if (object.left && object.left.id && object.left.id.type === 'module') {
        if (systemPackage.indexOf(object.left.id.lexeme) > -1) {
          call_type = 'sys_func';
        }
      } else {
        valGrammer.type = 'call';
        call_type = 'method';
      }
      let call = new GrammerCall(call_type);

      if (object.left) {
        let callType = object.isStatic ? '_static' : '';
        if (object.left.type === 'method_call') {
          call.addPath({ type: 'parent', name: '' });
          call.addPath({ type: 'call' + callType, name: object.left.id.lexeme });
        } else if (object.left.type === 'instance_call') {
          call.addPath({ type: 'object' + callType, name: object.left.id.lexeme });
        } else if (object.left.type === 'static_call') {
          call.addPath({ type: 'call_static', name: object.left.id.lexeme });
        } else {
          debug.stack(object.left);
        }

        if (object.left.propertyPath) {
          object.left.propertyPath.forEach(p => {
            // 因为这里的 ast path 是没有类型的，只有 lexeme，所以暂定为 call 类型
            call.addPath({
              type: 'call',
              name: p.lexeme
            });
          });
        }
      }
      if (object.args) {
        object.args.forEach(arg => {
          call.addParams(this.renderGrammerValue(null, arg));
        });
      }

      valGrammer.value = call;
    } else if (object.type === 'construct') {
      valGrammer.type = 'instance';
      valGrammer.value = new GrammerNewObject(object.aliasId.lexeme);
      object.args.forEach(item => {
        valGrammer.value.addParam(this.renderGrammerValue(null, item));
      });
    } else if (object.type === 'boolean') {
      valGrammer.type = 'bool';
      valGrammer.value = object.value;
    } else if (object.type === 'not') {
      valGrammer.type = 'not';
      valGrammer.value = this.renderGrammerValue(null, object.expr);
    } else if (object.type === 'array') {
      valGrammer.type = 'array';
      valGrammer.value = [];
      object.items.forEach(field => {
        var exprChild = this.renderGrammerValue(null, field, expectedType);
        valGrammer.value.push(exprChild);
      });
      valGrammer.type = 'array';
      valGrammer.expected = expectedType ? expectedType.valueType.lexeme : null;
    } else if (object.type === 'property') {
      object.type = 'property_access';
      this.renderGrammerValue(valGrammer, object);
    } else {
      debug.stack('unimpelemented : ' + object.type, object);
    }

    if (valGrammer.type === undefined) {
      debug.stack('valGrammer.type is undefined', object);
    }

    return valGrammer;
  }

  requestBody(ast, body, belong) {
    var nodeList = [];
    if (body) {
      if (body.type === 'apiBody') {
        // TeaRequest _request = new TeaRequest()
        nodeList.push(
          new GrammerExpr(
            new GrammerVar(REQUEST, this.tea.request.name),
            Symbol.assign(),
            new GrammerNewObject(this.tea.request.name)
          )
        );
      }

      const stmt = ['declares', 'protocol', 'port', 'method', 'pathname', 'quert', 'headers', 'body', 'appendStmts'];
      stmt.forEach(key => {
        if (body[key] && body[key] !== 'undefined') {
          if (Array.isArray(body[key])) {
            body[key].forEach(stmtItem => {
              let node = this.visitStmt(stmtItem, belong);
              nodeList.push(node);
            });
          } else {
            let node = this.visitStmt(body[key], belong);
            nodeList.push(node);
          }
        }
      });

      if (body.type === 'apiBody') {
        var doActionParams = [];
        doActionParams.push(new GrammerValue('param', REQUEST));

        if (ast.runtimeBody) {
          doActionParams.push(new GrammerValue('param', RUNTIME));
        }

        // response = Tea.doAction
        const doActionBehavior = new BehaviorDoAction(new GrammerVar(RESPONSE, this.tea.response.name), doActionParams);

        if (body.stmts) {
          body.stmts.stmts.forEach(stmt => {
            nodeList.push(this.visitStmt(stmt, belong));
          });
        }

        // _lastRequest = request_;
        nodeList.push(
          new GrammerExpr(
            new GrammerVar('_lastRequest', this.tea.request.name, 'var'),
            Symbol.assign(),
            new GrammerVar(REQUEST, this.tea.request.name)
          )
        );

        // returns
        if (ast.returns) {
          ast.returns.stmts.stmts.forEach(stmt => {
            // nodeList.push(this.visitStmt(stmt, belong));
            doActionBehavior.addBodyNode(this.visitStmt(stmt, belong));
          });
        }
        nodeList.push(doActionBehavior);
      }
    }
    return nodeList;
  }

  visitStmt(stmt, belong) {
    let node;
    if (stmt.type === 'declare') {
      let type = null;
      if (stmt.expectedType) {
        type = stmt.expectedType.lexeme;
      } else if (stmt.expr.inferred) {
        type = stmt.expr.inferred.name;
      }
      let expectedType = stmt.expectedType ? stmt.expectedType : null;
      let variate = new GrammerVar(stmt.id.lexeme, type);
      let value = this.renderGrammerValue(null, stmt.expr, expectedType);
      node = new GrammerExpr(variate, Symbol.assign(), value);
    } else if (stmt.type === 'requestAssign') {
      let variate = new GrammerCall('prop', [
        { type: 'object', name: REQUEST },
        { type: 'prop', name: stmt.left.id.lexeme }
      ]);
      var def = this.predefined['$Request'].modelBody.nodes.find((item) => {
        return item.fieldName.lexeme === stmt.left.id.lexeme;
      });
      let expectedType = def.fieldValue;
      let value = this.renderGrammerValue(null, stmt.expr, expectedType);
      if (stmt.left.type === 'request_property_assign') {
        let key = '';
        stmt.left.propertyPath.forEach((p, i) => {
          if (i === stmt.left.propertyPath.length - 1) {
            key = p.lexeme;
          } else {
            variate.addPath({ type: 'key', name: p.lexeme });
          }
        });
        node = new BehaviorSetMapItem(variate, key, value);
      } else {
        node = new GrammerExpr(variate, Symbol.assign(), value);
      }
    } else if (stmt.type === 'ifRequestAssign' || stmt.type === 'if') {
      node = this.visitIfElse(stmt, 'if');
    } else if (stmt.type === 'elseIfRequestAssign') {
      node = this.visitIfElse(stmt, 'elseif');
    } else if (stmt.type === 'return') {
      let expandFields = [];
      let notExpandField = [];
      node = new GrammerReturn();
      if (stmt.expr === undefined) {
        node.type = 'null';
      } else if (stmt.expr.type === 'object') {
        if (stmt.expr && stmt.expr.fields) {
          stmt.expr.fields.forEach(field => {
            if (field.type === 'expandField') {
              expandFields.push(this.renderGrammerValue(null, field.expr));
            } else {
              notExpandField.push(this.renderGrammerValue(null, field));
            }
          });
        } else if (stmt.expr) {
          expandFields.push(this.renderGrammerValue(null, stmt.expr));
        }
        node.params = notExpandField;
        node.expands = expandFields;
        node.type = stmt.expr.type;
      } else {
        let val = this.renderGrammerValue(null, stmt.expr);
        if (val.type !== 'null') {
          node.expands = [this.renderGrammerValue(null, stmt.expr)];
          node.type = stmt.expr.type;
        } else {
          node.type = 'null';
        }
      }
    } else if (stmt.type === 'throw') {
      node = new GrammerThrows(this.tea.exception.name);
      if (Array.isArray(stmt.expr)) {
        stmt.expr.forEach(e => {
          node.addParam(this.renderGrammerValue(null, e));
        });
      } else {
        node.addParam(this.renderGrammerValue(null, stmt.expr));
      }
    } else if (stmt.type === 'virtualCall') {
      let val = this.renderGrammerValue(null, stmt);
      node = val.value;
    } else if (stmt.type === 'while') {
      node = new GrammerCondition('while');
      if (Array.isArray(stmt.condition)) {
        stmt.condition.forEach(c => {
          node.addCondition(this.renderGrammerValue(null, c));
        });
      } else {
        node.addCondition(this.renderGrammerValue(null, stmt.condition));
      }
      if (stmt.stmts) {
        stmt.stmts.stmts.forEach(s => {
          node.addBodyNode(this.visitStmt(s, node.index));
        });
      }
    } else if (stmt.type === 'for') {
      node = new GrammerLoop('foreach');
      node.item = new GrammerVar(stmt.id.lexeme);
      node.source = this.renderGrammerValue(null, stmt.list);
      if (stmt.stmts) {
        stmt.stmts.stmts.forEach(s => {
          node.addBodyNode(this.visitStmt(s, node.index));
        });
      }
    } else if (stmt.type === 'assign') {
      node = new GrammerExpr(
        // 此处 ast 缺少是否需要添加声明关键字的判断，在组合器中判断是否为首次声明
        this.renderGrammerValue(null, stmt.left),
        Symbol.assign()
      );
      node.right = this.renderGrammerValue(null, stmt.expr);
    } else if (stmt.type === 'call') {
      node = this.renderGrammerValue(null, stmt).value;
    } else if (stmt.type === 'break') {
      node = new GrammerBreak();
    } else if (stmt.type === 'retry') {
      node = new BehaviorRetry();
    } else {
      debug.stack(stmt);
    }
    if (belong) {
      node.belong = belong;
    }
    return node;
  }

  visitIfConfition(stmtCondition) {
    let condition;
    if (stmtCondition.left) {
      let opt;
      let optList = ['and', 'or', 'not'];
      if (optList.indexOf(stmtCondition.type) > -1) {
        switch (stmtCondition.type) {
        case 'and': opt = Symbol.and(); break;
        case 'or': opt = Symbol.or(); break;
        case 'not': opt = Symbol.not(); break;
        default: debug.stack(stmtCondition);
        }
        condition = new GrammerExpr(
          this.renderGrammerValue(null, stmtCondition.left),
          opt,
          this.renderGrammerValue(null, stmtCondition.right)
        );
      } else if (stmtCondition.type === 'call') {
        condition = this.renderGrammerValue(null, stmtCondition);
      } else {
        debug.stack(stmtCondition);
      }
    } else {
      condition = this.renderGrammerValue(null, stmtCondition);
    }
    return condition;
  }

  visitIfElse(stmt, type = 'if') {
    let node = new GrammerCondition(type);
    if (stmt.condition) {
      node.addCondition(this.visitIfConfition(stmt.condition));
    }
    if (stmt.assigns) {
      stmt.assigns.forEach(assign => {
        node.addBodyNode(this.visitStmt(assign, node.index));
      });
    } else if (stmt.stmts) {
      let stmts = [];
      if (Array.isArray(stmt.stmts)) {
        stmts = stmt.stmts;
      } else if (Array.isArray(stmt.stmts.stmts)) {
        stmts = stmt.stmts.stmts;
      }
      stmts.forEach(assign => {
        let n = this.visitStmt(assign);
        if (n === undefined) {
          debug.stack(assign);
        }
        node.addBodyNode(this.visitStmt(assign, node.index));
      });

    }

    if (stmt.elseIfs) {
      stmt.elseIfs.forEach(elseIf => {
        node.addElse(this.visitIfElse(elseIf, 'elseif'));
      });
    }

    if (stmt.elseAssigns) {
      stmt.elseAssigns.forEach(elseAssign => {
        node.else.push(this.visitIfElse(elseAssign, 'else'));
      });
    } else if (stmt.elseStmts) {
      node.elseItem.push(this.visitIfElse(stmt.elseStmts, 'else'));
    }
    return node;
  }
}

module.exports = ApiVisitor;
