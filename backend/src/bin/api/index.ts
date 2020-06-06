import 'dotenv-flow/config';

import app from './app';
import log from '../../lib/log';

const PORT = process.env.PORT || 8080;

app
  .then((express) => {
    express.listen(PORT, () => log.info(`🚀 server started at http://localhost:${PORT}`));
  })
  .catch((err) => {
    log.error(err, "Couldn't initialize app");
    throw err;
  });
