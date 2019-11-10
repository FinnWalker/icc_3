// Manages the position of the image target.
AFRAME.registerComponent('image-target', {
    init: function () {
      const {object3D, sceneEl} = this.el
      object3D.visible = false

      const world = document.querySelector("#world_objects");
      const worldParent = document.querySelector("#world_parent");
      const skylinePlane = document.querySelector('#skylinePlane');
      const mainDino = document.querySelector("#t-rex");
      const dingyDinoScene = document.querySelector("#life_ring_scene");
      const portalDoor = document.querySelector("#portalDoor");
      const windowParent = document.querySelector("#window_parent");
      const skySphere_full = document.querySelector("#skySphere_full");
      const skySphere_portal = document.querySelector("#skySphere_portal");
      const skylinePlaneJustDinos = document.querySelector("#skylinePlaneJustDinos");

      skylinePlane.setAttribute("material", "depthWrite", false);

      let firstSeen = false;

      // Sets the position of the frame to match the image target.
      const showImage = ({detail}) => {
        object3D.position.copy(detail.position)
        object3D.quaternion.copy(detail.rotation)
        object3D.scale.set(detail.scale, detail.scale, detail.scale)

        if (uiPagesClosed)
        {
        // FIRST SEE IMAGE
          if (!firstSeen)
          {
            if(detail.name == "Coach_Target_05")
            { 
              skySphere_full.object3D.visible = false;
              mainDino.object3D.visible = false;
              dingyDinoScene.object3D.visible = false;

              skylinePlaneJustDinos.object3D.visible = false;
              
            }
            
            else {
              world.setAttribute("scale", "0 0 0");
              world.setAttribute("animation__grow", {
                property: "scale",
                from: "0 0 0",
                to: "0.3 0.3 0.3",
                // delay: 2000,
                dur: 1500
              });

              windowParent.object3D.visible = false;
              skySphere_portal.object3D.visible = false;

              world.addEventListener("animationcomplete", () => {
                sceneEl.emit('hidecamerafeed');
                mainDino.components.dino_animation.startAnimationsCountIn();
              });

              world.object3D.position.copy(detail.position)
              world.object3D.quaternion.copy(detail.rotation)

            }

            if (detail.name == "Coach_Target_05")
            {
              world.setAttribute("rotation", "-90 0 0");
              world.setAttribute("position", "0 -2 -9");
              world.setAttribute("scale", "0.3 0.3 0.3");

              windowParent.object3D.position.copy(detail.position);
              windowParent.object3D.quaternion.copy(detail.rotation);
              windowParent.object3D.scale.set(detail.scale, detail.scale, detail.scale);

              worldParent.object3D.position.copy(detail.position);
              worldParent.object3D.quaternion.copy(detail.rotation);
              worldParent.object3D.scale.set(detail.scale, detail.scale, detail.scale);
            
              portalDoor.components.portal_open.moveBox();

              
              // skySphere_full.object3D.visible = false;
            }

            world.object3D.visible = true;

            firstSeen = true;

            console.log(detail.name);
          }

          if (detail.name == "Coach_Target_05")
          {
            // windowParent.object3D.position.copy(detail.position);
            // windowParent.object3D.quaternion.copy(detail.rotation);
            // windowParent.object3D.scale.set(detail.scale, detail.scale, detail.scale);
            // worldParent.object3D.position.copy(detail.position);
            // worldParent.object3D.quaternion.copy(detail.rotation);
            // worldParent.object3D.scale.set(detail.scale, detail.scale, detail.scale);
          }
        }

      }
  
      // Update the position of the frame when the image target is found or updated.
      sceneEl.addEventListener('xrimagefound', showImage);
      // sceneEl.addEventListener('xrimageupdated', showImage);
  
      // Hide the image target when tracking is lost.
      // sceneEl.addEventListener('xrimagelost', showImage);

    }
  });

  AFRAME.registerComponent("camera-orientation", {
    init: function () {
      const {object3D, sceneEl} = this.el;
      this.camera = object3D.camera;
      window.addEventListener("orientationchange", function() {
        if (Math.abs(window.orientation) == 90)
        {
          this.camera.setAttribute("fov", 45);
          // object3D.position = new THREE.Vector3(0, 1, 5);
        }
        else {
          this.camera.setAttribute("fov", 80);
        }
      });
    }
  });


 // This component gives the invisible hider walls the property they need
 AFRAME.registerComponent('hider-material', {
  init: function() {
    const mesh = this.el.getObject3D('mesh')
    mesh.material.colorWrite = false
  },
})  



  AFRAME.registerComponent('boat', {
    schema: { 
      boat_num:     { type: 'int', default: -1 },
      radius:       { type: 'int', default:  1 },
      total_boats:  { type: 'int', default:  3 }
    },

    init: function () {
      const {object3D, sceneEl} = this.el;
      boat_num = this.data.boat_num;
      radius = this.data.radius;
      total_boats = this.data.total_boats;

      // object3D.visible = false;
      object3D.position.x = radius * Math.cos( (Math.PI * 2 * boat_num) / total_boats);
      object3D.position.z = radius * Math.sin( (Math.PI * 2 * boat_num) / total_boats);
    }
  });

  // FROM https://medium.com/samsung-internet-dev/i-made-my-first-pr-to-a-frame-3675d596a2d8
  // use with <a-ocean-plane material="normalMap: #water-normal; sphericalEnvMap: #night-sphere;" position="0 -2 0" ></a-ocean-plane>



  AFRAME.registerComponent("water-sprite-sheet", {
    schema: {
      speed: { type: 'number', default: 1 }
    },
    init: function () {
      this.ticker = 0;
      this.frameCounter = 0;
    },

    tick: function (time, timeDelta) {
      this.ticker += timeDelta * this.data.speed;

      if (this.ticker >= (1000 / 60))
      {
        this.frameCounter += 1 / 24;
        if (this.frameCounter > 1)
        {
          this.frameCounter = 0;
        }
        this.el.setAttribute('sprite-sheet', 'progress', this.frameCounter);
        this.ticker = 0;
      }
      
    }
  });


  AFRAME.registerComponent('water_sprite_group', {
    schema: {
      speed: { type: 'number', default: 1 }
    },
    init: function () {
      this.ticker = 0;
      this.frameCounter = 0;

      this.tileArr = this.el.getElementsByClassName("water_sprite");
    },

    tick: function (time, timeDelta) {
      this.ticker += timeDelta * this.data.speed;

      let tileArr = this.tileArr;

      if (this.ticker >= (1000 / 60))
      {
        this.frameCounter += 1 / 24;
        if (this.frameCounter > 1)
        {
          this.frameCounter = 0;
        }

        for (let i = 0; i < tileArr.length; i++)
        {
          tileArr[i].setAttribute('sprite-sheet', 'progress', this.frameCounter);
        }
        // this.el.setAttribute('sprite-sheet', 'progress', this.frameCounter);
        
        this.ticker = 0;
      }
      
    }
  });

  AFRAME.registerComponent("tiled_water_sprite-sheet_spawn", {
    schema: {
      scale: { type: 'number', default: 1 },
      rows: { type: 'int', default: 1 },
      columns: { type: 'int', default: 1 },
    },
    init : function () {
      const scale = this.data.scale;
      const rows = this.data.rows;
      const columns = this.data.columns;

      let tile;
      
      for (let i = 0; i < (rows * columns); i++)
        {
          tile = document.createElement("a-plane");
          this.el.appendChild(tile);
          tile.setAttribute("class", "water_sprite");
          tile.setAttribute("src", "#waterSprite");
          tile.setAttribute("sprite-sheet", "cols", 5);
          tile.setAttribute("sprite-sheet", "rows", 5);
          tile.setAttribute("sprite-sheet", "progress", 0);
          
          
        }

      let positionVec = new THREE.Vector3();
      this.tileArr = this.el.getElementsByClassName("water_sprite");
      let tileArr = this.tileArr;
       

      var currentTile = 0;
      
      if (tileArr.length < (rows * columns))
      {
        console.error("Rows * Columns must be the same as number of child tiles of the same class");
        return;
      }

      for ( let currentRow = 0; currentRow < rows; currentRow++ ) 
      {
        for ( let currentCol = 0; currentCol < columns; currentCol++ )
        {
          positionVec = new THREE.Vector3(
            scale * (currentRow - ( (rows - 1) * 0.5 )),
            scale * (currentCol - ( (columns - 1) * 0.5 )),
            0
          );

          tileArr[currentTile].object3D.position.x = positionVec.x;
          tileArr[currentTile].object3D.position.y = positionVec.y;
          tileArr[currentTile].object3D.position.z = positionVec.z;
          tileArr[currentTile].object3D.scale.x = tileArr[currentTile].object3D.scale.y = tileArr[currentTile].object3D.scale.z = this.data.scale; 
          
          currentTile++;

          
        }
      }
    }
  });

  AFRAME.registerComponent("skyline-reflection-sprite-sheet", {
    schema: {
      speed: { type: 'number', default: 1 }
    },
    init: function () {
      this.ticker = 0;
      this.frameCounter = 0;

    },

    tick: function (time, timeDelta) {
      this.ticker += timeDelta * this.data.speed;


      if (this.ticker >= (1000 / 60))
      {
        this.frameCounter += 1 / 8;
        if (this.frameCounter > 1)
        {
          this.frameCounter = 0;
        }
        this.el.setAttribute('sprite-sheet', 'progress', this.frameCounter);
        this.ticker = 0;
      }
      
    }
  });

  

  AFRAME.registerComponent("moving_particle", {
    schema: {
      src: {type: 'string' },
      moveDirection: { type: 'vec3', default: new THREE.Vector3(0, 0, 0) },
      moveSpeed: { type: 'number', default: 1 },
      rotationDirection: { type: 'vec3', default: new THREE.Vector3(0, 0, 0) },
      rotationSpeed: {  type: 'number', default: 1 },
      movementSpreadMagnitude: {  type: 'number', default: 1 },
      movementSpreadSpeed: { type: 'number', default: 1 },
      imageWidthRatio: { type: 'number', default: 1  },
      imageHeightRatio: { type: 'number', default: 1 },
      scale: {type: 'number', default: 1 },
      maxDistance: { type: 'number', default: 15 },
      randSpawnOnRefresh: { type: 'bool', default: false }
    },
    init: function ( ) {
      const {object3D, sceneEl} = this.el;
      // initialise particle hierarchy
      const entityTop = this.el;
      this.entityTop = entityTop;
      const imagesTop = document.createElement("a-entity");
      this.imagesTop = imagesTop;
      const imageFront = document.createElement("a-image");
      const imageBack = document.createElement("a-image");


      // append elements into hierarchy
      createHierarchy(); 

      // define images' a-planes
      defineImages(this.data.src, this.data.imageWidthRatio, this.data.imageHeightRatio); 

      this.moveDirection = new THREE.Vector3();
      this.moveDirection.x = this.data.moveDirection.x;
      this.moveDirection.y = this.data.moveDirection.y;
      this.moveDirection.z = this.data.moveDirection.z;
      this.moveDirection = this.moveDirection.normalize();

      this.rotationDirection = new THREE.Vector3();
      this.rotationDirection.x = this.data.rotationDirection.x;
      this.rotationDirection.y = this.data.rotationDirection.y;
      this.rotationDirection.z = this.data.rotationDirection.z;
      this.rotationDirection = this.rotationDirection.normalize();

      this.movementSpreadMagnitude = this.data.movementSpreadMagnitude;
      this.movementSpreadSpeed = this.data.movementSpreadSpeed;

      this.maxPoint = new THREE.Vector3();
      this.maxPoint.x = this.moveDirection.x * this.data.maxDistance;
      this.maxPoint.y = this.moveDirection.y * this.data.maxDistance;
      this.maxPoint.z = this.moveDirection.z * this.data.maxDistance;

      this.ticker = 0;

      this.startingPosition = new THREE.Vector3();
      this.startingPosition.x = object3D.position.x;
      this.startingPosition.y = object3D.position.y;
      this.startingPosition.z = object3D.position.z;

      this.maxLength = this.startingPosition.distanceToSquared(this.maxPoint);


      
      /// FUNCTIONS ///
      function createHierarchy ( ) {
        entityTop.appendChild(imagesTop)
        // entityTop.appendChild(imagesTop);
        imagesTop.appendChild(imageFront);
        imagesTop.appendChild(imageBack);
      }
      function defineImages( src, width, height ) {
        imageFront.setAttribute("src", src);
        imageBack.setAttribute("src", src);

        imageFront.setAttribute("width", width);
        imageBack.setAttribute("width", -width);

        imageFront.setAttribute("height", height);
        imageBack.setAttribute("height", height);

        imageFront.setAttribute("material", "transparent", true);
        imageBack.setAttribute("material", "transparent", true);

        imageFront.setAttribute("material", "depthWrite", false);
        imageBack.setAttribute("material", "depthWrite", false);

        imageBack.setAttribute("position", "0 0.1 0");
        imageBack.setAttribute("scale", "-1 1 1");
      }
    },
    tick: function (time, timeDelta) {
      // let moveDirection = this.moveDirection;

      this.entityTop.object3D.position.x = this.moveDirection.x * ( (timeDelta / 1000) * this.data.moveSpeed ) + this.entityTop.object3D.position.x;
      this.entityTop.object3D.position.y = this.moveDirection.y * ( (timeDelta / 1000) * this.data.moveSpeed ) + this.entityTop.object3D.position.y;
      this.entityTop.object3D.position.z = this.moveDirection.z * ( (timeDelta / 1000) * this.data.moveSpeed ) + this.entityTop.object3D.position.z;

      // let rotationDirection = this.rotationDirection;

      this.imagesTop.object3D.rotation.x = this.rotationDirection.x * ( (timeDelta / 1000) * this.data.rotationSpeed ) + this.imagesTop.object3D.rotation.x;
      this.imagesTop.object3D.rotation.y = this.rotationDirection.y * ( (timeDelta / 1000) * this.data.rotationSpeed ) + this.imagesTop.object3D.rotation.y;
      this.imagesTop.object3D.rotation.z = this.rotationDirection.z * ( (timeDelta / 1000) * this.data.rotationSpeed ) + this.imagesTop.object3D.rotation.z;

      // let movementSpreadAngle = (this.movementSpreadSpeed * (time / 1000));
      this.movementSpreadAngle = (this.movementSpreadSpeed * (time / 1000));

      this.imagesTop.object3D.position.x = this.movementSpreadMagnitude * Math.sin(this.movementSpreadAngle) * Math.cos(this.movementSpreadAngle);
      this.imagesTop.object3D.position.y = this.movementSpreadMagnitude * Math.sin(this.movementSpreadAngle) * Math.sin(this.movementSpreadAngle);
      this.imagesTop.object3D.position.z = this.movementSpreadMagnitude * Math.cos(this.movementSpreadAngle);

      // this.ticker += (timeDelta / 1000);
      // if (this.ticker > 1)
      // {
      //   console.log("1 second");
      //   this.ticker = 0;
      // }

      // if (this.entityTop.object3D.position.lengthSq() > this.maxPoint.lengthSq())
      // {
        
      
      // }
    },
    boundaryCheck: function() {
      if (this.entityTop.object3D.position.distanceToSquared(this.startingPosition) > this.maxLength)
      {
        this.entityTop.object3D.position.x = this.startingPosition.x;
        this.entityTop.object3D.position.y = this.startingPosition.y;
        this.entityTop.object3D.position.z = this.startingPosition.z;
        return true;
      }
      else {
        return false;
      }
    },
    refreshPosition: function (newSpawnPos) {
      this.startingPosition.x = newSpawnPos.x;
      this.startingPosition.y = newSpawnPos.y;
      this.startingPosition.z = newSpawnPos.z;
    }
    
  });

  AFRAME.registerComponent("custom-particle-system", {
    schema: {
      src: {type: 'string' },
      maxParticles: { type: 'int', default: 50 },
      direction: { type: 'vec3', default: new THREE.Vector3(0, -1, 0) },
      boundaryDistance: { type: 'number', default: 10 },
      spawnRadius: { type: 'number', default: 5},
      srcWidthRatio: { type: 'number', default: 1 },
      srcHeightRatio: { type: 'number', default: 1 },
      speed: { type: 'number', default: 1 },
      scale: { type: 'number', default: 1 },
      refreshSpawns: {type: 'bool', default: true }
    },
    init: function() {
      let particle;
      let randomTheta;
      this.randomTheta = randomTheta;
      for (let i = 0; i < this.data.maxParticles; i++)
      {
        particle = document.createElement("a-entity");
        this.el.appendChild(particle);

        particle.setAttribute("moving_particle", {
          src: this.data.src,
          moveDirection: this.data.direction,
          moveSpeed: this.data.speed * (Math.random() + 0.5),
          rotationDirection: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
          rotationSpeed: Math.random(),
          movementSpreadMagnitude: Math.random(),
          movementSpreadSpeed: Math.random(),
          imageWidthRatio: this.data. srcWidthRatio,
          imageHeightRatio: this.data.srcHeightRatio,
          scale: this.data.scale,
          maxDistance: this.data.boundaryDistance,
          randSpawnOnRefresh: this.data.refreshSpawns
        });

        
        
        particle.setAttribute("class", "leaf");

        this.randomTheta = Math.random() * Math.PI * 2;

        particle.object3D.position.x = this.data.spawnRadius * Math.random() * Math.cos(this.randomTheta);
        particle.object3D.position.z = this.data.spawnRadius * Math.random() * Math.sin(this.randomTheta);
      }

      this.particleArr = this.el.getElementsByClassName("leaf");
      this.ticker = 0;
      
      this.i = 0;
    },
    tick: function(timeDelta) {
      this.ticker += (timeDelta / 1000);
      if (this.ticker > 100)
      {
        for (this.i = 0; this.i < this.particleArr.length; this.i++)
        {
          if (this.particleArr[this.i].components.moving_particle.boundaryCheck())
          {
          this.randomTheta = Math.random() * Math.PI * 2;
          this.particleArr[this.i].components.moving_particle.refreshPosition( 
            new THREE.Vector3( 
                this.data.spawnRadius * Math.random() * Math.cos(this.randomTheta),
                0,
                this.data.spawnRadius * Math.random() * Math.sin(this.randomTheta)
              ));
          }


        this.ticker = 0;
        }
      }
    }
  });

  AFRAME.registerComponent("dino_animation", {
    init: function () {
      const {sceneEl} = this.el;
      this.shadow = document.querySelector("#mainDino_Shadow_Scale");
      this.sceneEl = sceneEl;
      this.animationList = [
        "1", 
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19"
        ]

        this.nudgeBack = false;
        this.timeOfNudgeStart = 0;
        this.firstAnimComplete = false;

        this.el.addEventListener("animationcomplete", () => {
          this.el.components.dino_animation.startAnimations();
        });
        
        this.el.addEventListener("animation-loop", () => {
          if (!this.firstAnimComplete)
          {
            this.timeOfNudgeStart = this.sceneEl.time;
            this.nudgeBack = true;
  
            this.firstAnimComplete = true;
          }
        });
    },
    startAnimationsCountIn: function () {
      this.el.setAttribute("animation__wait", {
        property: "visible",
        from: true,
        to: true,
        dur: 2500
      });
    },

    startAnimations: function ( ) {
      this.shadow.setAttribute("animation__scale", {
        property: "scale",
        from: "0 0 1",
        to: "1 1 1",
        delay: 1500,
        dur: 3500
      });
          
      this.el.setAttribute("animation-mixer", {
        clip: '*',
        loop: 'pingpong',
      });

      // this.el.addEventListener("animation-loop", () => {
      //   if (!this.firstAnimComplete)
      //   {
      //     this.timeOfNudgeStart = this.sceneEl.time;
      //     this.nudgeBack = true;

      //     this.firstAnimComplete = true;
      //   }
      // });
    },
    tick: function (time, timeDelta) {
      if (this.nudgeBack && ( (this.timeOfNudgeStart) < time ))
      {
        this.el.setAttribute("animation-mixer", "timeScale", -0.0000001);
        this.nudgeBack = false;
      }
    }
  });

/**
 * Function to add opening animation to the hiden wall objects in that are
 *  apart of the window object.
 */
  AFRAME.registerComponent("portal_open", {
    schema: {
      speed: {type: 'number', default: 1  },
      from: { type: 'vec3' },
      to: { type: 'vec3' }
    },
    init: function () {
      // const dino = document.querySelector("#t-rex");
      
      // this.el.addEventListener("animationcomplete", () => {
      //   dino.components.dino_animation.startAnimationsCountIn();
      // });
    },
    moveBox: function () {
      this.el.setAttribute("animation", {
        property: 'position',
        from: this.data.from,
        to: this.data.to,
        delay: 1000, 
        dur: (3000 / this.data.speed) + "",
        easing: 'linear',
      });
    }

    
  });
  
