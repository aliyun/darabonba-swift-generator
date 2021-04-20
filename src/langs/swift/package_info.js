'use strict';

// eslint-disable-next-line no-unused-vars
const debug = require('../../lib/debug');
const path = require('path');
const fs = require('fs');
const BasePackageInfo = require('../common/package_info');

const OPTION_LOCAL = 0b1;   // use local tmpl file to render content
const OPTION_SOURCE = 0b10;  // config by Teafile.{lang}.packageInfo
const OPTION_RENDER = 0b100;  // render content from tmpl
const OPTION_UPDATE = 0b1000;  // update if file already exist

// file_name : OPTIONS
const files = {
  '.gitignore': OPTION_LOCAL,
  'Cartfile': OPTION_LOCAL | OPTION_RENDER,
  'Package.swift': OPTION_LOCAL | OPTION_RENDER | OPTION_SOURCE,
  'podspec': OPTION_LOCAL | OPTION_RENDER,
  'LICENSE': OPTION_SOURCE,
  'README-CN.md': OPTION_SOURCE | OPTION_RENDER,
  'README.md': OPTION_SOURCE | OPTION_RENDER
};

class PackageInfo extends BasePackageInfo {
  emit(objects) {
    // this.outputDir = this.resolveOutputDir(packageInfo, '../../');
    // // this.checkParams(packageInfo, ['name', 'desc', 'github']);
    // requirePackage = Object.keys(requirePackage);
  }

  emitPackageInfo(packageInfo, requirePackage) {
    const params = {
      name: packageInfo.name,
      desc: packageInfo.desc,
      author: '',
      version: '',
      github: `https://github.com/${packageInfo.github}`,
      SwiftPackageDependencies: requirePackage.join(''),
      SwiftPackageDependenciesNamespace: requirePackage.join(''),
      CartfileDependencies: requirePackage.join(''),
      podspecDependencies: ''
    };
    Object.keys(files).forEach(filename => {
      let content = '';
      let optional = files[filename];
      if (optional & OPTION_UPDATE && fs.existsSync(path.join(this.outputDir, filename))) {
        content = fs.readFileSync(path.join(this.outputDir, filename)).toString();
      } else if (optional & OPTION_SOURCE && packageInfo.files && packageInfo.files[filename]) {
        let filepath = path.isAbsolute(packageInfo.files[filename]) ?
          packageInfo.files[filename] : path.join(this.config.pkgDir, packageInfo.files[filename]);
        if (!fs.existsSync(filepath)) {
          return;
        }
        content = fs.readFileSync(filepath).toString();
      } else if (optional & OPTION_LOCAL) {
        content = fs.readFileSync(path.join(__dirname, './files/' + filename + '.tmpl')).toString();
      }
      if (content !== '') {
        if (optional & OPTION_RENDER) {
          content = this.render(content, params);
        }
        if (filename === 'podspec') {
          // extra require
          filename = `${packageInfo.name}.podspec`;
        }
        fs.writeFileSync(path.join(this.outputDir, filename), content);
      }
    });
    if (packageInfo.testMode) {
      this.emitTestFiles(packageInfo, requirePackage);
    }
  }

  emitTestFiles(packageInfo, requirePackage) {
    const params = {
      name: packageInfo.name,
      desc: packageInfo.desc,
      author: '',
      version: '',
      github: `https://github.com/${packageInfo.github}`,
      SwiftPackageDependencies: requirePackage.join(''),
      SwiftPackageDependenciesNamespace: requirePackage.join(''),
      SwiftPackageTestDependenciesNamespace: '',
      CartfileDependencies: requirePackage.join(''),
      podspecDependencies: ''
    };

    // generate LinuxMain.swift
    this.renderAuto(
      path.join(__dirname, './files/LinuxMain.swift.tmpl'),
      path.join(this.outputDir, 'Tests', 'LinuxMain.swift'),
      params);

    // generate Package.swift
    this.renderAuto(
      path.join(__dirname, './files/Package-test.swift.tmpl'),
      path.join(this.outputDir, 'Package.swift'),
      params
    );

    // generate XCTestManifests.swift
    const testDir = packageInfo.name + 'Tests';
    this.renderAuto(
      path.join(__dirname, './files/XCTestManifests.swift.tmpl'),
      path.join(this.outputDir, 'Tests', testDir, 'XCTestManifests.swift'),
      params
    );

    // generate Test Case file
    this.renderAuto(
      path.join(__dirname, './files/TestCase.swift.tmpl'),
      path.join(this.outputDir, 'Tests', testDir, `${testDir}.swift`),
      params
    );
  }
}

module.exports = PackageInfo;
