const dotenv = require('dotenv').config();
const Twitter = require('twitter');
_ = require('lodash')
const path = require('path');

const express = require('express')
const socket = require("socket.io")


let SEARCH_TIME = 5 * (60 * 1000);     // time to get tweets in minutes (ms conversion factor)

// Express stuff

const app = express()
app.use(express.static(path.join(__dirname, 'public')))

var server = app.listen(process.env.PORT || 3000, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening on port:' + port);
});

// Sockets stuff

let io = require('socket.io').listen(server);

io.sockets.on('connection', socket => {
    console.log("New client: " + socket.id);
    socket.on('disconnect', () => {
        console.log("Client has disconnected");
    });
});

function socket_emit_data(data) {
    io.sockets.emit('data', {text:data.text,created_at:data.created_at});
}

// Twitter Stuff

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const isTweet = _.conforms({
    contributors: _.isObject,
    id_str: _.isString,
    text: _.isString,
})


var stream = client.stream('statuses/filter', { track: 'Colombia' });
stream.on('data', function (event) {
    // console.log(event.text);
    if (!(isTweet(event))) {
        socket_emit_data(event);
    }
});

stream.on('error', function (error) {
    throw error;
});