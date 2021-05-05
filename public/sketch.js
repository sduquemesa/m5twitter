let socket;

function setup() {
    createCanvas(WIDTH,HEIGTH);
    background(100);

    socket = io.connect('http://localhost:3000');
    socket.on('data', process_data)

    noLoop();
}

function draw() {
    background(0);
    noStroke();
    fill(255);
}

function process_data(data) {
    // console.log(data.text);
    // createP(data.retweeted_status.extended_tweet.full_text);
    createP('------------------------------')
}