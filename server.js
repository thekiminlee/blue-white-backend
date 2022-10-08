import express from 'express';
import routes from './routes.js';
import cors from 'cors';

// Server initialization
const app = express();
app.use(cors())

routes(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
    console.log(`Express server listening to PORT: ${PORT}`);
})