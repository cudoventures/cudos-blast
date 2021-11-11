! The faucet wallet --> https://github.com/CudoVentures/cudos-cli/blob/4873e0747a067ad5ed08cf87f8660024b2ab37e9/cmd/lib/keystore.js#L20

I am skipping get-the-repo and build the node binary.

Run init-root.sh before building the docker image (You should already have the node binary). After that rename cudos-data to cudos-data-zero-block. Check if the faucet-wallet in cudos-data-zero-block
corresponds exactly to the mnemonic in the keystore.js file.
