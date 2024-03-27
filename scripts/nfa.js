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

function regexToENFA(regex) {
  const precedence = {
    "|": 1,
    "*": 2,
    "+": 2,
  };
  let nfa = new NFA();
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
      let nfa1 = nfaStack.pop();
      nfa1 = nfa1.plusNFA(states);
      nfaStack.push(nfa1);
      console.log(nfaStack);
    } else if (token == "*") {
      let nfa1 = nfaStack.pop();
      // console.log(nfa1);
      nfa1 = nfa1.starNFA(states);
      nfaStack.push(nfa1);
    } else if (token === "(") {
      nfaStack.push(token);
    } else if (token === ")") {
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
        // console.log("loop end");
      }
      tempStack = stackLoop(tempStack, states);
      // console.log("tempStack", tempStack);
      nfaStack.pop();
      nfaStack.push(tempStack[0]);
    }
  }
  // 0nfa1|2nfa 3nfa|nfa
  nfaStack = stackLoop(nfaStack, states);
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
  // console.log("final", nfaStack);
  return nfaStack;
}

function stackLoop(nfaStack, states) {
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
  }
  return nfaStack;
}

function createNewState(states) {
  let tempSt = "q0";
  // console.log("createNewState loop start");
  while (states.has(tempSt)) {
    let tempstate_no = tempSt.slice(1);
    tempSt = "q" + (parseInt(tempstate_no) + 1);
    // console.log("createNewState loop", tempSt);
  }
  // console.log("createNewState loop end");
  // console.log(tempSt);
  states.add(tempSt);
  return tempSt;
}
