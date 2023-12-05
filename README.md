English | [简体中文](/README-zh-CN.md)

[![Node.js CI](https://github.com/aliyun/darabonba-swift-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/aliyun/darabonba-swift-generator/actions/workflows/ci.yml)
[![codecov][cov-image]][cov-url]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@darabonba/swift-generator.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@darabonba/swift-generator
[cov-image]: https://codecov.io/gh/aliyun/darabonba-swift-generator/branch/master/graph/badge.svg
[cov-url]: https://codecov.io/gh/aliyun/darabonba-swift-generator
[download-image]: https://img.shields.io/npm/dm/@darabonba/swift-generator.svg?style=flat-square
[download-url]: https://npmjs.org/package/@darabonba/swift-generator

# Darabonba Code Generator for Swift

## Running Environment

- Node.js >= 10.0

## Installation

Darabonba Code Generator was designed to work in Node.js. The preferred way to install the Generator is to use the [NPM](https://www.npmjs.com/) package manager. Simply type the following into a terminal window:

```shell
npm install @darabonba/swift-generator
```

## Usage

Generate Swift Code

```javascript
'use strict';

const path = require('path');
const fs = require('fs');

const parser = require('@darabonba/parser');
const SwiftGenerator = require('@darabonba/swift-generator');

const sourceDir = "<Darabonda package directory>";
const outputDir = "<Generate output directory>";

// generate AST data by Darabonba Parser
let packageMetaFilePath = path.join(sourceDir, 'Darafile');
let packageMeta = JSON.parse(fs.readFileSync(packageMetaFilePath, 'utf8'));
let mainFile = path.join(sourceDir, packageMeta.main);
let ast = parser.parse(fs.readFileSync(mainFile, 'utf8'), mainFile);

// initialize generator
let generatorConfig = {
    ...packageMeta,
    pkgDir: sourceDir,
    outputDir
};

let generator = new SwiftGenerator(generatorConfig);

// generate swift code by generator
generator.visit(ast);

// The execution result will be output in the 'outputDir'
```

## Quickly Start

```bash
git clone https://github.com/aliyun/swift-generator.git
cd swift-generator/
node examples/complex.js
```

## Issues

[Opening an Issue](https://github.com/aliyun/darabonba-swift-generator/issues/new/choose), Issues not conforming to the guidelines may be closed immediately.

## Changelog

Detailed changes for each release are documented in the [release notes](/CHANGELOG.md).

## License

[Apache-2.0](/LICENSE)
Copyright (c) 2009-present, Alibaba Cloud All rights reserved.
