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

async function check(moduleName, expectedFiles = []) {
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
  expectedFiles.forEach(element => {
    const outputFilePath = path.join(outputDir, moduleName, element);
    const expectedFilePath = path.join(expectedDir, moduleName, element);
    const expected = fs.readFileSync(expectedFilePath, 'utf8');
    assert.deepStrictEqual(fs.readFileSync(outputFilePath, 'utf8'), expected);
  });
}

describe('Swift Generator', function () {
  it('add annotation should ok', function () {
    check('annotation', [
      'Sources/Darabonba_Main/Client.swift',
      'Sources/Darabonba_Main/Models.swift'
    ]);
  });

  it('api should ok', function () {
    check('api', [
      'Sources/Darabonba_Main/Client.swift',
    ]);
  });

  // it('add comments should ok', function () {
  //   check('comment', [
  //     'Sources/Darabonba_Main/Client.swift',
  //     'Sources/Darabonba_Main/Models.swift'
  //   ]);
  // });

  it('complex should ok', function () {
    check('complex', [
      'Sources/Darabonba_Main/Client.swift',
      'Sources/Darabonba_Main/Models.swift'
    ]);
  });

  it('const should ok', function () {
    check('const', [
      'Sources/Darabonba_Main/Client.swift',
    ]);
  });

  it('empty should ok', function () {
    check('empty', [
      'Sources/Darabonba_Main/Client.swift',
    ]);
  });

  it('function should ok', function () {
    check('function', [
      'Sources/Darabonba_Main/Client.swift',
    ]);
  });

  it('import should ok', function () {
    check('import', [
      'Sources/Package/Client.swift',
      'Package.swift',
      'Package.podspec',
      'Cartfile',
      '.gitignore',
      '.swiftformat'
    ]);
  });

  it('map should ok', function () {
    check('map', [
      'Sources/Darabonba_Main/Client.swift',
      'Sources/Darabonba_Main/Models.swift'
    ]);
  });

  it('model should ok', function () {
    check('model', [
      'Sources/Darabonba_Main/Client.swift',
      'Sources/Darabonba_Main/Models.swift'
    ]);
  });

  it('statements should ok', function () {
    check('statements', [
      'Sources/Darabonba_Main/Client.swift',
    ]);
  });

  it('super should ok', function () {
    check('super', [
      'Sources/Darabonba_Main/Client.swift',
    ]);
  });

  it('alias should ok', function () {
    check('alias', [
      'Sources/Darabonba_Main/Client.swift',
    ]);
  });

  it('number should ok', function () {
    check('number', [
      'Sources/Darabonba_Main/Client.swift',
    ]);
  });

  it('package should ok', function () {
    check('package', [
      'Sources/Package/Main.swift',
      'Package.swift',
      'Package.podspec',
      'Cartfile',
      '.gitignore',
      '.swiftformat'
    ]);
  });

  it('exec should ok', function () {
    check('exec', [
      'Client.swift',
    ]);
  });

  it('optional should ok', function () {
    check('optional', [
      'Sources/Darabonba_Main/Client.swift',
      'Sources/Darabonba_Main/Models.swift'
    ]);
  });
});
