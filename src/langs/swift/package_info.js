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
    this.package = _upperFirst(_camelCase(_name(this.config.name)));
    this.scope = _upperFirst(_camelCase(_name(this.config.scope)));
    this.namespace = `${this.scope}_${this.package}`;
    const object = objects.find(obj => obj.type === 'client');
    this.client = object;
    this.imports = [];
    this.dependencies = _deepClone(this.dependencies);

    this.cartfile();
    this.packageManage();
    this.podspec();
    this.others();
    if (this.config.withTest) {
      this.tests();
    }
  }

  tests() {
    this.renderAuto(
      path.join(__dirname, './files/XCTestManifests.swift.tmpl'),
      path.join(this.config.dir, `Tests/${this.namespace}/XCTestManifests.swift`), {
        name: this.namespace
      }
    );
    this.renderAuto(
      path.join(__dirname, './files/TestCase.swift.tmpl'),
      path.join(this.config.dir, `Tests/${this.namespace}/${this.namespace}Tests.swift`), {
        name: this.namespace
      }
    );
    this.renderAuto(
      path.join(__dirname, './files/LinuxMain.swift.tmpl'),
      path.join(this.config.dir, 'Tests/LinuxMain.swift'), {
        name: this.namespace
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
    Object.keys(this.dependencies).forEach((key) => {
      const item = this.dependencies[key];
      const meta = item.meta;
      let version = getReleaseVersion(meta);
      if (meta.github) {
        emitter.emitln(`github ${meta.github.orgs}/${meta.github.repo} ~> ${version}`);
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
    let items = [];
    Object.keys(this.dependencies).forEach((key) => {
      const item = this.dependencies[key];
      const meta = item.meta;
      let version = getReleaseVersion(meta);
      if (meta.github) {
        emitter.emitln(`.package(url: "https://github.com/${meta.github.orgs}/${meta.github.repo}.git", from: "${version}"),`, 3);
      } else {
        emitter.emitln(`.package(url: "https://github.com/${item.scope}/${item.package_name}.git", from: "${version}"),`, 3);
      }
      items.push(`"${_upperFirst(_camelCase(_name(item.scope)))}_${_upperFirst(_camelCase(_name(item.package_name)))}"`);
    });
    emitter.emit(']', 2);
    let depen = items.join(', ');
    if (this.config.withTest) {
      items.unshift(`"${this.namespace}"`);
      let depenTest = items.join(', ');
      this.renderAuto(
        path.join(__dirname, './files/Package-test.swift.tmpl'),
        path.join(this.config.dir, 'Package.swift'), {
          name: this.namespace,
          SwiftPackageDependencies: emitter.output,
          SwiftPackageDependenciesNamespace: depen,
          SwiftPackageTestDependenciesNamespace: depenTest
        }
      );
    } else {
      this.renderAuto(
        path.join(__dirname, './files/Package.swift.tmpl'),
        path.join(this.config.dir, 'Package.swift'), {
          name: this.namespace,
          SwiftPackageDependencies: emitter.output,
          SwiftPackageDependenciesNamespace: depen
        }
      );
    }
  }

  podspec() {
    let orgs = this.config.scope;
    let repo = this.config.name;
    if (this.config.github && this.config.github.orgs) {
      orgs = this.config.github.orgs;
    }
    if (this.config.github && this.config.github.repo) {
      repo = this.config.github.repo;
    }
    let author = `"${_upperFirst(this.config.scope)}" => ""`;
    if (this.config.maintainers && this.config.maintainers.name && this.config.maintainers.email) {
      author = `"${this.config.maintainers.name}" => "${this.config.maintainers.email}"`;
    }

    let emitter = new Emitter(this.config);

    Object.keys(this.dependencies).forEach(key => {
      const item = this.dependencies[key];
      const meta = item.meta;
      let version = getReleaseVersion(meta);
      let package_name = `${_upperFirst(_camelCase(_name(item.scope)))}_${_upperFirst(_camelCase(_name(item.package_name)))}`;
      emitter.emitln(`  spec.dependency '${package_name}',  '~> ${version}'`);
    });

    this.renderAuto(
      path.join(__dirname, './files/podspec.tmpl'),
      path.join(this.config.dir, `${this.namespace}.podspec`), {
        name: this.namespace,
        version: this.config.version,
        desc: `${this.scope} ${this.package} SDK for Swift`,
        homepage: `https://github.com/${orgs}/${repo}.git`,
        author: author,
        podspecDependencies: emitter.output
      }
    );
  }
}

module.exports = PackageInfo;
