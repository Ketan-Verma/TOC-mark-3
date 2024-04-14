function removeEpsilonTransitions(enfa) {
  // Function to compute epsilon closure of a state
  let rechable = new Set();
  let ctable = new Map();

  function epsilonClosure(state) {
    let closure = new Set();
    closure.add(state);
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
  // for (const element of ctable) {
  //   console.log(ctable.get(element[0]));
  // }
  // console.log("ctable", ctable);
  // makeClosureTable(ctable, "closure-table");
  //   mega transaction
  let megaTrans = new Map();
  for (let state of enfa.states) {
    // console.log("state is", state);
    let eclsr = ctable.get(state);
    // console.log(eclsr);
    for (let input of enfa.alphabet) {
      // console.log("Ddelta ", state, input);
      // console.log("closure is", eclsr);
      let megaClosure = new Set();
      for (const elmt of eclsr) {
        let _temp_trans = enfa.transitions.get(`${elmt}-${input}`);
        // console.log();
        _temp_trans = _temp_trans ? _temp_trans : [];
        _temp_trans.forEach((element) => {
          // console.log(element);
          // console.log(ctable.get(element));
          megaClosure = megaClosure.union(ctable.get(element));
          // console.log("megaclsr", megaClosure);
        });
      }
      megaTrans.set(`${state}-${input}`, megaClosure);
    }
  }
  // for (let state of enfa.states) {
  //   //q0,q1,q2
  //   for (let input of enfa.alphabet) {
  //     //a,b
  //     let megaClosure = new Set();
  //     //q0->q0,q1->q1,q2,...
  //     megaClosure = megaClosure.union(ctable.get(state));

  //     let _abc = enfa.transitions.get(`${state}-${input}`) || [];
  //     megaClosure = megaClosure.union(new Set(_abc));
  //     for (let closureState of megaClosure) {
  //       let _xyz = enfa.transitions.get(`${closureState}-${input}`) || [];
  //       for (let _state of _xyz) {
  //         megaClosure.add(_state);
  //         megaClosure = megaClosure.union(epsilonClosure(_state));
  //       }
  //     }
  //     megaTrans.set(`${state}-${input}`, megaClosure);
  //   }
  // }
  /*
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
  // console.log("megaTrans", megaTrans);
  // makeMegaTable(enfa, megaTrans, "mega-table");
  // Remove epsilon transitions
  // for (let [transition, nextStates] of enfa.transitions) {
  //   if (transition.endsWith("-e")) {
  //     enfa.transitions.delete(transition);

  //     let currentState = transition.split("-")[0];
  //     let epsilonClosureStates = epsilonClosure(currentState);

  //     for (let nextState of nextStates) {
  //       for (let state of epsilonClosureStates) {
  //         if (enfa.transitions.has(`${state}-${nextState}`)) {
  //           enfa.transitions.get(`${state}-${nextState}`).forEach((symbol) => {
  //             if (!enfa.transitions.has(`${currentState}-${symbol}`)) {
  //               enfa.transitions.set(`${currentState}-${symbol}`, []);
  //             }
  //             enfa.transitions.get(`${currentState}-${symbol}`).push(nextState);
  //           });
  //         }
  //       }
  //     }
  //   }
  // }
  // console.log("state", enfa.states);
  let tempTrans = new Map();
  for (const state of enfa.states) {
    for (const input of enfa.alphabet) {
      let nextStates = megaTrans.get(`${state}-${input}`);
      if (nextStates.size == 0) {
        continue;
      }
      let nextStatesArray = Array.from(nextStates);
      tempTrans.set(`${state}-${input}`, nextStatesArray);
    }
  }
  // console.log("tempTrans", tempTrans);
  enfa.transitions = new Map([...tempTrans]);

  //! removing unreachable states
  let _rmStart = enfa.startState;
  let _rmVisited = new Set();
  let _rmStack = [];
  _rmStack.push(_rmStart);
  // _rmVisited.add("qd");
  while (_rmStack.length > 0) {
    let current_rm = _rmStack.pop();
    if (_rmVisited.has(current_rm)) continue;
    _rmVisited.add(current_rm);
    for (let letter of enfa.alphabet) {
      let rm_trans = enfa.transitions.get(`${current_rm}-${letter}`);
      for (let trm of rm_trans) {
        _rmStack.push(trm);
        _rmVisited.add(trm);
      }
    }
  }
  // console.log("visited", _rmVisited);//
  let _notVisited = enfa.states.difference(_rmVisited);
  // console.log("notvisited", _notVisited);
  enfa.states = _rmVisited;
  for (const letter of enfa.alphabet) {
    for (const _rm_state of _notVisited) {
      enfa.transitions.delete(`${_rm_state}-${letter}`);
    }
  }
  // //! set final states
  for (let state of enfa.states) {
    // console.log("state", state, ctable.get(state));
    if (!ctable.get(state).isDisjointFrom(enfa.finalStates)) {
      enfa.finalStates.add(state);
    }
  }
  return [ctable, megaTrans, enfa];
}

// Example usage:

// enfa = removeEpsilonTransitions(enfa);
// console.log(enfa);

function makeClosureTable(ctable, containerId) {
  // return;
  let container = document.getElementById(containerId);
  container.innerHTML = "";

  let table = document.createElement("div");
  table.classList.add("table", "table-bordered");
  let row = document.createElement("h3");
  row.innerText = "Closure Table";
  table.appendChild(row);
  for (let [state, closure] of ctable) {
    let row = document.createElement("p");
    row.classList.add("closure-row");
    let __entries = Array.from(closure);
    if (__entries.length == 0) {
      __entries.push("Ø");
    }
    row.innerText = state + " = " + __entries.join(", ");

    table.appendChild(row);
  }
  container.appendChild(table);
}
function makeMegaTable(enfa, megaTrans, containerId) {
  //row1 > state | input
  let container = document.getElementById(containerId);
  container.innerHTML = "";
  let table = document.createElement("table");
  table.classList.add("table", "table-bordered");
  let row = document.createElement("tr");
  let _th = document.createElement("th");
  _th.setAttribute("colspan", enfa.alphabet.size + 1);
  _th.textContent = "Mega Transition Table";
  row.appendChild(_th);
  table.appendChild(row);
  let row1 = document.createElement("tr");
  row1.classList.add("mega-row");
  let th1 = document.createElement("th");
  th1.innerText = "State";
  row1.appendChild(th1);
  for (let symbol of enfa.alphabet) {
    var th = document.createElement("th");
    th.textContent = symbol;
    row1.appendChild(th);
  }
  table.appendChild(row1);
  for (let state of enfa.states) {
    let row = document.createElement("tr");
    row.classList.add("mega-row");
    let td = document.createElement("td");
    td.innerText = state;
    row.appendChild(td);
    for (let input of enfa.alphabet) {
      let td = document.createElement("td");
      let nextStates = megaTrans.get(`${state}-${input}`) || [];
      if (nextStates.length == 0) {
        nextStates.push("Ø");
      }
      td.innerText = Array.from(nextStates).join(", ");
      row.appendChild(td);
    }
    table.appendChild(row);
  }

  container.appendChild(table);
}
