#!/bin/bash
if [ -f "$1" ]; then
    base64 -d "$1"
else
    echo "$1" | base64 -d
fi 