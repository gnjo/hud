 var CashBox = function(boxsize,basegeo,basemat){
  this.boxsize=boxsize||10
  let defmat=new THREE.MeshLambertMaterial({
   map: void 0, //needupdate
   visible:false, //needupdate
   transparent:true,alphaTest: 0.5,side:THREE.BackSide
  });
  let defgeo=new THREE.BoxBufferGeometry(boxsize,boxsize,boxsize)
  this.basegeo=basegeo?basegeo:defgeo
  this.basemat=basemat?basemat:defmat
  ;
  this.loader= new THREE.TextureLoader();
  this.cash={}
 };
 // メソッドはコンストラクタの prototype プロパティに定義します
 //CashBox.prototype.
 CashBox.prototype.isstring=function(obj){
  return toString.call(obj) === '[object String]'
 };
 CashBox.prototype.hash=function(ary){
  let s=this.isstring(ary)?ary:ary.join('')
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0); 
 };
 CashBox.prototype.make=function(_ary){
  let ary=this.isstring(_ary)?[_ary]:_ary
  let h=this.hash(ary)
  if(this.cash[h])return this.cash[h].clone() //speedup
  ;
  let geo=this.basegeo//
  let mats=ary.map(pic=>{
   let mat =this.basemat.clone()
   mat.map=(pic)?this.loader.load(pic):void 0
   mat.visible=(pic)?true:false
   return mat
  })
  let mesh=new THREE.Mesh(geo,mats)
  this.cash[ this.hash(ary) ] =mesh
  return mesh
 };

/*
let aa=new CashBox(10)
aa.loader.setPath( 'https://gnjo.github.io/fatema/');
let a=aa.make('wall.png')
console.log(a)
*/
