var FloorMaker=function(str,boxsize){
 if(!this.isformat(str)) return console.error('bad format')
 //need https://gnjo.github.io/hud/Mesher.js & three.js
 //format
 //F00=wallname.jpg //under the 512x512
 //■x41w+\n
 //x41h
 this.boxsize=boxsize||10
 let a=str.trim().split('\n')
 this._header=a.shift()
 this._mapstr=a.join('\n').trim()
 //console.log(this._header,this._mapstr)
 let wk=this._header.split('=')
 this.name=wk[0]
 this.number=parseInt(this.name.slice(1))
 this.wallurl=wk[1]
 this.floor=new THREE.Group(),this.floor.name=this.name
 this.data=this.tomapdata(this._mapstr) 
 //20*20 x=i%20,y=~~(i/20)
 this.patterns={}
 this.wall=tex(this.wallurl)
 this.door=tex(this.wallurl,1)
 this.doorkey=tex(this.wallurl,2)
 this.doorsec=tex(this.wallurl,3)
 this.ground=this.wall
 this.iswall=/[■□壁０１２３４５６７８９＋]/
 this.isdoor=/[扉隠鍵]/
 this.isdoorkey=/[鍵]/ //あ～ん
 this.isdoorsec=/[隠]/
 this.isicon=/[出入脱街宝箱昇降？！\u30a0-\u30ff]/
 // is.katakana=(d)=>{return /[\u30a0-\u30ff]/.test(d)}
 this.patterns={
  /*
　針：ピット。茶。
　毒：猛毒床。紫。
　黙：沈黙床。水。
　闇：暗闇床。一段明るい黒。
　禁：転移禁止床。黄色。
*/  
  "針":"#885544",
  "毒":"#008800",
  "黙":"#880088",
  "闇":"#555555",
  "禁":"#888800",
  "穴":"#000000"
 }
 //
 this.fullmapsize=16*21
 let s=16*21
 this.fullmap=document.createElement('canvas')
 this.footmap=document.createElement('canvas')
}
FloorMaker.prototype.p2g=function p2g(f,x,y){//pos to geopos
 let s=this.boxsize
 return new THREE.Vector3(x*s+0,f*-1*s+0,y*s+0)
}
FloorMaker.prototype.isformat=(str)=>{return /^F\d\d=/.test(str)}
FloorMaker.prototype.tomapdata=function tomapdata(ary,w){
 w=w||41
 if(/\n/.test(ary)) return this.tomapdata(ary.split('\n').join(''),w)
 let getpos=function getpos(mapx,mapy,data,w){
  let x=~~(mapx*2)+1
  let y=~~(mapy*2)+1
  let f=(x,y,w)=>{return y*w+x}//fn.pos2len
  //console.log(mapx,mapy,x,y,f(x,y,w))
  let o={}
  /*                  */o.n=data[f(x,y-1,w)]
  o.w=data[f(x-1,y,w)],o.g=data[f(x,y,w)],o.e=data[f(x+1,y,w)]
  /*                  */o.s=data[f(x,y+1,w)] 
  o.c='　'  
  /*
 let str=
 "■"+o.n+"■"+"\n"
+ o.w+o.g+ o.e+"\n"
+"■"+o.n+"■"
 console.log(str,o)
 */
  return o
 }
 let size=(w-w%2)/2,data=[]
 for(let y=0;y<size;y++)
  for(let x=0;x<size;x++){
   data.push(getpos(x,y,ary,w))
  }
 return data
}
FloorMaker.prototype.build=function(){
 let data=this.data
 let check=(d)=>{
  if(this.iswall.test(d))return this.wall
  if(!this.isdoor.test(d))return void 0;
  if(this.isdoorkey.test(d))return this.doorkey
  if(this.isdoorsec.test(d))return this.doorsec
  return this.door
 }
 data.map((d,i)=>{
  let y=~~(i/20),x=i%20,size=16,ox=size,oy=size,p=this.patterns,p2g=this.p2g
  ,iswall=this.iswall,wall=this.wall,isdoor=this.isdoor,door=this.door
  ,ground=this.ground,isicon=this.isicon
  let mesh=mm.make({
   n:check(d.n),
   e:check(d.e),
   w:check(d.w),
   s:check(d.s),
   c:wall,
   g:p[d.g]?tex(p[d.g],128):ground,
  })
  mesh.position.copy(p2g( this.number ,x,y))
  this.floor.add(mesh)
  //console.log(d)
  //icon make
  if(!isicon.test(d.g))return;
  let icon=mm.make({i:tex(d.g,1,128,'#ffffff')},'icon')
  icon.position.copy(p2g( this.number ,x,y))
  this.floor.add(icon)
  //console.log(icon)
 })
 ///
 return this.floor
}
