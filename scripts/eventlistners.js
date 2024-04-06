document
  .getElementById("createNfaButton")
  .addEventListener("click", function () {
    const regex = document.getElementById("regexpinput").value;
    let radios = document.getElementsByName("faradio");
    let selected = "0";
    for (let i = 0; i < radios.length; i++) {
      // Check if the radio button is checked
      if (radios[i].checked) {
        selected = radios[i].value;
        break; // Exit loop once a checked radio button is found
      }
    }
    if (selected == "0") {
      const enfa = regexToENFA(regex);
      console.log("enfa created", enfa);
      // makeTableFromNfa(enfa, "alphabet-nfa-table", true);
      makeTransitionTable(enfa, "transition-table-contaner", true);
      drawGraph(enfa);
    } else if (selected == "1") {
      // let tempenfa = new NFA();
      // tempenfa.states = new Set(["q0", "q1", "q2"]);
      // tempenfa.alphabet = new Set(["a", "b"]);
      // tempenfa.startState = "q0";
      // tempenfa.finalStates = new Set(["q2"]);
      // tempenfa.addTransition("q0", "a", "q1");
      // tempenfa.addTransition("q1", "e", "q2");
      // tempenfa.addTransition("q2", "b", "q2");
      // console.log("enfa", tempenfa);
      // let tempnfa = removeEpsilonTransitions(tempenfa);
      // console.log("nfa", tempnfa);
      const enfa = regexToENFA(regex);
      console.log("enfa created", enfa);
      const nfa = removeEpsilonTransitions(enfa);
      console.log("emoves removd", nfa);
      makeTransitionTable(nfa, "transition-table-contaner");
      //
      drawGraph(nfa);
    } else if (selected == "2") {
      const enfa = regexToENFA(regex);
      console.log("enfa created", enfa);
      const nfa = removeEpsilonTransitions(enfa);
      console.log("emoves removd", nfa);
      let dfa = makeDfaFromNfa(nfa);
      console.log("dfa", dfa);
      makeTransitionTable(dfa, "transition-table-contaner");
      drawGraph(dfa);
      // drawGraph(dfa);
    } else if (selected == "3") {
      const enfa = regexToENFA(regex);
      // console.log("enfa created", enfa);
      const nfa = removeEpsilonTransitions(enfa);
      // console.log("emoves removd", nfa);
      let dfa = makeDfaFromNfa(nfa);
      // let dfa = new NFA();
      // dfa.states = new Set(["q0", "q1", "q2", "q3", "q4", "q5"]);
      // dfa.alphabet = new Set(["a", "b"]);
      // dfa.startState = "q0";
      // dfa.finalStates = new Set(["q3", "q4", "q5"]);
      // dfa.addTransition("q0", "a", "q1");
      // dfa.addTransition("q0", "b", "q2");
      // dfa.addTransition("q1", "a", "q3");
      // dfa.addTransition("q1", "b", "q4");
      // dfa.addTransition("q2", "a", "q3");
      // dfa.addTransition("q2", "b", "q5");
      // dfa.addTransition("q3", "a", "q3");
      // dfa.addTransition("q3", "b", "q1");
      // dfa.addTransition("q4", "a", "q4");
      // dfa.addTransition("q4", "b", "q5");
      // dfa.addTransition("q5", "a", "q5");
      // dfa.addTransition("q5", "b", "q4");
      let mdfa = minimizedfa(dfa);
      makeTransitionTable(mdfa, "transition-table-contaner");
      console.log("minimum state dfa", mdfa);
      drawGraph(mdfa);
    }
  });
