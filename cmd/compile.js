const fs = require('fs')
const {
    execSync
} = require("child_process");

function compileCmd(argv) {
    if (!fs.existsSync(argv.contractname)) {
        console.log(`${argv.contractname} does not exist`);
        return
    }
    // temporary solution before uploading our dockerimage to the Hub
    try {
        execSync("docker inspect cudo/rust-wasm").toString('utf-8');
    } catch (e) {
        try {
            execSync("docker build -f rust-wasm.Dockerfile --tag cudo/rust-wasm .").toString('utf-8');
        } catch (e) {}
    }

    try {
        execSync(`docker run --rm -v "${process.env.PWD}/${argv.contractname}":/code --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cudo/rust-wasm`).toString('utf-8');
    } catch (e) {
    }
    console.log("Compiled.");
}

module.exports.compileCmd = compileCmd;
