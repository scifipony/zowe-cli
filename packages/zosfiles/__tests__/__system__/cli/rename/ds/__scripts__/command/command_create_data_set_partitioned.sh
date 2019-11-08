#!/bin/bash
dataSetName=$1
set -e

echo "================Z/OS FILES CREATE DATA-SET-PARTITIONED==============="
zowe zos-files create data-set-partitioned "$dataSetName"
if [ $? -gt 0 ]
then
    exit $?
fi
