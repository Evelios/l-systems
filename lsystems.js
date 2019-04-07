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
let h_width;
let h_height;
let view_size;
let h_view_size;
let view_percent = 0.8;
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
  h_width = width / 2;
  h_height = height / 2;
  view_size = view_percent * Math.min(width, height);
  h_view_size = view_size / 2;
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

  const lines = lsystem();
  const scaled_lines = scaleLines(lines, {
    xmin : -h_view_size,
    xmax :  h_view_size,
    ymin : -h_view_size,
    ymax :  h_view_size,
  });

  push();
  translate(h_width, h_height);
  scaled_lines.forEach(seg => {
    line(seg[0].x, seg[0].y, seg[1].x, seg[1].y);
  });
  pop();
}

function lsystem() {
  let current_pos = createVector(0, 0);
  let rotation = 0;
  let lines = [];

  let lsys = new LSystem({
    axiom       : params.axiom,
    productions : params.productions,
    finals      : {
      '+' : () => { rotation +=  Math.PI * 1/3; },
      '-' : () => { rotation += -Math.PI * 1/3; },
      'F' : () => {
        const len = 1 / lsys.iterations + 1;
        let next_pos = createVector(0, len);
        next_pos.rotate(rotation);
        next_pos.add(current_pos);
        lines.push([current_pos, next_pos]);
        current_pos = next_pos;
      }
    },
  });

  lsys.iterate(params.iterates);
  lsys.final();

  return lines;
}

function scaleLines(lines, ibbox) {
  const lbbox = getBbox(lines);
  console.log(lbbox);

  return lines.map(seg => {
    return [
      createVector(
        map(seg[0].x, lbbox.xmin, lbbox.xmax, ibbox.xmin, ibbox.xmax),
        map(seg[0].y, lbbox.ymin, lbbox.ymax, ibbox.ymin, ibbox.ymax),
      ),
      createVector(
        map(seg[1].x, lbbox.xmin, lbbox.xmax, ibbox.xmin, ibbox.xmax),
        map(seg[1].y, lbbox.ymin, lbbox.ymax, ibbox.ymin, ibbox.ymax),
      )
    ];
  });
}

function getBbox(lines) {
  return lines.reduce((bbox, seg) => {
    return {
      xmin : Math.min(bbox.xmin, seg[0].x),
      xmax : Math.max(bbox.xmax, seg[1].x),
      ymin : Math.min(bbox.ymin, seg[0].y),
      ymax : Math.max(bbox.ymax, seg[1].y),
    };
  }, {
    xmin :  Infinity,
    xmax : -Infinity,
    ymin :  Infinity,
    ymax : -Infinity
  });

}
