function minimizedfa(dfa) {
  console.log("dfa", dfa);
  let min_dfa = new NFA();
  min_dfa.setStartState(dfa.startState);
  min_dfa.alphabet = dfa.alphabet;

  let nonFinalStates = new Set(
    [...dfa.states].filter((state) => !dfa.finalStates.has(state))
  );
  let finalStates = new Set(
    [...dfa.states].filter((state) => dfa.finalStates.has(state))
  );
  let k = 0;
  let partition = new Array();
  let temp_partition = new Set();
  temp_partition.add(nonFinalStates);
  temp_partition.add(finalStates);
  // temp_partition.add(new Set());
  partition.push(temp_partition); //g1 g2
  // console.log("partition", k, partition[k].size, partition.length);
  while (k < 10) {
    k++;
    // console.log("k", k, partition[k - 1].size);
    if (k > 1 && partition[k - 2].size == partition[k - 1].size) {
      break;
    }
    temp_partition = new Set();
    //PI 1
    //G1 G2
    let Group = [...partition[k - 1]];
    // console.log("group", Group);
    let group_table = new Map();
    let grp_set = new Set();
    for (const state of dfa.states) {
      // let temp = new Set();
      //state = q1
      let Gid = "";
      for (const symbol of dfa.alphabet) {
        //symbol = a
        for (let itr = 0; itr < Group.length; itr++) {
          //G1
          if (Group[itr].has(dfa.transitions.get(`${state}-${symbol}`)[0])) {
            Gid += itr.toString();
            break;
          }
        }
      }
      grp_set.add(Gid);
      group_table.set(state, Gid);
    }
    // console.log("group_table", group_table);
    // console.log("grp_set", grp_set);
    for (const group of Group) {
      let temp_grp_map = new Map();
      //g1 g2
      // console.log("group", group);
      for (const temp_state of group) {
        //q1,q2
        if (!temp_grp_map.has(group_table.get(temp_state))) {
          temp_grp_map.set(group_table.get(temp_state), new Set([temp_state]));
        } else {
          temp_grp_map.get(group_table.get(temp_state)).add(temp_state);
        }
      }
      // console.log("temp_grp_map", temp_grp_map);
      for (const [key, value] of temp_grp_map) {
        temp_partition.add(value);
      }
      // temp_partition.add(temp_grp_map.values());
    }
    // for (let _Q of partition[k - 1]) {
    //   let temp = _Q;
    //   // console.log("temp", temp);
    //   let part_flag = false;
    //   for (const j_ of temp) {
    //     let p = j_;
    //     for (const q_ of temp) {
    //       if (p == q_) continue;
    //       let q = q_;
    //       for (let letter of dfa.alphabet) {
    //         let pa = dfa.transitions.get(`${p}-${letter}`)[0];
    //         let qa = dfa.transitions.get(`${q}-${letter}`)[0];
    //         // console.log("pairs", pa, qa);
    //         continue;
    //         let temp_delta = new Set([pa, qa]);
    //         for (const part of temp_partition) {
    //           // console.log("part", part, "temp", temp_delta);

    //           if (temp_delta.isSubsetOf(part)) {
    //             part_flag = true;
    //             break;
    //             // temp_partition.add(pair);
    //           }
    //         }
    //         if (!part_flag) {
    //           temp_partition.add(temp_delta);
    //           // console.log("temp_delta", temp_delta);
    //           // temp_delta = temp_delta.difference(temp);
    //           // console.log("temp_partition", temp_partition);
    //         } else {
    //           temp_partition.add(temp);
    //         }
    //       }
    //       // if (part_flag) break;
    //       //for any symbol alphabet
    //       //p and q are pairs
    //       //kya ye same group me hai
    //       //agar ha to alag alag kar lo

    //       // if (
    //       //   (dfa.finalStates.has(p) && !dfa.finalStates.has(q)) ||
    //       //   (!dfa.finalStates.has(p) && dfa.finalStates.has(q))
    //       // ) {
    //       //   temp_partition.add(p);
    //       //   temp_partition.add(q);
    //       // }
    //     }
    //     // if (part_flag) break;
    //   }
    // }

    partition.push(temp_partition);
  }
  // console.log(`par ${k}`, partition[k - 1]);
  let stateArray = Array.from(partition[k - 1]);
  for (let i = 0; i < stateArray.length; i++) {
    // console.log("i", i, stateArray[i]);
    // console.log("i", i, Array.from(stateArray[i]));
    let str = Array.from(stateArray[i]).join(",");
    // console.log("str", str);
    min_dfa.addState(str);
    if (Array.from(stateArray[i]).includes(dfa.startState)) {
      min_dfa.setStartState(str);
    }
    if (Array.from(stateArray[i]).some((state) => dfa.finalStates.has(state))) {
      min_dfa.addFinalState(str);
    }

    for (const symbol of dfa.alphabet) {
      // console.log(str, "symbol", symbol);
      let toStatearray = dfa.transitions.get(
        `${Array.from(stateArray[i])[0]}-${symbol}`
      );
      // console.log(toStatearray[0]);
      for (let j = 0; j < stateArray.length; j++) {
        if (stateArray[j].has(toStatearray[0])) {
          min_dfa.addTransition(
            str,
            symbol,
            Array.from(stateArray[j]).join(",")
          );
          break;
        }
      }
    }
  }
  //! removing unreachable states
  let _rmStart = min_dfa.startState;
  let _rmVisited = new Set();
  let _rmStack = [];
  _rmStack.push(_rmStart);
  // if (deadreq) _rmVisited.add("qd");
  while (_rmStack.length > 0) {
    let current_rm = _rmStack.pop();
    if (_rmVisited.has(current_rm)) continue;
    _rmVisited.add(current_rm);
    for (let letter of min_dfa.alphabet) {
      let rm_trans = min_dfa.transitions.get(`${current_rm}-${letter}`);
      for (let trm of rm_trans) {
        _rmStack.push(trm);
        _rmVisited.add(trm);
      }
    }
  }
  // console.log("visited", _rmVisited);
  let _notVisited = min_dfa.states.difference(_rmVisited);
  // console.log("notvisited", _notVisited);
  min_dfa.states = _rmVisited;
  for (const letter of min_dfa.alphabet) {
    for (const _rm_state of _notVisited) {
      min_dfa.transitions.delete(`${_rm_state}-${letter}`);
    }
  }
  /*/!renaming
  let renamemap = new Map();
  for (const state of min_dfa.states) {
    if (state.includes(",")) {
      let tempSt = "q0";
      while (min_dfa.states.has(tempSt)) {
        let tempstate_no = tempSt.slice(1);
        tempSt = "q" + (parseInt(tempstate_no) + 1);
      }
      min_dfa.states.add(tempSt);
      if (min_dfa.finalStates.delete(state)) min_dfa.finalStates.add(tempSt);
      min_dfa.states.delete(state);

      renamemap.set(state, tempSt);
    }
  }
  for (const delta of min_dfa.transitions) {
    let strsplit = delta[0].split("-");
    if (renamemap.has(strsplit[0])) {
      let tempTB = renamemap.get(strsplit[0]);
      if (Array.isArray(delta[1]))
        min_dfa.transitions.set(`${tempTB}-${strsplit[1]}`, delta[1]);
      else min_dfa.transitions.set(`${tempTB}-${strsplit[1]}`, [delta[1]]);
      min_dfa.transitions.delete(`${strsplit[0]}-${strsplit[1]}`);
    }
  }
  for (const delta of min_dfa.transitions) {
    if (renamemap.has(delta[1][0])) {
      if (Array.isArray(delta[1][0]))
        min_dfa.transitions.set(delta[0], renamemap.get(delta[1][0]));
      else min_dfa.transitions.set(delta[0], [renamemap.get(delta[1][0])]);
    }
  }*/
  // console.log("min_dfa", min_dfa);
  return min_dfa;
}

/*/   let min_dfa = new NFA();
  //   minimizeDFA() {
  // Partition states into accepting and non-accepting
  const acceptingStates = new Set(
    [...dfa.states].filter((state) => dfa.finalStates.has(state))
  );
  const nonAcceptingStates = new Set(
    [...dfa.states].filter((state) => !dfa.finalStates.has(state))
  );
  let partitions = [acceptingStates, nonAcceptingStates];
  //   console.log(partitions);
  let refined = true;

  // Helper function to find a partition containing a state
  function findPartition(state) {
    for (const partition of partitions) {
      for (const partitionState of partition) {
        if (partitionState === state) {
          return partition;
        }
      }
    }
    return null; // Return null if state is not found in any partition
  }
  let escape = 0;
  while (refined) {
    escape++;

    if (escape > 10) {
      alert("itta calculation mere bas ka nahi");
      return;
    }
    refined = false;
    const newPartitions = [];

    // Refinement step
    console.log("problem in while", escape, partitions);
    for (const partition of partitions) {
      //   console.log("problem in for partition");
      for (const symbol of dfa.alphabet) {
        const transitionMap = new Map();
        for (const state of partition) {
          const key = `${state}-${symbol}`;
          const toStates = dfa.transitions.get(key) || [];
          const toPartitions = toStates.map(findPartition);
          toPartitions.forEach((toPartition, index) => {
            const states = transitionMap.get(toPartition) || [];
            transitionMap.set(toPartition, states.concat(toStates[index]));
          });
        }
        newPartitions.push(
          ...Array.from(transitionMap.values()).filter(
            (states) => states.length > 0
          )
        );
      }
    }

    // Check if any new partitions were found
    if (newPartitions.length !== partitions.length) {
      partitions = newPartitions;
      refined = true;
    }
  }

  // Merge equivalent states
  const stateMap = new Map();
  partitions.forEach((partition, index) => {
    partition.forEach((state) => stateMap.set(state, index));
  });

  const minimizedDFA = new NFA();
  partitions.forEach((partition, index) => {
    const representativeState = [...partition][0];
    minimizedDFA.addState(index);
    if (partition.has(dfa.startState)) {
      minimizedDFA.setStartState(index);
    }
    if (partition.has(dfa.startState) && partition.has(dfa.finalStates)) {
      minimizedDFA.addFinalState(index);
    }
  });

  for (const [fromState, symbol] of dfa.transitions.keys()) {
    const toStates = dfa.transitions.get(`${fromState}-${symbol}`);
    const fromPartition = stateMap.get(fromState);
    const toPartition = stateMap.get(toStates[0]);
    minimizedDFA.addTransition(fromPartition, symbol, toPartition);
  }

  return minimizedDFA;
}*/
