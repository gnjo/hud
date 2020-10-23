/*
include tex
*/

/*usage
let mm=new Mesher(10)
let p1=mm.make({i:tex('？',2,64,'#ffffff')},'question')
p1.position.copy(mover.p2g(0,0,3))//f,x,y
scene.add(p1)
let p2=mm.make({i:tex('？',2,64,'#ffffff')},'question')
p2.position.copy(mover.p2g(0,1,1))//f,x,y
scene.add(p2)

let b1=mm.make({
 n:void 0,
 e:void 0,
 w:void 0,
 s:tex('maptile.png',1,32),
 c:void 0,
 g:tex('#ffff66',32),
},'box')

b1.position.copy(mover.p2g(0,0,1))
scene.add(b1)

*/

//tex
;(function(root){
 var _tex={} //cash
 var loader=new THREE.TextureLoader()
 var baseurl=''
 ;
 function _url(url){
  if(!baseurl) baseurl=url.slice(0,-1*url.split('/').pop().length)
  if(!/\//.test(url))return baseurl+url
  return url
  ;
 }
 function _hash(url,tilenum,tilesize,other){
  return [url,tilenum,tilesize,other].join('_')
 }
 function tip(num,size){
  return (tex)=>{
   size=size||16,num=num||0;
   let img=tex.image,w=img.naturalWidth,h=img.naturalHeight
   ,c=document.createElement('canvas'),ctx=c.getContext("2d")
   ,nw=~~(w/size),nh =~~(h/size),x=num%nw,y=~~(num/nw)
   ;
   c.height=c.width=size
   ctx.drawImage(img,x*size,y*size,size,size, 0,0,size,size)
   tex.image.src=c.toDataURL()
   tex.needsUpdate=true////
  }
 }
 
 function adddoor(opt){
  return (tex)=>{
    var color='#8888aa'
    //opt===0 wall
    //opt===1 door
    //opt===2 key
    //opt===3 hide
    if(opt===2) color='#aa3333'
    if(opt===3) color='#333333'
    //
   let img=tex.image,w=img.naturalWidth,h=img.naturalHeight
   ,c=document.createElement('canvas'),ctx=c.getContext("2d")
   c.height=h;c.width=w
   ctx.drawImage(img,0,0,w,h)
   ctx.globalCompositeOperation = "lighter"//"hue"//"difference"//"lighter";
   ctx.globalAlpha=0.5
   ctx.fillStyle = color//"#333333";
   let w2=w*0.6,h2=h*0.8
   ctx.fillRect(w*0.2,h*0.2,w2,h2);
   tex.image.src=c.toDataURL()
   tex.needsUpdate=true////       
  }
 }
 
 /*
   function wall3d(url,opt,size){
    size=size||128
    var color='#aaaaaa'
    //opt===0 wall
    //opt===1 door
    //opt===2 key
    //opt===3 hide
    if(opt===2) color='#aa3333'
    if(opt===3) color='#333333'

    let hash=[url,opt,size].join('_')
    if(_tile[hash])return _tile[hash]
    ;    

    var a = new Image();
    var c=document.createElement('canvas')
    var ctx=c.getContext('2d')
    var w=ctx.canvas.width=size,h=ctx.canvas.height=size
    a.onload = function(){
      ctx.drawImage(a,0,0,size,size)
      if(!opt)return _tile[hash]=img
      ;
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha=0.5
      ctx.fillStyle = color//"#333333";
      let w2=w*0.6,h2=h*0.8
      ctx.fillRect(w*0.2,h*0.2,w2,h2);
    };
    a.src = url
    return _tile[hash]=img
  }  

 */
 
/*
 function icon(a,b,size,color){
  //console.log(a,b,size,color)
  color=color||'#ffffff'
  //let hash=[a,b,size,color].join('_')
  //    if(_tile[hash])return _tile[hash]
  ;    
  //b===0 //no outline
  //b===1 //circle
  //b===2 //square
  let img=document.createElement('canvas')
  let ctx=img.getContext('2d')
  img.width=img.height=size||16
  ctx.imageSmoothingEnabled= false  
  ;
  let r=img.width/2
  ctx.font=`${r*1.4}px sans-serif`
  ctx.textAlign='center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle=color
  ctx.fillText(a,r,r,img.width)
  ctx.strokeStyle=color
  ctx.lineWidth=size>16?2:1
  if(b===1) ctx.rect(0, 0, r*2, r*2)
  else if(b===2)ctx.arc(r, r, r-1, 0, 2*Math.PI,true)
  ctx.stroke()
  return img;
 }
 */
 
 function icon(a,b,size,color,rot){
  //console.log(a,b,size,color)
  color=color||'#ffffff'
  size=size||16
  //let hash=[a,b,size,color].join('_')
  //    if(_tile[hash])return _tile[hash]
  ;    
  //b===0 //no outline
  //b===1 //circle
  //b===2 //square
  let img=document.createElement('canvas')
  let ctx=img.getContext('2d')
  img.width=img.height=size
  ctx.imageSmoothingEnabled= false  
  ;

  let r=img.width/2
  ctx.font=`${r*1.4}px sans-serif`
  ctx.textAlign='center'
  ctx.textBaseline = 'middle'
  ctx.save()
  if(rot){
   //rotation icon
   //icon('▲',0,16,'#fff','N')
   if(/N/i.test(rot)) rot=0
   else if(/E/i.test(rot)) rot=90
   else if(/S/i.test(rot)) rot=180
   else if(/W/i.test(rot)) rot=270
   ctx.translate(parseInt(size / 2), parseInt(size / 2))
   ctx.rotate((rot * Math.PI) / 180);
   ctx.translate(-1*parseInt(size / 2), -1*parseInt(size / 2))   
  }  
  ctx.fillStyle=color
  ctx.fillText(a,r,r,img.width)
  //
  ctx.restore()
  ctx.strokeStyle=color
  ctx.lineWidth=size>16?2:1
  if(b===1) ctx.rect(0, 0, r*2, r*2)
  else if(b===2)ctx.arc(r, r, r-1, 0, 2*Math.PI,true)
  ctx.stroke()
  return img;
 }


 function hatch2(a,size){
  let img=document.createElement('canvas')
  let ctx=img.getContext('2d')
  ctx.imageSmoothingEnabled= false  
  img.width=img.height=size=size||16
  ;
  let x1=0,y1=0,dx=size,dy=size,delta=4,color=a
  //ctx.rect(x1, y1, dx, dy);
  //ctx.save();
  //ctx.clip();
  var majorAxe = Math.max(dx,dy)
  ctx.strokeStyle = color;
  for(let n=-1*majorAxe;n<majorAxe;n+=delta){
   ctx.beginPath();
   ctx.moveTo(n + x1, y1);
   ctx.lineTo(dy + n + x1 , y1 + dy);
   ctx.stroke();
  }
  return img
 }
 function texmark(str,opt,size,color){
  return new THREE.CanvasTexture(icon(str,opt,size,color))
 }
 function texhatch(color,size){
  return new THREE.CanvasTexture(hatch2(color,size))
 }


 function entry(url,tilenum,tilesize,other){
  let hash=_hash(url,tilenum,tilesize,other)
  if(_tex[hash])return _tex[hash]
  ;
  if(/^#/.test(url))return _tex[hash]=texhatch(url,tilenum,tilesize,other)
  if(!/\./.test(url))return  _tex[hash]=texmark(url,tilenum,tilesize,other)
  if(tilesize!=void 0) return _tex[hash]=loader.load(_url(url),tip(tilenum,tilesize))
  if(tilenum!=void 0) return _tex[hash]=loader.load(_url(url),adddoor(tilenum)) //add door
  return _tex[hash]=loader.load(_url(url))
 }
 root._tex=_tex
 root.tex =entry;
})(this);


//mesher
var Mesher=function(boxsize){
 this.boxsize=boxsize||10
 //bumpmap
 this.boxmat=new THREE.MeshPhongMaterial({//THREE.MeshLambertMaterial({
  map: void 0, //needupdate
  visible:false, //needupdate
  //transparent:true,
  //alphaTest: 0.5,
  side:THREE.BackSide,
  shininess:10 //deafut 30
 });
 this.boxgeo=new THREE.BoxBufferGeometry(boxsize,boxsize,boxsize)

 this.planemat=new THREE.MeshPhongMaterial({
  map: void 0, //needupdate
  visible:false, //needupdate
  transparent:true,
  alphaTest: 0.5,
  side:THREE.DoubleSide
 });
 this.planegeo=new THREE.PlaneBufferGeometry(boxsize/4,boxsize/4,16,16)
 ;
}

Mesher.prototype.makebox=function(obj,name){
 let geo=this.boxgeo 
 let mat=this.boxmat.clone()
 let mats=[
  obj.e,obj.w,
  obj.c,obj.g,
  obj.s,obj.n
 ].map(d=>{
  if(!d)return mat.clone()
  let m=mat.clone()
  m.map=d,m.visible=true
  //bumpmap
  m.bumpMap=d// テクスチャと同じものを設定するだけでOK
  m.bumpMapScale = 0.2//1// 0-1
  //
  return m   
 })
 let mesh=new THREE.Mesh(geo,mats)
 mesh.name=name
 return mesh;
}
Mesher.prototype.makeplane=function(obj,name){
 let geo=this.planegeo
 let mat=this.planemat.clone()
 let mesh = new THREE.Mesh(geo,mat) 
 ;
 mat.map=obj.i,mat.visible=true,mat.map.needsUpdate=true,mesh.name=name
 return mesh
}
Mesher.prototype.make=function(obj,name){
 //{e,w,
 // c,g,
 // s,n,i}
 //function isstring(obj){return toString.call(obj) === '[object String]'}; 
 if(obj.i)return this.makeplane(obj,name)
 else return this.makebox(obj,name)

}
