//tile
;(function(root){
  /*
　アイコンは、床の上に浮くようにして回転する。また、オンオフ可能である。

　壁の種類。
　壁：オーソドックスな壁。
　■：壁。
　□：壁。
　＋：壁。
　０から９：壁。座標用途。
　扉：通常扉
　隠：隠し扉、あくまで見つけにくい扉であるのみ。
　鍵：鍵付き扉。あくまで制御はしない。
　あ～ん：鍵付き扉。識別用。
　上：下から上で抜けられる扉。上から下は付加。
　下：上から下。
　左：右から左。
　右：左から右。

　地面の種類、罠。
　道：通常。空白の全角スペースも道。
　　：道。
　針：ピット。茶。
　毒：猛毒床。紫。
　黙：沈黙床。水。
　闇：暗闇床。一段明るい黒。
　禁：転移禁止床。黄色。
　移：転移床。ピンク。
　回：回転床。緑。
　穴：落下穴。橙。
　←：氷床、左へ。
　↑：氷床、上へ。
　↓：氷床、下へ。
　→：氷床、右へ。

　地面の種類、アイコン。アイコンを置く場合は地面は道。
　！：イベント・パーソン
　？：イベント・オブジェクト
　昇：昇階段。
　降：降階段。
　機：エレベータ。
　敵：固定敵、ルームガータ。
　ア～ン：あらゆるイベント識別用。

  */
  var _tile={} //cash
  //
  // is.katakana=(d)=>{return /[\u30a0-\u30ff]/.test(d)}
  // is.hiragana=(d)=>{return /[\u3040-\u309f]/.test(d)}  
  //
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
    var img=document.createElement('canvas')
    var ctx=img.getContext('2d')
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
  //
  function hatch(a,b,size){
    let hash=[a,b,size].join('_')
    if(_tile[hash])return _tile[hash]
    ;
    if(b===1)return _tile[hash]=hatch1(a,size)
    else if(b===2) return _tile[hash]=hatch2(a,size)
    else return _tile[hash]=hatch0(a,size)
  }

  function hatch0(a,size){
    //full paint
    let img=document.createElement('canvas')
    let ctx=img.getContext('2d')
    ctx.imageSmoothingEnabled= false  
    img.width=img.height=size||16
    ;
    if(!a)a='transparent'
    let s=img.width/2*2
    ctx.fillStyle = a;
    ctx.fillRect(s*0,s*0,s*1,s*1);
    return img;  
  }

  function hatch1(a,size){
    let img=document.createElement('canvas')
    let ctx=img.getContext('2d')
    ctx.imageSmoothingEnabled= false  
    img.width=img.height=size||16
    ;
    let s=img.width/2
    ctx.fillStyle = a;
    ctx.fillRect(s*0,s*0,s*1,s*1);
    ctx.fillRect(s*1,s*1,s*1,s*1);
    //  ctx.fillStyle = b;
    //  ctx.fillRect(s*0,s*1,s*1,s*1);
    //  ctx.fillRect(s*1,s*0,s*1,s*1);
    return img;
  }

  var hatch2 = function(a,size){
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

  function icon(a,b,size,color){
    color=color||'#ffffff'
    let hash=[a,b,size,color].join('_')
    if(_tile[hash])return _tile[hash]
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

  function wall({n,e,w,s},gimg,size){
    //keys #ff0000
    //door #ffff00
    //wall #ffffff
    let mwall=/[壁■□０１２３４５６７８９＋]/
    let mroad=/[道　]/
    let mdoor=/[扉]/
    let mdoor2=/[隠]/
    let mdoor3=/[鍵\u3040-\u309f]/
    let mwall2=/[上下左右扉隠鍵壁■□０１２３４５６７８９＋\u3040-\u309f]/
    /*　あ～ん：鍵付き扉。識別用。
　上：下から上で抜けられる扉。上から下は付加。
　下：上から下。
　左：右から左。
　右：左から右。
*/  

    ;
    let img=document.createElement('canvas')
    let ctx=img.getContext('2d')
    img.width=img.height=size=size||16
    ctx.imageSmoothingEnabled= false  
    if(gimg) ctx.drawImage(gimg,0,0,size,size)
    ;
    let f=(xs,ys,xe,ye)=>{
      ctx.beginPath();
      ctx.moveTo(xs,ys);
      ctx.lineTo(xe,ye);
      ctx.closePath();
      ctx.stroke();
    }  
    ctx.lineWidth=2
    ctx.strokeStyle="#eeeeee"
    if(mwall2.test(n)) f(0,0,size,0)
    if(mwall2.test(s)) f(0,size,size,size)
    if(mwall2.test(e)) f(size,0,size,size)
    if(mwall2.test(w)) f(0,0,0,size)
    //    
    //door
    let z=4,sz=z+size-z*2  
    ctx.strokeStyle="#333333"
    if(mdoor.test(n)) f(z,0,sz,0)
    if(mdoor.test(s)) f(z,size,sz,size)
    if(mdoor.test(e)) f(size,z,size,sz)
    if(mdoor.test(w)) f(0,z,0,sz)
    if(n==='上') f(z,0,sz,0)
    if(s==='下') f(z,size,sz,size)
    if(e==='右') f(size,z,size,sz)
    if(w==='左') f(0,z,0,sz)    
    //keydoor
    ctx.strokeStyle="#ff2266"
    if(mdoor3.test(n)) f(z,0,sz,0)
    if(mdoor3.test(s)) f(z,size,sz,size)
    if(mdoor3.test(e)) f(size,z,size,sz)
    if(mdoor3.test(w)) f(0,z,0,sz)
    //special
    return img
  }

  //
  function tile(obj,type,size){
    if(typeof obj==='object')return wall(obj,type,size)
    if(obj===void 0||obj==='transparent') return hatch(obj,type,size)
    if(obj.charAt(0)==='#') return hatch(obj,type,size)
    if(/\./.test(obj)) return wall3d(obj,type,size)

    let hash=[obj,type,size].join('_')
    if(_tile[hash])return _tile[hash]
    return  _tile[hash]=icon(obj,type,size)
  }
  root.tile=tile
  root._tile=_tile //tile cash
  root.icon=icon
})(this);


var FloorMaker=function(str,boxsize){
 if(!this.isformat(str)) return console.error('bad format')
 //need https://gnjo.github.io/hud/Mesher.js & three.js
 //format
 //F00=wallname.jpg //under the 512x512
 //■x41w+\n
 //x41h
 this.boxsize=boxsize||10
 this.mm=new Mesher(boxsize)
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
 this.fullmap.width=this.footmap.width=this.fullmapsize
 this.fullmap.height=this.footmap.height=this.fullmapsize
  
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
  ,ground=this.ground,isicon=this.isicon,mm=this.mm
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


FloorMaker.prototype.mapframe=function mapframe(cell,size,ctx){
  let ary=Array.from({length:cell}).map((d,i)=>{
    let g=tile(''+i,0,size),z=size
    ctx.drawImage(g,0,i*size+z) //ho
    ctx.drawImage(g,i*size+z,0) //ve
  })
}

FloorMaker.prototype.makemap=function(){
  let data=this.data,p=this.patterns
  ,ctx=this.fullmap.getContext('2d')
  this.mapframe(20,16,ctx)
  //this.fullmapsize=16*21
  //let s=16*21
  //this.fullmap=document.createElement('canvas')
  //this.footmap=document.createElement('canvas')
  data.map((d,i)=>{
    let y=~~(i/20),x=i%20,size=16,ox=size,oy=size //,p=xx.patterns
    let g=(p[d.g])?tile(p[d.g],2,16):tile(d.g,0,16)
    ;
    let wall=tile(d,g,16)
    ctx.drawImage(wall,x*size+ox,y*size+oy);  
  })  
}
FloorMaker.prototype.makefootmap=function(footary){
  //let c=xx.makefootmap(["F00X00Y00.N","F00X01Y01.N","F00X00Y01.N"])
  let ctx=this.footmap.getContext('2d'),s=16
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
  this.mapframe(20,s,ctx)
  //footary is push addr F00X00Y00.N
  footary.map(d=>{
    let x=parseInt( d.charAt(4)+d.charAt(5) )
    let y=parseInt( d.charAt(7)+d.charAt(8) )
//    console.log(x,y,d)
    let ox=s,oy=s
    ctx.drawImage(this.fullmap,ox+s*x,oy+s*y,s,s,ox+s*x,oy+s*y,s,s)    
  })
  return this.footmap
}

//walked color? unwalk color

//script(src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js")
//script(src="https://gnjo.github.io/hud/Mesher.js?v=10")

/*
let xx=new FloorMaker(da)
xx.build()
xx.makemap()
let c=xx.makefootmap(["F00X00Y00.N","F00X01Y01.N","F00X00Y01.N"])
//ctx.drawImage(xx.fullmap,0,0)
ctx.drawImage(c,0,0)


//ctx.drawImage(icon('＜',0,16,'#ff0000'),16*3,16*3)

let cx=document.querySelector('canvas.x')
cx.width=xx.fullmap.width,cx.height=xx.fullmap.height
let ctx2=cx.getContext('2d')
ctx2.drawImage(xx.fullmap,0,0)
*/
