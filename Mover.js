/*history
v0.1 build
v1.0 mesh chase true rotation

*/
/*usage
camera = new THREE.PerspectiveCamera( 75,ww/hh, 1, 50 );
light = new THREE.PointLight(new THREE.Color(0xffffff),4.0,boxsize*5,5);
light = new THREE.SpotLight( 0xddeeff,2.0,boxsize*3,5 );

mover=new Mover(boxsize,new V3(0))
mover.add(camera,new V3(0,-0.1,-boxsize*0.49))
mover.add(light,new V3(0,boxsize*0.49,-boxsize*0.49))
;
scene.add(mover.mover)
scene.add(mover.grid)

mover.movecheck=function(ch,o){
return true;//move ok// if dont move, return false
}
setTimeout(()=>{ mover.chase()},10)

plane.position.copy( mover.p2g(0,10,10) )

*/
var Mover=function(movesize,vec3){
vec3=vec3||new THREE.Vector3(0)
this.zero=vec3.clone()
this.vecmap={
 'N':180,
 'E':90,
 'W':270,
 'S':0
}
this.v='N'
this.movesize=movesize||10
{
 let wk=this.movesize*0.1
 var mover = new THREE.Mesh(
  new THREE.BoxGeometry(wk,wk,wk)
  , new THREE.MeshPhongMaterial( { color: 0x00ff00 })
 );
 mover.rotation.order = "YXZ"//gimbal lock
 mover.position.x=this.zero.x
 mover.position.y=this.zero.y
 mover.position.z=this.zero.z
 mover.rotation.x=0
 let n=this.vecmap[this.v]
 mover.rotation.y=THREE.Math.degToRad(n)
 mover.rotation.z=0
}
this.mover =mover
{
 let m=this.movesize
 var grid =new THREE.GridHelper(20*m,20)
 grid.position.y=vec3.y-m/2
 grid.position.x=vec3.x+m*10-m/2
 grid.position.z=vec3.z+m*10-m/2
}
this.grid=grid
this.chaseary=[];
this.moving=0
this.wait=200
this.split=16
this.keymap={
 '<':'A'.charCodeAt(0),
 '>':'D'.charCodeAt(0),
 '^':'W'.charCodeAt(0),
 'V':'S'.charCodeAt(0),
 'L':'Q'.charCodeAt(0),
 'R':'E'.charCodeAt(0),
 'U':'R'.charCodeAt(0),
 'D':'F'.charCodeAt(0)
}
this.keyevent=true
this.movecheck=function(ch,o){return true}
let self=this
document.documentElement.addEventListener('keydown',function(ev){
 //console.log(ev,self.moving,self.keyevent)
 //this=self
 if(!self.keyevent)return
 if(self.moving)return
 let ch;
 Object.keys(self.keymap).map(key=>{if(ev.which===self.keymap[key])ch=key })
 if(ch&&self.movecheck(ch,self)) self.move(ch,self.wait)
 ;
})
;
}
Mover.prototype.iscamera=function(mesh){
if(!mesh)return
return /camera/i.test(mesh.type)
}
Mover.prototype.islight=function(mesh){
if(!mesh)return
return /light/i.test(mesh.type)
}
Mover.prototype.ismesh=function(mesh){
if(!mesh)return
return /mesh/i.test(mesh.type) 
}
Mover.prototype.add=function(mesh,offset){
let v=new THREE.Vector3(0)
this.chaseary.push({mesh:mesh,offset:offset||v})
}
Mover.prototype._chase=function(base,chaser,offset){
//console.log(target.position,camera.position,offset)
var roffset = offset.clone()
var boffset = roffset.applyMatrix4( base.matrixWorld );
chaser.position.x = boffset.x;
chaser.position.y = boffset.y;
chaser.position.z = boffset.z;
if(this.iscamera(chaser)) chaser.lookAt( base.position );
if(this.islight(chaser)) chaser.target=base
if(this.ismesh(chaser)) chaser.rotation.copy(base.rotation) //v1.0
 
}
Mover.prototype.chase=function(){
this.chaseary.map(d=>{
 let mesh=d.mesh,offset=d.offset,base=this.mover
 if(this.iscamera(mesh)) mesh.updateProjectionMatrix()
 this._chase(base,mesh,offset)   
})
}
Mover.prototype.move=function move(ch,time){
this.moving=1
time=time||this.time
let sp=this.split,boxsize=this.movesize
 ,dd,val,fn,target=this.mover,dt=time/sp
;
if(ch==='<') val=90,dd=THREE.Math.degToRad(val/sp),fn=target.rotateY
if(ch==='>') val=-90,dd=THREE.Math.degToRad(val/sp),fn=target.rotateY
if(ch==='^') val=1*boxsize,dd=val/sp,fn=target.translateZ
if(ch==='V') val=-1*boxsize,dd=val/sp,fn=target.translateZ
if(ch==='L') val=1*boxsize,dd=val/sp,fn=target.translateX
if(ch==='R') val=-1*boxsize,dd=val/sp,fn=target.translateX
if(ch==='U') val=1*boxsize,dd=val/sp,fn=target.translateY
if(ch==='D') val=-1*boxsize,dd=val/sp,fn=target.translateY
if(!fn)return this.moving=0
;
this.lop((i)=>{
 //console.log(i)
 fn.call(target,dd)/*,this.chase()*/
 if(i===0) setTimeout(()=>{/*this.chase(),*/this.moving=0},0)
},dt,sp)
;
}
Mover.prototype.lop=function lop(caller,dt,_i){
let i=_i
setTimeout(()=>{
 i--
 if(i<0)return
 return caller(i),lop(caller,dt,i)
},dt)
/*usage
lop((i)=>{
ff(0,i)
if(i===0) console.log('end')
},10,11)

*/
}
Mover.prototype.getv=function getv(){
// 180 => N
// 90  => E
// 0   => S
// -90(270) => W
let m=this.mover
m.updateMatrixWorld() 
let deg = Math.round((THREE.Math.radToDeg(m.rotation.y))+360)%360 +0
// deg=Math.round(deg)
if(deg===180)return this.v='N'
if(deg===90)return this.v='E'
if(deg===0)return this.v='S'
if(deg===270)return this.v='W'
return this.v
//return NEWS
}
Mover.prototype.getp=function getp(){
let m=this.mover,f,x,y
m.updateMatrixWorld()
f=Math.round(m.position.y/10*-1+0) +0
x=Math.round(m.position.x/10+0) +0
y=Math.round(m.position.z/10+0) +0
return {f:f,x:x,y:y}
}

Mover.prototype.p2g=function p2g(f,x,y){
 //pos to geopos
let s=this.movesize
return new THREE.Vector3(x*s+0,f*-1*s+0,y*s+0)
}


//short util _v()
//_v(v).turn()
//_v(v).right()
//_v(v).left()
//_v(v).ch(ch)
//ch is <>^v lr //ud
function _v(v){
let o={}
o.org=v.toLowerCase()
o.turn=()=>{
 let a=o.org
  if(a==='n')return 's'
  else if(a==='s')return 'n'
  else if(a==='w')return 'e'
  else if(a==='e')return 'w'
}
//   n
// w * e
//   s
o.right=()=>{
 let a=o.org
  if(a==='n')return 'e'
  else if(a==='s')return 'w'
  else if(a==='w')return 'n'
  else if(a==='e')return 's'
}
o.left=()=>{
 let a=o.org
  if(a==='n')return 'w'
  else if(a==='s')return 'e'
  else if(a==='w')return 's'
  else if(a==='e')return 'n'
}
return o;
}

//export {Mover,_v}



