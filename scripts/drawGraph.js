let diameter = 40;
function setup() {
  let canvasParent = document.getElementById("canvasContainer");
  let myCanvas = createCanvas(1200, 400);
  myCanvas.parent(canvasParent);
  //   drawGraph(nfa);
}

function drawGraph(nfa) {
  background(255);
  push();
  //   noFill();
  //   ellipse(100, height / 2, 30)
  //initialisation
  {
    let ellipsePos = new Map();
    ellipsePos.clear();
    let setStack = [];
    let currentState = nfa.startState;
    //   console.log("stsrt", currentState);
    setStack.push(currentState);
    let visited = new Set();
    visited.clear();
    let steps = 0;
    let distance = 0;
    //   let dsmap = new Map();
    let distanceMap = new Map();
    distanceMap.clear();
    let statedistance = new Map();
    statedistance.clear();
    statedistance.set(currentState, distance);
    distanceMap.set(distance, 1);
    let heigthMap = new Map();
    heigthMap.clear();
    heigthMap.set(currentState, 0);
  }
  // going through all states
  while (setStack.length > 0) {
    currentState = setStack.pop();
    let _currentStateDistance = statedistance.get(currentState);
    if (visited.has(currentState)) {
      continue;
    }
    visited.add(currentState);
    let separationVar = 100;
    let x = 60 + 100 * _currentStateDistance;
    let _n = distanceMap.get(_currentStateDistance);
    let _gap = Math.floor(((_n - 1) * separationVar) / 2);
    //! adjust height
    let __start =
      Math.floor((_gap * heigthMap.get(currentState)) / 2) +
      Math.floor(height / 2);
    // console.log("n", _n, "gap", _gap, "start", __start);
    let y = __start + separationVar * heigthMap.get(currentState);
    // console.log(currentState, "index", getKeyIndex(statedistance, currentState));

    //*    draw the state
    if (nfa.finalStates.has(currentState)) {
      ellipse(x, y, 40);
    }
    if (currentState == nfa.startState) {
      strokeWeight(2);
      line(x - diameter / 2, y, x - diameter * 1.25, y);
      line(x - diameter / 2, y, x - 30, y + 5);
      line(x - diameter / 2, y, x - 30, y - 5);
    }
    ellipse(x, y, diameter);
    ellipsePos.set(currentState, [x, y]);
    text(currentState, x - 6, y + 4);
    // console.log(currentState, x, y);

    //* transations
    //check for epsilon
    if (nfa.transitions.has(`${currentState}-e`)) {
      let st = nfa.transitions.get(`${currentState}-e`);
      //   distance++;
      //   console.log(st, "distance is", _currentStateDistance + 1);
      //   console.log("setting distance", _currentStateDistance + 1, st.length);
      st.forEach((element, key) => {
        heigthMap.set(element, heigthMap.get(currentState) + key);
        if (distanceMap.has(_currentStateDistance + 1)) {
          let temp = distanceMap.get(_currentStateDistance + 1);
          distanceMap.set(_currentStateDistance + 1, temp + 1);
        } else {
          distanceMap.set(_currentStateDistance + 1, 1);
        }
        //! if any error use comment code
        // if (!statedistance.has(element)) {
        statedistance.set(element, _currentStateDistance + 1);
        // }

        setStack.push(element);
      });
    }
    //check for other alphabets
    for (const alphabet of nfa.alphabet) {
      if (nfa.transitions.has(`${currentState}-${alphabet}`)) {
        let st = nfa.transitions.get(`${currentState}-${alphabet}`);
        // console.log(st, "distance is", _currentStateDistance + 1);
        // console.log("setting distance", _currentStateDistance + 1, st.length);

        // distanceMap.set(_currentStateDistance + 1, st.length);
        st.forEach((element, key) => {
          heigthMap.set(element, heigthMap.get(currentState) + key);

          if (distanceMap.has(_currentStateDistance + 1)) {
            let temp = distanceMap.get(_currentStateDistance + 1);
            distanceMap.set(_currentStateDistance + 1, temp + 1);
          } else {
            distanceMap.set(_currentStateDistance + 1, 1);
          }
          //! if any error use comment code
          // if (!statedistance.has(element)) {
          statedistance.set(element, _currentStateDistance + 1);
          // }

          setStack.push(element);
        });
      }
    }

    // console.log(setStack);
  }
  //   console.log("stateDistance", statedistance);
  //   console.log("distanceMap", distanceMap);
  // make states
  {
  }
  // making edges
  {
    let edges = new Map();
    //  initialize the transactions
    for (const tras of nfa.transitions) {
      for (let index = 0; index < tras[1].length; index++) {
        const element = tras[1][index];
        let tempArr = split(tras[0], "-");
        //   console.log(`${tempArr[0]}${element}`, [tempArr[1]]);
        edges.set(`${tempArr[0]}-${element}`, [tempArr[1]]);
      }
    }
    //draw edges
    console.log("look", edges, statedistance);
    for (const edge of edges) {
      let tempArr = split(edge[0], "-");
      let x1 = ellipsePos.get(tempArr[0])[0];
      let y1 = ellipsePos.get(tempArr[0])[1];
      let x2 = ellipsePos.get(tempArr[1])[0];
      let y2 = ellipsePos.get(tempArr[1])[1];
      let dirR = 1;
      if (statedistance.get(tempArr[0]) > statedistance.get(tempArr[1])) {
        dirR = -1;
        // console.log("rev");
      }
      // Calculate control points
      let curvature = 0.25; // Adjust the curvature
      let cx1 = x1;
      +(x2 - x1) * curvature; // Adjust the multiplier to change the curvature
      let cy1 = y1 + (y2 - y1) * curvature;
      let cx2 = x2;
      -(x2 - x1) * curvature; // Adjust the multiplier to change the curvature
      let cy2 = y2 - (y2 - y1) * curvature;
      cx1 = x1;
      cy1 = y1 + (dist(x1, y1, x2, y2) / 2) * dirR;
      cx2 = x2;
      cy2 = y2 + (dist(x1, y1, x2, y2) / 2) * dirR;
      let t = 0.55; // parameter value (0 <= t <= 1) representing the point on the curve
      //* bezierTangent()
      //* 1stpoint,1stcontrol,2ndcontrol,2ndpoint,t
      let tangx = bezierPoint(x1, cx1, cx2, x2, t);
      let tangy = bezierPoint(y1, cy1, cy2, y2, t);

      // Draw the tangent line
      let tx = bezierTangent(85, 10, 90, 15, t);
      let ty = bezierTangent(20, 10, 90, 80, t);
      let tanga = atan2(ty, tx) + PI;
      push();
      stroke(255); // Red color for the tangent line
      // line(tangx, tangy, cos(_a) * 30 + tangx, sin(_a) * 30 + tangy);
      pop();
      push();
      noFill();
      // line(x1 + diameter / 2, y1, x2 - diameter / 2, y2);
      bezier(
        x1,
        y1 + (diameter / 2) * dirR,
        cx1,
        cy1,
        cx2,
        cy2,
        x2,
        y2 + (diameter / 2) * dirR
      );
      //* xanchor1,yanc1,xcontrol1,ycontrol1,
      //* xcontrol2,ycontrol2,xanchor2,yanchor2
      pop();
      // / Draw the points for visualization
      // fill(255, 0, 0); // Control point 1 in red
      // ellipse(x1, y1, 2, 2);
      // fill(0, 255, 0); // Control point 2 in green
      // ellipse(x2, y2, 2, 2);
      // fill(0, 0, 255); // Curve's control points in blue
      // ellipse(cx1, cy1, 2, 2);
      // ellipse(cx2, cy2, 2, 2);

      //state name
      push();
      // fill(255, 2, 10);
      // ellipse(tangx, tangy + 3.5, 1, 1);
      // noFill();
      // stroke(0);
      fill(0);
      let stateStrTemp = edge[1].join(",");
      if (dirR > 0) {
        // >
        // console.log("hello", edge[1]);
        text(stateStrTemp, tangx - 10, tangy + 18);
        line(tangx, tangy + 3.5, tangx - 10, tangy - 5 + 3.5);
        line(tangx, tangy + 3.5, tangx - 10, tangy + 5 + 3.5);
      } else {
        // <
        text(stateStrTemp, tangx - 10, tangy + 15);
        stroke(255, 0, 0);
        line(tangx, tangy - 3.5, tangx + 10, tangy - 5 - 3.5);
        line(tangx, tangy - 3.5, tangx + 10, tangy + 5 - 3.5);
      }
      // line(tangx, tangy, cos(tanga) * 30 + tangx, sin(tanga) * 30 + tangy);
      strokeWeight(3);

      // ellipse(x1, y1, 30);
      // noFill();
      // console.log(tempArr[0], x1 - 6, y1 + 4);
      // text(tempArr[0], x1 - 6, y1 + 4);
      // text(tempArr[1], x2 - 6, y2 + 4);
      // text(tempArr[1], (x1 + x2) / 2, (y1 + y2) / 2);
      pop();
    }
  }

  //   console.log(heigthMap);
  noLoop();
}

function getKeyIndex(map, targetKey) {
  let index = 0;
  for (let [key, value] of map.entries()) {
    if (key === targetKey) {
      return index;
    }
    index++;
  }
  // Key not found
  alert("Key not found in getKeyIndex() function.", map, targetKey);
  return -1;
}
