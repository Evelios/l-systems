"use strict";

// Colors
const bgColor         = tinycolor("#303030");
const bgAccent        = tinycolor("#393939");
const primaryColor    = tinycolor("#AA7539");
const secondaryColor  = tinycolor("#A23645");
const tertiaryColor   = tinycolor("#27566B");
const quaternaryColor = tinycolor("#479030");

// Globals
let width;
let height;
let rng;

var params = {
  seed : 1
};

function setup() {
  width  = document.body.clientWidth || window.innerWidth;
  height = document.body.clientHeight || window.innerHeight;

  createCanvas(width, height);
  setUpGui();
  noLoop();
}

function setUpGui() {
  const gui = new dat.GUI();

  gui.add(params, "seed", 1, 5, 1).name("RNG Seed").onChange(setupSeed);
}

function setupSeed() {
  rng = Alea(params.seed);
}

function draw() {
    background(bgColor.toHexString());
}