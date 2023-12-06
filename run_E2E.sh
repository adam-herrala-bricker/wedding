#!/bin/bash

#bash script to run the Cypress E2E tests

cd backend &&
npm run start:test &

cd frontend &&
npm run test:e2e