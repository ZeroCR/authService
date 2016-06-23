const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');
const helmet = require('helmet');

const app = express();



// Configuration
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
	app.use(errorHandler());
}

// Routes
// require('./config/express')(app);
require('./api/routes')(app);

app.listen(3000, function () {
	console.log('Demo Express server listening on port %d in %s mode', 3000, app.settings.env);
});

module.exports = app;
