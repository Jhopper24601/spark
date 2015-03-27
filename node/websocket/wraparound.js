var sockets = require('./sockets.js');
var screen = require('./screen.js');
var nconf = require('nconf');
var util = require('./util.js');

nconf.argv()
     .env()
     .file({file: '../config.json'});

sockets.setConfig(nconf);
screen.setConfig(nconf);

var pac1 = [0,0,0, 0,0,0, 0,0,0, 0,0,0, 77,77,13, 68,68,13, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 75,75,0, 222,222,0, 255,255,0, 255,255,0, 63,63,0, 0,0,0, 0,0,0, 0,0,0, 255,255,0, 255,255,0, 255,255,0, 124,124,0, 0,0,0, 0,0,0, 0,0,0, 127,127,0, 255,255,0, 252,252,0, 102,102,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 146,146,0, 255,255,0, 251,251,0, 62,62,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 42,42,0, 255,255,0, 255,255,0, 254,254,0, 76,76,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 113,113,0, 255,255,0, 255,255,0, 255,255,0, 64,64,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 59,59,13, 134,134,13, 130,130,13, 0,0,0, 0,0,0];
var pac1_width = 8;
var pac1_height = 8;

var pac2 = [0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 59,59,0, 194,194,0, 242,242,0, 190,190,0, 70,70,0, 0,0,0, 0,0,0, 48,48,0, 255,255,0, 255,255,0, 255,255,0, 255,255,0, 235,235,0, 0,0,0, 0,0,0, 138,138,0, 255,255,0, 252,252,0, 159,159,0, 62,62,0, 21,21,0, 0,0,0, 0,0,0, 144,144,0, 255,255,0, 251,251,0, 131,131,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 67,67,0, 255,255,0, 255,255,0, 255,255,0, 255,255,0, 215,215,0, 0,0,0, 0,0,0, 0,0,0, 101,101,0, 239,239,0, 255,255,0, 242,242,0, 127,127,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0];
var pac2_width = 8;
var pac2_height = 8;

var pac3 = [0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 88,88,0, 216,216,0, 242,242,0, 166,166,0, 20,20,0, 0,0,0, 0,0,0, 73,73,0, 255,255,0, 255,255,0, 255,255,0, 255,255,0, 221,221,0, 0,0,0, 0,0,0, 197,197,0, 255,255,0, 255,255,0, 255,255,0, 255,255,0, 255,255,0, 78,78,13, 0,0,0, 203,203,0, 255,255,0, 255,255,0, 255,255,0, 255,255,0, 255,255,0, 84,84,13, 0,0,0, 102,102,0, 255,255,0, 255,255,0, 255,255,0, 255,255,0, 251,251,0, 34,34,13, 0,0,0, 0,0,0, 138,138,0, 251,251,0, 255,255,0, 219,219,0, 51,51,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0];
var pac3_width = 8;
var pac3_height = 8;

var count = 0;
var on = true;
var seq = 0;
var col = 0;
var forward = true;
var drawcount = 0;

var drawing = false;

var screens = ["Freddy", "Robot"];
var brightness = 32;

function setup(message) {
  console.log("message in setup: ", message);
  var coreid = JSON.parse(message).coreid
  	screen.setup(coreid, function(){
      console.log("done with setup, setting brightness");
      screen.setBrightness([util.getNameForCoreId(coreid)], brightness, function(bright, err){
        console.log("Screen birghtness set to ", bright);
      });
      if(!drawing)
      {
        console.log("BEGIN DRAW");
        draw();   
        drawing = true;
      }
    });
};

function draw() {
  drawPac();
  drawcount++;
}

function drawPac() {
  console.log("drawing pac: ", seq, " at ", col);
  
  col++;
  if(col > 31)
    col = 0; 

  seq++;
  if(seq > 2)
    seq = 0;

  screen.drawBMP(screens, col, true, seq, function(){
      draw();
  });
};

function main() {
  screen.addBitmap(pac1, pac1_width, pac1_height, 0);
  screen.addBitmap(pac2, pac2_width, pac2_height, 1);
  screen.addBitmap(pac3, pac3_width, pac3_height, 2);

	sockets.registerListener(function(message){
    console.log("setting up pacman with message ", message);
    setup(message);
  });
};

main();