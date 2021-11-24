FROM cudos/binary:0.3

ARG INIT=0

RUN apt update && apt install -y jq

COPY ./init-root.sh ./

RUN chmod +x ./init-root.sh && \
    sed -i 's/\r$//' ./init-root.sh

ENV MONIKER="cudos-root-node-local-cli"
ENV CHAIN_ID="cudos-local-network-cli"
ENV ORCH_ETH_ADDRESS="0x0000000000000000000000000000000000000000"

ENV INIT=${INIT}

CMD ["/bin/bash", "-c", "if [ $INIT == '1' ]; then ./init-root.sh; fi && cudos-noded start"]