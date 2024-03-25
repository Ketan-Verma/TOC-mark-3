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
    // this is M1
    // smallnfa is M2

    // Add all states from smallnfa to the main nfa
    // smallnfa.states.forEach((state) => {});
    for (let _changing = 0; _changing < smallnfa.states.length; _changing++) {
      const element = smallnfa.states[_changing];
      this.addState(state);
    }

    // Add all symbols from smallnfa's alphabet to the main nfa's alphabet
    // smallnfa.alphabet.forEach((symbol) => {});

    for (let _changing = 0; _changing < smallnfa.alphabet.length; _changing++) {
      const element = smallnfa.alphabet[_changing];
      this.addAlphabet(element);
    }

    // Add all transitions from smallnfa to the main nfa
    console.log("loop is on");
    smallnfa.transitions.forEach((states, key) => {
      console.log(states, key);
      if (true) {
      } else if (this.transitions.has(key)) {
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
    this.addTransition(this.startState, "e", smallnfa.startState);
    this.finalStates.clear();
    // Add all final states from smallnfa to the main nfa
    smallnfa.finalStates.forEach((state) => {
      this.addFinalState(state);
    });
  }
  unionNFA(smallnfa, stackelements) {
    let tStart = "qs";
    let tFinal = "qf";
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
  starNFA(smallnfa) {
    // Add all states from smallnfa to the main nfa
    smallnfa.states.forEach((state) => {
      this.addState(state);
    });

    // Add all symbols from smallnfa's alphabet to the main nfa's alphabet
    smallnfa.alphabet.forEach((symbol) => {
      this.addAlphabet(symbol);
    });

    // / Add all transitions from smallnfa to the main nfa
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

    // Set the start state of the main nfa to the start state of smallnfa
    this.setStartState(smallnfa.startState);

    // Add all final states from smallnfa to the main nfa
    smallnfa.finalStates.forEach((state) => {
      this.addFinalState(state);
    });
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
    } else if ("|*+".includes(token)) {
      // while (
      //   stack.length > 0 &&
      //   precedence[stack[stack.length - 1]] >= precedence[token]
      // ) {
      //   output += stack.pop();
      // }
      nfaStack.push(token);
    } else if (token === "(") {
      nfaStack.push(token);
    } else if (token === ")" && regex[i + 1] === "*") {
      console.log(nfaStack);
      while (nfaStack.length > 0 && nfaStack[nfaStack.length - 1] !== "(") {
        let nfa1 = nfaStack.pop();
        let nfa2 = nfaStack.pop();
        let operation = null;
        if (nfa2 === "+") {
          operation = "+";
          nfa2 = nfaStack.pop();
          // console.log(nfa1, nfa2);
          // return;

          nfa2.unionNFA(nfa1);
          nfaStack.push(nfa2);
          console.log("union", nfa2);
        } else {
          console.log(nfa1, nfa2);
          return;
          nfa2.concatenateNFA(nfa1);
          nfaStack.push(nfa2);
        }
      }
      nfaStack.push(token);
    } else if (token === ")" && regex[i + 1] === "+" && regex[i + 2] === "+") {
      nfaStack.push(token);
    } else if (token === ")") {
      // console.log("nfaStack", nfaStack);

      while (nfaStack.length > 0 && nfaStack[nfaStack.length - 1] !== "(") {
        // console.log("nfaStack", nfaStack);
        let nfa1 = nfaStack.pop();
        let nfa2 = nfaStack.pop();
        let operation = null;
        if (nfa2 === "+") {
          operation = "+";
          nfa2 = nfaStack.pop();
          // console.log(nfa1, nfa2);
          // return;
          // console.log("unionNFA");
          // console.log(nfa1, nfa2);
          nfa2.unionNFA(nfa1, nfaStack);
          nfaStack.push(nfa2);
        } else if (nfa2 == "(") {
          nfaStack.push(nfa1);
          break;
        } else {
          console.log(nfa1, nfa2);
          break;
          nfa2.concatenateNFA(nfa1);
          nfaStack.push(nfa2);
        }
      }
    } else if (token === ")") {
      // while (nfaStack.length > 0 && nfaStack[nfaStack.length - 1] !== "(") {
      //   // output += stack.pop();
      // }
    }
  }

  // while (nfastack.length > 0) {
  //   output += stack.pop();
  // }

  return nfaStack;
}
function createNewState(states) {
  let tempSt = "q0";
  while (states.has(tempSt)) {
    tempSt = "q" + (parseInt(tempSt[1]) + 1);
  }
  // console.log(tempSt);
  states.add(tempSt);
  return tempSt;
}
