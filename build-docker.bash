#!/bin/bash
set -ex
cd `dirname $0`
docker build -t ocrnyc/intotheokavango .
docker push ocrnyc/intotheokavango 
rm -rf nginx/static
cp -r static nginx/
docker build -t ocrnyc/intotheokavango-nginx ./nginx
docker push ocrnyc/intotheokavango-nginx

