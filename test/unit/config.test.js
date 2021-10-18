const config = require('../../cmd/lib/config')

var assert = require('assert');
describe('./../cmd/lib/config', function () {
    describe('getConfig()', function () {
        it('should throw no when config is not found', async function () {
            const configPath = 'nonexistant/path'
            assert.rejects(async () => await config.getConfig(configPath),
                Error,
                'Config file was not found! Make sure that cudos.config.js exists at ${configPath}`');
        });
    });
    describe('getEndpoint()', function () {
        it('should throw exception when endpoint property is not found', async function () {
            assert.rejects(async () => await config.getEndpoint({}),
                Error, 'Missing [endpoint] in the config file.');
        });
    });
})
