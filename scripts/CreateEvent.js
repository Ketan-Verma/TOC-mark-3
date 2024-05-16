let main_container = document.getElementById("solution-container");
let parnetENFA = null;
let parnetNFA = null;
let parnetDFA = null;
let parnetMDFA = null;
createSolution();
function createSolution() {
  // console.log("CreateEvent.js loaded!");
  let regex = document.getElementById("regex-input").value;
  const _ENFA = regexToENFA(regex);
  const _ENFA1 = regexToENFA(regex);
  parnetENFA = _ENFA1;

  const _NFA = removeEpsilonTransitions(_ENFA);
  // console.log("enfa", _NFA[0]);
  // console.log("enfa", _NFA[1]);
  const tempNFA = _NFA[2];
  parnetNFA = tempNFA;
  const _DFA = makeDfaFromNfa(tempNFA);
  const _DFA1 = makeDfaFromNfa(tempNFA);
  parnetDFA = _DFA1;
  let _minDFA = minimizedfa(_DFA);
  let _minDFA1 = minimizedfa(_DFA);
  parnetMDFA = _minDFA1;
  // console.log("unreachable", _minDFA[0]);
  // console.log(_minDFA[1]);
  // console.log(_minDFA[2]);
  main_container.innerHTML = `<div
  class="p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3"
>
  <h1>Solution</h1>
  <div>${drawDiagram(_minDFA1[2])}</div>
  <div class="accordion" id="accordionPanelsStayOpenExample">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#panelsStayOpen-collapseOne"
          aria-expanded="true"
          aria-controls="panelsStayOpen-collapseOne"
        >
          1. Regular Expression To Epsilon-NFA
        </button>
      </h2>
      <div
        id="panelsStayOpen-collapseOne"
        class="accordion-collapse collapse show"
      >
        <div class="accordion-body">
          <h3>Transition Table E-NFA</h3>
  <br/>
          <div class="middle-container">${
            makeTransitionHtml(_ENFA1, true).innerHTML
          }</div><br/>

          <h3>Graph</h3>
         
          <button class="btn btn-primary" id="button-1a">Open Graph</button>
          
          <div class="graph-container" id="graph1">
        </div>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#panelsStayOpen-collapseTwo"
          aria-expanded="false"
          aria-controls="panelsStayOpen-collapseTwo"
        >
          2. Removing Epsilon Moves
        </button>
      </h2>
      <div
        id="panelsStayOpen-collapseTwo"
        class="accordion-collapse collapse"
      >
        <div class="accordion-body">
          <h3>Transition Table E-NFA</h3><br/>
          <div class="middle-container">${
            makeTransitionHtml(_ENFA1, true).innerHTML
          }</div><br/>

          <p><strong>Step 1 : ε-closure of each state</strong></p>
          <div class="middle-container">
          <p>
          ${makeClsrTable(_NFA[0])}
          
          </p>
          </div>
    <p><strong>Step 2 : δ' transition for each state</strong></p>
    <div class="middle-container">
    
    <p>
    ${makeMegaTransTable(_NFA[1])}
    
    </p>
    </div>
          <h3>Transition Table NFA</h3><br/>
          <div class="middle-container">${
            makeTransitionHtml(_NFA[2]).innerHTML
          }</div><br/>
          <h2>NFA Graph</h2>
          <button class="btn btn-primary" id="button-2a">Open Graph</button>

          <div class="graph-container" id="graph2">
        </div>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#panelsStayOpen-collapseThree"
          aria-expanded="false"
          aria-controls="panelsStayOpen-collapseThree"
        >
          3. NFA to DFA Conversion
        </button>
      </h2>
      <div
        id="panelsStayOpen-collapseThree"
        class="accordion-collapse collapse"
      >
        <div class="accordion-body">
          <h3>NFA Transition Table</h3><br/>
          <div class="middle-container">
          ${makeTransitionHtml(_NFA[2]).innerHTML}
          </div><br/>
          <h3>DFA Transition Table</h3><br/>
          <div class="middle-container">
          ${makeTransitionHtml(_DFA1).innerHTML}
          </div><br/>
          <h3>Graph</h3>
          <button class="btn btn-primary" id="button-3a">Open Graph</button>

          <div class="graph-container" id="graph3">
        </div>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#panelsStayOpen-collapseFour"
          aria-expanded="false"
          aria-controls="panelsStayOpen-collapseFour"
        >
          4. Minimization of DFA
        </button>
      </h2>
      <div
        id="panelsStayOpen-collapseFour"
        class="accordion-collapse collapse"
      >
        <div class="accordion-body">
          <p><strong>step 1: remove unreachable states</strong></p>
          <div class="middle-container">
          <p>{
            ${Array.from(_minDFA[0]).join(", ")}
          }
          </p>
          </div>
          <p><strong>step 2: DFA Transition Table </strong></p><br/>
          <div class="middle-container">
          ${makeTransitionHtml(_DFA1).innerHTML}
          </div><br/>
          <p>
            <strong>step 3: Divide the states into partitions:</strong>
          </p>
          <div class="middle-container">
          ${ShowPartitions(_minDFA[1])}
          </div><br/>
          <h3>Minimized DFA Transition Table</h3><br/>
          <div class="middle-container">
          ${makeTransitionHtml(_minDFA[2]).innerHTML}
          </div>         <br/>
          <h3>Graph</h3>
          <button class="btn btn-primary" id="button-4a">Open Graph</button>

          <div class="graph-container" id="graph4">
        </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
  const solution = document.createElement("div");

  main_container.appendChild(solution);
}
function makeTransitionHtml(tempNfa, isENFA = false) {
  // return;
  const tablecontainer = document.createElement("div");
  tablecontainer.innerHTML = "";
  tablecontainer.classList.add("transition-table-container");
  tablecontainer.classList.add("table-container");
  let table = document.createElement("table");
  // table.setAttribute("class", "table table-bordered");
  // table.setAttribute("id", "transition-table");
  var row0 = document.createElement("tr");
  var th0 = document.createElement("th");
  th0.setAttribute("colspan", 2 + tempNfa.alphabet.size + isENFA);
  th0.textContent = "Transition Table";
  row0.appendChild(th0);
  var row1 = document.createElement("tr");

  var th1 = document.createElement("td");
  th1.setAttribute("rowspan", "2");
  th1.setAttribute("colspan", "2");
  th1.textContent = "Present State";

  var th2 = document.createElement("td");
  if (isENFA) {
    th2.setAttribute("colspan", tempNfa.alphabet.size + 1);
  } else {
    th2.setAttribute("colspan", tempNfa.alphabet.size);
  }
  th2.textContent = "Next State";
  row1.appendChild(th1);
  row1.appendChild(th2);
  // Create second row with next state values
  var row2 = document.createElement("tr");
  if (isENFA) {
    var th = document.createElement("th");
    th.textContent = "ε";
    row2.appendChild(th);
  }
  for (let symbol of tempNfa.alphabet) {
    var th = document.createElement("th");
    th.textContent = symbol;
    row2.appendChild(th);
  }

  table.appendChild(row0);
  table.appendChild(row1);
  table.appendChild(row2);

  // Create rows with transition values
  for (let state of tempNfa.states) {
    var row = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    td1.textContent =
      tempNfa.startState == state && tempNfa.finalStates.has(state)
        ? "start, final"
        : tempNfa.startState == state
        ? "start"
        : tempNfa.finalStates.has(state)
        ? "final"
        : "";
    td2.textContent = state;
    row.appendChild(td1);
    row.appendChild(td2);
    if (isENFA) {
      var td3 = document.createElement("td");
      td3.classList.add("cell");
      if (tempNfa.transitions.has(`${state}-e`)) {
        td3.textContent = tempNfa.transitions.get(`${state}-e`);
      }
      row.appendChild(td3);
    }
    for (let symbol of tempNfa.alphabet) {
      const key = `${state}-${symbol}`;
      var td3 = document.createElement("td");
      td3.classList.add("cell");

      if (tempNfa.transitions.has(key)) {
        td3.textContent = tempNfa.transitions.get(key);
      }

      row.appendChild(td3);
    }
    table.appendChild(row);
  }

  // Append table to contaiiner
  tablecontainer.appendChild(table);
  return tablecontainer;
}
/*

*/
function makeClsrTable(ctable) {
  let content = "";
  for (let [state, closure] of ctable) {
    content += `ε-closure(${state}) = {${Array.from(closure).join(
      ", "
    )}} <br />`;
  }
  return content;
}
function makeMegaTransTable(megaTrans) {
  let content = "";
  for (let [state, closure] of megaTrans) {
    // console.log("state", state, closure);
    // if (closure.size == 0) continue;
    content += `δ'(${state}) = {${Array.from(closure).join(", ")}} <br />`;
  }
  return content;
}

function ShowPartitions(partitions) {
  let content = "";
  for (let i = 0; i < partitions.length; i++) {
    let partition = partitions[i];
    content += `Partition: ${i + 1} </br>`;
    for (let group of partition) {
      // content += `{${Array.from(group).join(", ")}} <br />`;
      content += "{";
      for (let grpelem of group) {
        content += `"${grpelem}" `;
      }
      content += "} ";
    }
    content += "<br />";
  }
  return content;
}

function drawDiagram(f_a) {
  // const container = document.getElementById(containerId);
  container = "";
  // console.log("f_a", f_a);
  let distances = new Map();
  let start = f_a.startState;
  let visited = new Set();
  let stack = [start];
  // let newStates = new Set();
  // let newStateMap = new Map();

  // let dist = 0;
  distances.set(start, 0);
  while (stack.length > 0) {
    let state = stack.pop();
    if (visited.has(state)) continue;
    // console.log("state", state, distances.get(state));
    visited.add(state);
    for (let symbol of f_a.alphabet) {
      let temp = f_a.transitions.get(state + "-" + symbol);
      if (temp) {
        for (let s of temp) {
          stack.push(s);
          distances.set(s, distances.get(state) + 1);
        }
      }
    }
  }
  // console.log("distances", distances);
  let heightmap = new Map();
  let stateDistance = new Map();
  for (let [state, distance] of distances) {
    // console.log(state, distance);
    //* state distance
    if (stateDistance.has(distance)) {
      let temparray = stateDistance.get(distance);
      // console.log(temparray);
      temparray.push(state);
      stateDistance.set(distance, temparray);
    } else stateDistance.set(distance, [state]);

    //* height map

    if (heightmap.has(distance)) {
      heightmap.set(distance, heightmap.get(distance) + 1);
    } else {
      heightmap.set(distance, 1);
    }
  }
  // console.log("state distance", stateDistance);
  // console.log("heightmap", heightmap);
  let ypos = new Map();
  for (let [xpos, value] of distances) {
    let ys = heightmap.get(value);
    let y = 0;
    // console.log(xpos, "x =", value);
    // console.log("y =", y);
  }
  return container;
}

const graphbutton = document.getElementById("graph-button");
const modal = document.getElementById("graph-overlay");
const button1 = document.getElementById("button-1a");
const graph1 = document.getElementById("graph1");
const button2 = document.getElementById("button-2a");
const graph2 = document.getElementById("graph2");
const button3 = document.getElementById("button-3a");
const graph3 = document.getElementById("graph3");
const button4 = document.getElementById("button-4a");
const graph4 = document.getElementById("graph4");

// Add event listeners to the buttons
graphbutton.addEventListener("click", function (event) {
  // console.log("button Clicked", parnetENFA);
  // makeNetworkFromNfa(parnetENFA);
  modal.style.display = "none";
  graphbutton.style.display = "none";
});
button1.addEventListener("click", function () {
  // console.log("button Clicked", parnetENFA);
  graphbutton.style.display = "block";
  modal.style.display = "block";
  makeNetworkFromNfa(parnetENFA);
});

button2.addEventListener("click", function () {
  // console.log("button Clicked", parnetNFA);
  // Code to be executed when button 2 is clicked
  modal.style.display = "block";
  graphbutton.style.display = "block";
  makeNetworkFromNfa(parnetNFA);
});

button3.addEventListener("click", function () {
  // Code to be executed when button 3 is clicked
  // console.log("button Clicked", parnetDFA);
  modal.style.display = "block";
  graphbutton.style.display = "block";
  makeNetworkFromNfa(parnetDFA);
});

button4.addEventListener("click", function () {
  // Code to be executed when button 4 is clicked
  // console.log("button Clicked", parnetMDFA[2]);
  modal.style.display = "block";
  graphbutton.style.display = "block";
  makeNetworkFromNfa(parnetMDFA[2]);
});
