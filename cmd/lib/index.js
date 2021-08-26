const {
    exec,
    execSync
} = require("child_process");

const math_1 = require("@cosmjs/math");
const proto_signing_1 = require("@cosmjs/proto-signing");

const calculateFee = function calculateFee(gasLimit, {
    denom,
    amount: gasPriceAmount
}) {
    const amount = Math.ceil(gasPriceAmount.multiply(new math_1.Uint53(gasLimit)).toFloatApproximation());
    return {
        amount: proto_signing_1.coins(amount, denom),
        gas: gasLimit.toString(),
    };
}

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
module.exports.calculateFee = calculateFee;
