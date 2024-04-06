const alphabetBtn = document.getElementById("alphabet-btn");
alphabetBtn.addEventListener("click", function makeNFAfromAlphabet() {
  let tempnfa = new NFA();
  const alphabet = document.getElementById("alphabets-input").value;
  alphabetArray = alphabet.split(",");
  for (let i = 0; i < alphabetArray.length; i++) {
    const symbol = alphabetArray[i];
    tempnfa.addAlphabet(symbol);
  }
  tempnfa.addState("q0");
  tempnfa.addState("q1");
  tempnfa.addState("q2");
  tempnfa.addState("q3");
  tempnfa.setStartState("q0");
  tempnfa.addFinalState("q3");
  tempnfa.addTransition("q0", "0", "q0");
  tempnfa.addTransition("q0", "1", "q1");
  tempnfa.addTransition("q1", "0", "q1");
  tempnfa.addTransition("q1", "1", "q0");
  tempnfa.addTransition("q3", "1", "q1");
  tempnfa.addTransition("q3", "1", "q2");
  tempnfa.addTransition("q2", "0", "q3");
  tempnfa.addTransition("q2", "1", "q3");
  // tempnfa.addFinalState("q0");
  // console.log(tempnfa);
  makeTableFromNfa(tempnfa, "alphabet-nfa-table", true);
});
function makeTableFromNfa(Xnfa, Xid, editable = false) {
  const tablecontainer = document.getElementById(Xid);
  tablecontainer.innerHTML = "";
  tablecontainer.classList.add("table-container");
  const table = document.createElement("table");
  // Create first row with headings
  var row1 = document.createElement("tr");

  var th1 = document.createElement("th");
  th1.setAttribute("rowspan", "2");
  th1.setAttribute("colspan", "2");
  th1.textContent = "Present State";

  var th2 = document.createElement("th");
  th2.setAttribute("colspan", Xnfa.alphabet.size);
  th2.textContent = "Next State";

  row1.appendChild(th1);
  row1.appendChild(th2);
  // Create second row with next state values
  var row2 = document.createElement("tr");

  for (let symbol of Xnfa.alphabet) {
    var th = document.createElement("th");
    th.textContent = symbol;
    row2.appendChild(th);
  }
  table.appendChild(row1);
  table.appendChild(row2);
  // Create rows with transition values
  for (let state of Xnfa.states) {
    var row = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    td1.textContent =
      Xnfa.startState == state && Xnfa.finalStates.has(state)
        ? "start, final"
        : Xnfa.startState == state
        ? "start"
        : Xnfa.finalStates.has(state)
        ? "final"
        : "";
    td2.textContent = state;
    row.appendChild(td1);
    row.appendChild(td2);
    for (let symbol of Xnfa.alphabet) {
      const key = `${state}-${symbol}`;
      var td3 = document.createElement("td");
      td3.classList.add("editable-cell");
      if (editable) {
        var input = document.createElement("input");
        input.type = "text";
        input.id = key;

        input.classList.add("editable-cell-input");
        input.addEventListener("change", function () {
          // updateCell(this);
          var tempTid = this.id;
          var tempTvalue = this.value.trim();
          var isValidFormat = /^q\d+(,q\d+)*$/.test(tempTvalue);
          if (isValidFormat) {
            Xnfa.transitions.set(tempTid, tempTvalue.split(","));
            // console.log(Xnfa.transitions);
          } else {
            alert(
              "Invalid format. Please use 'q0', 'q1', 'q2', etc., or 'q0,q1,q2,..."
            );
            this.value = "";
          }
          // console.log(Xnfa.transitions);
        });
        // td3.textContent = key;
        if (Xnfa.transitions.has(key)) {
          input.value = Xnfa.transitions.get(key);
          // td3.textContent = Xnfa.transitions.get(key);
        }
        td3.appendChild(input);
      } else {
        if (Xnfa.transitions.has(key)) {
          td3.textContent = Xnfa.transitions.get(key);
        }
      }
      row.appendChild(td3);
    }
    table.appendChild(row);
  }

  // Append table to contaiiner
  tablecontainer.appendChild(table);
}
/*<table>
            <tr>
                <th rowspan="2" colspan="2">Present State</th>
                <th colspan="2">next State</th>
            </tr>
            <tr>

                <td>0</td>
                <td>1</td>
            </tr>
            <tr>
                <td>start</td>
                <td>q0</td>
                <td>q0</td>
                <td>q1</td>
            </tr>
            <tr>
                <td></td>
                <td>q0</td>
                <td>q0</td>
                <td>q1</td>
            </tr>
            <tr>
                <td>final</td>
                <td>q0</td>
                <td>q0</td>
                <td>q1</td>
            </tr>
          </table>*/
function toggleDivs() {
  var container1 = document.getElementById("section-1");
  var container2 = document.getElementById("section-2");

  if (container1.style.display === "none") {
    container1.style.display = "block";
    container2.style.display = "none";
  } else {
    container1.style.display = "none";
    container2.style.display = "block";
  }
}
