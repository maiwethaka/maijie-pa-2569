/* 16:9 mathematics stage with a quiet reading center. */
(() => {
const canvas=document.getElementById('mathBackground'),button=document.getElementById('mathMotion'),ctx=canvas.getContext('2d'),preference=matchMedia('(prefers-reduced-motion: reduce)');
let width,height,frame=0,time=0,last=0,paused=preference.matches;
const symbols=['∑','π','√','∞','∫','y = x²','sin θ','a² + b²','∂f / ∂x','eⁱπ + 1 = 0'];
function line(points,alpha=.3){ctx.globalAlpha=alpha;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
function draw(){
ctx.clearRect(0,0,width,height);ctx.save();ctx.scale(width/1600,height/900);ctx.strokeStyle='#719fc6';ctx.fillStyle='#94badb';ctx.lineWidth=1.3;
// Receding coordinate grid continuously moves toward the viewer.
for(let i=-10;i<=10;i++)line([[800+i*38,610],[800+i*210,940]],.17);
for(let i=0;i<13;i++){const z=(i/13+time*.018)%1,y=610+z*z*340;line([[0,y],[1600,y]],.12+z*.13);}
symbols.forEach((s,i)=>{const x=i%2?1410:35,y=(i*119+time*6)%1020-60;ctx.globalAlpha=.5+.15*Math.sin(time*.3+i);ctx.font=(i<5?'36':'22')+'px Georgia,serif';ctx.fillText(s,x+Math.sin(time*.17+i)*24,y);});
// Coordinate planes with continuously drawn parabola and sine graph.
[false,true].forEach(right=>{const ox=right?1370:112,oy=right?310:585;line([[ox-90,oy],[ox+100,oy]],.38);line([[ox,oy-110],[ox,oy+55]],.38);const points=[],progress=(Math.sin(time*.4+(right?1:0))+1)/2;for(let i=0;i<=100*progress;i++){const x=-90+i*1.8;points.push([ox+x,oy-(right?Math.sin(x/30+time*.35)*37:x*x/95-15)]);}line(points,.78);if(points.length){ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(...points.at(-1),3,0,Math.PI*2);ctx.fill();}});
const points=Array.from({length:28},(_,i)=>({x:(i%2?1360:15)+(i*57%215)+Math.sin(time*.18+i)*20,y:(i*97+time*3)%980-40}));
points.forEach((p,i)=>{ctx.globalAlpha=.6;ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);ctx.fill();points.slice(i+1).forEach(q=>{const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<155)line([[p.x,p.y],[q.x,q.y]],(1-d/155)*.45);});});
// Rotating 3D wireframe cubes with perspective projection.
[0,1].forEach(side=>{const a=time*.12+side,b=time*.075,vertices=[];for(let x of [-1,1])for(let y of [-1,1])for(let z of [-1,1]){const xx=x*Math.cos(a)-z*Math.sin(a),zz=x*Math.sin(a)+z*Math.cos(a),yy=y*Math.cos(b)-zz*Math.sin(b),depth=y*Math.sin(b)+zz*Math.cos(b),scale=53/(1+depth*.18);vertices.push([(side?1450:125)+xx*scale,(side?660:220)+yy*scale]);}for(let i=0;i<8;i++)for(let bit of [1,2,4])if((i^bit)>i)line([vertices[i],vertices[i^bit]],.58);});
ctx.strokeStyle='#c9d6e7';ctx.fillStyle='#d4e5f6';for(let i=0;i<22;i++){const x=i%2?1400+(i*31%180):i*29%180,y=(i*67-time*9+1800)%940;ctx.globalAlpha=.35+.25*Math.sin(time+i);ctx.beginPath();ctx.arc(x,y,i%3?1:2,0,Math.PI*2);ctx.fill();if(i%5===0)line([[x,y],[x+18,y-45]],.23);}
// Soft empty center keeps the menu, photographs and text readable.
ctx.globalCompositeOperation='destination-out';const mask=ctx.createLinearGradient(0,0,1600,0);[[0,0],[.15,0],[.27,.93],[.73,.93],[.85,0],[1,0]].forEach(([p,a])=>mask.addColorStop(p,'rgba(0,0,0,'+a+')'));ctx.globalAlpha=1;ctx.fillStyle=mask;ctx.fillRect(0,0,1600,900);ctx.restore();
}
function resize(){width=innerWidth;height=innerHeight;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);draw();}
function tick(stamp){if(paused||document.hidden){frame=0;return;}if(stamp-last>=40){time+=Math.min((stamp-last)/1000,.08);last=stamp;draw();}frame=requestAnimationFrame(tick);}
function sync(){cancelAnimationFrame(frame);frame=0;button.textContent=paused?'เปิดพื้นหลังเคลื่อนไหว':'หยุดพื้นหลัง';button.setAttribute('aria-pressed',String(paused));canvas.dataset.moving=String(!paused);draw();if(!paused&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
button.addEventListener('click',()=>{paused=!paused;sync();});preference.addEventListener('change',e=>{paused=e.matches;sync();});document.addEventListener('visibilitychange',sync);window.addEventListener('resize',resize);resize();sync();
})();
