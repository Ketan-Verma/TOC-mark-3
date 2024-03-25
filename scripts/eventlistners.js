document.getElementById("createButton").addEventListener("click", function () {
  let regex = document.getElementById("regexpinput").value;
  console.log(regexToENFA(regex));
});
