const questions = [
 {q:'Lengkapkan jujukan nombor berikut: 81, 27, ___, 3, 1',a:['6','9','18','12'],c:1},
 {q:'Corak 1 menggunakan 4 batang mancis, Corak 2 menggunakan 7 batang mancis dan Corak 3 menggunakan 10 batang mancis. Berapakah bilangan mancis yang diperlukan untuk membentuk Corak 5?',a:['13','16','19','22'],c:1},
 {q:'Faktorkan selengkapnya: 8y² − 2',a:['2(4y² − 1)','2(2y − 1)(2y + 1)','(4y − 2)(2y + 1)','2(2y − 1)²'],c:1},
 {q:'Ungkapkan 3/(4k) − (2 − k)/(8k) sebagai satu pecahan tunggal dalam bentuk termudah.',a:['(4 + k)/(8k)','(4 − k)/(8k)','(1 + k)/(8k)','(5 − k)/(8k)'],c:0},
 {q:'Diberi L = ½(a + b)h. Ungkapkan a sebagai perkara rumus.',a:['a = 2L/h − b','a = 2L/h + b','a = 2Lh − b','a = L/h − b'],c:0},
 {q:'Diberi k² = 4m + 3. Cari nilai k apabila m = 11.',a:['6','7','47','49'],c:1},
 {q:'Rajah menunjukkan sebuah pentagon sekata. Cari nilai x (sudut pedalaman).',a:['72°','108°','120°','144°'],c:1},
 {q:'Sebuah poligon mempunyai hasil tambah sudut pedalaman 1260°. Berapakah bilangan sisinya?',a:['7','8','9','10'],c:2},
 {q:'Panjang lengkok minor PQ ialah 11 cm dan jejari bulatan ialah 14 cm. Cari nilai sudut θ. Gunakan π = 22/7.',a:['30°','45°','60°','90°'],c:1},
 {q:'Cari luas permukaan sebuah sfera dengan jejari 5 cm. Gunakan π = 3.142.',a:['78.55 cm²','157.1 cm²','314.2 cm²','523.7 cm²'],c:2},
 {q:'Sebuah piramid mempunyai tapak segi empat sama dengan sisi 5 cm dan tinggi 9 cm. Apakah isipadunya?',a:['45 cm³','75 cm³','150 cm³','225 cm³'],c:1},
 {q:'Cari titik tengah bagi garis lurus yang menyambungkan A(−1, 8) dan B(7, 2).',a:['(3, 5)','(4, 6)','(6, 10)','(8, 10)'],c:0},
 {q:'Diberi fungsi y = x² − 4. Cari nilai y apabila x = −3.',a:['−13','−5','5','13'],c:2},
 {q:'Fungsi manakah yang diwakili oleh set pasangan tertib {(1,1), (2,4), (3,9)}?',a:['y = x + 1','y = 2x','y = x²','y = x³'],c:2},
 {q:'Sebuah kereta bergerak sejauh 180 km dalam masa 2 jam. Apakah lajunya?',a:['60 km/j','90 km/j','180 km/j','360 km/j'],c:1},
 {q:'Laju sebuah basikal berubah daripada 5 m/s kepada 15 m/s dalam masa 4 saat. Apakah pecutannya?',a:['2.5 m/s²','3.75 m/s²','5 m/s²','10 m/s²'],c:0},
 {q:'Apakah kecerunan bagi persamaan garis lurus y = −3x + 7?',a:['−3','3','4','7'],c:0},
 {q:'Antara berikut, yang manakah bukan transformasi isometri?',a:['Translasi','Pantulan','Putaran','Pembesaran'],c:3},
 {q:'Cari min bagi nombor: 4, 8, 9, 11, 13.',a:['8','9','10','11'],c:1},
 {q:'Sebiji dadu adil dilambung. Apakah kebarangkalian mendapat nombor perdana?',a:['1/6','1/3','1/2','2/3'],c:2}
];
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score'),progressEl=document.getElementById('progress');
const startScreen=document.getElementById('startScreen'),questionScreen=document.getElementById('questionScreen'),endScreen=document.getElementById('endScreen');
const keys={left:false,right:false};
let running=false,paused=false,raf=0,score=0,correct=0,wrong=0,current=0,last=0,world=0,player={x:90,y:0,vy:0,onGround:true},canvasW=800,canvasH=420,ground=350,feedbackTimer=0,answered=false;
const checkpoints=questions.map((_,i)=>420+i*390);
const obstacles=Array.from({length:20},(_,i)=>({x:260+i*390,y:0,w:34,h:38}));
function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);canvasW=r.width;canvasH=r.height;ground=canvasH-62;player.y=Math.min(player.y||ground-44,ground-44)}
new ResizeObserver(resize).observe(canvas);resize();
function draw(){const w=canvasW,h=canvasH,g=ground;ctx.clearRect(0,0,w,h);
 const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#83d5ff');sky.addColorStop(1,'#d5f4ff');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
 // distant clouds and rolling hills
 for(let i=0;i<6;i++){let x=((i*195-world*.18)%(w+180)+w+180)%(w+180)-80;ctx.fillStyle='#ffffff9c';ctx.beginPath();ctx.ellipse(x,75+(i%2)*37,38,13,0,0,7);ctx.ellipse(x+20,70+(i%2)*37,25,17,0,0,7);ctx.fill()}
 ctx.fillStyle='#97de9d';ctx.beginPath();ctx.moveTo(0,g);for(let x=0;x<=w+20;x+=20)ctx.lineTo(x,g-24-Math.sin((x+world*.3)/90)*12);ctx.lineTo(w,g);ctx.fill();
 ctx.fillStyle='#65c875';ctx.fillRect(0,g,w,h-g);ctx.fillStyle='#40ad63';ctx.fillRect(0,g,w,9);
 // ground tiles
 for(let x=-((world*.65)%48);x<w;x+=48){ctx.fillStyle='#ffffff27';ctx.fillRect(x,g+18,25,7);ctx.fillStyle='#2f9b54';ctx.fillRect(x+12,g+40,22,5)}
 // obstacles, checkpoint flags
 obstacles.forEach(o=>{const x=o.x-world;if(x<-50||x>w+50)return;ctx.fillStyle='#a75c36';roundRect(x,g-o.h,o.w,o.h,8);ctx.fillStyle='#ffd05a';ctx.fillRect(x+5,g-o.h+8,6,7);ctx.fillStyle='#8a492e';ctx.fillRect(x+14,g-6,6,6)});
 checkpoints.forEach((x,i)=>{const sx=x-world;if(sx<-35||sx>w+35)return;ctx.fillStyle='#fff';ctx.fillRect(sx,g-78,5,78);ctx.fillStyle='#ff705e';ctx.beginPath();ctx.moveTo(sx+5,g-77);ctx.lineTo(sx+42,g-66);ctx.lineTo(sx+5,g-54);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 11px Nunito';ctx.fillText(String(i+1),sx+13,g-63)});
 // player shadow and cheerful fox runner
 const px=player.x-world,py=player.y;ctx.fillStyle='#2c815033';ctx.beginPath();ctx.ellipse(px+20,g-1,22,5,0,0,7);ctx.fill();
 ctx.save();ctx.translate(px,py);if(keys.left&&!keys.right)ctx.scale(-1,1);
 // legs
 ctx.fillStyle='#315b78';roundRect(7,31,10,15,4);roundRect(22,31,10,15,4);ctx.fillStyle='#ffcd56';roundRect(3,41,16,6,3);roundRect(19,41,16,6,3);
 // tail
 ctx.fillStyle='#e78136';ctx.beginPath();ctx.ellipse(35,27,11,6,-.35,0,7);ctx.fill();
 // ears and head
 ctx.fillStyle='#ed9144';ctx.beginPath();ctx.moveTo(5,16);ctx.lineTo(7,0);ctx.lineTo(18,11);ctx.moveTo(22,11);ctx.lineTo(34,0);ctx.lineTo(36,17);ctx.fill();ctx.fillStyle='#ffe2a3';ctx.beginPath();ctx.arc(20,20,16,0,7);ctx.fill();ctx.fillStyle='#ed9144';ctx.beginPath();ctx.arc(20,18,14,Math.PI,0);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(16,21,3,0,7);ctx.arc(26,21,3,0,7);ctx.fill();ctx.fillStyle='#25445d';ctx.beginPath();ctx.arc(17,21,1.5,0,7);ctx.arc(27,21,1.5,0,7);ctx.fill();ctx.fillStyle='#e68c5b';ctx.beginPath();ctx.ellipse(21,27,4,3,0,0,7);ctx.fill();ctx.restore();
}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function loop(t){if(!running)return;let dt=Math.min((t-last)/16.67||1,2);last=t;if(!paused){if(keys.right){player.x+=4.1*dt}if(keys.left){player.x=Math.max(30,player.x-4.1*dt)}if(!player.onGround){player.vy+=.62*dt;player.y+=player.vy*dt;if(player.y>=ground-47){player.y=ground-47;player.vy=0;player.onGround=true}}
 const next=checkpoints[current];if(next!==undefined&&player.x>=next-50){paused=true;keys.left=keys.right=false;showQuestion()}
 // keep player near left third as the world scrolls
 world=Math.max(0,player.x-canvasW*.31);
 }draw();raf=requestAnimationFrame(loop)}
function begin(){cancelAnimationFrame(raf);score=correct=wrong=current=world=0;player={x:90,y:ground-47,vy:0,onGround:true};paused=false;running=true;scoreEl.textContent='0';progressEl.textContent='0/20';startScreen.classList.add('hidden');endScreen.classList.add('hidden');questionScreen.classList.add('hidden');last=performance.now();raf=requestAnimationFrame(loop)}
function showQuestion(){answered=false;const item=questions[current];document.getElementById('qNumber').textContent=`SOALAN ${current+1} / 20`;document.getElementById('questionText').textContent=item.q;const box=document.getElementById('answers');box.innerHTML='';document.getElementById('feedback').textContent='';document.getElementById('feedback').className='feedback';item.a.forEach((v,i)=>{const b=document.createElement('button');b.className='answer';b.innerHTML=`<b>${'ABCD'[i]}</b>${v}`;b.onclick=()=>answer(i,b);box.appendChild(b)});questionScreen.classList.remove('hidden')}
function answer(i,btn){if(answered)return;answered=true;const item=questions[current],buttons=[...document.querySelectorAll('.answer')],fb=document.getElementById('feedback');buttons.forEach(b=>b.disabled=true);if(i===item.c){score+=10;correct++;btn.classList.add('correct');fb.textContent='BETUL! 🎉';}else{wrong++;btn.classList.add('wrong');fb.textContent='SALAH ❌';fb.classList.add('bad')};scoreEl.textContent=score;progressEl.textContent=`${current+1}/20`;setTimeout(()=>{questionScreen.classList.add('hidden');current++;if(current>=questions.length){finish();return}paused=false;last=performance.now();raf=requestAnimationFrame(loop)},1250)}
function finish(){running=false;paused=true;document.getElementById('finalScore').textContent=score;document.getElementById('finalCorrect').textContent=correct;document.getElementById('finalWrong').textContent=wrong;document.getElementById('finalTotal').textContent=questions.length;document.getElementById('finalPercent').textContent=`${Math.round(correct/questions.length*100)}%`;endScreen.classList.remove('hidden')}
function jump(){if(running&&!paused&&player.onGround){player.vy=-12;player.onGround=false}}
function keyDown(e){if(['ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='ArrowLeft')keys.left=true;if(e.code==='ArrowRight')keys.right=true;if(e.code==='Space')jump()}
function keyUp(e){if(e.code==='ArrowLeft')keys.left=false;if(e.code==='ArrowRight')keys.right=false}
window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('blur',()=>{keys.left=keys.right=false});
function bindHold(id,dir){const el=document.getElementById(id);const on=e=>{e.preventDefault();if(dir==='jump')jump();else keys[dir]=true;el.classList.add('pressed');el.setPointerCapture?.(e.pointerId)};const off=e=>{if(dir!=='jump')keys[dir]=false;el.classList.remove('pressed')};el.addEventListener('pointerdown',on);['pointerup','pointercancel','lostpointercapture'].forEach(n=>el.addEventListener(n,off))}
bindHold('leftBtn','left');bindHold('rightBtn','right');bindHold('jumpBtn','jump');document.getElementById('startBtn').onclick=begin;document.getElementById('restartBtn').onclick=begin;

