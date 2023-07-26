TweenLite.defaultEase = Sine.easeInOut;

function addStrokeLineWaves() {
  const waves = document.querySelectorAll(".wave-stroke");
  
  let waveIdx = 0;
  for (const wave of waves) {
     secondWavify(wave, {
    // wavify(wave, {
      height: 60 + waveIdx * 60,
      bones: 15,
      originalWidth: 1440, 
      sections: 20,
      amplitude: 30,
      strokeColor: "transparent",
      strokeWidth: 0,
      fillColor: "#ffffff",
      speed: 1.5,      
      segments: 100,
      frequency: 1,
      container: ".hero-next",
      fillable: false,  
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
  wavify(document.querySelector(".feel-the-wave-two"), {
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
