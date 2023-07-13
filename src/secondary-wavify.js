/*
 *   Wavify
 *   JavaScript library to make some nice waves
 *   by peacepostman @ potion
 */
function secondWavify(wave_element, options) {
  if ("undefined" === typeof options) options = {};

  //  Options
  //
  //
  var settings = Object.assign(
    {},
    {
      container: options.container ? options.container : "body",
      // Height of wave
      height: 200,
      // Amplitude of wave
      amplitude: 100,
      // Animation speed
      speed: 0.15,
      // Total number of articulation in wave
      bones: 3,
      // Color
      strokeWidth: 1,
      strokeColor: "rgba(255,255,255, 0.20)",
      fillColor: "rgba(255,255,255, 0.20)",
      fillable: false,
      callback: null,
    },
    options
  );

  var wave = wave_element,
    width = document
      .querySelector(settings.container)
      .getBoundingClientRect().width,
    height = document
      .querySelector(settings.container)
      .getBoundingClientRect().height,
    points = [],
    lastUpdate,
    totalTime = 0,
    animationInstance = false,
    tweenMaxInstance = false;

  //  Allow new settings, avoid setting new container for logic purpose please :)
  //
  function rebuilSettings(params) {
    settings = Object.assign({}, settings, params);
  }

  //  Draw function
  //
  //
  function draw() {
    var now = window.Date.now();

    if (lastUpdate) {
      var elapsed = (now - lastUpdate) / 1000;
      lastUpdate = now;
      totalTime += elapsed;
      if (settings.callback) {
        tweenMaxInstance = settings.callback(settings, {
          totalTime,
          width,
          height,
        });
      }
    } else {
      lastUpdate = now;
    }

    animationInstance = requestAnimationFrame(draw);
  }

  //  Pure js debounce function to optimize resize method
  //
  //
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

  //  Redraw for resize with debounce
  //
  var redraw = debounce(function () {
    pause();
    points = [];
    totalTime = 0;
    width = document
      .querySelector(settings.container)
      .getBoundingClientRect().width;
    height = document
      .querySelector(settings.container)
      .getBoundingClientRect().height;
    lastUpdate = false;
    play();
  }, 250);

  function boot() {
    if (!animationInstance) {
      tweenMaxInstance = TweenMax.set(wave, {
        attr: {
          stroke: settings.strokeColor,
          "stroke-width": settings.strokeWidth,
          fill: settings.fillColor,
        },
      });
      play();
      window.addEventListener("resize", redraw);
    }
  }

  function reboot(options) {
    kill();
    if (typeof options !== undefined) {
      rebuilSettings(options);
    }
    tweenMaxInstance = TweenMax.set(wave, {
      attr: {
        stroke: settings.strokeColor,
        "stroke-width": settings.strokeWidth,
        fill: settings.fillColor,
      },
    });
    play();
    window.addEventListener("resize", redraw);
  }

  function play() {
    if (!animationInstance) {
      animationInstance = requestAnimationFrame(draw);
    }
  }

  function pause() {
    if (animationInstance) {
      cancelAnimationFrame(animationInstance);
      animationInstance = false;
    }
  }

  function updateColor(options) {
    if (typeof options.timing === undefined) {
      options.timing = 1;
    }
    if (typeof options.color === undefined) {
      options.color = settings.strokeColor;
    }
    tweenMaxInstance = TweenMax.to(wave, parseInt(options.timing), {
      attr: { stroke: options.color, "stroke-width": settings.strokeWidth },
      onComplete: function () {
        if (
          typeof options.onComplete !== undefined &&
          {}.toString.call(options.onComplete) === "[object Function]"
        ) {
          options.onComplete();
        }
      },
    });
  }

  function kill() {
    if (animationInstance) {
      pause();
      tweenMaxInstance.kill();
      tweenMaxInstance = TweenMax.set(wave, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 0,
        clearProps: "all",
        attr: {
          d: "M0,0",
          stroke: "",
        },
      });
      window.removeEventListener("resize", redraw);
      animationInstance = false;
    }
  }

  //  Boot Wavify
  //
  boot();

  return {
    reboot: reboot,
    play: play,
    pause: pause,
    kill: kill,
    updateColor: updateColor,
  };
}