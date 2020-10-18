
;(function(root){

 function entry(obj){
  if(!obj){
   let canvas=document.createElement('canvas'),m=30 
   return canvas.width=16*m,canvas.height=9*m,document.body.appendChild(canvas),entry(canvas)
  }
  let ctx=(obj.canvas)?obj:obj.getContext('2d'),fsize=~~(ctx.canvas.height/20)
  ctx.font=`${fsize}px planes`
  ctx.save()
  ;
  let o={}
  o.ctx=ctx
  o.w=o.ctx.canvas.width
  o.h=o.ctx.canvas.height
  o.fsize=fsize
  o.modeary=['default','grid']
  o.callers={}
  o.fading=0
  o.tick1fps=0
  o.tick20fps=0
  o.tick30fps=0
  o.tickAlpha=0
  o.tick60fps=0
  ;
  o.images={}
  o.getimg=function(url){
   let u=url
   console.log(url)
   if(typeof u==='object'&&u.src) o.images[u.src]=u,u=u.src
   if(typeof u==='object'&&!u.src) return u//not cash the direct      
   if(o.images[u])return o.images[u]
   ;
   let a=new Image()
   a.crossOrigin = "anonymous";  //
   o.images[u.split('/').pop()]=o.images[u]=a,a.src=u
   return a;   
  }
  o.stand=(_img,lcr)=>{
   lcr=lcr||'c' 
   var ctx=o.ctx
   var img=o.getimg(_img) 
   let cx=o.w/2,cy=o.h/2,ow=o.w/6,oh=o.fsize*2
   if(lcr=='c')return ctx.drawImage(img,cx-img.width/2,o.h-img.height-oh)
   if(lcr=='l')return ctx.drawImage(img,cx-img.width/2+ow,o.h-img.height-oh)
   if(lcr=='r')return ctx.drawImage(img,cx-img.width/2-ow,o.h-img.height-oh) 
  }
  o.pen=function pen(text,line,lcr,blink,color){
   color=(color)?"#d0d0d0":"#ffffffee"
   //ctx=
   let ctx=o.ctx
   let w=o.w,h=o.h,fh=parseInt(ctx.font),fw=fh/2
   ,wpx=ctx.measureText(text).width,hpx=fh*line+fh,wk,x
   ;
   lcr=lcr||ctx.textAlign
   lcr=lcr.charAt(0)
   if(lcr==='l')ctx.textAlign='left',x=fw/2  
   if(lcr==='c')ctx.textAlign='center',x=w/2
   if(lcr==='r')ctx.textAlign='right',x=w-fw/2
   if(blink){
    ctx.fillStyle='#ff2266'
    ctx.globalAlpha = o.tickAlpha*0.5+0.1
    if(lcr==='l') ctx.fillRect(x-fw,hpx-fh+2,wpx+fw+x,fh)
    if(lcr==='c') ctx.fillRect(w/2-wpx/2-fw/2,hpx-fh+2,wpx+fw,fh)
    if(lcr==='r') ctx.fillRect(x-wpx-fw/2,hpx-fh+2,wpx+fw,fh)
    ctx.globalAlpha=1
   }
   ctx.fillStyle=color //'#ffffff'
   ctx.shadowColor = 'rgba(0, 0, 0, 1)';
   // ぼかしのサイズ
   ctx.shadowBlur = 3;
   // X方向のオフセット
   ctx.shadowOffsetX = 3;
   // Y方向のオフセット
   ctx.shadowOffsetY = 3;
   ctx.fillText(text,x,hpx)
   return o.restore()
  }
  ;
  o.add=function(mode,caller){
   o.callers[mode]=caller
  }
  o.ismode=function(str){
   return (o.callers[str])?true:false
  }
  o.mode=function(modestr,fadetime){

   return o.modeary=modestr.split(',')
   return o.modeary=['default'],setTimeout((wk)=>{o.modeary=wk},10,modestr.split(','))
  }
  o.clear=function(color){
   let ctx=o.ctx,w=o.w,h=o.h,wk
   if(color){
    return ctx.fillStyle=color,ctx.fillRect(0,0,o.w,o.h),o.restore()
   }
   return ctx.clearRect(0,0,w,h)
  }
  o.restore=()=>{o.ctx.restore(),o.ctx.save()}
  o.update=()=>{
   return o.modeary.map(d=>{
    if(o.callers[d])return o.callers[d](o.ctx,o),o.restore()
   })
  }
  o.start=()=>{
   setInterval(()=>{ o.tick1fps++ },1000/1)
   setInterval(()=>{ o.tick20fps++ },1000/20)
   setInterval(()=>{ o.tick30fps++;o.tickAlpha=Math.abs(Math.sin(o.tick30fps/30)) },1000/30)
   setInterval(()=>{ o.tick60fps++ },1000/60)
   return o;
  }
  ;
  o.add('default',(ctx)=>{
   o.clear()
  })
  o.add('grid',(ctx,o)=>{
   ctx.strokeStyle='#ffffff'
   ctx.globalAlpha=0.75
   ctx.beginPath();
   /////
   let s=o.fsize,xmax=~~(o.w/s+0.99),ymax=~~(o.h/s+0.99)
   for(y=0;y<ymax;y++){
    ctx.beginPath();
    ctx.moveTo(0,s*y);
    ctx.lineTo(o.w,s*y);
    ctx.stroke();
   }
   for(x=0;x<xmax;x++){
    ctx.beginPath();
    ctx.moveTo(s*x,0);
    ctx.lineTo(s*x,o.h);
    ctx.stroke();    
   }
   ////
  })
  ;
  return o.start()
 }
 ;
 root.planes=entry

 if(!root.THREE)return;

 function entry2(renderer){
  var canvas2d,ctx2d,pm,camera2d,scene2d,tex2d,plane2d
  ,width,height
  ;
  canvas2d=document.createElement('canvas')
  width=canvas2d.width=renderer.domElement.width
  height=canvas2d.height=renderer.domElement.height

  renderer.autoClear = false;/////////////////////
  // Get 2D context and draw something supercool.
  var ctx2d = canvas2d.getContext('2d');
  var pm=planes(ctx2d)
  // Create the camera and set the viewport to match the screen dimensions.
  var camera2d = new THREE.OrthographicCamera(
   -width/2, width/2, height/2, -height/2, 0, 3
  );

  // Create also a custom scene for HUD.
  var scene2d = new THREE.Scene();

  // Create texture from rendered graphics.
  var tex2d = new THREE.Texture(canvas2d) 
  tex2d.needsUpdate = true;
  tex2d.minFilter =THREE.NearestFilter;

  var plane2d = new THREE.Mesh(
   new THREE.PlaneBufferGeometry( width, height )
   ,new THREE.MeshBasicMaterial( {map: tex2d,transparent:true})
  );
  scene2d.add( plane2d );

  var loading=0
  setTimeout(()=>{loading=1},100)
  pm.update2d=function update2d(){
   if(!loading)return 
   pm.update()
   tex2d.needsUpdate = true;
   renderer.render(scene2d, camera2d);    
  }

  return pm
 }

 root.planes2d=entry2
 //x=planes2d(renderer)
 //x.update2d();
 // requestAnimationFrame(...)
 //  renderer.clear()
 //  renderer.render(scene, camera)
 //  pm.update2d()

})(this);

//pen(text,line,'lcr',blinkflg)
//pen2(text,line,'lcr',offset) //square pen
/*
let text=`これは一行目。
されど、二行目。漢字あいうえお。
三行目は、カタカナと漢字。
`
let pm
test();


function test(){
 // let canvas=document.createElement('canvas')
 // let ctx=canvas.getContext('2d')
 // let pm=planes(ctx) //ctx or canvas or null is demo mode 640x320
 pm=planes()
 pm.add('shop',(ctx,o)=>{
  o.clear('#000000')
  ctx.drawImage(o.getimg("https://gnjo.github.io/fatema/back.jpg"),0,0,o.w,o.h)

 })

 pm.add('map',(ctx,o)=>{
  o.clear('#00ff00')

 })
 pm.add('mes',(ctx,o)=>{
  ctx.textAlign='center'
  ctx.fillStyle='#000000'
  //  ctx.globalAlpha=o.tickAlpha*0.25+0.5
  ctx.globalAlpha=0.5
  ctx.fillRect(0,o.h-o.fsize*4,o.w,o.fsize*4)
  ctx.globalAlpha=1  
  ctx.fillStyle='#ffffff'
  text.split('\n').map((d,i)=>{
   ctx.fillText(d,o.w/2,o.fsize*1*(14.1+i))
  })

  o.pen('プラティモ',0,'r',0)
  o.pen('カラマティ',1,'r',7)
  o.pen('ライトニング',2,'r',0)

 })

 //pm.mode('shop,mes,grid',100) //fadetick
 pm.mode('shop,mes,grid') //fadetick


 function animate(){
  requestAnimationFrame(animate),pm.update()
 }animate();

}

*/

/*
var re={}
re.dat={}
re.typemap={
 img:/\.jpg|\.jpeg|\.gif|\.png|\.bmp/i, //'*.jpg,*.jpeg,*.gif,*.png,*.bmp',
 bgm:/\.wav|\.flac|\.mp3|\.mid/i, //'*.wav,*.flac,*.mp3,*.mid',
 mov:/\.mpeg|\.mp4|\.ogg|\.avi/i, //'*.mpeg,*.mp4,*.ogg,*.avi',
 txt:/\.txt|\.md|\.csv|\.dat/i //'*.txt,*.md,*.csv,*.dat'
}
re.paths=[];
re.setPath=(path)=>{return re.paths.push(path) }
re.get=(name,tilesize)=>{

}
re.makeTile=()=>{

}
*/

//re.get('xyz.png.0',32)
