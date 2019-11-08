#!/bin/bash
beforeDSName=$1
afterDSName=$2
set -e

echo "================Z/OS FILES RENAME DATA SET==============="
zowe zos-files rename data-set "$beforeDSName" "$afterDSName"
if [ $? -gt 0 ]
then
    exit $?
fi
