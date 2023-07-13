TweenLite.defaultEase = Sine.easeInOut;

function addStrokeLineWaves() {
  // TweenLite.set("g", { y: window.innerHeight / 2 });

  // const redraw = () => {
  //   const waves = document.querySelectorAll(".wave-stroke");
  //   const width = document
  //     .querySelector(".hero-next")
  //     .getBoundingClientRect().width;
  //   const height = document
  //     .querySelector(".hero-next")
  //     .getBoundingClientRect().height;

  //   const interval = width / segments;
  //   for (const wave of waves) {
  //     for (let i = 0; i < segments; i++) {
  //       var norm = i / segments;
  //       var point = wave.points.appendItem(svg.createSVGPoint());

  //       point.x = i * interval;
  //       point.y = amplitude / 2 + (waveIdx + 1) * amplitude;
  //       const tgtPointY = -amplitude / 2 + (waveIdx + 1) * amplitude;

  //       TweenMax.to(point, 2, {
  //         y: tgtPointY,
  //         repeat: -1,
  //         yoyo: true,
  //       }).progress(norm * frequency);
  //     }
  //     waveIdx++;
  //   }
  // };
  const waves = document.querySelectorAll(".wave-stroke");
  let waveIdx = 0;

  function drawPoints(factor, settings) {
    var points = [];

    for (var i = 0; i <= settings.bones; i++) {
      var x = (i / settings.bones) * settings.width;
      var sinSeed =
        (factor + (i + (i % settings.bones))) * settings.speed * 100;
      var sinHeight = Math.sin(sinSeed / 100) * settings.amplitude;
      var yPos = Math.sin(sinSeed / 100) * sinHeight + settings.height;
      points.push({ x: x, y: yPos });
    }

    return points;
  }

  function drawPath(points, fillable) {
    var SVGString = "M " + points[0].x + " " + points[0].y;

    var cp0 = {
      x: (points[1].x - points[0].x) / 2,
      y: points[1].y - points[0].y + points[0].y + (points[1].y - points[0].y),
    };

    SVGString +=
      " C " +
      cp0.x +
      " " +
      cp0.y +
      " " +
      cp0.x +
      " " +
      cp0.y +
      " " +
      points[1].x +
      " " +
      points[1].y;

    var prevCp = cp0;
    var inverted = -1;

    for (var i = 1; i < points.length - 1; i++) {
      var cpLength = Math.sqrt(prevCp.x * prevCp.x + prevCp.y * prevCp.y);
      var cp1 = {
        x: points[i].x - prevCp.x + points[i].x,
        y: points[i].y - prevCp.y + points[i].y,
      };

      SVGString +=
        " C " +
        cp1.x +
        " " +
        cp1.y +
        " " +
        cp1.x +
        " " +
        cp1.y +
        " " +
        points[i + 1].x +
        " " +
        points[i + 1].y;
      prevCp = cp1;
      inverted = -inverted;
    }

    if (fillable) {
      SVGString += " L " + width + " " + height;
      SVGString += " L 0 " + height + " Z";
    }
    return SVGString;
  }

  for (const wave of waves) {
    secondWavify(wave, {
      height: 300,
      bones: 5,
      amplitude: 30,
      strokeColor: "transparent",
      strokeWidth: 0,
      fillColor: "#ffffff",
      speed: 0.25,
      segments: 100,
      frequency: 6,
      container: ".hero-next",
      fillable: false,
      callback: (settings, params) => {
        const { frequency, segments, amplitude, container, fillable } =
          settings;
        const { width, totalTime } = params;
        const svg = document.querySelector(container).querySelector("svg");
        const interval = width / segments;
        var factor = totalTime * Math.PI;
        return TweenMax.to(wave, settings.speed, {
          attr: {
            d: drawPath(drawPoints(factor, { ...settings, width }), fillable),
          },
          ease: Power1.easeInOut,
        });
        // console.log("this is callback", settings, params);
        // for (let i = 0; i < segments; i++) {
        //   const norm = i / segments;
        //   const point = wave.points.appendItem(svg.createSVGPoint());
        //   point.x = i * interval;
        //   point.y = amplitude / 2 + (waveIdx + 1) * amplitude;
        //   const tgtPointY = -amplitude / 2 + (waveIdx + 1) * amplitude;
        //   TweenMax.to(point, 2, {
        //     y: tgtPointY,
        //     repeat: -1,
        //     yoyo: true,
        //   }).progress(norm * frequency);
        // }
      },
    });
    waveIdx++;
  }
}

function init() {
  const selectors = document.querySelectorAll(".wave-stroke-line");
  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    wavify(selector, {
      height: 60 + i * 80,
      bones: 5,
      amplitude: 40,
      strokeColor: "#ffffff",
      strokeWidth: 5,
      fillColor: "transparent",
      speed: 0.25,
      container: ".hero",
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
    container: ".hero",
    fillable: true,
  });

  addStrokeLineWaves();
}

init();
