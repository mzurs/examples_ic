#!/usr/bin/bash

echo "Running... "

CDK=$1

CANISTER_NAME=$2

if [[ $CDK == "rust" ]]; then

    echo "Running Rust CDK"

    cd rust/ || bash

    bash scripts/deploy.sh "$CANISTER_NAME"

elif [[ $CDK == "typescript" ]]; then

    cd typescript/ || bash

    bash scripts/deploy.sh "$CANISTER_NAME"

else 

    echo "No CDK Found"

fi
