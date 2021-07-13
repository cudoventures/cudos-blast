FROM starport/cli
ENV APP_HOME="./cudos_data/node"
RUN mkdir cudos-node

WORKDIR ./cudos-node

# till make cudos-node repo public
COPY ./cudos-node ./

USER root

CMD ["serve"]
