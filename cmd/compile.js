const fs = require('fs')
const {
    exec,
} = require("child_process");

function compileCmd(argv) {
    let scmd = `docker run --rm -v "${process.env.PWD}/${argv.contractname}":/code --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cudo/rust-wasm`;

    if (!fs.existsSync(argv.contractname)) {
        console.log(`${argv.contractname} does not exist`);
        return
    }
    console.log('compiling...');
    execCmd(`docker run --rm -v "${process.env.PWD}/${argv.contractname}":/code --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cudo/rust-wasm`);
}

function execCmd(cmd) {
    exec(cmd,
        function(error, stdout, stderr) {
            console.log("execcc");
            console.log(stdout);
            if (error !== null) {
                console.log(stderr);
            }
        });
}

module.exports.compileCmd = compileCmd;
