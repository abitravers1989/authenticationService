const { createContainer, asFunction, asValue } = require('awilix');

// External Dependencies
const express = require('express');
const expressJwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const getenv = require('getenv');
const winston = require('winston');

// Internal Files
const server = require('./server');

const container = createContainer();

let envVariables;

try {
  envVariables = getenv.multi({
    auth0Domain: ['auth0Domain'],
    apiIdentifier: ['apiIdentifier']
  });
  if (!envVariables.auth0Domain) {
    throw new Error('auth0Domain env variable must be provided');
  }
  if (!envVariables.apiIdentifier) {
    throw new Error('apiIdentifier env variable must be provided');
  }
} catch (error) {
  winston.error(error, 'Error while loading environment variables');
}

// External Libraries
container.register({
  app: asFunction(express).singleton(),
  expressJwt: asValue(expressJwt),
  jwksRsa: asValue(jwksRsa),
  logger: asValue(winston),
});

// Config
container.register({
  envVariables: asValue(envVariables),
});

// Rest
container.register({
  server: asFunction(server).singleton(),
});

module.exports = container.cradle;
