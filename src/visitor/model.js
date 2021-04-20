'use strict';

const assert = require('assert');
const BaseVisitor = require('./base');
const debug = require('../lib/debug');

const {
  ObjectItem,
  PropItem,
  NoteItem
} = require('../langs/common/items');

const {
  Modify,
} = require('../langs/common/enum');

const {
  _upperFirst,
  _isBasicType
} = require('../lib/helper');

class ModelVisitor extends BaseVisitor {
  init(ast, level) {
    this.modelName = ast.modelName.lexeme;

    const modelDirName = this.langConfig.model.dir ? this.langConfig.model.dir : 'models';
    this.layer = this.langConfig.resolvePathByPackage ?
      this.emitConfig.layer + '.' + modelDirName : modelDirName;

    this.emitConfig = {
      ...this.emitConfig,
      ext: this.langConfig.ext,
      layer: this.layer,
      filename: this.modelName,
      emitType: 'model'
    };
  }

  visit(ast, level = 0, predefined) {
    assert.equal(ast.type, 'model');

    this.init(ast, level);

    const combinator = this.getCombinator();
    combinator.includeList = this.langConfig.model.include;

    this.object = new ObjectItem();
    this.object.name = ast.modelName.lexeme;
    this.object.addExtends(this.langConfig.tea.model.name);

    // props
    this.initProp(this.object, ast.modelBody.nodes);

    if (predefined) {
      // for parser 1.0+
      // submodels
      const subModels = Object.keys(predefined).filter((key) => {
        return !key.startsWith('$')
        && predefined[key].type === 'model'
        && key.indexOf('.') !== -1
        && key.indexOf(this.modelName + '.') !== -1;
      }).map((key) => {
        return predefined[key];
      });

      if (subModels.length !== 0) {
        for (let i = 0; i < subModels.length; i++) {
          var subModelObject = new ObjectItem();
          subModelObject.addExtends(this.langConfig.tea.model);
          this.initProp(subModelObject, subModels[i].modelBody.nodes);
          this.object.addBodyNode(subModelObject);
        }
      }
    }
    this.done();
  }

  getSubModelName(node) {
    return [this.modelName, _upperFirst(node.fieldName.lexeme)].join('').replace(this.modelName, '');
  }

  initProp(obj, nodes) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.fieldValue.fieldType === undefined) {
        this.combinator.addModelInclude(this.getSubModelName(node));
      } else if (node.fieldValue.fieldType === 'array') {
        let name = '';
        if (node.fieldValue.fieldItemType.lexeme) {
          name = node.fieldValue.fieldItemType.lexeme;
        } else if (node.fieldValue.itemType) {
          name = node.fieldValue.fieldItemType.lexeme;
        }
        if (name && !_isBasicType()) {
          this.combinator.addModelInclude(name);
        }
      }

      const prop = new PropItem();
      prop.name = node.fieldName.lexeme;
      prop.type = node.fieldValue.fieldType;
      prop.modify.push(Modify.public());

      if (node.required) {
        prop.addNote(new NoteItem('required', true));
      }

      node.attrs.forEach((attr) => {
        let value;
        if (attr.attrValue.string !== undefined) {
          value = attr.attrValue.string;
        } else if (attr.attrValue.value !== undefined) {
          value = attr.attrValue.value;
        } else if (attr.attrValue.lexeme !== undefined) {
          value = attr.attrValue.lexeme;
        } else {
          debug.stack(attr);
        }
        let note = new NoteItem(
          attr.attrName.lexeme,
          value
        );
        prop.addNote(note);
        if (note.key === 'name' && note.value) {
          prop.name = note.value;
        }
      });

      obj.addBodyNode(prop);
    }
  }
}

module.exports = ModelVisitor;
