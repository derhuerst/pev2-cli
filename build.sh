#!/bin/bash

set -e
set -x

curl -L -s -O 'https://github.com/dalibo/pev2/releases/download/v0.20.1/pev2.tar.gz'

rm -rf lib/*
tar -x -C lib -f pev2.tar.gz --strip-components 1
