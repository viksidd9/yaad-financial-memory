import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch { return false; }
}

function makeGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,255,255,1)');
  g.addColorStop(.18,'rgba(83,190,255,.82)');
  g.addColorStop(.48,'rgba(37,131,216,.24)');
  g.addColorStop(1,'rgba(37,131,216,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,128,128);
  return new THREE.CanvasTexture(canvas);
}

function curveBetween(a,b,bend=.32) {
  const mid = a.clone().lerp(b,.5);
  mid.z += Math.max(0.35, a.distanceTo(b)*bend);
  return new THREE.QuadraticBezierCurve3(a,mid,b);
}

export function initFinancialMemoryScene(root) {
  if (!root || !supportsWebGL()) return null;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({alpha:true, antialias:true, powerPreference:'high-performance'}); }
  catch { return null; }
  const compact = root.dataset.threeVariant === 'mockup';
  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, innerWidth < 700 ? 1.2 : 1.75));
  renderer.domElement.setAttribute('aria-hidden','true');
  renderer.domElement.tabIndex=-1;
  root.appendChild(renderer.domElement);

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(compact?36:32,1,.1,100);
  camera.position.set(0,0,compact?11:12.8);
  const group=new THREE.Group(); scene.add(group);
  scene.add(new THREE.AmbientLight(0xffffff,1.8));
  const key=new THREE.PointLight(0x79d7ff,compact?18:26,40); key.position.set(3,4,7); scene.add(key);
  const rim=new THREE.PointLight(0x256fd8,compact?13:18,35); rim.position.set(-5,-2,4); scene.add(rim);

  const glow=makeGlowTexture();
  const positions={
    yaad:new THREE.Vector3(0,.1,.6), hdfc:new THREE.Vector3(-3.15,1.65,-.2), sbi:new THREE.Vector3(-2.55,-1.85,-.45),
    arjun:new THREE.Vector3(3.05,1.55,-.4), urban:new THREE.Vector3(2.7,-1.85,-.65)
  };
  if(compact){Object.values(positions).forEach(p=>p.multiplyScalar(.82));}
  const colors={yaad:0x1d84dc,hdfc:0x58c8ff,sbi:0x8fdfff,arjun:0x30a6ef,urban:0x67bff2};
  const nodes=[];
  Object.entries(positions).forEach(([name,pos])=>{
    const radius=name==='yaad'?(compact?.62:.76):(compact?.31:.38);
    const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(radius,3),new THREE.MeshPhysicalMaterial({color:colors[name],roughness:.18,metalness:.04,transparent:true,opacity:.94,clearcoat:1,clearcoatRoughness:.1}));
    mesh.position.copy(pos); mesh.userData.base=pos.clone(); mesh.userData.phase=Math.random()*Math.PI*2; mesh.userData.name=name; group.add(mesh); nodes.push(mesh);
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:colors[name],transparent:true,opacity:name==='yaad'?.34:.2,depthWrite:false}));
    sprite.position.copy(pos); const s=name==='yaad'?(compact?2.7:3.4):(compact?1.4:1.7); sprite.scale.set(s,s,1); group.add(sprite);
  });

  const relationships=[['hdfc','sbi',0x74d4ff],['yaad','arjun',0x2c9fe9],['yaad','urban',0x4999e8],['yaad','hdfc',0xa8e7ff]];
  relationships.forEach(([a,b,color],idx)=>{
    const curve=curveBetween(positions[a],positions[b],idx===0?.18:.28);
    const geometry=new THREE.TubeGeometry(curve,48,idx===0?.018:.012,5,false);
    const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:idx===0?.38:.27});
    group.add(new THREE.Mesh(geometry,mat));
  });
  const orbitMat=new THREE.MeshBasicMaterial({color:0x5cc8ff,transparent:true,opacity:.14,side:THREE.DoubleSide});
  [1.25,2.15,3.45].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.RingGeometry(r,r+.008,96),orbitMat.clone());ring.rotation.x=Math.PI/2+(i-.5)*.14;ring.rotation.y=(i-1)*.22;group.add(ring);});

  const starsCount=compact?55:95; const starPos=new Float32Array(starsCount*3);
  for(let i=0;i<starsCount;i++){starPos[i*3]=(Math.random()-.5)*11;starPos[i*3+1]=(Math.random()-.5)*7;starPos[i*3+2]=(Math.random()-.5)*6-1;}
  const starGeo=new THREE.BufferGeometry(); starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));
  const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0x8ddcff,size:compact?.025:.033,transparent:true,opacity:.52})); group.add(stars);

  let active=true, visible=true, destroyed=false, pointerX=0,pointerY=0, raf=0;
  const resize=()=>{const w=Math.max(1,root.clientWidth),h=Math.max(1,root.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  const onPointer=e=>{if(!finePointer.matches||reducedMotion.matches)return;const r=root.getBoundingClientRect();pointerX=((e.clientX-r.left)/r.width-.5);pointerY=((e.clientY-r.top)/r.height-.5);};
  const tick=t=>{if(destroyed)return;raf=requestAnimationFrame(tick);if(!active||!visible)return;const s=t*.001; if(!reducedMotion.matches){group.rotation.y+=(pointerX*.075-group.rotation.y)*.035;group.rotation.x+=(-pointerY*.045-group.rotation.x)*.035;nodes.forEach((n,i)=>{n.position.y=n.userData.base.y+Math.sin(s*.7+n.userData.phase)*(.055+i*.006);n.rotation.y=s*(.07+i*.009);});stars.rotation.z=s*.012;} renderer.render(scene,camera);};
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&reducedMotion.matches)renderer.render(scene,camera);},{rootMargin:'150px'}); io.observe(root);
  const onVisibility=()=>{active=!document.hidden;}; document.addEventListener('visibilitychange',onVisibility); root.addEventListener('pointermove',onPointer,{passive:true}); window.addEventListener('resize',resize,{passive:true});
  resize(); root.classList.add('webgl-ready'); renderer.render(scene,camera); if(!reducedMotion.matches)raf=requestAnimationFrame(tick);
  const onMotionChange=()=>{if(reducedMotion.matches){cancelAnimationFrame(raf);renderer.render(scene,camera);} else raf=requestAnimationFrame(tick);}; reducedMotion.addEventListener?.('change',onMotionChange);

  return {destroy(){destroyed=true;cancelAnimationFrame(raf);io.disconnect();document.removeEventListener('visibilitychange',onVisibility);root.removeEventListener('pointermove',onPointer);window.removeEventListener('resize',resize);reducedMotion.removeEventListener?.('change',onMotionChange);renderer.dispose();root.classList.remove('webgl-ready');renderer.domElement.remove();}};
}

function boot(){document.querySelectorAll('[data-three-scene]').forEach(root=>{try{initFinancialMemoryScene(root);}catch(err){console.warn('Yaad 3D fallback active',err);}});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
