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
  makeClosureTable(ctable, "closure-table");
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
  makeMegaTable(enfa, megaTrans, "mega-table");
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
  console.log("state", enfa.states);
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
  console.log("tempTrans", tempTrans);
  enfa.transitions = new Map([...tempTrans]);
  return enfa;
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
