'use strict';

module.exports = {
  indent: '    ',
  keywords: [
    // https://docs.swift.org/swift-book/ReferenceManual/LexicalStructure.html
    // Keywords used in declarations
    'associatedtype', 'class', 'deinit', 'enum', 'extension', 'fileprivate', 'func', 'import', 'init',
    'inout', 'internal', 'let', 'open', 'operator', 'private', 'protocol', 'public', 'rethrows',
    'static', 'struct', 'subscript', 'typealias', 'var',
    // Keywords used in statements
    'break', 'case', 'continue', 'default', 'defer', 'do', 'else', 'fallthrough', 'for', 'guard', 'if',
    'in', 'repeat', 'return', 'switch', 'where', 'while',
    // Keywords used in expressions and types
    'as', 'Any', 'catch', 'false', 'is', 'nil', 'super', 'self', 'Self', 'throw', 'throws', 'true', 'try',
    // Keywords reserved in particular contexts
    'associativity', 'convenience', 'dynamic', 'didSet', 'final', 'get', 'infix', 'indirect', 'lazy', 'left',
    'mutating', 'none', 'nonmutating', 'optional', 'override', 'postfix', 'precedence', 'prefix', 'Protocol',
    'required', 'right', 'set', 'Type', 'unowned', 'weak', 'willSet',
    // NSObject prop
    'superclass', 'description', 'debugDescription'
  ],
  symbolMap: {
    'ASSIGN': '=',
    'EQ': '==',
    'NOT': '!=',
    'AND': '&&',
    'OR': '||',
    'PLUS': '+',
    'SUB': '-',
    'MULTI': '*',
    'DIV': '/',
    'POWER': '^',
    'GREATER': '>',
    'GREATER_EQ': '>=',
    'LESS': '<',
    'LESS_EQ': '<=',
    'REVERSE': '!',
    'CONCAT': '+'
  },
  modifyOrder: [
    'PRIVATE',
    'PROTECTED',
    'PUBLIC',
    'FINAL',
    'ABSTRACT',
    'STATIC'
  ],
  model: {
    dir: 'Models',
    include: [],
  },
  client: {
    name: 'Client',
    include: [
      { import: 'Foundation', alias: null },
      { import: 'Tea', alias: null }
    ]
  },
  tea: {
    core: {
      name: 'Tea.TeaCore',
      doAction: 'doAction',
      allowRetry: 'allowRetry',
      sleep: 'sleep',
      getBackoffTime: 'getBackoffTime',
      isRetryable: 'isRetryable',
      toReadable: 'toReadable',
      timeNow: 'timeNow',
    },
    model: {
      name: 'Tea.TeaModel',
      toMap: 'toMap',
      fromMap: 'fromMap'
    },
    inputStream: { name: 'InputStream' },
    outputStream: { name: 'OutputStream' },
    error: { name: 'Tea.ReuqestError' },
    converter: {
      name: 'Tea.TeaConverter',
      merge: 'merge'
    },
    response: { name: 'Tea.TeaResponse' },
    request: { name: 'Tea.TeaRequest' },
    exception: { name: 'Tea.TeaError' },
    exceptionRetryable: { name: 'Tea.RetryableError' },
    exceptionUnretryable: { name: 'Tea.UnretryableError' },
  }
};
