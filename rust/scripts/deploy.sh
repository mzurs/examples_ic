#!/usr/bin/bash

CANISTER_NAME="$1"

# change to canister directory
cd "$CANISTER_NAME"/ || true

# deploy the canister
dfx deploy "$CANISTER_NAME"

cd ..
