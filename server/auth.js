const axios = require('axios');

const config = require('../config');

const { client_id, client_secret, request_token_url } = config.github;

module.exports = (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === '/auth') {
      const code = ctx.query.code;
      if (!code) {
        ctx.body = 'code not exist';
        return;
      }
      const result = await axios({
        method: 'POST',
        url: request_token_url,
        data: {
          client_id,
          client_secret,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      });

      console.log(result.status, result.data);

      if (result.status === 200 && (result.data && !result.data.error)) {
        ctx.session.githubAuth = result.data;

        const { access_token, token_type } = result.data;

        const userInfoResp = await axios({
          method: 'GET',
          url: 'https://api.github.com/user',
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        });

        ctx.session.userInfo = userInfoResp.data;
        console.log('ctx.session.userInfo', ctx.session.userInfo);
        console.log('ctx session', ctx.session);
        ctx.redirect((ctx.session && ctx.session.urlBeforeOAuth) || '/');
        ctx.session.urlBeforeOAuth = null;
      } else {
        const errorMsg = result.data && result.data.error;
        ctx.body = `request token failed ${errorMsg}`;
      }
    } else {
      await next();
    }
  });

  server.use(async (ctx, next) => {
    const method = ctx.method;
    const path = ctx.path;
    if (path === '/logout' && method === 'POST') {
      ctx.session = null;
      ctx.body = 'logout success';
    } else {
      await next();
    }
  });

  server.use(async (ctx, next) => {
    const method = ctx.method;
    const path = ctx.path;
    if (path === '/prepare-auth' && method === 'GET') {
      const { url } = ctx.query; // the url before doing OAuth
      ctx.session.urlBeforeOAuth = url;
      console.log('ctx session', ctx.session);
      console.log('config', config);
      console.log(config.OAUTH_URL);
      ctx.redirect(config.github.OAUTH_URL);
    } else {
      await next();
    }
  });
};
