let diameter = 40;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
function setup() {
  let canvasParent = document.getElementById("canvasContainer");
  let myCanvas = createCanvas(1200, 800);
  myCanvas.parent(canvasParent);
  //   drawGraph(nfa);
}
function drawFA(nfa) {
  console.log("Graph start");
  background(255);
  line(0, height / 2, 5, height / 2);
  let transitions = nfa.transitions;
  for (let transition of transitions) {
    console.log(transition);
  }
  let stack = [];
  stack.push(nfa.startState);
  let visited = new Set();
  while (stack.length > 0) {
    let currentState = stack.pop();
    if (visited.has(currentState)) continue;
    visited.add(currentState);
    let x = offsetX + 100 * visited.size;
    let y = height / 2; //offsetY + 100 * visited.size;
    ellipse(x, y, diameter, diameter);
    text(currentState, x, y);
    for (let input of nfa.alphabet) {
      let nextState = transitions.get(`${currentState}-${input}`);
      if (!nextState) continue;

      stack.push(nextState);
    }
  }
}
