;(function(root){
  function fpsloop(caller,fps){
    let count=0
    fps=Math.min(fps||60,60)
    ;
    //console.log(fps)
    function loop(time){
      setTimeout(function() {
        requestAnimationFrame(loop);
        if(caller) caller(count)
        count++;
      }, 1000 / fps);
    }
    ;
    loop(count)
  }
  function entry(canvas,w,h,boxsize){
    var fps=60
    var boxsize=boxsize||10
    // Create scene for 3D content.
    var canvas=canvas||document.querySelector('canvas')
    // Create shortcuts for window size.
    var width = w||320//w//window.innerWidth;
    var height = h||240//h//window.innerHeight;
    canvas.width=width,canvas.height=height
    var scene = new THREE.Scene();

    // Create camera and move it a bit further. Make it to look to origo.
    var camera = new THREE.PerspectiveCamera( 75, width / height, 1, boxsize*10 );
    camera.position.set(boxsize,boxsize,-boxsize*2)
    camera.lookAt(scene.position);
    // Create renderer.
    var renderer = new THREE.WebGLRenderer({antialias: false,canvas:canvas});
    renderer.setSize( width, height );
    //renderer.autoClear = false;
    renderer.setPixelRatio(1)//window.devicePixelRatio);
    // Let there be light!
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( boxsize, boxsize, boxsize );
    scene.add(light);

    let hu=hud(renderer);
    let ctx=hu.ctx//hud.update()
    let draw=function(time,ctx){
      let w=ctx.canvas.width,h=ctx.canvas.height
      //ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
      ctx.fillText(`${time}fps(fps=${fps})`,w/2,h-16)
      return
    } //dummy

    // Now we have two scenes. Only thing we need now is a render loop!
    let abort=0
    function animate(time){
      if(abort)return
      try{
        renderer.clear()
        renderer.render(scene, camera)
        ;
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
        ;
        if(draw)
          draw(time,ctx)
        hu.update()        
      }catch(e){
        console.warn(e)
        abort=1
      }
    };
    let loop=function(caller,_fps){
      fps=_fps||60,draw=caller||draw
      fpsloop(animate,fps)
    }

    let mesh=function(){

    }
    let helper=function(){

    }

    return {
      camera:camera,scene:scene,light:light,mesh:mesh,helper:helper,renderer:renderer,
      loop:loop,hu:hu,ctx:ctx,pen:hu.pen
    }

  }
  root.threeq=entry
})(this);

//////////////////////////////////////////////////////////////////////////////
/*usage

let w=320*2,h=240*2,fps=30,boxsize=10,canvas=document.querySelector('canvas')
let {camera,scene,light,mesh,helper,loop,ctx,pen}=threeq(canvas,w,h,boxsize)


// And the box.
var geometry = new THREE.BoxBufferGeometry( boxsize, boxsize, boxsize );
var material = new THREE.MeshPhongMaterial( {color: 0xcccccc} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.position.y+=boxsize/2

var pgeometry = new THREE.PlaneBufferGeometry( boxsize, boxsize, 20,20 );
var pmaterial = new THREE.MeshPhongMaterial( {color: 0xcccccc,side:THREE.double} );
var plane = new THREE.Mesh( pgeometry, pmaterial );
plane.rotation.x=THREE.Math.degToRad(-90)
scene.add( plane );

console.log(plane)

loop(draw,fps)


function draw(time,ctx){
  let w=ctx.canvas.width,h=ctx.canvas.height,fh=parseInt(ctx.font),fw=fh/2
  // Rotate cube.
  cube.rotation.x += 0.01;
  cube.rotation.y -= 0.01;
  cube.rotation.z += 0.03;

  pen("RAD [x:"+(cube.rotation.x % (2 * Math.PI)).toFixed(1)+", y:"+(cube.rotation.y % (2 * Math.PI)).toFixed(1)+", z:"+(cube.rotation.z % (2 * Math.PI)).toFixed(1)+"]" ,5,'c',7);
  pen(fh+'px',0,'c',1)
  pen(time+'f',0,'r')
  pen('漢字ライン1',0,'l')
  pen('ライン2',1,'l')
  pen('ライン3',2,'l')
  pen('ライン4',3,'l')
  pen('ライン5',4,'l')
  pen('ライン6',5,'l')
  pen('ライン7',6,'l')
  pen('ライン8',7,'l')
  pen('ライン9',8,'l')
  pen('ライン10',9,'l')
  //pen(cycleval(time),10,'l')
  pen('漢字テスト、痺れ乙女ヴン',11,'l',7)
}

*/
