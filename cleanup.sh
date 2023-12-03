#!/bin/bash

if [ "$1" == "all" ]; then

    echo "Removing all .dfx folders"

    find . -type d -name ".dfx" -exec rm -rf {} +

    echo "Removing target..."

    rm -rf target

else

    echo "No Argument Matched."

fi
