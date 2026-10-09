// Viewer 3D kemasan kartu Toko Tangan Kanan (dieline v5, 57 × 22 × 89 mm).
// Geometri dibangun dari pola cutting; artwork ditempel sebagai satu tekstur.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Posisi dieline di dalam file artwork (pt) — hasil overlay PDF desain vs PDF cutting.
const ART = { w: 517.6, h: 458.1, ox: 96.4427, oy: 414.4385 }
const S = 0.0254 / 72 // pt → meter
const W = 161.57, D = 62.4, H = 252.28, Y0 = 58.98, YT = 311.26
const TUCK = [
  ['L', 351.62, 370.82], ['L', 354.76, 373.31],
  ['C', 360, 373.31, 365.02, 374.07, 364.78, 377.36],
  ['C', 360.15, 389.63, 354.61, 393.81, 347.35, 399.28],
  ['C', 341.65, 401.12, 336.63, 401.66, 327.86, 402.62],
  ['L', 247.83, 402.62],
  ['C', 239.06, 401.66, 234.04, 401.12, 228.34, 399.28],
  ['C', 221.08, 393.81, 215.6, 389.67, 212.08, 377.24],
]

// cards: { back: url, fronts: [url, ...], count = 50 } — fronts diulang bila kurang dari count
function roundedCardGeo(THREE, w, h, t, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 6 });
  g.translate(0, 0, -t / 2);
  const cap = g.groups[0].count, half = cap / 2, side = g.groups[1];
  g.clearGroups(); g.addGroup(0, half, 1); g.addGroup(half, half, 0); g.addGroup(side.start, side.count, 2);
  const pos = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < cap; i++) {
    const u = (pos.getX(i) + w / 2) / w, v = (pos.getY(i) + h / 2) / h;
    uv.setXY(i, pos.getZ(i) > 0 ? u : 1 - u, v);
  }
  return g;
}

export function createPackagingViewer(el, { texture, cards: cardOpts, background = null, onReady } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: background === null })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;cursor:grab'
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  if (background !== null) scene.background = new THREE.Color(background)
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 10)
  camera.position.set(0.17, 0.12, 0.24)

  scene.add(new THREE.HemisphereLight(0xffffff, 0xe9e5dc, 1.7))
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(0.25, 0.5, 0.35)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  Object.assign(key.shadow.camera, { left: -0.12, right: 0.12, top: 0.12, bottom: -0.12, near: 0.1, far: 1.5 })
  key.shadow.radius = 6
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xffffff, 0.5)
  fill.position.set(-0.4, 0.2, -0.3)
  scene.add(fill)

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ opacity: 0.14 }))
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, (H * S) / 2, 0)
  controls.enableDamping = true
  controls.enablePan = false
  controls.minDistance = 0.14
  controls.maxDistance = 0.55
  controls.maxPolarAngle = Math.PI / 2 - 0.04
  controls.update()

  const tex = new THREE.TextureLoader().load(texture, () => { needs = true; onReady?.() })
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
  const printMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 })
  const boardMat = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.9, side: THREE.BackSide })

  const v3 = (x, y, z) => new THREE.Vector3(x, y, z)
  const rect = (x0, y0, x1, y1) => poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]])
  function poly(pts) { const s = new THREE.Shape(); s.moveTo(...pts[0]); pts.slice(1).forEach(p => s.lineTo(...p)); s.closePath(); return s }

  // Petakan bentuk (koordinat dieline) ke bidang 3D: anchor → origin, +x → U, +y → V
  function panel(parent, shape, [ax, ay], origin, U, V, su = 1, sv = 1) {
    const g = new THREE.ShapeGeometry(shape, 24)
    const pos = g.attributes.position, uv = g.attributes.uv, p = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i)
      uv.setXY(i, (x + ART.ox) / ART.w, 1 - (ART.oy - y) / ART.h)
      p.copy(origin).addScaledVector(U, (x - ax) * S * su).addScaledVector(V, (y - ay) * S * sv)
      pos.setXYZ(i, p.x, p.y, p.z)
    }
    g.computeVertexNormals()
    const outer = new THREE.Mesh(g, printMat), inner = new THREE.Mesh(g, boardMat)
    outer.castShadow = true
    parent.add(outer, inner)
  }

  const w = W * S, d = D * S, h = H * S
  const box = new THREE.Group()
  const front = new THREE.Shape()
  front.moveTo(-16.87, Y0); front.lineTo(144.7, Y0); front.lineTo(144.7, YT); front.lineTo(85.18, YT)
  front.absarc(63.92, YT, 21.26, 0, Math.PI, true)
  front.lineTo(-16.87, YT); front.closePath()
  panel(box, front, [-16.87, Y0], v3(-w / 2, 0, d / 2), v3(1, 0, 0), v3(0, 1, 0))
  panel(box, rect(144.7, Y0, 207.06, YT), [144.7, Y0], v3(w / 2, 0, d / 2), v3(0, 0, -1), v3(0, 1, 0), D / 62.36)
  panel(box, rect(207.06, Y0, 368.63, YT), [207.06, Y0], v3(w / 2, 0, -d / 2), v3(-1, 0, 0), v3(0, 1, 0))
  panel(box, rect(-79.37, Y0, -16.87, YT), [-79.37, Y0], v3(-w / 2, 0, -d / 2), v3(0, 0, 1), v3(0, 1, 0), D / 62.5)
  panel(box, rect(-16.87, 0, 144.7, Y0), [-16.87, Y0], v3(-w / 2, 0, d / 2), v3(1, 0, 0), v3(0, 0, 1), 1, D / Y0)

  const dustL = new THREE.Group(); dustL.position.set(-w / 2, h, 0)
  panel(dustL, poly([[-79.37, YT], [-16.95, YT], [-17.96, 322.48], [-24.08, 328.02], [-28.21, 360.92], [-71.89, 360.92], [-71.89, 320.31]]),
    [-79.37, YT], v3(0, 0, -d / 2), v3(0, 0, 1), v3(0, 1, 0), D / 62.5)
  const dustR = new THREE.Group(); dustR.position.set(w / 2, h, 0)
  panel(dustR, poly([[144.7, YT], [207.06, YT], [199.58, 320.31], [199.58, 360.92], [156.05, 360.92], [151.92, 328.02], [145.8, 322.48]]),
    [144.7, YT], v3(0, 0, d / 2), v3(0, 0, -1), v3(0, 1, 0), D / 62.36)
  box.add(dustL, dustR)

  const lid = new THREE.Group(); lid.position.set(0, h, -d / 2)
  panel(lid, rect(207.06, YT, 368.63, 373.19), [207.06, YT], v3(w / 2, 0, 0), v3(-1, 0, 0), v3(0, 0, 1), 1, D / (373.19 - YT))
  const tuck = new THREE.Group(); tuck.position.set(0, 0, d)
  const ts = new THREE.Shape(); ts.moveTo(354.76, 373.19)
  for (const s of TUCK) s[0] === 'L' ? ts.lineTo(s[1], s[2]) : ts.bezierCurveTo(...s.slice(1))
  ts.lineTo(210.45, 373.19); ts.closePath()
  panel(tuck, ts, [207.06, 373.19], v3(w / 2, 0, -0.0012), v3(-1, 0, 0), v3(0, -1, 0))
  lid.add(tuck); box.add(lid)

  const disposables = []
  const cards = new THREE.Group()
  const CARD = { h: 0.085 }
  box.add(cards)
  if (cardOpts) {
    Object.assign(CARD, { count: cardOpts.count ?? 50, w: 0.055, h: 0.085, t: 0.00028, pitch: 0.00029 })
    const loadTex = url => { const t = new THREE.TextureLoader().load(url, () => { needs = true }); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); disposables.push(t); return t }
    const mat = o => { const m = new THREE.MeshStandardMaterial(o); disposables.push(m); return m }
    const edgeMat = mat({ color: 0xfbfaf7, roughness: 0.8 })
    const backMat = mat({ map: loadTex(cardOpts.back), roughness: 0.45 })
    const frontMats = (cardOpts.fronts ?? []).map(u => mat({ map: loadTex(u), roughness: 0.45 }))
    if (!frontMats.length) frontMats.push(edgeMat)
    const cardGeo = roundedCardGeo(THREE, CARD.w, CARD.h, CARD.t, 0.003)
    disposables.push(cardGeo)
    const z0 = -((CARD.count - 1) * CARD.pitch) / 2
    for (let i = 0; i < CARD.count; i++) {
      const m = new THREE.Mesh(cardGeo, [frontMats[i % frontMats.length], backMat, edgeMat])
      m.position.set(0, CARD.h / 2 + 0.0004, z0 + i * CARD.pitch)
      m.castShadow = true
      cards.add(m)
    }
  }
  scene.add(box)
  renderer.localClippingEnabled = true

  // Acak posisi kartu saat keluar: miring 5–10°, sebagian lebih tinggi (seeded → selalu sama)
  const clipLocal = { R: [new THREE.Plane(new THREE.Vector3(-1, 0, 0), w / 2), new THREE.Plane(new THREE.Vector3(0, 1, 0), -h)],
                      L: [new THREE.Plane(new THREE.Vector3(1, 0, 0), w / 2), new THREE.Plane(new THREE.Vector3(0, 1, 0), -h)] }
  const clipWorld = { R: clipLocal.R.map(p => p.clone()), L: clipLocal.L.map(p => p.clone()) }
  const syncClip = () => { box.updateMatrixWorld(); for (const k of ['R', 'L']) clipLocal[k].forEach((p, i) => clipWorld[k][i].copy(p).applyMatrix4(box.matrixWorld)) }
  const clipMats = new Map()
  const clipMat = (m, side) => { const key = m.uuid + side; if (!clipMats.has(key)) { const c = m.clone(); c.clippingPlanes = clipWorld[side]; c.clipIntersection = true; clipMats.set(key, c) } return clipMats.get(key) }
  let seed = 99
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  cards.children.forEach(m => {
    const r = rnd(), tilt = r < 0.55 || (r >= 0.8 && r < 0.92), lift = r >= 0.35 && r < 0.92
    const deg = tilt ? (5 + rnd() * 5) * (rnd() < 0.5 ? -1 : 1) : 0
    m.userData.tilt = THREE.MathUtils.degToRad(deg)
    m.userData.lift = lift ? 0.004 + rnd() * 0.01 : 0
    m.userData.y0 = m.position.y
    if (deg) { const side = deg > 0 ? 'R' : 'L'; m.material = m.material.map(x => clipMat(x, side)) }
  })
  syncClip()
  disposables.push(...clipMats.values())

  const ease = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
  function pose(k) {
    lid.rotation.x = -THREE.MathUtils.degToRad(112) * ease(Math.max(0, (k - 0.1) / 0.9))
    tuck.rotation.x = -THREE.MathUtils.degToRad(75) * ease(Math.min(1, k * 1.6))
    const dk = ease(Math.max(0, (k - 0.45) / 0.55))
    dustL.position.y = dustR.position.y = h - 0.0006 * (1 - dk)
    dustL.rotation.z = -Math.PI / 2 * (1 - dk) + 0.12 * dk
    dustR.rotation.z = Math.PI / 2 * (1 - dk) - 0.12 * dk
    const e = ease(Math.max(0, (k - 0.6) / 0.4))
    for (const m of cards.children) {
      const a = m.userData.tilt * e, dy = m.userData.y0 + (CARD.h * 0.5 + m.userData.lift) * e - h
      m.position.x = -dy * Math.sin(a); m.position.y = h + dy * Math.cos(a); m.rotation.z = a
    }
  }
  pose(0)

  let t = 0, target = 0, last = performance.now(), raf = 0, visible = true, needs = true
  controls.addEventListener('change', () => { needs = true })
  renderer.domElement.addEventListener('pointerdown', () => { renderer.domElement.style.cursor = 'grabbing' })
  window.addEventListener('pointerup', onUp)
  function onUp() { renderer.domElement.style.cursor = 'grab' }

  function resize() {
    const { clientWidth: cw, clientHeight: ch } = el
    if (!cw || !ch) return
    renderer.setSize(cw, ch, false)
    camera.aspect = cw / ch
    camera.updateProjectionMatrix()
    needs = true
  }
  const ro = new ResizeObserver(resize); ro.observe(el); resize()
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; needs = true }); io.observe(el)

  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    if (t !== target) {
      t = Math.max(0, Math.min(1, t + Math.sign(target - t) * dt / 1.6))
      if (Math.abs(t - target) < 1e-3) t = target
      pose(t); needs = true
    }
    if (controls.update()) needs = true
    if (visible && needs) { renderer.render(scene, camera); needs = false }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  return {
    toggleLid() { target = target ? 0 : 1; return target === 1 },
    setOpen(open) { target = open ? 1 : 0 },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); controls.dispose()
      window.removeEventListener('pointerup', onUp)
      scene.traverse(o => o.geometry?.dispose())
      disposables.forEach(x => x.dispose())
      tex.dispose(); printMat.dispose(); boardMat.dispose(); renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
