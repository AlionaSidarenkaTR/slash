var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');
var fs = require('fs');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var configDB = require('./server/config/database.js');

var auth = express.Router();
var api = express.Router();
var port = process.env.PORT || 8080;
var TWO_DAYS = 2 * 24 * 60 * 60;
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
app.use(multiparty({
    uploadDir: 'client/img/public/'
}));

require('./server/initializer/passport')(passport);
require('./server/routes/auth.js')(auth, passport);
require('./server/routes/api.js')(api, passport);
mongoose.connect(configDB.url);

io.on('connection', function(socket){
	socket.on('create', function(data) {
    	socket.join(data.userId);
  	});
  	socket.on('invited', function(data) {
		io.in(data.listId).emit('sendInvitation', data);
  		data.invited_users && data.invited_users.forEach(function(user) {
  			socket.broadcast.to(user.userId).emit('recieveInvitation', {id: user.userId})
  		});
  	});

	socket.on('newList', function(data){
		socket.join(data.listId);
	});

	socket.on('taskChange', function(data) {
		io.in(data.listId).emit('taskChanged', data);
	});

	socket.on('subtaskChange', function(data){
		io.in(data.listId).emit('subtaskChanged', data);
		io.in(data.listId).emit('taskChanged', {listId: data.listId});
	});

	socket.on('result', function(data) {
		if(data.message === 'approve') {
			socket.join(data.listId);
		}
		//emit message to everyone
		io.in(data.listId).emit('recieveResult', {message: data.message, listId: data.listId, userId: data.userId});

		//emit message to invitor
	  	//socket.broadcast.to(data.listId).emit('recieveResult', {message: data.message, listId: data.listId, userId: data.userId});
	});

	socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected!');
    });

    socket.on('joinSockets', function(data) {
    	data.sockets.forEach(function(id) {
    		socket.join(id);
    	})
    })
});

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'client', 'views'));

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(session({
	secret: 'anyStringOfText',
	saveUninitialized: true,
	resave: true,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: TWO_DAYS
	})
}));
app.use(passport.initialize());
app.use(passport.session());//use after express session as it combines them together
app.use(flash());
app.use(express.static(path.resolve(__dirname, 'client')));
app.use('/auth', auth);
app.use('/api', api);

app.get("/", function(req, res) {
	if(req.user){
        res.cookie('userId', JSON.stringify(req.user._id));
		res.cookie('loggedIn', 'true');
	}
    res.sendFile(__dirname + '/client/views/index.html')
});

http.listen(8080, function(){
  console.log('listening on ', 8080);
});