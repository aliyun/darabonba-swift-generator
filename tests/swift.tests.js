'use strict';

const path = require('path');
const fs = require('fs');
const assert = require('assert');
require('mocha-sinon');

const DSL = require('@darabonba/parser');

const Generator = require('../src/generator');

const lang = 'swift';

const expectedDir = path.join(__dirname, 'expected/');
const fixturesDir = path.join(__dirname, 'fixtures/');
const outputDir = path.join(__dirname, '../', 'output/tests/');

function check(moduleName, expectedFiles = []) {
  const mainFilePath = path.join(fixturesDir, moduleName, 'main.dara');
  const moduleOutputDir = path.join(outputDir, moduleName);
  const prefixDir = path.join(fixturesDir, moduleName);
  const pkgContent = fs.readFileSync(
    fs.existsSync(path.join(prefixDir, 'Darafile')) ? path.join(prefixDir, 'Darafile') : path.join(prefixDir, 'Teafile'), 'utf8');
  const pkgInfo = JSON.parse(pkgContent);
  const config = {
    outputDir: moduleOutputDir,
    pkgDir: path.join(fixturesDir, moduleName),
    ...pkgInfo
  };
  const generator = new Generator(config, lang);

  const dsl = fs.readFileSync(mainFilePath, 'utf8');
  const ast = DSL.parse(dsl, mainFilePath);
  generator.visit(ast);
  setTimeout(function () {
    expectedFiles.forEach(element => {
      const outputFilePath = path.join(outputDir, moduleName, element);
      const expectedFilePath = path.join(expectedDir, moduleName, element);
      const expected = fs.readFileSync(expectedFilePath, 'utf8');
      assert.deepStrictEqual(fs.readFileSync(outputFilePath, 'utf8'), expected);
    });
  }, 2000);
}

describe('Swift Generator', function () {
  check('complex', []);
});
