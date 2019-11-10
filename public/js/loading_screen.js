AFRAME.registerComponent('customize-loading-icon', {
    init: function() {
      console.log('customizing loading spinner')
      document.getElementById("loadImage").src="../images/coach_c_logo_128.png";
      document.getElementById("loadImageContainer").classList.add("blackBackground");
      window.addEventListener("message", () => {
        console.log("message sent");
      });
      
    }
  });

  AFRAME.registerComponent("powered_by_8th_wall", {
    init: function() {
      console.log("powered by 8th wall started");
      let loadingBG = document.getElementById("loadImageContainer");
      let poweredBy8thWall = document.getElementById("_8thWallDisclaimer");
      let container = document.getElementById("8thWallContainer");
      container.removeChild(poweredBy8thWall);
      loadingBG.appendChild(poweredBy8thWall);
    
      
    }
  });