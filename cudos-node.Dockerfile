FROM starport/cli
ENV APP_HOME="./cudos_data/node"

RUN git clone https://github.com/CudoVentures/cudos-node.git

WORKDIR ./cudos-node

USER root

CMD ["serve"]
