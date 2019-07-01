const express = require('express');
const app = express();

// App setup
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/views`));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('It works!');
});

// Run the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.info(`The server is running on port ${PORT}`));