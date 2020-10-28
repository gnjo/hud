function gameCanvas(w,h,resizenone){
  //640,480
  //keepsize
  //antialias
  let bs2=`
  image-rendering: optimizeSpeed;             /* Older versions of FF          */
  image-rendering: -moz-crisp-edges;          /* FF 6.0+                       */
  image-rendering: -webkit-optimize-contrast; /* Safari                        */
  image-rendering: -o-crisp-edges;            /* OS X & Windows Opera (12.02+) */
  image-rendering: pixelated;                 /* Awesome future-browsers       */
  -ms-interpolation-mode: nearest-neighbor;   /* IE                            */
  `;
  let bs='background:#0a0a0a;margin:0 auto;width:100%;height:100%;padding:0;'
  ,asp=w/h
  ,fitw='display:block;width:100vw;height:auto;margin:auto;' +bs2
  ,fith='display:block;width:auto;height:100vh;margin:auto;' +bs2
  ,canvas=document.createElement('canvas')
  ,_w=window.innerWidth,_h=window.innerHeight
  ,resize=()=>{
    _w=window.innerWidth,_h=window.innerHeight
    return canvas.style=(_w>_h*asp)?fith:fitw
  }
  ,nonestyle='display:block;'+bs2
  ;
  canvas.width=w,canvas.height=h
  document.body.style=bs
  if(!resizenone) resize(),window.addEventListener('resize',resize) ;
  else canvas.style=nonestyle
  document.body.appendChild(canvas)
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
