FROM golang:buster as builder

RUN apt update

RUN apt install -y jq build-essential

WORKDIR /usr/cudos-builder

COPY ./CudosNode ./CudosNode
COPY ./CudosGravityBridge ./CudosGravityBridge

RUN cd ./CudosNode && make

RUN FOLDER=$(ls /go/pkg/mod/github.com/\!cosm\!wasm/ | grep wasmvm@v) && ln -s /go/pkg/mod/github.com/\!cosm\!wasm/${FOLDER} /go/pkg/mod/github.com/\!cosm\!wasm/wasmvm

FROM golang:buster

WORKDIR /usr/cudos

COPY --from=builder /go/pkg/mod/github.com/!cosm!wasm/wasmvm/api/libwasmvm.so /usr/lib
COPY --from=builder /go/bin/cudos-noded /go/bin/cudos-noded

COPY ./cudos-data-zero-block ./cudos-data-zero-block
COPY ./start-node.sh ./start-node.sh

CMD ["./start-node.sh"]
