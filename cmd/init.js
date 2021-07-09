const fs = require('fs');
const mkdirp = require('mkdirp');
const minimatch = require('minimatch');
const {
    execSync
} = require("child_process");
const path = require('path');

const MODE_0666 = parseInt('0666', 8)
const MODE_0755 = parseInt('0755', 8)
const TEMPLATE_DIR = path.join(__dirname, '..', 'template')

function initCmd(argv) {
    let dir = argv.dir;
    if (dir !== '.') {
        mkdir(dir, '.')
    }

    if (fs.existsSync(`${dir}/${argv.contractname}`)) {
        console.log(`${argv.contractname} exists`);
        return
    }

    mkdir(dir, argv.contractname);
    mkdir(dir, `${argv.contractname}/examples`);
    mkdir(dir, `${argv.contractname}/schema`);
    mkdir(dir, `${argv.contractname}/src`);
    mkdir(dir, `${argv.contractname}/tests`);
    mkdir(dir, `${argv.contractname}/deploy`);

    copyTemplateMulti('', `${dir}/${argv.contractname}`, '*.toml');
    copyTemplateMulti('examples', `${dir}/${argv.contractname}/examples`, '*.rs');
    copyTemplateMulti('schema', `${dir}/${argv.contractname}/schema`, '*.json');
    copyTemplateMulti('src', `${dir}/${argv.contractname}/src`, '*.rs');
}

/**
 * Copy file from template directory.
 */

function copyTemplate(from, to) {
    write(to, fs.readFileSync(path.join(TEMPLATE_DIR, from), 'utf-8'))
}

/**
 * Copy multiple files from template directory.
 */

function copyTemplateMulti(fromDir, toDir, nameGlob) {
    fs.readdirSync(path.join(TEMPLATE_DIR, fromDir))
        .filter(minimatch.filter(nameGlob, {
            matchBase: true
        }))
        .forEach(function(name) {
            copyTemplate(path.join(fromDir, name), path.join(toDir, name))
        })
}


/**
 * Make the given dir relative to base.
 */

function mkdir(base, dir) {
    var loc = path.join(base, dir)

    console.log('   \x1b[36mcreate\x1b[0m : ' + loc + path.sep)
    mkdirp.sync(loc, MODE_0755)
}

/**
 * echo str > file.
 */

function write(file, str, mode) {
    fs.writeFileSync(file, str, {
        mode: mode || MODE_0666
    })
    console.log('   \x1b[36mcreate\x1b[0m : ' + file)
}

module.exports.initCmd = initCmd;
