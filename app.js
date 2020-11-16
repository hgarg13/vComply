const createError = require('http-errors'),
	express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	logger = require('morgan'),
	mongoose = require("mongoose"),
	dotenv = require('dotenv'),
	cors = require('cors');

app.use(cors())
dotenv.config();

var indexRouter = require('./routes/index');
var configWorkflowRouter = require('./routes/config_workflow');
var actionRouter = require('./routes/action');

let url = "mongodb+srv://tradeUser:harshita13@tradecluster.goy7p.mongodb.net/vComply?retryWrites=true&w=majority&ssl=true" || "mongodb://localhost/iSim";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const UserModel = require("./model/user");
async function addUser() {
	//find users

	let data = [
		{user_id: 1,name: "Elsa Ingram"},
		{user_id: 2,name: "Paul Marsh"},
		{user_id: 3,name: "D Joshi"},
		{user_id: 4,name: "Nick Holden"},
		{user_id: 5,name: "John"}
	]
	await UserModel.create(data);
}
addUser()

app.use('/', indexRouter);
app.use('/configureWorkflow', configWorkflowRouter);
app.use('/takeAction', actionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
