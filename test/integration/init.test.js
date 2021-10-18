const { exec } = require('child_process')
const fs = require('fs')

var assert = require('assert');
describe('Init command', async function () {

    it('should create a template in specified dir', async function () {
        const output = await execCommand()
        checkDir(process.cwd() + '/initFolder')
    });
})


function checkDir(directoryPath) {
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            console.log(file)
        });
    })
}

function execCommand() {
    return new Promise((resolve, reject) => {
        exec('node cudos.js init --dir initFolder', (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    })
}
