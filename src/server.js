module.exports = ({ app, expressJwt, jwksRsa, envVariables, logger }) => {
  let server;
  return {
    start: () => {
      app.use(
        expressJwt({
          secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${
              envVariables.auth0Domain
            }/.well-known/jwks.json`,
          }),
          // Validate the audience and the issuer.
          audience: envVariables.apiIdentifier,
          issuer: `https://${envVariables.auth0Domain}/`,
          algorithms: ['RS256'],
        }),
      );

      app.get('/private', (req, res) => {
        res.send('Only authenticated users can reach here');
      });

      server = app.listen(envVariables.PORT, () => {
        logger.info(`Application listening on port ${server.address().port}`);
      });
    },
  };
};
