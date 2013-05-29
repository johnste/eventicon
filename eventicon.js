/*!
 * Eventicon - A small Chrome plugin to display social network sites notifications in favicons.
 * John Sterling, http://johnste.se
 * Copyright (c) 2012-2013 John Sterling
 * MIT Licensed
 * @version 0.1.4
*/
(function(){
  Tinycon.setOptions({
    fallback: false,
    // Overrides for sites if grabbing favicon violates CORS policy
    overrides: [
     {
      origin: "https://www.facebook.com",
      favicon: "https://www.facebook.com/favicon.ico"
     }
    ]
  });

  var options = {
    sites: [
      {
        hostname: /^www.facebook.com$/,
        init: function() {
          var counts = {
            requests: 0,
            messages: 0,
            notifications: 0,
            getTotal: function() {
              return this.requests + this.messages + this.notifications;
            }
          };

          // Listen for friend requests
          document.getElementById("requestsCountValue").addEventListener("DOMNodeInserted", function(event){
            counts.requests = parseInt(event.target.textContent);
            updateTinycon(null, counts.getTotal());
          });

          // Listen for messages
          document.getElementById("mercurymessagesCountValue").addEventListener("DOMNodeInserted", function(event){
            counts.messages = parseInt(event.target.textContent);
            updateTinycon(null, counts.getTotal());
          });

          // Listen for notifications
          document.getElementById("notificationsCountValue").addEventListener("DOMNodeInserted", function(event){
            counts.notifications = parseInt(event.target.textContent);
            updateTinycon(null, counts.getTotal());
          });
        }
      }
  ]};
  var changedTitle = false;

  function updateTinycon(event, setNumber) {
    var newTitle = document.title;

    if (typeof setNumber !== "undefined" && setNumber >= 0) {
      console.log("Eventicon: Setting number to " + setNumber);
      Tinycon.setBubble(setNumber);
    }
    else if (event !== null && event.srcElement.parentElement.tagName === "TITLE") {
      console.log("Eventicon: Title changed");
      // Try to find event notifications in the titles, they usually look like (X) or [X] where X is the number of unread notifications.
      var regex = /[\(\[]([0-9]+)[\)\]]/;
      var match = newTitle.match(regex);
      if (match !== null) {
        // We found a number in the title, update the bubble
        changedTitle = true;
        if (match[1] < 100) {
          console.log("Eventicon: Set bubble to " + match[1]);
          Tinycon.setBubble(match[1]);
        }
        // Remove the notification number from the current title, trim it and add a space at the end. This way, the event
        // is triggered again when the site resets the title without the number.
        document.title = newTitle.replace(regex, "")
          .replace(/^\s+|\s+$/g, "") + " ";
      } else if (!changedTitle) {
        console.log("Eventicon: Remove bubble");
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

  var foundSite = false;
  for(var i=0; i < options.sites.length; i++) {
    if(options.sites[i].hostname.test(document.location.hostname)) {
      console.log("Eventicon: Matched domain " + document.location.hostname);
      options.sites[i].init();
      foundSite = true;
      break;
    }
  }

  if (!foundSite) {
    console.log("Eventicon: Listening for title changes");
    document.addEventListener ("DOMCharacterDataModified", updateTinycon);
  }
})();



