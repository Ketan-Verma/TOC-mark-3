/*
NDFA(Q, ∑, δ,q0,F)
Q: finite set of states  
∑: finite set of the input symbol  
q0: initial state   
F: final state  
δ: Transition function  
*/

class NFA {
  constructor() {
    this.states = new Set();
    this.alphabet = new Set();
    this.startState = null;
    this.finalStates = new Set();
    this.transitions = new Map();
  }

  addState(state) {
    this.states.add(state);
  }

  addAlphabet(symbol) {
    this.alphabet.add(symbol);
  }

  addTransition(fromState, symbol, toState) {
    const key = `${fromState}-${symbol}`;
    if (this.transitions.has(key)) {
      // Retrieve the existing array and concatenate toState
      const existingStates = this.transitions.get(key);
      this.transitions.set(key, existingStates.concat(toState));
    } else {
      // If the key doesn't exist yet, initialize it with an array containing toState
      this.transitions.set(key, [toState]);
    }
  }

  setStartState(state) {
    this.startState = state;
    this.addState(state);
  }

  addFinalState(state) {
    this.finalStates.add(state);
  }
  concatenateNFA(smallnfa) {
    //q0 will be unchanged
    // this is M1
    // smallnfa is M2
    //Q
    // Add all states from smallnfa to the main nfa
    smallnfa.states.forEach((state) => {
      this.addState(state);
    });
    //sigma
    // Add all symbols from smallnfa's alphabet to the main nfa's alphabet
    smallnfa.alphabet.forEach((symbol) => {
      this.addAlphabet(symbol);
    });

    // Add all transitions from smallnfa to the main nfa
    // console.log("loop is on");
    //delta
    smallnfa.transitions.forEach((states, key) => {
      // console.log(states, key);
      if (this.transitions.has(key)) {
        // Retrieve the existing array and concatenate states
        const existingStates = this.transitions.get(key);
        this.transitions.set(key, existingStates.concat(states));
      } else {
        // If the key doesn't exist yet, initialize it with an array containing states
        this.transitions.set(key, states);
      }
    });

    // Set the start state of the main nfa to the start state of smallnfa
    // this.setStartState(smallnfa.startState);
    this.finalStates.forEach((f1) => {
      this.addTransition(f1, "e", smallnfa.startState);
    });
    this.finalStates.clear();
    // Add all final states from smallnfa to the main nfa
    smallnfa.finalStates.forEach((state) => {
      this.addFinalState(state);
    });
    return this;
  }
  unionNFA(smallnfa, stackelements) {
    // console.log("union stavk", stackelements);
    let tStart = createNewState(stackelements);
    let tFinal = createNewState(stackelements);
    this.addState(tStart);
    this.addState(tFinal);

    this.addTransition(tStart, "e", this.startState);
    this.addTransition(tStart, "e", smallnfa.startState);

    // Add all states from smallnfa to the main nfa
    smallnfa.states.forEach((state) => {
      this.addState(state);
    });

    // Add all symbols from smallnfa's alphabet to the main nfa's alphabet
    smallnfa.alphabet.forEach((symbol) => {
      this.addAlphabet(symbol);
    });

    // Add all transitions from smallnfa to the main nfa
    smallnfa.transitions.forEach((states, key) => {
      if (this.transitions.has(key)) {
        // Retrieve the existing array and concatenate states
        const existingStates = this.transitions.get(key);
        this.transitions.set(key, existingStates.concat(states));
      } else {
        // If the key doesn't exist yet, initialize it with an array containing states
        this.transitions.set(key, states);
      }
    });
    //add all final states from smallnfa to the main nfa
    this.finalStates = this.finalStates.union(smallnfa.finalStates);
    // for (let _changing = 0; _changing < this.finalStates.size; _changing++) {
    //   const element = this.finalStates[_changing];
    //   console.log("element", this.finalStates);
    // }
    for (const item of this.finalStates) {
      this.addTransition(item, "e", tFinal);
    }
    this.finalStates.clear();

    this.setStartState(tStart);
    this.addFinalState(tFinal);
  }
  starNFA(stackelements) {
    let tStart = createNewState(stackelements);
    let tFinal = createNewState(stackelements);
    this.addState(tStart);
    this.addState(tFinal);

    this.addTransition(tStart, "e", this.startState);
    this.addTransition(tStart, "e", tFinal);
    for (const item of this.finalStates) {
      this.addTransition(item, "e", tFinal);
      this.addTransition(item, "e", this.startState);
    }
    this.finalStates.clear();
    // Set the start state of the main nfa to the start state of smallnfa
    this.setStartState(tStart);
    this.addFinalState(tFinal);
    return this;
  }
  plusNFA(stackelements) {
    let tStart = createNewState(stackelements);
    let tFinal = createNewState(stackelements);
    this.addState(tStart);
    this.addState(tFinal);

    this.addTransition(tStart, "e", this.startState);
    // this.addTransition(tStart, "e", tFinal);
    for (const item of this.finalStates) {
      this.addTransition(item, "e", tFinal);
      this.addTransition(item, "e", this.startState);
    }
    this.finalStates.clear();
    // Set the start state of the main nfa to the start state of smallnfa
    this.setStartState(tStart);
    this.addFinalState(tFinal);
    return this;
  }
}
function applyConcatenation(stack) {
  let flag = true;
  while (flag) {
    flag = false;
    for (let i = 0; i < stack.length - 1; i++) {
      // console.log(stack[i], stack[i + 1], typeof stack[i], typeof stack[i + 1]);
      if (
        typeof stack[i] == "object" &&
        typeof stack[i] == typeof stack[i + 1]
      ) {
        let nfa1 = stack[i];
        nfa1 = nfa1.concatenateNFA(stack[i + 1]);
        stack.splice(i, 2, nfa1);
        flag = true;
        break;
      }
    }
  }

  return stack;
}
function applySingleOperation(stack, states) {
  let flag = true;
  while (flag) {
    flag = false;
    for (let i = 0; i < stack.length - 1; i++) {
      if (typeof stack[i] == "object" && stack[i + 1] == "*") {
        let nfa1 = stack[i];
        nfa1.starNFA(states);
        stack.splice(i, 2, nfa1);
        flag = true;
        break;
      } else if (typeof stack[i] == "object" && stack[i + 1] == "+") {
        let nfa1 = stack[i];
        nfa1.plusNFA(states);
        stack.splice(i, 2, nfa1);
        flag = true;
        break;
      }
    }
  }
  return stack;
}
function applyUnion(stack, states) {
  let flag = true;
  while (flag) {
    flag = false;
    for (let i = 0; i < stack.length - 2; i++) {
      if (
        typeof stack[i] == "object" &&
        typeof stack[i + 2] == "object" &&
        stack[i + 1] == "|"
      ) {
        let nfa1 = stack[i];
        nfa1.unionNFA(stack[i + 2], states);
        stack.splice(i, 3, nfa1);
        flag = true;
        break;
      }
    }
  }
  return stack;
}
function regexToENFA(regex) {
  // let nfa = new NFA();
  let nfaStack = [];
  let states = new Set();

  for (let i = 0; i < regex.length; i++) {
    const token = regex[i];
    // console.log(token);
    if (token == "e") {
      let tempQ1 = createNewState(states);
      let tempnfa1 = new NFA();
      tempnfa1.addState(tempQ1);
      tempnfa1.setStartState(tempQ1);
      tempnfa1.addFinalState(tempQ1);
      tempnfa1.addTransition(tempQ1, "e", tempQ1);
      nfaStack.push(tempnfa1);
      states = states.union(tempnfa1.states);
      // nfa.concatenateNFA(tempnfa1);
    } else if (/[a-zA-Z0-9]/.test(token)) {
      let tempQ1 = createNewState(states);
      let tempQ2 = createNewState(states);
      let tempnfa1 = new NFA();
      tempnfa1.addAlphabet(token);
      tempnfa1.addState(tempQ1);
      tempnfa1.addState(tempQ2);
      tempnfa1.setStartState(tempQ1);
      tempnfa1.addFinalState(tempQ2);
      tempnfa1.addTransition(tempQ1, token, tempQ2);
      nfaStack.push(tempnfa1);
      states = states.union(tempnfa1.states);
      // output += token;
    } else if (token == "|") {
      // while (nfaStack.length > 0 && nfaStack[nfaStack.length - 1] !== "(") {}
      nfaStack.push(token);
    } else if (token == "+") {
      nfaStack.push(token);
      continue;
      let nfa1 = nfaStack.pop();
      nfa1 = nfa1.plusNFA(states);
      nfaStack.push(nfa1);
      // console.log(nfaStack);
    } else if (token == "*") {
      nfaStack.push(token);
      continue;
      let nfa1 = nfaStack.pop();
      // console.log(nfa1);
      nfa1 = nfa1.starNFA(states);
      nfaStack.push(nfa1);
    } else if (token === "(") {
      nfaStack.push(token);
    } else if (token === ")") {
      nfaStack.push(token);
      continue;
      let tempStack = [];
      while (nfaStack.length > 0 && nfaStack[nfaStack.length - 1] !== "(") {
        // console.log("loop start");
        let elem = nfaStack.pop();
        tempStack.push(elem);

        continue;
        let nfa1 = nfaStack.pop();
        let nfa2 = nfaStack.pop();
        let operation = null;
        if (nfa2 === "|") {
          operation = "|";
          nfa2 = nfaStack.pop();
          nfa2.unionNFA(nfa1, states);
          nfaStack.push(nfa2);
        } else if (nfa2 == "(") {
          nfaStack.push(nfa1);
          // console.log("loop break");
          break;
        } else {
          nfa2.concatenateNFA(nfa1);
          nfaStack.push(nfa2);
        }
      }
      console.log("tempStack", tempStack);
      tempStack = stackLoop(tempStack, states);
      // console.log("tempStack", tempStack);
      nfaStack.pop();
      nfaStack.push(tempStack[0]);
    }
  }
  // 0nfa1|2nfa 3nfa|nfa
  // console.log("raw nfa", nfaStack);
  let sopnfa = applySingleOperation(nfaStack, states);
  // console.log("single operation", sopnfa);
  let nfaConStack = applyConcatenation(sopnfa, states);
  // console.log("concatenated", nfaConStack);
  let nfaUnion = applyUnion(nfaConStack, states);
  // console.log("union", nfaUnion);
  let rmvParanthesis = nfaUnion.filter((item) => item !== "(" && item !== ")"); //.filter(char => char !== '(' && char !== ')');
  // console.log("rmvParanthesis", rmvParanthesis);
  let finalOpNfa = applySingleOperation(rmvParanthesis, states);
  // console.log("finalOpNfa", finalOpNfa);
  let finalConNfa = applyConcatenation(finalOpNfa, states);
  // console.log("finalConNfa", finalConNfa);
  return finalConNfa[0];

  nfaStack = stackLoop(nfaStack, states);
  //? Sequencing States
  let nfa = new NFA();
  nfa = nfaStack[0];
  // return nfa;
  let temp_alphabet = nfa.alphabet;
  // temp_alphabet.add("e");
  nfa.states.clear();
  let temp_visited = new Set();
  let temp_itrStack = [];
  temp_itrStack.push(nfa.startState);
  let _DEBUGITR = 0;
  //while loop itrStack
  while (temp_itrStack.length > 0) {
    _DEBUGITR++;
    if (_DEBUGITR > 100) {
      alert("Infinite loop detected itrStack");
      break;
    }

    let current_state = temp_itrStack.pop();
    temp_visited.add(current_state);
    // console.log("current_state", current_state, temp_visited);

    if (temp_visited.has(current_state)) continue;
    nfa.addState(current_state);

    if (nfa.transitions.has(`${current_state}-e`)) {
      let st = nfa.transitions.get(`${current_state}-e`);
      st.forEach((element, key) => {
        if (!temp_visited.has(element)) temp_itrStack.push(element);
      });
    }
    temp_alphabet.forEach((alphabet) => {
      if (nfa.transitions.has(`${current_state}-${alphabet}`)) {
        let st = nfa.transitions.get(`${current_state}-${alphabet}`);
        st.forEach((element, key) => {
          // console.log("element", element);
          if (!temp_visited.has(element)) temp_itrStack.push(element);
        });
      }
    });
  }

  // console.log("seq state : ");
  //! this is  imp loop
  /*
  let x = 0;
  while (nfaStack.length > 1) {
    // break;
    // console.log("loop", x, nfaStack.length);
    if (x >= nfaStack.length - 1) x = 0;
    let nfa1 = nfaStack[x];
    let nfa2 = nfaStack[x + 1];
    if (nfa2 == "|") {
      // x = x + 1;
      if (nfaStack[x + 3] instanceof NFA) x += 2;
      else if (nfaStack[x + 2] instanceof NFA) {
        nfa2 = nfaStack[x + 2];
        nfa2.unionNFA(nfa1, states);
        nfaStack.splice(x, 3, nfa2);
      }
    } else if (nfa2 instanceof NFA && nfa1 instanceof NFA) {
      nfa2.concatenateNFA(nfa1);
      nfaStack.splice(x, 2, nfa2);
    } else {
      // console.log(nfaStack);
      // console.log("nfa1", nfa1, "nfa2", nfa2, x);
      alert("kuch to hua hai");

      break;
    }
    // output = nfaStack.pop();
  }/*/
  console.log("final", nfa);
  return nfa;
}

function stackLoop(nfaStack, states) {
  let x = 0;
  let _DEBUGITR = 0;
  while (nfaStack.length > 1) {
    if (_DEBUGITR > 100) {
      alert("Infinite loop detected in stack loop");
      break;
    }
    _DEBUGITR++;

    // break;
    // console.log("loop", x, nfaStack.length);
    if (x >= nfaStack.length - 1) x = 0;
    let nfa1 = nfaStack[x];
    let nfa2 = nfaStack[x + 1];
    if (nfa2 == "|") {
      // x = x + 1;
      if (nfaStack[x + 3] instanceof NFA) x += 2;
      else if (nfaStack[x + 2] instanceof NFA) {
        nfa2 = nfaStack[x + 2];
        nfa2 = nfa2.unionNFA(nfa1, states);
        nfaStack.splice(x, 3, nfa2);
      }
    } else if (nfa2 instanceof NFA && nfa1 instanceof NFA) {
      nfa2 = nfa2.concatenateNFA(nfa1);
      nfaStack.splice(x, 2, nfa2);
    } else {
      // console.log(nfaStack);
      // console.log("nfa1", nfa1, "nfa2", nfa2, x);
      alert("kuch to hua hai");

      break;
    }
    // output = nfaStack.pop();
  }
  return nfaStack;
}

function createNewState(states) {
  let tempSt = "q0";
  // console.log("createNewState loop start");
  let _DEBUGITR = 0;
  while (states.has(tempSt)) {
    if (_DEBUGITR > 100) {
      alert("Infinite loop detected in createNewState");
      break;
    }
    let tempstate_no = tempSt.slice(1);
    tempSt = "q" + (parseInt(tempstate_no) + 1);
    _DEBUGITR++;
    // console.log("createNewState loop", tempSt);
  }
  // console.log("createNewState loop end");
  // console.log(tempSt);
  states.add(tempSt);
  return tempSt;
}
function makeTransitionTable(tempNfa, divId, isENFA = false) {
  // return;
  const tablecontainer = document.getElementById(divId);
  tablecontainer.innerHTML = "";
  tablecontainer.classList.add("transition-table-container");
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
}
