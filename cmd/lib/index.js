const {
    exec,
    execSync
} = require("child_process");

const execCmd = function execCmd(cmd) {
    exec(cmd,
        function(error, stdout, stderr) {
            console.log(stdout);
            if (error !== null) {
                console.log(stderr);
            }
        });
}

module.exports.execCmd = execCmd;
module.exports.execSyncCmd = execSync;
