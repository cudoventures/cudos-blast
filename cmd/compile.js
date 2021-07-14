const fs = require('fs')
const {
    execCmd
} = require("./lib");

function compileCmd(argv) {
    let scmd = `docker run --rm -v "${process.env.PWD}/${argv.contractname}":/code --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cudo/rust-wasm`;

    if (!fs.existsSync(argv.contractname)) {
        console.log(`${argv.contractname} does not exist`);
        return
    }
    console.log('compiling...');
    execCmd(scmd);
}

module.exports.compileCmd = compileCmd;
