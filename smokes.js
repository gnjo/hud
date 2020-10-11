var Smokes=function(url,color,size,mass){
  this.color=new THREE.Color(color||0x00ddff)
  this.url=url||"https://gnjo.github.io/fatema/smoke.png"
  this.tex=new THREE.TextureLoader().load(this.url)
  this.mat = new THREE.MeshLambertMaterial({color:this.color, map: this.tex});
  this.mat.transparent=true,this.mat.alphaTest=0.01 
  this.size=size/3||300
  let r=Math.random,s=this.size  
  this.geo = new THREE.PlaneBufferGeometry(s,s);
  this.smokes=new THREE.Group(),this.smokes.name='smokes'
  this.mass=mass||160 //under 1000
  Array.from({length:this.mass}).map(d=>{
    var p = new THREE.Mesh(this.geo,this.mat);
    //z +s*0.2 block the shutout of view
    p.position.set(r()*s*2-s,r()*s*2-s,r()*s*5+s*0.2),p.rotation.z=r()*s
    this.smokes.add(p);
  })
  this.clock = new THREE.Clock();
}
Smokes.prototype.update=function(speed) {
  var dt=this.clock.getDelta()
  speed=speed||0.3
  this.smokes.children.map((d,i)=>{d.rotation.z +=(dt*speed)})
}
Smokes.prototype.setColor=function(color){
  this.color=new THREE.Color(color)
  this.mat.color=this.color
}


/*
var url="https://gnjo.github.io/fatema/smoke.png"
,color='#00ddff',widesize=window.innerWidth,mass=160
,smokes =new Smokes(url,color,widesize,mass)
scene.add(smokes.smokes)
... requestAnimationFrame(animate),smokes.update()///
*/
