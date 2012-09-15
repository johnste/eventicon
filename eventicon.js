/*!
 * Eventicon - A small Chrome plugin to display social network sites notifications in favicons.
 * John Sterling, http://johnste.se
 * Copyright (c) 2012 John Sterling
 * MIT Licensed
 * @version 0.1
*/
(function(){
  Tinycon.setOptions({
    fallback: false,
    // Add override for sites that cause their favicon to violate the CORS policy
    overrides: [
     {      
      href: "https://www.facebook.com/",
      favicon: "https://www.facebook.com/favicon.ico"
     }
    ]
  });

  var changedTitle = false;

  function updateTinycon(event) {
    var newTitle = document.title;
    if(event == null || event.srcElement.parentElement.tagName == "TITLE") {
      // Try to find event notifications in the titles, they usually look like (X) or [X] where X is the number of unread notifications.
      var regex = /[\(\[]([0-9]+)[\)\]]/;
      var match = newTitle.match(regex);      
      if(match !== null && !changedTitle) {
        // We found a number in the title, update the bubble
        changedTitle = true;
        Tinycon.setBubble(match[1] < 100 ? match[1] : "++");
        // Remove the notification number from the current title, trim it and add a space at the end. This way, the event
        // is triggered again when the site resets the title without the number.
        document.title = newTitle.replace(regex, "")
          .replace(/^\s+|\s+$/g, "") + " ";      
      } else if(!changedTitle) {
        // If the title was changed and we didn't trigger it, remove the notification bubble
        Tinycon.setBubble('');
      }
      else {
        // If the title was changed because of something we did, just reset the flag
        changedTitle = false;
      }
    }
  }
  updateTinycon(null);  
  document.addEventListener ("DOMCharacterDataModified", updateTinycon);
})();



