FROM rust:1.53.0-alpine

RUN apk update
# Being required for gcc linking
RUN apk add --no-cache musl-dev

# Setup Rust with Wasm support
RUN rustup target add wasm32-unknown-unknown

# Check cargo version
RUN cargo --version

RUN rustup target list --installed

WORKDIR /code

CMD ["cargo", "build", "--target", "wasm32-unknown-unknown"]
