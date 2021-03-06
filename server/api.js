const axios = require('axios');

const github_base_url = 'https://api.github.com';

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const path = ctx.path;
    if (path.startsWith('/github')) {
      const githubAuth = ctx.session.githubAuth;
      const githubPath = `${github_base_url}${ctx.url.replace(
        '/github/',
        '/'
      )}`;
      const token = githubAuth && githubAuth.access_token;
      let headers = {};
      if (token) {
        headers['Authorization'] = `${githubAuth.token_type} ${token}`;
      }
      const result = await axios({
        method: 'GET',
        url: githubPath,
        headers,
      });

      try {
        if (result.status === 200) {
          ctx.body = result;
        } else {
          ctx.status = result.status;
          ctx.body = {
            success: false,
          };
        }
        ctx.set('Content-Type', 'application/json');
      } catch (error) {
        console.error(error);
        ctx.body = {
          success: false,
        };
      }
    } else {
      await next();
    }
  });
};
