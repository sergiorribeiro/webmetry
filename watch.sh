#!/bin/bash

digestA=""

while [[ true ]]
do
  digestB=`find src/ -type f -exec md5 {} \;`
  if [[ $digestA != $digestB ]] ; then           
    ./compile.sh
    digestA=$digestB
  fi
  sleep 2
done