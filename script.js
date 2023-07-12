// var wave1 = $('#feel-the-wave').wavify({
//   height: 80,
//   bones: 4,
//   amplitude: 60,
//   strokeColor: '#B289EF',
//   speed: .15
// });
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
  });
}

init()