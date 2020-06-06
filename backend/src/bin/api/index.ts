import 'dotenv-flow/config';

import app from './app';

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`🚀 server started at http://localhost:${PORT}`));
