/*
three.js texture util

scene.background=tex(url)
//if tile
//tex(url,tilenumber,size)

*/

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
 function _hash(url,tilenum,tilesize){
  return [url,tilenum,tilesize].join('_')
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

 function entry(url,tilenum,tilesize){
  let hash=_hash(url,tilenum,tilesize)
  if(_tex[hash])return _tex[hash]
  ;
  if(tilenum!=void 0) return _tex[hash]=loader.load(_url(url),tip(tilenum,tilesize))
  return _tex[hash]=loader.load(_url(url))
 }
 root._tex=_tex
 root.tex =entry;
})(this);
