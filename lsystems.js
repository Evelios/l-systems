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
let lsys;
let rng;

var params = {
  seed : 1,
  axiom : 'ABC',
  productions : {
    'B': 'F+F',
    'B': 'BB'
  },
};

function setup() {
  lsys = new LSystem({});
  setupSeed();
  setUpGui();
  resize();
  noLoop();
}

function resize() {
  width  = document.body.clientWidth  || window.innerWidth;
  height = document.body.clientHeight || window.innerHeight;
  createCanvas(width, height);
}

function resizeAndRedraw() {
  resize();
  draw();
}

function setUpGui() {
  const gui = new dat.GUI();

  gui.add(params, "seed", 1, 5, 1).name("RNG Seed").onChange(setupSeed);
  gui.add(params, "axiom").name("Axiom").onChange(draw);
}

function setupSeed() {
  rng = Alea(params.seed);
}

function draw() {
  background(bgColor.toHexString());

  const eles = lsystem();

  console.log(eles);
}

function lsystem() {
  lsys.setAxiom(params.axiom);
  for (key in params.productions) {
    lsys.setProduction(key, params.productions[key]);
  }

  return lsys.iterate(3);
}
