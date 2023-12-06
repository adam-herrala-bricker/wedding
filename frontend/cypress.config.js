require('dotenv').config()
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      ENTRY_KEY: process.env.ENTRY_KEY,
      ADMIN_KEY: process.env.ADMIN_KEY
    }
  },
});
