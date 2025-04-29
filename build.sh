#!/bin/bash

set -e
set -x

# see also https://github.com/dalibo/pev2/issues/292#issuecomment-2721487239
curl -fsSL -o lib/index.html 'https://github.com/dalibo/pev2/releases/download/v1.15.0/pev2.html'
