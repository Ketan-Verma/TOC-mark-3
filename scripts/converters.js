function removeEpsilonTransitions(enfa) {
  // Function to compute epsilon closure of a state
  let rechable = new Set();
  let ctable = new Map();

  function epsilonClosure(state) {
    let closure = new Set();
    let stack = [state];

    while (stack.length > 0) {
      let currentState = stack.pop();
      let transitions = enfa.transitions.get(`${currentState}-e`) || [];

      for (let nextState of transitions) {
        if (!closure.has(nextState)) {
          closure.add(nextState);
          stack.push(nextState);
        }
      }
    }

    return closure;
  }
  for (let state of enfa.states) {
    ctable.set(state, epsilonClosure(state));
  }
  console.log("ctable", ctable);
  //   mega transaction
  let megaTrans = new Map();
  for (let state of enfa.states) {
    for (let input of enfa.alphabet) {
      let megaClosure = new Set();
      megaClosure = megaClosure.union(ctable.get(state));
      let _abc = enfa.transitions.get(`${state}-${input}`) || [];
      megaClosure = megaClosure.union(new Set(_abc));
      for (let closureState of megaClosure) {
        let _xyz = enfa.transitions.get(`${closureState}-${input}`) || [];
        for (let _state of _xyz) {
          megaClosure.add(_state);
          megaClosure = megaClosure.union(epsilonClosure(_state));
        }
      }
      megaTrans.set(`${state}-${input}`, megaClosure);
    }
  } /*
  for (let state of enfa.states) {
    for (let input of enfa.alphabet) {
      let megaClosure = new Set();
      megaClosure.union(ctable.get(state));
      for (let closureState of ctable.get(state)) {
        let _xyz = enfa.transitions.get(`${closureState}-${input}`) || [];

        // megaTrans.set(`${state}-${input}`, _xyz);
        for (let _state of _xyz) {
          megaClosure.add(_state);
          megaClosure = megaClosure.union(epsilonClosure(_state));
        }
      }
      megaTrans.set(`${state}-${input}`, megaClosure);
    }
  }*/
  console.log("megaTrans", megaTrans);

  // Remove epsilon transitions
  for (let [transition, nextStates] of enfa.transitions) {
    if (transition.endsWith("-e")) {
      enfa.transitions.delete(transition);

      let currentState = transition.split("-")[0];
      let epsilonClosureStates = epsilonClosure(currentState);

      for (let nextState of nextStates) {
        for (let state of epsilonClosureStates) {
          if (enfa.transitions.has(`${state}-${nextState}`)) {
            enfa.transitions.get(`${state}-${nextState}`).forEach((symbol) => {
              if (!enfa.transitions.has(`${currentState}-${symbol}`)) {
                enfa.transitions.set(`${currentState}-${symbol}`, []);
              }
              enfa.transitions.get(`${currentState}-${symbol}`).push(nextState);
            });
          }
        }
      }
    }
  }

  return enfa;
}

// Example usage:
let enfa = {
  states: new Set(["q0", "q1", "q2"]),
  alphabet: new Set(["a", "b"]),
  startState: "q0",
  finalStates: new Set(["q2"]),
  transitions: new Map([
    ["q0-e", ["q1"]],
    ["q0-a", ["q1", "q2"]],
    ["q1-e", ["q2"]],
    ["q1-b", ["q2"]],
    ["q2-e", ["q0"]],
  ]),
};

enfa = removeEpsilonTransitions(enfa);
console.log(enfa);
