#!/bin/bash

#Note: I believe npm ci already only installs production deps
#when NODE_ENV is set to 'production', but just being safe

echo "Build script"

#go to FE directory and run ci (install deps)
cd ../frontend && npm ci &&

# run build
npm run build &&

# return to BE directory and install deps
cd - && npm ci &&

echo "Production build run successfully!"