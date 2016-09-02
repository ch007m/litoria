#!/usr/bin/env bash

rm -rf ~/Temp/litoria/t1/
node bin/litoria.js init -c simple ~/Temp/litoria/t1
lr ~/Temp/t1/

rm -rf ~/Temp/litoria/t2/
node bin/litoria.js init -c management ~/Temp/litoria/t2
lr ~/Temp/litoria/t2/

rm -rf ~/Temp/litoria/t3/
node bin/litoria.js init -c lab ~/Temp/litoria/t3
lr ~/Temp/litoria/t3/
