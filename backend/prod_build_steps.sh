#!/bin/bash

#Note: I believe npm ci already only installs production deps
#when NODE_ENV is set to 'production', but just being safe

echo "Build script"

cd ../frontend && npm ci --production &&

cd npm run build &&

cd - && npm ci --production &&

echo "Production build run successfully!"