describe('alpha test', async function() {
    const alphaContract = await getContractFactory('alpha', {
        count: 13
    });

    const contractAddress = await alphaContract.deploy();

    const _alphaContract = await getContractFromAddress(contractAddress);

    const {
        count
    } = await alphaContract.querySmart({
        'get_count': {}
    });

    expect(count).to.equal(14);
})
