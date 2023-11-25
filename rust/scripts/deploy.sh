#!/usr/bin/bash

CANISTER_NAME="$1"

# change to canister directory
cd "$CANISTER_NAME"/ || bash

# deploy the canister
dfx deploy "$CANISTER_NAME"

cd .. || bash

bash scripts/generate_did.sh "$CANISTER_NAME"

cd ..
