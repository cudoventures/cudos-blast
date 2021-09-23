FROM starport/cli:0.17.3
ENV APP_HOME=${APP_HOME}

RUN git clone https://github.com/CudoVentures/cudos-node.git

WORKDIR ./cudos-node

USER root

CMD ["chain", "serve"]
