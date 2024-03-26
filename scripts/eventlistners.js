document
  .getElementById("createNfaButton")
  .addEventListener("click", function () {
    let regex = document.getElementById("regexpinput").value;
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
      let enfa = regexToENFA(regex);
      console.log("enfa created", enfa);
      drawGraph(enfa[0]);
    } else if (selected == "1") {
      let enfa = regexToENFA(regex)[0];
      console.log("enfa created", enfa);
      let nfa = removeEpsilonTransitions(enfa);
      console.log("emoves removd", nfa);

      // drawGraph(nfa[0]);
    } else if (selected == "2") {
    } else if (selected == "3") {
    }
  });
