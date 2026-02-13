import 'dotenv/config';
import app from '@/main/config/app';


// const appInsights = require('applicationinsights');
// appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).setAutoCollectConsole(true, true).start();

const port = Number(process.env.PORT || 3000);

app.listen(port, () => console.log(`Server running on port: ${port} -  ${process.env.NODE_ENV}`));
