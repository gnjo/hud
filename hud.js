/*usage
  let h=hud(renderer);
  let ctx=h.ctx//h.update()  
  ctx.clearRect(0,0,640,480)
  ctx.fillText(Date.now()+'',640/2,32)
  h.update()
*/
  ;(function(root){
    
    function entry(renderer){
      renderer.autoClear = false;
      let width=renderer.domElement.width
      let height=renderer.domElement.height

      // We will use 2D canvas element to render our HUD.  
      var hudCanvas = document.createElement('canvas');

      // Again, set dimensions to fit the screen.
      hudCanvas.width = width;
      hudCanvas.height = height;

      // Get 2D context and draw something supercool.
      var hudBitmap = hudCanvas.getContext('2d');
      hudBitmap.font = "32px monospace";
      hudBitmap.textAlign = 'center';
      hudBitmap.fillStyle = "#00ff00";
      hudBitmap.fillText('Initializing...', width / 2, height / 2);

      // Create the camera and set the viewport to match the screen dimensions.
      var cameraHUD = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 3 );

      // Create also a custom scene for HUD.
      var sceneHUD = new THREE.Scene();

      // Create texture from rendered graphics.
      var hudTexture = new THREE.Texture(hudCanvas) 
      hudTexture.needsUpdate = true;
      hudTexture.minFilter =THREE.NearestFilter;

      // Create HUD material.
      var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
      material.transparent = true;

      // Create plane to render the HUD. This plane fill the whole screen.
      var planeGeometry = new THREE.PlaneBufferGeometry( width, height );
      var plane = new THREE.Mesh( planeGeometry, material );
      sceneHUD.add( plane );
      var loading=0
      setTimeout(()=>{loading=1},100)
      function update(){
        if(!loading)return 
        // Render HUD on top of the scene.
        hudTexture.needsUpdate = true;    
        renderer.render(sceneHUD, cameraHUD);    
      }  
      return {ctx:hudBitmap,update:update}
    }
    
    root.hud=entry
  })(this);
