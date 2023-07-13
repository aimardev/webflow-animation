TweenLite.defaultEase = Sine.easeInOut;

function addStrokeLineWaves() {
// TweenLite.set("g", { y: window.innerHeight / 2 });

const svg = document.querySelector(".hero-next svg");



const frequency = 6;
const segments = 100;
const amplitude = 30;

  const waves = document.querySelectorAll(".wave-stroke");
  const width = document.querySelector('.hero-next').getBoundingClientRect()
      .width
    const height = document.querySelector('.hero-next').getBoundingClientRect()
      .height

  const interval = width / segments;
  let waveIdx = 0;
  for (const wave of waves) {
    for (let i = 0; i < segments; i++) {
      var norm = i / segments;
      var point = wave.points.appendItem(svg.createSVGPoint());

      point.x = i * interval;
      point.y = amplitude / 2 + (waveIdx + 1) * amplitude;
      const tgtPointY = -amplitude / 2 + (waveIdx + 1) * amplitude;

      TweenMax.to(point, 2, {
        y: tgtPointY,
        repeat: -1,
        yoyo: true,
      }).progress(norm * frequency);
    }
    waveIdx++;
  }
}

function init() {
  const selectors = document.querySelectorAll(".wave-stroke-line")
  for(let i = 0; i < selectors.length; i ++) {
    const selector = selectors[i]
    wavify(selector, {
      height: 60 + i * 80,
      bones: 5,
      amplitude: 40,
      strokeColor: "#ffffff",
      strokeWidth: 5,
      fillColor: "transparent",
      speed: 0.25,
      container: '.hero',
      fillable: false,
    });
  }
  // stroke line
  wavify(document.querySelector("#feel-the-wave-two"), {
    height: 300,
    bones: 5,
    amplitude: 40,
    strokeColor: "transparent",
    strokeWidth: 0,
    fillColor: "#ffffff",
    speed: 0.25,
    container: '.hero',
    fillable: true,
  });

  addStrokeLineWaves()
}

init()