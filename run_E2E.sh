#!/bin/bash

#bash script to run the Cypress E2E tests
#note: if you run this locally, you have to kill the process afterwards
# lsof -i tcp:3003
# kill -9 <PID>

cd backend &&
npm run start:test &

cd frontend &&
npm run test:e2e