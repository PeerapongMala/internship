/**
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Based on @tojiro's vr-samples-utils.js
 */

let WEBVR = {
  createButton: function(renderer, options) {
    if (options && options.frameOfReferenceType) {
      renderer.vr.setFrameOfReferenceType(options.frameOfReferenceType);
    }

    function showEnterVR(device) {
      button.style.display = "";
      button.style.cursor = "pointer";
      button.style.right = "24px";
      button.style.bottom = "24px";

      button.onmouseenter = function() {
        button.style.opacity = "1.0";
      };

      button.onmouseleave = function() {
        button.style.opacity = "0.5";
      };

      button.onclick = function() {
        device.isPresenting
          ? device.exitPresent()
          : device.requestPresent([{ source: renderer.domElement }]);
      };

      renderer.vr.setDevice(device);
    }

    function showEnterXR(device) {
      var currentSession = null;

      function onSessionStarted(session) {
        session.addEventListener("end", onSessionEnded);

        renderer.vr.setSession(session);

        currentSession = session;
      }

      function onSessionEnded(event) {
        currentSession.removeEventListener("end", onSessionEnded);

        renderer.vr.setSession(null);

        currentSession = null;
      }

      button.style.display = "";

      button.style.cursor = "pointer";
      button.style.left = "80%";
      button.style.width = "100px";

      button.onmouseenter = function() {
        button.style.opacity = "1.0";
      };
      button.onmouseleave = function() {
        button.style.opacity = "0.5";
      };

      button.onclick = function() {
        if (currentSession === null) {
          navigator.xr.requestSession("immersive-vr").then(onSessionStarted);
        } else {
          currentSession.end();
        }
      };
    }

    function showVRNotFound(device) {
      button.style.display = "";
      button.style.cursor = "not-allowed";
      button.style.right = "24px";
      button.style.bottom = "24px";

      button.onmouseenter = null;
      button.onmouseleave = null;

      button.onmouseleave = function() {
        button.style.opacity = "0.5";
      };

      renderer.vr.setDevice(null);
    }

    function stylizeElement(element) {
      element.style.position = "absolute";
      element.style.backgroundImage = 'url("https://i.imgur.com/btjpgYm.png")';
      element.style.backgroundColor = "transparent";
      element.style.backgroundRepeat = "no-repeat";
      element.style.backgroundSize = "100%";
      element.style.width = "75px";
      element.style.height = "44px";
      element.style.border = "none";
      element.style.opacity = "0.5";
      element.style.zIndex = "999";
    }

    if ("xr" in navigator && "supportsSession" in navigator.xr) {
      var button = document.createElement("button");
      button.style.display = "none";

      stylizeElement(button);

      navigator.xr.supportsSession("immersive-vr").then(showEnterXR);

      return button;
    } else if ("getVRDisplays" in navigator) {
      button = document.createElement("button");
      button.style.display = "none";

      stylizeElement(button);

      window.addEventListener(
        "vrdisplayconnect",
        function(event) {
          var display = event.detail ? event.detail.display : event.display;
          showEnterVR(display);
        },
        false
      );

      window.addEventListener(
        "vrdisplaydisconnect",
        function(event) {
          showVRNotFound(event);
        },
        false
      );

      window.addEventListener(
        "vrdisplaypresentchange",
        function(event) {},
        false
      );

      window.addEventListener(
        "vrdisplayactivate",
        function(event) {
          var display = event.detail ? event.detail.display : event.display;
          display.requestPresent([{ source: renderer.domElement }]);
        },
        false
      );

      navigator
        .getVRDisplays()
        .then(function(displays) {
          if (displays.length > 0) {
            showEnterVR(displays[0]);
          } else {
            showVRNotFound();
          }
        })
        .catch(showVRNotFound);

      return button;
    } else {
      var message = document.createElement("a");
      message.href = "https://webvr.info";
      message.innerHTML = "WEBVR NOT SUPPORTED";

      message.style.left = "calc(50% - 90px)";
      message.style.width = "180px";
      message.style.textDecoration = "none";

      stylizeElement(message);

      return message;
    }
  },

  // DEPRECATED

  checkAvailability: function() {
    console.warn("WEBVR.checkAvailability has been deprecated.");
    return new Promise(function() {});
  },

  getMessageContainer: function() {
    console.warn("WEBVR.getMessageContainer has been deprecated.");
    return document.createElement("div");
  },

  getButton: function() {
    console.warn("WEBVR.getButton has been deprecated.");
    return document.createElement("div");
  },

  getVRDisplay: function() {
    console.warn("WEBVR.getVRDisplay has been deprecated.");
  }
};
