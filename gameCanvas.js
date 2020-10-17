function gameCanvas(w,h){
  //640,480
  //keepsize
  let bs='background:#0a0a0a;margin:0 auto;width:100%;height:100%;padding:0;'
  ,asp=w/h
  ,fitw='display:block;width:100vw;height:auto;margin:auto;'
  ,fith='display:block;width:auto;height:100vh;margin:auto;'
  ,canvas=document.createElement('canvas')
  ,_w=window.innerWidth,_h=window.innerHeight
  ,resize=()=>{
    _w=window.innerWidth,_h=window.innerHeight
    return canvas.style=(_w>_h*asp)?fith:fitw
  }
  ;
  canvas.width=w,canvas.height=h
  document.body.style=bs
  resize()
  document.body.appendChild(canvas)
  window.addEventListener('resize',resize)
  ;
  return canvas;
}

//create canvas
/*
// Create scene for 3D content.
var width = 640
var height = 480
var canvas=gameCanvas(width,height)
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({antialias: true,canvas:canvas});

*/

function gameSound(name){
 let el=document.createElement('video')
 el.classList.add(name||'')
 el.setAttribute('autoplay','autoplay')
 el.style="display:none"
 function userControlled(){
  if(el.dataset.needsUpdate) el.play()
  el.dataset.needsUpdate=''    
 }
 document.body.appendChild(el)
 ;['keydown','mousemove','mousedown','contextmenu','wheel'].map(d=>{window.addEventListener(d,userControlled)});
 return el 
  /*
 function userCotrolled(){
  if(ZAP_SE.dataset.needsUpdate) ZAP_SE.play()
  if(ZAP_BGM.dataset.needsUpdate) ZAP_BGM.play()
  ZAP_SE.dataset.needsUpdate=''
  ZAP_BGM.dataset.needsUpdate=''
//console.log(ZAP_SE.dataset.needsUpdate)
//音はユーザーコントロールでなければならない。
//キーイベントかマウスイベントにトラップする。
//document.body.onclick=()=>{
// SE_('crystal1.ogg')
// userCotrolled()
//}
 
 }
  
*/  
}

function gameSE(name){return gameSound(name||'se')}
function gameBGM(name){return gameSound(name||'bgm')}
/*
 fn.q('.se').src=se[ss]
 fn.q('.im').src=im[ii]
 fn.q('video.se').volume=i*0.01
*/
