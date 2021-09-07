async function main() {
    const alphaContract = await getContractFromAddress('cudos1uul3yzm2lgskp3dxpj0zg558hppxk6pt8t00qe');
    const r = await alphaContract.execute({
        'increment': {}
    });
    console.log(r)
    const count = await alphaContract.querySmart({
        'get_count': {}
    });
    console.log(count);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(`${error}`);
        process.exit(1);
    });
