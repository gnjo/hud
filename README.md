# hud
three.js on ui plane
demo https://codepen.io/gnjo/pen/YzqgBBm?editors=0010
```
script(src="https://gnjo.github.io/hud/hud.js")
```
```
  let h=hud(renderer);
  let ctx=h.ctx//h.update()  
  ctx.clearRect(0,0,640,480)
  ctx.fillText(Date.now()+'',640/2,32)
  h.update()
```
