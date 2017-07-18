var chalk = require('chalk');
var logger = require('./logger');
var inquirer = require('inquirer');
var jsbeautify = require('js-beautify').js;
var path = require('path');
var fs = require('fs');
var execSync = require('child_process').execSync;
var _exeSync = execSync;
execSync = function (cmd) {
    console.log(cmd);
    return _exeSync(cmd);
}
var pkgPath = path.join(__dirname, './package.json');

function getPkgObj() {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
}

function getPkgField(flag) {
    return getPkgObj()[flag];
}

function setPkgField(flag, value) {
    let obj = getPkgObj();
    obj[flag] = `${value}`;
    return new Promise((resolve, reject) => {
        fs.writeFile(pkgPath, jsbeautify(JSON.stringify(obj)), (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(value);
        });
    });
}

function updateVersion(versionFlag, version) {
    return inquirer
        .prompt([{
            type: 'input',
            name: 'version',
            message: `Which version for node-fetch-sp?`,
            default: version
        }])
        .then((answers) => {
            if (version !== answers.version) {
                version = answers.version;
                return setPkgField(versionFlag, version).then(() => {
                    logger.success(`Update package.json ${versionFlag} succeed.`);
                    return version;
                });
            } else {
                return version;
            }
        });
}

var versionFlag = 'version';
var version = getPkgField(versionFlag);

updateVersion(versionFlag, version)
    .then((newverson) => {
        if (newverson !== version) {
            var name = `v${newverson}`;
            var message = `publish ${name}`
            execSync(`git add lib package.json&&git commit -m "${message}"`);
            execSync(`git tag -a ${name} -m "${message}" -f`);
            execSync(`git push origin --tags -f`);
        }
    })