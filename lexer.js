
/*
let mac=`
xyz=aaaa
bbb={ //multistring and top&tail trim
aiuewo
kakikukeko
}
`
let a=lexer(mac)

a['xyz']
a['bbb']

*/

;(function(root){
 let co=// //comment out
 let ca=// //capture

 function entry(text){
  if(!text) return console.error('param 1 undefined',text)
  let t=text.replace(co,'').trim()
 }
 root.lexer =entry
}(this)
