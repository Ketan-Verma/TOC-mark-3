function makeDfaFromNfa(nfa) {
  let dfa = new NFA();
  let tempStack = [];
  //   console.log(nfa.transitions);
  dfa.states = nfa.states;
  dfa.startState = nfa.startState;
  dfa.finalStates = nfa.finalStates;
  dfa.alphabet = nfa.alphabet;
  tempStack = Array.from(dfa.states);
  //   tempStack.push(state);
  //   console.log(tempStack);
  let visited = [];
  while (tempStack.length > 0) {
    let current_state = tempStack.pop();
    // if (current_state.length == 0) console.log("hello");
    // console.log("current", current_state);
    if (visited.includes(current_state)) continue;

    visited.push(current_state);
    for (const letter of dfa.alphabet) {
      let to_state = nfa.transitions.get(`${current_state}-${letter}`);
      if (!dfa.states.has(current_state)) {
        to_state = [];
        dfa.states.add(current_state);
        let temp_arr = current_state.split(",");
        temp_arr.forEach((element) => {
          //   for (const input of dfa.alphabet) {
          let micro_t = nfa.transitions.get(`${element}-${letter}`);
          if (micro_t) to_state.push(to_state.concat(micro_t));
          //   console.log("micro", to_state);
          //   }
        });
      }
      //   console.log("???before", to_state);
      to_state = [...new Set(to_state)];
      to_state = to_state.join(",");
      to_state = to_state.split(",");
      to_state = [...new Set(to_state)];
      //   console.log("???after", to_state);
      if (to_state.length > 0) {
        // console.log("current", current_state);
        if (to_state.length > 2) {
          to_state = to_state.sort();
        }
        if (to_state.length == 0) continue;
        to_state = to_state.join(",");
        // console.log("condition", dfa.states.has(current_state));
        if (!to_state) continue;
        // console.log(">>", current_state, letter, to_state);
        dfa.addTransition(current_state, letter, to_state);
        tempStack.push(to_state);
      }
    }
  }

  //   final states
  //state q0q1q5 ka koi bhi element final me hai kya

  for (const state of dfa.states) {
    let temp_states_ary = new Set(state.split(","));
    // console.log(temp_states_ary);
    if (!temp_states_ary.isDisjointFrom(dfa.finalStates)) {
      dfa.addFinalState(state);
    }
    // console.log("")
    // if(dfa.finalStates.has(state)){}
  }
  //! removing unreachable states
  let _rmStart = dfa.startState;
  let _rmVisited = new Set();
  let _rmStack = [];
  _rmStack.push(_rmStart);
  // if (deadreq) _rmVisited.add("qd");
  while (_rmStack.length > 0) {
    let current_rm = _rmStack.pop();
    if (_rmVisited.has(current_rm)) continue;
    _rmVisited.add(current_rm);
    for (let letter of dfa.alphabet) {
      let rm_trans = dfa.transitions.get(`${current_rm}-${letter}`);
      for (let trm of rm_trans) {
        _rmStack.push(trm);
        _rmVisited.add(trm);
      }
    }
  }
  // console.log("visited", _rmVisited);
  let _notVisited = dfa.states.difference(_rmVisited);
  // console.log("notvisited", _notVisited);
  dfa.states = _rmVisited;
  for (const letter of dfa.alphabet) {
    for (const _rm_state of _notVisited) {
      dfa.transitions.delete(`${_rm_state}-${letter}`);
    }
  }
  //! dead transition
  let deadreq = false;
  for (const state of dfa.states) {
    for (const letter of dfa.alphabet) {
      if (!dfa.transitions.has(`${state}-${letter}`)) {
        dfa.addTransition(state, letter, "qd");
        deadreq = true;
        // console.log("dead", state, letter);
      }
    }
  }
  if (deadreq) {
    dfa.addState("qd");
    for (const letter of dfa.alphabet) {
      dfa.addTransition("qd", letter, "qd");
    }
  }

  //!renaming
  let renamemap = new Map();
  for (const state of dfa.states) {
    if (state.includes(",")) {
      let tempSt = "q0";
      while (dfa.states.has(tempSt)) {
        let tempstate_no = tempSt.slice(1);
        tempSt = "q" + (parseInt(tempstate_no) + 1);
      }
      dfa.states.add(tempSt);
      if (dfa.finalStates.delete(state)) dfa.finalStates.add(tempSt);
      dfa.states.delete(state);

      renamemap.set(state, tempSt);
    }
  }
  for (const delta of dfa.transitions) {
    let strsplit = delta[0].split("-");
    if (renamemap.has(strsplit[0])) {
      let tempTB = renamemap.get(strsplit[0]);
      if (Array.isArray(delta[1]))
        dfa.transitions.set(`${tempTB}-${strsplit[1]}`, delta[1]);
      else dfa.transitions.set(`${tempTB}-${strsplit[1]}`, [delta[1]]);
      dfa.transitions.delete(`${strsplit[0]}-${strsplit[1]}`);
    }
  }
  for (const delta of dfa.transitions) {
    if (renamemap.has(delta[1][0])) {
      if (Array.isArray(delta[1][0]))
        dfa.transitions.set(delta[0], renamemap.get(delta[1][0]));
      else dfa.transitions.set(delta[0], [renamemap.get(delta[1][0])]);
    }
  }

  return dfa;
}
