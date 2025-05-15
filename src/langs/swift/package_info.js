'use strict';

// eslint-disable-next-line no-unused-vars
const debug = require('../../lib/debug');
const path = require('path');
const fs = require('fs');
const BasePackageInfo = require('../common/package_info');
const { _deepClone, _upperFirst, _camelCase, _name, _dir } = require('../../lib/helper');
const Emitter = require('../../lib/emitter');

function getReleaseVersion(meta) {
  let version = meta.version;
  if (meta.releases && meta.releases.swift) {
    let tmp = meta.releases.swift.split(':');
    version = tmp[1];
  }
  return version;
}

class PackageInfo extends BasePackageInfo {
  emit(objects) {
    this.packageInfo = this.config.packageInfo || {};
    this.name = this.config.name;
    this.scope = this.config.scope;
    this.package = this.packageInfo.name ?
      _upperFirst(_camelCase(_name(this.packageInfo.name)))
      : _upperFirst(_camelCase(_name(`${this.scope}_${this.name}`)));
    const object = objects.find(obj => obj.type === 'client');
    this.client = object;
    this.imports = [];
    this.dependencies = _deepClone(this.dependencies);

    this.cartfile();
    this.packageManage();
    this.podspec();
    this.podfile();
    this.others();
    if (this.config.withTest) {
      this.tests();
    }
  }

  tests() {
    this.renderAuto(
      path.join(__dirname, './files/XCTestManifests.swift.tmpl'),
      path.join(this.config.dir, `Tests/${this.package}/XCTestManifests.swift`), {
        name: this.package
      }
    );
    this.renderAuto(
      path.join(__dirname, './files/TestCase.swift.tmpl'),
      path.join(this.config.dir, `Tests/${this.package}/${this.package}Tests.swift`), {
        name: this.package
      }
    );
    this.renderAuto(
      path.join(__dirname, './files/LinuxMain.swift.tmpl'),
      path.join(this.config.dir, 'Tests/LinuxMain.swift'), {
        name: this.package
      }
    );
  }

  others() {
    const files = [
      '.gitignore',
      '.swiftformat',
    ];
    files.forEach(file => {
      this.renderAuto(
        path.join(__dirname, `./files/${file}.tmpl`),
        path.join(this.config.dir, file)
      );
    });
  }

  cartfile() {
    let writepath = path.join(this.config.dir, 'Cartfile');
    let emitter = new Emitter(this.config);
    emitter.emitln('github aliyun/tea-swift ~> 1.0.3');
    Object.keys(this.dependencies).forEach((key) => {
      const item = this.dependencies[key];
      const meta = item.meta;
      let version = getReleaseVersion(meta);
      if (meta.swift && meta.swift.packageInfo && meta.swift.packageInfo.github) {
        emitter.emitln(`github ${meta.swift.packageInfo.github
          .replace('https://github.com/', '')
          .replace('http://github.com/', '')
          .replace('.git', '')} ~> ${version}`);
      } else {
        emitter.emitln(`github ${item.scope}/${item.package_name} ~> ${version}`);
      }
    });
    _dir(writepath);
    fs.writeFileSync(writepath, emitter.output);
  }

  packageManage() {
    let emitter = new Emitter(this.config);
    emitter.emitln('dependencies: [', 2);
    emitter.emitln('// Dependencies declare other packages that this package depends on.', 3);
    emitter.emitln('.package(url: "https://github.com/aliyun/tea-swift.git", from: "1.0.3"),', 3);
    let items = [];
    items.push('.product(name: "Tea", package: "tea-swift")');
    Object.keys(this.dependencies).forEach((key) => {
      const item = this.dependencies[key];
      const meta = item.meta;
      let version = getReleaseVersion(meta);
      let addr;
      if (meta.swift && meta.swift.packageInfo && meta.swift.packageInfo.github) {
        emitter.emitln(`.package(url: "${meta.swift.packageInfo.github}", from: "${version}"),`, 3);
        addr = meta.swift.packageInfo.github
          .replace('https://github.com/', '')
          .replace('http://github.com/', '')
          .replace('.git', '')
          .split('/')[1];
      } else {
        emitter.emitln(`.package(url: "https://github.com/${item.scope}/${item.package_name}.git", from: "${version}"),`, 3);
        addr = item.package_name;
      }
      items.push(`.product(name: "${item.package_name}", package: "${addr}")`);
    });
    emitter.emit(']', 2);
    let depen = items.join(`,
                        `);
    if (this.config.withTest) {
      items.unshift(`"${this.package}"`);
      let depenTest = items.join(', ');
      this.renderAuto(
        path.join(__dirname, './files/Package-test.swift.tmpl'),
        path.join(this.config.dir, 'Package.swift'), {
          name: this.package,
          SwiftPackageDependencies: emitter.output,
          SwiftPackageDependenciesNamespace: depen,
          SwiftPackageTestDependenciesNamespace: depenTest
        }
      );
    } else {
      this.renderAuto(
        path.join(__dirname, './files/Package.swift.tmpl'),
        path.join(this.config.dir, 'Package.swift'), {
          name: this.package,
          SwiftPackageDependencies: emitter.output,
          SwiftPackageDependenciesNamespace: depen
        }
      );
    }
  }

  podspec() {
    let author = `"${_upperFirst(this.scope)}" => ""`;
    if (this.packageInfo.author && this.packageInfo.email) {
      author = `"${this.packageInfo.author}" => "${this.packageInfo.email}"`;
    }

    let emitter = new Emitter(this.config);

    Object.keys(this.dependencies).forEach(key => {
      const item = this.dependencies[key];
      const meta = item.meta;
      let version = getReleaseVersion(meta);
      let package_name = `${_upperFirst(_camelCase(_name(item.package_name)))}`;
      emitter.emitln(`  spec.dependency '${package_name}',  '~> ${version}'`);
    });

    this.renderAuto(
      path.join(__dirname, './files/podspec.tmpl'),
      path.join(this.config.dir, `${this.package}.podspec`), {
        name: this.package,
        version: getReleaseVersion(this.config),
        desc: this.packageInfo.desc || `${this.scope} ${this.package} SDK for Swift`,
        homepage: this.packageInfo.github || `https://github.com/${this.scope}/${this.package}.git`,
        author: author,
        podspecDependencies: emitter.output
      }
    );
  }

  podfile() {
    let emitter = new Emitter(this.config);

    Object.keys(this.dependencies).forEach(key => {
      const item = this.dependencies[key];
      const meta = item.meta;
      let version = getReleaseVersion(meta);
      let package_name = `${_upperFirst(_camelCase(_name(item.package_name)))}`;
      emitter.emitln(`  pod '${package_name}',  '~> ${version}'`);
    });

    this.renderAuto(
      path.join(__dirname, './files/Podfile.tmpl'),
      path.join(this.config.dir, 'Podfile'), {
        name: this.package,
        podspecDependencies: emitter.output
      }
    );
  }
}

module.exports = PackageInfo;
