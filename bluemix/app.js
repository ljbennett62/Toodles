var cfenv = require( 'cfenv' );
var cors = require( 'cors' );
var express = require( 'express' );
var jsonfile = require( 'jsonfile' );
var mqtt = require( 'mqtt' );
var parser = require( 'body-parser' );
var request = require( 'request' );

// External configuration
config = jsonfile.readFileSync( __dirname + '/config.json' );

// Application
var app = express();

// Middleware
app.use( parser.json() );
app.use( parser.urlencoded( { 
	extended: false 
} ) );

// Cross domain access
app.use( cors() );

// Per-request actions
app.use( function( req, res, next ) {	
	// Configuration
	req.config = config;
	
	// Just keep swimming
	next();
} );

// Static for main files
app.use( '/', express.static( 'public' ) );

// Routes
app.use( '/api', require( './routes/conversation' ) );
app.use( '/api', require( './routes/language' ) );
app.use( '/api', require( './routes/sensor' ) );
app.use( '/api', require( './routes/stt' ) );
app.use( '/api', require( './routes/tts' ) );
app.use( '/api', require( './routes/visual' ) );

// Bluemix
var env = cfenv.getAppEnv();

// Listen
var server = app.listen( env.port, env.bind, function() {
	// Debug
	console.log( 'Started on: ' + env.port );
} );

// Connect to Watson IoT
var client  = mqtt.connect( 
  config.iot_host, 
  {
    clientId: config.iot_client + '_' + Math.round( ( Math.random() * 10000 ) ),
    username: config.iot_user,
    password: config.iot_password,
    port: config.iot_port
  }
);

// Socket
var io = require( 'socket.io' )( server );

// New socket connection
io.on( 'connection', function( socket ) {
  // Listen for sensor event
  // Broadcast when encountered
  socket.on( 'emulator', function( data ) {
    io.emit( 'sensor', data );
  } );

  // Listen for camera command
  socket.on( 'photo', function( data ) {
    client.publish( config.topic_photo, JSON.stringify( {
      start: data  
    } ) );
  } );

  // Listen for Bluetooth data
  socket.on( 'ble', function( data ) {
    client.publish( 'iot-2/type/Bean/id/IBM/evt/stacks/fmt/json', JSON.stringify( data ) );
  } );
} );

// Connected to Watson
// Subscribe for sensor data
client.on( 'connect', function() {
  console.log( 'Connected.' );

  client.subscribe( config.topic_stacks, function( error, granted ) {
    console.log( 'Sensors.' );
  } );

  client.subscribe( config.topic_stream, function( error, granted ) {
    console.log( 'Streaming.' );
  } );

  client.subscribe( config.topic_visual, function( error, granted ) {
    console.log( 'Visual.' );
  } );
} );

// New message arrived
client.on( 'message', function( topic, message ) {
  var data = null;
  var destination = null;

  // Parse JSON
  data = JSON.parse( message.toString() );

  if( topic == config.topic_stream ) {
    destination = 'stream';
  } else if( topic == config.topic_visual ) {
    destination = 'visual';
  } else {
    destination = 'sensor';
  }

  // Send to dashboard
  io.emit( destination, data );
} );
