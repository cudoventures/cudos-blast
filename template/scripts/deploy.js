async function main() {
    const TemplateContract = await getContractFactory('alpha', {
        count: 13
    });
    const contractAddress = await TemplateContract.deploy();
    console.log(`${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
