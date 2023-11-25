#!/usr/bin/env bash

canister=$1

cargo build --manifest-path="$canister/Cargo.toml" \
    --target wasm32-unknown-unknown \
    --release --package "$canister"

cd ..

candid-extractor "target/wasm32-unknown-unknown/release/$canister.wasm" >"rust/$canister/$canister.did"

echo "Declarations Generated!"
