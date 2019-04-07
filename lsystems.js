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
  iterates : 1,
  axiom : 'F++F++F',
  productions : {
    'F': 'F-F++F-F',
  },
};

function setup() {
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
  const gui = new dat.GUI({name : 'L-Systems'});

  gui.add(params, "seed", 1, 5, 1).name("RNG Seed").onChange(setupSeed);
  gui.add(params, "axiom").name("Axiom").onChange(draw);
  gui.add(params, "iterates", 1, 5, 1).name("Iterates").onChange(draw);
}

function setupSeed() {
  rng = Alea(params.seed);
}

function draw() {
  background(bgColor.toHexString());
  stroke(primaryColor.toHexString());
  strokeWeight(2);

  push();
  translate(width / 2, height / 2);

  lsys = new LSystem({
    axiom       : params.axiom,
    productions : params.productions,
    finals      : {
      '+' : () => { rotate( Math.PI * 1/3); },
      '-' : () => { rotate(-Math.PI * 1/3); },
      'F' : () => {
        const len = 40 / (lsys.iterations + 1);
        line(0, 0, 0, len);
        translate(0, len);
      }
    },
  });

  lsys.iterate(params.iterates);
  lsys.final();
  pop();
}
