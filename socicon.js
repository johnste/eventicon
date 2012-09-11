(function(){
  Tinycon.setOptions({
    fallback: false
  });

  var prevTitle = "";

  function updateTinycon(event) {
    if(prevTitle != document.title &&
      (event == null || event.srcElement.parentElement.tagName == "TITLE")) {
      var regex = /\(([0-9]+)\)/;
      var match = document.title.match(regex);
      if(match !== null) {
        Tinycon.setBubble(match[1]);
        document.title = prevTitle = document.title.replace(regex, "")
          .replace(/^\s+|\s+$/g, "");
      }
    }
  }
  updateTinycon(null);
  document.addEventListener ("DOMCharacterDataModified", updateTinycon);
})();

