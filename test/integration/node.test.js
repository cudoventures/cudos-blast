const { exec } = require('child_process')
const fs = require('fs') 

var assert = require('assert');
describe('Node command', function () {
    it('should start a node', async function () {
        const { err, stdout, stderr } = await exec('node cudos.js node start')
        console.log(err, stdout, stderr)
        //checkDir(process.cwd() + '/initFolder')
    });
})
