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
let view_percent = 0.7;

const lsystems = {
  'Kosh Snowflake' : {
    init_angle : 0,
    angle : 60,
    axiom : 'F++F++F',
    productions : {
      'F': 'F-F++F-F'
    }
  },
  'Sierpinski Triangle' : {
    init_angle : 0,
    angle : 120,
    axiom : 'F-G-G',
    productions : {
      'F' : 'F-G+F+G-F',
      'G' : 'GG'
    }
  },
  'Dragon Curve' : {
    init_angle : 0,
    angle : 90,
    axiom : 'FX',
    productions : {
      'X' : 'X+YF+',
      'Y' : '-FX-Y'
    }
  },
};

const default_alg = 'Kosh Snowflake';

const params = {
  seed        : 1,
  iterates    : 1,
  algorithm   : default_alg,
  init_angle  : lsystems[default_alg].init_angle,
  angle       : lsystems[default_alg].angle,
  axiom       : lsystems[default_alg].axiom,
  productions : lsystems[default_alg].productions,
};

function setup() {
  setUpGui();
  resize();
  noLoop();
  angleMode(DEGREES);
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
  const gui = new dat.GUI({
    name : 'L-Systems',
    load : JSON
  });

  gui.add(params, 'iterates', 1, 10, 1).name('Iterates').onChange(draw);
  gui.add(params, 'angle', 0, 180, 1).name('Angle').onChange(draw).listen();
  gui.add(params, 'axiom').name('Axiom').onChange(draw).listen();
  gui.add(params, 'algorithm', Object.keys(lsystems)).name('Algorithm').onChange(updateAndDraw);

  gui.remember(params);
}

function updateAndDraw() {
  updateAlgorithmParam('init_angle');
  updateAlgorithmParam('angle');
  updateAlgorithmParam('axiom');
  updateAlgorithmParam('productions');
  draw();
}

function updateAlgorithmParam(value) {
  params[value] = lsystems[params.algorithm][value];
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
  let rotation = params.init_angle;
  let lines = [];

  const drawForward = () => {
    const len = 1 / lsys.iterations + 1;
    let next_pos = createVector(len, 0);
    next_pos.rotate(rotation);
    next_pos.add(current_pos);
    lines.push([current_pos, next_pos]);
    current_pos = next_pos;
  };

  let lsys = new LSystem({
    axiom       : params.axiom,
    productions : params.productions,
    finals      : {
      '+' : () => { rotation +=  params.angle; },
      '-' : () => { rotation += -params.angle; },
      'F' : () => { drawForward() },
      'G' : () => { drawForward() },
    },
  });

  lsys.iterate(params.iterates);
  lsys.final();

  return lines;
}

function scaleLines(lines, ibbox) {
  const lbbox = getBbox(lines);

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
      xmin : Math.min(bbox.xmin, seg[0].x, seg[1].x),
      xmax : Math.max(bbox.xmax, seg[0].x, seg[1].x),
      ymin : Math.min(bbox.ymin, seg[0].y, seg[1].y),
      ymax : Math.max(bbox.ymax, seg[0].y, seg[1].y),
    };
  }, {
    xmin :  Infinity,
    xmax : -Infinity,
    ymin :  Infinity,
    ymax : -Infinity
  });

}
