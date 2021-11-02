#!/bin/bash

FILE=cudos-data/config/genesis.json

if [ -f "$FILE" ]; then
	echo 'cudos-noded start'
	cudos-noded start
else
	echo 'clean start'
	cp -r ./cudos-data-zero-block/* ./cudos-data/.
	cudos-noded start
fi
