/* ===================================================================
   LINEAR ALGEBRA - INTERACTIVE SIMULATIONS
   Chapter 3: Vectors, Linear Combinations, Span, Norms
   =================================================================== */

window.initLinAlg = true;

/* --- SHARED HELPERS --- */
function laGrid(ctx, W, H, cellPx, originX, originY) {
    ctx.save();
    ctx.strokeStyle = '#e8edf2';
    ctx.lineWidth = 1;
    for (let x = originX % cellPx; x < W; x += cellPx) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = originY % cellPx; y < H; y += cellPx) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(W, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, H); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px Arial';
    ctx.fillText('x', W - 12, originY - 6);
    ctx.fillText('y', originX + 5, 12);
    ctx.fillStyle = '#b0b8c8'; ctx.font = '10px Arial';
    for (let i = -10; i <= 10; i++) {
        if (i === 0) continue;
        let px = originX + i * cellPx;
        let py = originY + i * cellPx;
        if (px > 4 && px < W - 4) ctx.fillText(i, px - 4, originY + 14);
        if (py > 4 && py < H - 4) ctx.fillText(-i, originX + 4, py + 4);
    }
    ctx.restore();
}

function laArrow(ctx, ox, oy, dx, dy, color, label, lineWidth) {
    let ex = ox + dx, ey = oy + dy;
    let len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return;
    let ux = dx / len, uy = dy / len;
    let headLen = Math.min(14, len * 0.35);
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = lineWidth || 2.5;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - headLen * (ux - 0.4 * uy), ey - headLen * (uy + 0.4 * ux));
    ctx.lineTo(ex - headLen * (ux + 0.4 * uy), ey - headLen * (uy - 0.4 * ux));
    ctx.closePath(); ctx.fill();
    if (label) {
        ctx.font = 'bold 13px Arial';
        ctx.fillText(label, ex + 8, ey - 5);
    }
    ctx.restore();
}

/* --- 01: VECTORS & VECTOR SPACES --- */
window.initLAVectors = function () {
    const canvas = document.getElementById('la-v-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cellPx = 40;
    const ox = W / 2, oy = H / 2;

    const uxIn  = document.getElementById('la-v-ux'),  uyIn  = document.getElementById('la-v-uy');
    const vxIn  = document.getElementById('la-v-vx'),  vyIn  = document.getElementById('la-v-vy');
    const alpIn = document.getElementById('la-v-alpha');
    const showSum   = document.getElementById('la-v-show-sum');
    const showScale = document.getElementById('la-v-show-scale');
    const showPara  = document.getElementById('la-v-show-para');

    function fmtV(v) { return parseFloat(v).toFixed(1); }

    function draw() {
        let ux = parseFloat(uxIn.value), uy = -parseFloat(uyIn.value);
        let vx = parseFloat(vxIn.value), vy = -parseFloat(vyIn.value);
        let alpha = parseFloat(alpIn.value);
        document.getElementById('la-v-ux-val').innerText = fmtV(uxIn.value);
        document.getElementById('la-v-uy-val').innerText = fmtV(uyIn.value);
        document.getElementById('la-v-vx-val').innerText = fmtV(vxIn.value);
        document.getElementById('la-v-vy-val').innerText = fmtV(vyIn.value);
        document.getElementById('la-v-alpha-val').innerText = alpha.toFixed(2);

        ctx.clearRect(0, 0, W, H);
        laGrid(ctx, W, H, cellPx, ox, oy);

        let udx = ux * cellPx, udy = uy * cellPx;
        let vdx = vx * cellPx, vdy = vy * cellPx;

        if (showPara && showPara.checked && showSum && showSum.checked) {
            ctx.save();
            ctx.fillStyle = 'rgba(100,149,237,0.10)';
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(ox + udx, oy + udy);
            ctx.lineTo(ox + udx + vdx, oy + udy + vdy);
            ctx.lineTo(ox + vdx, oy + vdy);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = 'rgba(100,149,237,0.35)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 4]);
            ctx.beginPath(); ctx.moveTo(ox + udx, oy + udy); ctx.lineTo(ox + udx + vdx, oy + udy + vdy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ox + vdx, oy + vdy); ctx.lineTo(ox + udx + vdx, oy + udy + vdy); ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }

        if (showScale && showScale.checked) {
            laArrow(ctx, ox, oy, alpha * udx, alpha * udy, '#d97706', '\u03b1u', 2);
        }

        laArrow(ctx, ox, oy, udx, udy, '#2563eb', 'u', 3);
        laArrow(ctx, ox, oy, vdx, vdy, '#dc2626', 'v', 3);

        if (showSum && showSum.checked) {
            laArrow(ctx, ox, oy, udx + vdx, udy + vdy, '#059669', 'u+v', 3);
        }

        ctx.fillStyle = '#2563eb'; ctx.font = '12px Arial';
        ctx.fillText('u = (' + fmtV(uxIn.value) + ', ' + fmtV(uyIn.value) + ')', 10, 18);
        ctx.fillStyle = '#dc2626';
        ctx.fillText('v = (' + fmtV(vxIn.value) + ', ' + fmtV(vyIn.value) + ')', 10, 34);
        ctx.fillStyle = '#059669';
        ctx.fillText('u+v = (' + (parseFloat(uxIn.value)+parseFloat(vxIn.value)).toFixed(1) + ', ' + (parseFloat(uyIn.value)+parseFloat(vyIn.value)).toFixed(1) + ')', 10, 50);
        ctx.fillStyle = '#d97706';
        ctx.fillText('\u03b1u = (' + (alpha*parseFloat(uxIn.value)).toFixed(1) + ', ' + (alpha*parseFloat(uyIn.value)).toFixed(1) + ')', 10, 66);
    }

    const axioms = [
        'Closure under +', 'Closure under \u00b7',
        'Commutativity: u+v = v+u', 'Associativity: (u+v)+w = u+(v+w)',
        'Zero vector: u+0 = u', 'Additive inverse: u+(-u) = 0',
        'Distributivity: \u03b1(u+v) = \u03b1u+\u03b1v', 'Scalar assoc: \u03b1(\u03b2u) = (\u03b1\u03b2)u'
    ];
    const axiomsDiv = document.getElementById('la-v-axioms');
    if (axiomsDiv) {
        axiomsDiv.innerHTML = axioms.map(function(name) {
            return '<div style="display:flex;align-items:center;gap:0.4rem;padding:0.35rem 0.5rem;background:#f0fdf4;border:1px solid #86efac;border-radius:2px;font-size:0.75rem;"><span style="color:#16a34a;font-weight:700;">\u2713</span><span>' + name + '</span></div>';
        }).join('');
    }

    [uxIn, uyIn, vxIn, vyIn, alpIn, showSum, showScale, showPara].forEach(function(el) {
        if (el) el.addEventListener('input', draw);
        if (el) el.addEventListener('change', draw);
    });
    draw();
};

/* --- 02: LINEAR COMBINATIONS (2D / 3D DUAL MODE) --- */
window.initLALinCombo = function () {
    const btn2D = document.getElementById('la-lc-btn-2d');
    const btn3D = document.getElementById('la-lc-btn-3d');
    const controls2D = document.getElementById('la-lc-2d-controls');
    const controls3D = document.getElementById('la-lc-3d-controls');
    const canvas2D = document.getElementById('la-lc-canvas');
    const container3D = document.getElementById('la-lc-3d-container');

    let is3D = false;

    if (btn2D && btn3D) {
        btn2D.onclick = () => setMode(false);
        btn3D.onclick = () => setMode(true);
    }

    function setMode(to3D) {
        is3D = to3D;
        if (is3D) {
            if(btn3D) { btn3D.style.background = 'var(--accent)'; btn3D.style.color = '#fff'; }
            if(btn2D) { btn2D.style.background = 'transparent'; btn2D.style.color = 'var(--text)'; }
            if(controls2D) controls2D.style.display = 'none';
            if(controls3D) controls3D.style.display = 'block';
            if(canvas2D) canvas2D.style.display = 'none';
            if(container3D) container3D.style.display = 'block';
            if (!threeInitialized) initThreeJS();
            update3D();
        } else {
            if(btn2D) { btn2D.style.background = 'var(--accent)'; btn2D.style.color = '#fff'; }
            if(btn3D) { btn3D.style.background = 'transparent'; btn3D.style.color = 'var(--text)'; }
            if(controls2D) controls2D.style.display = 'block';
            if(controls3D) controls3D.style.display = 'none';
            if(canvas2D) canvas2D.style.display = 'block';
            if(container3D) container3D.style.display = 'none';
            draw2D();
        }
    }

    // --- 2D LOGIC ---
    const ctx2D = canvas2D ? canvas2D.getContext('2d') : null;
    const W2 = canvas2D ? canvas2D.width : 600, H2 = canvas2D ? canvas2D.height : 480;
    const cellPx = 44;
    const ox2 = W2 / 2, oy2 = H2 / 2;

    const v1xIn = document.getElementById('la-lc-v1x'), v1yIn = document.getElementById('la-lc-v1y');
    const v2xIn = document.getElementById('la-lc-v2x'), v2yIn = document.getElementById('la-lc-v2y');
    const c1In  = document.getElementById('la-lc-c1'),  c2In  = document.getElementById('la-lc-c2');
    const showSpan2 = document.getElementById('la-lc-show-span');
    const showComp2 = document.getElementById('la-lc-show-components');

    function draw2D() {
        if (!ctx2D) return;
        let v1x = parseFloat(v1xIn.value), v1y = -parseFloat(v1yIn.value);
        let v2x = parseFloat(v2xIn.value), v2y = -parseFloat(v2yIn.value);
        let c1  = parseFloat(c1In.value),  c2  = parseFloat(c2In.value);

        document.getElementById('la-lc-v1x-val').innerText = parseFloat(v1xIn.value).toFixed(1);
        document.getElementById('la-lc-v1y-val').innerText = parseFloat(v1yIn.value).toFixed(1);
        document.getElementById('la-lc-v2x-val').innerText = parseFloat(v2xIn.value).toFixed(1);
        document.getElementById('la-lc-v2y-val').innerText = parseFloat(v2yIn.value).toFixed(1);
        document.getElementById('la-lc-c1-val').innerText  = c1.toFixed(2);
        document.getElementById('la-lc-c2-val').innerText  = c2.toFixed(2);

        let rx = c1 * parseFloat(v1xIn.value) + c2 * parseFloat(v2xIn.value);
        let ry = c1 * parseFloat(v1yIn.value) + c2 * parseFloat(v2yIn.value);
        document.getElementById('la-lc-result').innerText = '( ' + rx.toFixed(2) + ', ' + ry.toFixed(2) + ' )';

        ctx2D.clearRect(0, 0, W2, H2);

        let det = v1x * v2y - v1y * v2x;
        let isPlane = Math.abs(det) > 0.001;
        let lineLen = Math.sqrt(v1x*v1x + v1y*v1y);

        if (showSpan2 && showSpan2.checked) {
            if (isPlane) {
                ctx2D.fillStyle = 'rgba(147,197,253,0.18)';
                ctx2D.fillRect(0, 0, W2, H2);
            } else if (lineLen > 0.01) {
                let nx = v1x / lineLen, ny = v1y / lineLen;
                let bigT = Math.max(W2, H2) * 3;
                ctx2D.save();
                ctx2D.strokeStyle = 'rgba(147,197,253,0.5)';
                ctx2D.lineWidth = 6;
                ctx2D.beginPath();
                ctx2D.moveTo(ox2 - bigT * nx, oy2 - bigT * ny);
                ctx2D.lineTo(ox2 + bigT * nx, oy2 + bigT * ny);
                ctx2D.stroke();
                ctx2D.restore();
            } else {
                ctx2D.beginPath();
                ctx2D.arc(ox2, oy2, 6, 0, 2 * Math.PI);
                ctx2D.fillStyle = 'rgba(147,197,253,0.7)';
                ctx2D.fill();
            }
        }

        laGrid(ctx2D, W2, H2, cellPx, ox2, oy2);

        laArrow(ctx2D, ox2, oy2, v1x * cellPx, v1y * cellPx, '#2563eb', 'v\u2081', 3);
        laArrow(ctx2D, ox2, oy2, v2x * cellPx, v2y * cellPx, '#dc2626', 'v\u2082', 3);

        let rdx = (c1*v1x + c2*v2x) * cellPx, rdy = (c1*v1y + c2*v2y) * cellPx;
        let c1dx = c1 * v1x * cellPx, c1dy = c1 * v1y * cellPx;
        let c2dx = c2 * v2x * cellPx, c2dy = c2 * v2y * cellPx;

        if (showComp2 && showComp2.checked) {
            laArrow(ctx2D, ox2, oy2, c1dx, c1dy, 'rgba(37,99,235,0.5)', '', 2);
            laArrow(ctx2D, ox2 + c1dx, oy2 + c1dy, c2dx, c2dy, 'rgba(220,38,38,0.5)', '', 2);
            ctx2D.save();
            ctx2D.setLineDash([4, 4]);
            ctx2D.strokeStyle = 'rgba(100,116,139,0.5)';
            ctx2D.lineWidth = 1;
            ctx2D.beginPath(); ctx2D.moveTo(ox2, oy2); ctx2D.lineTo(ox2 + c1dx, oy2 + c1dy); ctx2D.stroke();
            ctx2D.beginPath(); ctx2D.moveTo(ox2 + c1dx, oy2 + c1dy); ctx2D.lineTo(ox2 + c1dx + c2dx, oy2 + c1dy + c2dy); ctx2D.stroke();
            ctx2D.setLineDash([]);
            ctx2D.restore();
        }

        laArrow(ctx2D, ox2, oy2, rdx, rdy, '#059669', 'c\u2081v\u2081+c\u2082v\u2082', 3.5);

        ctx2D.font = '12px Arial'; ctx2D.fillStyle = '#1e293b';
        ctx2D.fillText('Span: ' + (isPlane ? '\u211d\u00b2 (full plane)' : (lineLen < 0.01 ? '{0} (point)' : 'line through origin')), 10, H2 - 14);
    }

    [v1xIn, v1yIn, v2xIn, v2yIn, c1In, c2In, showSpan2, showComp2].forEach(function(el) {
        if (el) {
            el.addEventListener('input', () => { if (!is3D) draw2D(); });
            el.addEventListener('change', () => { if (!is3D) draw2D(); });
        }
    });

    // --- 3D LOGIC ---
    let threeInitialized = false;
    let scene, camera, renderer, controls3D_obj;
    let arrowHelpers3D = [];
    let spanObject3D = null;
    let resultArrow3D = null;

    const ids3D = ['v1x', 'v1y', 'v1z', 'v2x', 'v2y', 'v2z', 'v3x', 'v3y', 'v3z', 'c1', 'c2', 'c3'];
    const inputs3D = {};
    ids3D.forEach(id => {
        inputs3D[id] = document.getElementById('la-lc3d-' + id);
        if (inputs3D[id]) {
            inputs3D[id].addEventListener('input', () => { if(is3D) update3D(); });
            inputs3D[id].addEventListener('change', () => { if(is3D) update3D(); });
        }
    });
    const showSpan3 = document.getElementById('la-lc3d-show-span');
    const showResult3 = document.getElementById('la-lc3d-show-result');
    if(showSpan3) showSpan3.addEventListener('change', () => { if(is3D) update3D(); });
    if(showResult3) showResult3.addEventListener('change', () => { if(is3D) update3D(); });

    const resultLabel3D = document.getElementById('la-lc3d-result');
    const spanLabel3D = document.getElementById('la-lc3d-span');

    function initThreeJS() {
        if (!container3D) return;
        container3D.innerHTML = '';
        const w3 = container3D.clientWidth || 600;
        const h3 = container3D.clientHeight || 480;

        scene = new THREE.Scene();
        scene.background = new THREE.Color('#ffffff'); // Set to pure white

        camera = new THREE.PerspectiveCamera(45, w3 / h3, 0.1, 100);
        camera.position.set(5, 4, 8);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(w3, h3);
        container3D.appendChild(renderer.domElement);

        controls3D_obj = new THREE.OrbitControls(camera, renderer.domElement);
        controls3D_obj.enableDamping = true;
        controls3D_obj.dampingFactor = 0.05;

        // Grid and Axes for white background
        const gridHelper = new THREE.GridHelper(10, 10, 0x94a3b8, 0xe2e8f0);
        gridHelper.position.y = -0.01; // Slightly lowered to avoid z-fighting with the plane
        scene.add(gridHelper);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(5, 10, 5);
        scene.add(dirLight);

        let animationId;
        function animate3D() {
            animationId = requestAnimationFrame(animate3D);
            if (is3D) {
                controls3D_obj.update();
                renderer.render(scene, camera);
            }
        }
        animate3D();

        window.addEventListener('resize', () => {
            if (is3D && container3D.clientWidth) {
                renderer.setSize(container3D.clientWidth, container3D.clientHeight);
                camera.aspect = container3D.clientWidth / container3D.clientHeight;
                camera.updateProjectionMatrix();
            }
        });

        threeInitialized = true;
    }

    function update3D() {
        if (!threeInitialized) return;

        // Clean up old objects
        arrowHelpers3D.forEach(ah => scene.remove(ah));
        arrowHelpers3D = [];
        if (spanObject3D) {
            scene.remove(spanObject3D);
            spanObject3D = null;
        }
        if (resultArrow3D) {
            scene.remove(resultArrow3D);
            resultArrow3D = null;
        }

        // Parse inputs
        let v1 = new THREE.Vector3(
            parseFloat(inputs3D.v1x.value) || 0,
            parseFloat(inputs3D.v1y.value) || 0,
            parseFloat(inputs3D.v1z.value) || 0
        );
        let v2 = new THREE.Vector3(
            parseFloat(inputs3D.v2x.value) || 0,
            parseFloat(inputs3D.v2y.value) || 0,
            parseFloat(inputs3D.v2z.value) || 0
        );
        let v3 = new THREE.Vector3(
            parseFloat(inputs3D.v3x.value) || 0,
            parseFloat(inputs3D.v3y.value) || 0,
            parseFloat(inputs3D.v3z.value) || 0
        );
        let c1 = parseFloat(inputs3D.c1.value) || 0;
        let c2 = parseFloat(inputs3D.c2.value) || 0;
        let c3 = parseFloat(inputs3D.c3.value) || 0;

        // Update labels
        document.getElementById('la-lc3d-c1-val').innerText = c1.toFixed(2);
        document.getElementById('la-lc3d-c2-val').innerText = c2.toFixed(2);
        document.getElementById('la-lc3d-c3-val').innerText = c3.toFixed(2);

        let res = new THREE.Vector3()
            .addScaledVector(v1, c1)
            .addScaledVector(v2, c2)
            .addScaledVector(v3, c3);
        
        if(resultLabel3D) {
            resultLabel3D.innerText = `( ${res.x.toFixed(2)}, ${res.y.toFixed(2)}, ${res.z.toFixed(2)} )`;
        }

        const origin = new THREE.Vector3(0, 0, 0);
        const addArrow = (v, color, width=0.12, headWidth=0.25) => {
            let length = v.length();
            if (length > 0.001) {
                let dir = v.clone().normalize();
                let arrow = new THREE.ArrowHelper(dir, origin, length, color, headWidth, width);
                scene.add(arrow);
                return arrow;
            }
            return null;
        };

        let a1 = addArrow(v1, 0xdc2626); if(a1) arrowHelpers3D.push(a1);
        let a2 = addArrow(v2, 0x2563eb); if(a2) arrowHelpers3D.push(a2);
        let a3 = addArrow(v3, 0x16a34a); if(a3) arrowHelpers3D.push(a3);

        if (showResult3 && showResult3.checked) {
            resultArrow3D = addArrow(res, 0x9333ea, 0.2, 0.35); // Purple result, slightly thicker
        }

        // Rank Calculation
        let det = v1.x * (v2.y * v3.z - v2.z * v3.y) -
                  v1.y * (v2.x * v3.z - v2.z * v3.x) +
                  v1.z * (v2.x * v3.y - v2.y * v3.x);

        let dim = 0;
        let basis = [];
        const eps = 1e-5;
        if (v1.lengthSq() > eps) { basis.push(v1); dim = 1; }
        if (v2.lengthSq() > eps) {
            if (dim === 0) { basis.push(v2); dim = 1; } 
            else {
                let cross = new THREE.Vector3().crossVectors(basis[0], v2);
                if (cross.lengthSq() > eps) { basis.push(v2); dim = 2; }
            }
        }
        if (v3.lengthSq() > eps) {
            if (dim === 0) { basis.push(v3); dim = 1; } 
            else if (dim === 1) {
                let cross = new THREE.Vector3().crossVectors(basis[0], v3);
                if (cross.lengthSq() > eps) { basis.push(v3); dim = 2; }
            } else if (dim === 2) {
                if (Math.abs(det) > eps) { basis.push(v3); dim = 3; }
            }
        }

        if (spanLabel3D) {
            if (dim === 0) { spanLabel3D.innerText = '{0} (Dim = 0)'; spanLabel3D.style.color = '#94a3b8'; }
            else if (dim === 1) { spanLabel3D.innerText = 'Line (Dim = 1)'; spanLabel3D.style.color = '#eab308'; }
            else if (dim === 2) { spanLabel3D.innerText = 'Plane (Dim = 2)'; spanLabel3D.style.color = '#06b6d4'; }
            else if (dim === 3) { spanLabel3D.innerText = 'Entire ℝ³ (Dim = 3)'; spanLabel3D.style.color = '#22c55e'; }
        }

        if (showSpan3 && showSpan3.checked) {
            if (dim === 1) {
                let dir = basis[0].clone().normalize().multiplyScalar(20);
                let material = new THREE.LineBasicMaterial({ color: 0x93c5fd, linewidth: 4, transparent: true, opacity: 0.6 });
                let geometry = new THREE.BufferGeometry().setFromPoints([dir.clone().negate(), dir]);
                spanObject3D = new THREE.Line(geometry, material);
                scene.add(spanObject3D);
            } else if (dim === 2) {
                let b1 = basis[0].clone().normalize();
                let b2 = basis[1].clone().normalize();
                let geometry = new THREE.PlaneGeometry(20, 20);
                let normal = new THREE.Vector3().crossVectors(b1, b2).normalize();
                
                let material = new THREE.MeshBasicMaterial({ 
                    color: 0x93c5fd, 
                    transparent: true, 
                    opacity: 0.25, // Slight boost for 3D visibility
                    side: THREE.DoubleSide,
                    depthWrite: false 
                });
                spanObject3D = new THREE.Mesh(geometry, material);
                // Rotate the plane's local Z-axis to align with the normal
                spanObject3D.lookAt(normal);
                scene.add(spanObject3D);
            } else if (dim === 3) {
                let geometry = new THREE.BoxGeometry(20, 20, 20);
                let material = new THREE.MeshBasicMaterial({ 
                    color: 0x93c5fd, 
                    transparent: true, 
                    opacity: 0.15,
                    side: THREE.DoubleSide,
                    depthWrite: false 
                });
                spanObject3D = new THREE.Mesh(geometry, material);
                scene.add(spanObject3D);
            }
        }
    }

    // Initial draw
    setMode(false);
};

/* --- 03: SPAN, BASIS & DIMENSION --- */
window.initLASpan = function () {
    const canvas = document.getElementById('la-sp-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cellPx = 44;
    const ox = W / 2, oy = H / 2;

    const v1cb = document.getElementById('la-sp-v1');
    const v2cb = document.getElementById('la-sp-v2');
    const v3cb = document.getElementById('la-sp-v3');
    const v3xIn = document.getElementById('la-sp-v3x'), v3yIn = document.getElementById('la-sp-v3y');
    const dimLabel   = document.getElementById('la-sp-dim-label');
    const basisLabel = document.getElementById('la-sp-basis-label');

    const VECS = [
        { x: 3, y: 1, color: '#e53e3e', label: 'v\u2081' },
        { x: 1, y: 3, color: '#3182ce', label: 'v\u2082' },
        { x: 2, y: 0, color: '#38a169', label: 'v\u2083' }
    ];

    function draw() {
        let use = [v1cb.checked, v2cb.checked, v3cb.checked];
        VECS[2].x = parseFloat(v3xIn.value);
        VECS[2].y = parseFloat(v3yIn.value);
        document.getElementById('la-sp-v3x-val').innerText = VECS[2].x.toFixed(1);
        document.getElementById('la-sp-v3y-val').innerText = VECS[2].y.toFixed(1);

        let active = VECS.filter(function(v, i) { return use[i]; });

        let basis = [];
        for (let j = 0; j < active.length; j++) {
            let v = active[j];
            if (basis.length === 0) {
                if (Math.abs(v.x) > 1e-9 || Math.abs(v.y) > 1e-9) basis.push([v.x, v.y]);
            } else if (basis.length === 1) {
                let b = basis[0];
                let det = b[0] * v.y - b[1] * v.x;
                if (Math.abs(det) > 1e-9) basis.push([v.x, v.y]);
            }
        }
        let dim = basis.length;
        if (active.length === 0) dim = 0;

        let spanText = dim === 2 ? '\u211d\u00b2  (dim = 2)' : dim === 1 ? 'Line  (dim = 1)' : '{0}  (dim = 0)';
        if (dimLabel) dimLabel.innerText = spanText;
        let usedLabels = VECS.filter(function(v, i) { return use[i]; }).map(function(v) { return v.label; });
        if (basisLabel) basisLabel.innerText = dim === 0 ? 'Basis: \u2205' : 'Active: {' + usedLabels.join(', ') + '}';

        ctx.clearRect(0, 0, W, H);

        if (dim === 2) {
            ctx.fillStyle = 'rgba(147,197,253,0.15)';
            ctx.fillRect(0, 0, W, H);
        } else if (dim === 1 && basis.length === 1) {
            let bx = basis[0][0], by = basis[0][1];
            let len = Math.sqrt(bx*bx + by*by);
            let nx = bx/len, ny = -by/len;
            let bigT = Math.max(W, H) * 3;
            ctx.save();
            ctx.strokeStyle = 'rgba(147,197,253,0.5)';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(ox - bigT*nx, oy - bigT*ny);
            ctx.lineTo(ox + bigT*nx, oy + bigT*ny);
            ctx.stroke();
            ctx.restore();
        } else if (dim === 0) {
            ctx.beginPath();
            ctx.arc(ox, oy, 8, 0, 2*Math.PI);
            ctx.fillStyle = 'rgba(147,197,253,0.6)';
            ctx.fill();
        }

        laGrid(ctx, W, H, cellPx, ox, oy);

        for (let i = 0; i < 3; i++) {
            if (!use[i]) continue;
            let v = VECS[i];
            laArrow(ctx, ox, oy, v.x * cellPx, -v.y * cellPx, v.color, v.label, 3.5);
        }

        ctx.font = 'bold 12px Arial'; ctx.fillStyle = '#1e293b';
        ctx.fillText('Span dimension: ' + dim, 10, H - 14);
    }

    [v1cb, v2cb, v3cb, v3xIn, v3yIn].forEach(function(el) {
        if (el) el.addEventListener('input', draw);
        if (el) el.addEventListener('change', draw);
    });
    draw();
};

/* --- 04: NORMS & UNIT BALLS --- */
window.initLANorms = function () {
    const canvas = document.getElementById('la-nm-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cellPx = 100;
    const ox = W / 2, oy = H / 2;

    const pIn   = document.getElementById('la-nm-p');
    const showAll = document.getElementById('la-nm-show-all');

    function lpNorm(x, y, p) {
        if (p >= 50) return Math.max(Math.abs(x), Math.abs(y));
        return Math.pow(Math.pow(Math.abs(x), p) + Math.pow(Math.abs(y), p), 1/p);
    }

    function drawBall(p, color, lineWidth, fillAlpha) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = fillAlpha > 0 ? 0.18 : 1;
        ctx.fillStyle = color;
        ctx.beginPath();
        let first = true;
        for (let deg = 0; deg <= 360; deg++) {
            let theta = (deg / 360) * 2 * Math.PI;
            let c = Math.abs(Math.cos(theta)), s = Math.abs(Math.sin(theta));
            let r;
            if (p >= 50) {
                r = 1 / Math.max(c, s + 1e-10);
            } else {
                r = 1 / Math.pow(Math.pow(c, p) + Math.pow(s, p), 1/p);
            }
            let px2 = ox + r * Math.cos(theta) * cellPx;
            let py2 = oy - r * Math.sin(theta) * cellPx;
            if (first) { ctx.moveTo(px2, py2); first = false; }
            else ctx.lineTo(px2, py2);
        }
        ctx.closePath();
        if (fillAlpha > 0) ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
        ctx.restore();
    }

    function draw() {
        let p = parseFloat(pIn.value);
        document.getElementById('la-nm-p-val').innerText = p >= 7.5 ? '\u221e' : p.toFixed(1);

        ctx.clearRect(0, 0, W, H);

        ctx.save();
        ctx.strokeStyle = '#e8edf2'; ctx.lineWidth = 1;
        for (let x = ox % cellPx; x < W; x += cellPx) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = oy % cellPx; y < H; y += cellPx) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.font = '11px Arial';
        ctx.fillText('1', ox + cellPx + 2, oy - 6);
        ctx.fillText('-1', ox - cellPx - 14, oy - 6);
        ctx.fillText('1', ox + 4, oy - cellPx - 2);
        ctx.fillText('-1', ox + 4, oy + cellPx + 12);
        ctx.restore();

        if (showAll && showAll.checked) {
            drawBall(1,  '#e53e3e', 1.5, 0.06);
            drawBall(2,  '#3182ce', 1.5, 0.06);
            drawBall(50, '#38a169', 1.5, 0.06);
        }

        let pColor = p <= 1.05 ? '#e67e22' : p <= 2.05 ? '#6366f1' : p >= 7.5 ? '#059669' : '#0ea5e9';
        drawBall(p >= 7.5 ? 50 : p, pColor, 3, 0.12);

        ctx.save();
        ctx.fillStyle = pColor; ctx.font = 'bold 13px Arial';
        let pLabel = p >= 7.5 ? 'L\u221e ball' : p <= 1.05 ? 'L\u00b9 ball' : p <= 2.05 ? 'L\u00b2 ball' : 'L^' + p.toFixed(1) + ' ball';
        ctx.fillText(pLabel, ox + cellPx * 0.72 + 6, oy - cellPx * 0.72);
        ctx.restore();


        if (showAll && showAll.checked) {
            let toSuper = str => str.split('').map(c => {
                const map = {'0':'\u2070','1':'\u00B9','2':'\u00B2','3':'\u00B3','4':'\u2074','5':'\u2075','6':'\u2076','7':'\u2077','8':'\u2078','9':'\u2079','.':'\u22C5'};
                return map[c] || c;
            }).join('');
            let pLabel = p >= 7.5 ? '\u221e' : toSuper(p.toFixed(1));
            let items = [
                ['L\u00b9 (diamond)', '#e53e3e'],
                ['L\u00b2 (circle)',  '#3182ce'],
                ['L\u221e (square)', '#38a169'],
                ['L' + pLabel + ' (current)', pColor]
            ];
            items.forEach(function(item, i) {
                ctx.fillStyle = item[1];
                ctx.fillRect(10, 12 + i * 18, 12, 12);
                ctx.fillStyle = '#1e293b'; ctx.font = '11px Arial';
                ctx.fillText(item[0], 28, 22 + i * 18);
            });
        }
    }

    [pIn, showAll].forEach(function(el) {
        if (el) el.addEventListener('input', draw);
        if (el) el.addEventListener('change', draw);
    });



    draw();
};

// ============================================================================
// LA 4: LINEAR TRANSFORMATIONS
// ============================================================================
window.initLATransforms = function() {
    const canvas = document.getElementById('la-tr-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cellPx = 50;
    const ox = W / 2, oy = H / 2;

    const inA = document.getElementById('la-tr-a');
    const inB = document.getElementById('la-tr-b');
    const inC = document.getElementById('la-tr-c');
    const inD = document.getElementById('la-tr-d');

    let currentM = [1, 0, 0, 1];
    let targetM = [1, 0, 0, 1];
    let animating = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function drawGrid(m) {
        ctx.clearRect(0, 0, W, H);
        const a = m[0], b = m[1], c = m[2], d = m[3];
        
        ctx.save();
        ctx.translate(ox, oy);
        
        ctx.lineWidth = 1;
        for (let i = -10; i <= 10; i++) {
            ctx.strokeStyle = i === 0 ? '#10b981' : '#e2e8f0';
            ctx.beginPath();
            ctx.moveTo((a*i - b*10) * cellPx, -(c*i - d*10) * cellPx);
            ctx.lineTo((a*i + b*10) * cellPx, -(c*i + d*10) * cellPx);
            ctx.stroke();

            ctx.strokeStyle = i === 0 ? '#ef4444' : '#e2e8f0';
            ctx.beginPath();
            ctx.moveTo((a*-10 + b*i) * cellPx, -(c*-10 + d*i) * cellPx);
            ctx.lineTo((a*10 + b*i) * cellPx, -(c*10 + d*i) * cellPx);
            ctx.stroke();
        }

        ctx.lineWidth = 3;
        laArrow(ctx, 0, 0, a * cellPx, -c * cellPx, '#10b981', '', 3);
        laArrow(ctx, 0, 0, b * cellPx, -d * cellPx, '#ef4444', '', 3);
        ctx.restore();
    }

    function animate() {
        let diff = 0;
        for (let i = 0; i < 4; i++) {
            currentM[i] += (targetM[i] - currentM[i]) * 0.1;
            diff += Math.abs(targetM[i] - currentM[i]);
        }
        drawGrid(currentM);
        if (diff > 0.01) {
            requestAnimationFrame(animate);
        } else {
            animating = false;
            currentM = [...targetM];
            drawGrid(currentM);
        }
    }

    function updateTarget() {
        targetM = [
            parseFloat(inA.value) || 0, parseFloat(inB.value) || 0,
            parseFloat(inC.value) || 0, parseFloat(inD.value) || 0
        ];
        if (!animating) { animating = true; requestAnimationFrame(animate); }
    }

    [inA, inB, inC, inD].forEach(el => el.addEventListener('input', updateTarget));

    function setPreset(m) {
        inA.value = m[0]; inB.value = m[1]; inC.value = m[2]; inD.value = m[3];
        updateTarget();
    }

    document.getElementById('la-tr-preset-ident').onclick = () => setPreset([1, 0, 0, 1]);
    document.getElementById('la-tr-preset-rot90').onclick = () => setPreset([0, -1, 1, 0]);
    document.getElementById('la-tr-preset-rot45').onclick = () => setPreset([0.7, -0.7, 0.7, 0.7]);
    document.getElementById('la-tr-preset-shear').onclick = () => setPreset([1, 1, 0, 1]);
    document.getElementById('la-tr-preset-scale').onclick = () => setPreset([2, 0, 0, 2]);
    document.getElementById('la-tr-preset-reflect').onclick = () => setPreset([0, 1, 1, 0]);

    drawGrid(currentM);
};

// ============================================================================
// LA 5: MATRIX MULTIPLICATION
// ============================================================================
window.initLAMultiply = function() {
    const canvas = document.getElementById('la-mul-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cellPx = 50;
    const ox = W / 2, oy = H / 2;

    const b11 = document.getElementById('la-mul-b11'), b12 = document.getElementById('la-mul-b12');
    const b21 = document.getElementById('la-mul-b21'), b22 = document.getElementById('la-mul-b22');
    const a11 = document.getElementById('la-mul-a11'), a12 = document.getElementById('la-mul-a12');
    const a21 = document.getElementById('la-mul-a21'), a22 = document.getElementById('la-mul-a22');
    const resDiv = document.getElementById('la-mul-result');

    let currentM = [1, 0, 0, 1];
    let animId = null;

    function drawGrid(m) {
        ctx.clearRect(0, 0, W, H);
        const a = m[0], b = m[1], c = m[2], d = m[3];
        ctx.save(); ctx.translate(ox, oy);
        
        ctx.lineWidth = 1;
        for (let i = -10; i <= 10; i++) {
            ctx.strokeStyle = i === 0 ? '#10b981' : '#e2e8f0';
            ctx.beginPath(); ctx.moveTo((a*i - b*10)*cellPx, -(c*i - d*10)*cellPx); ctx.lineTo((a*i + b*10)*cellPx, -(c*i + d*10)*cellPx); ctx.stroke();
            ctx.strokeStyle = i === 0 ? '#ef4444' : '#e2e8f0';
            ctx.beginPath(); ctx.moveTo((a*-10 + b*i)*cellPx, -(c*-10 + d*i)*cellPx); ctx.lineTo((a*10 + b*i)*cellPx, -(c*10 + d*i)*cellPx); ctx.stroke();
        }
        ctx.lineWidth = 3;
        laArrow(ctx, 0, 0, a * cellPx, -c * cellPx, '#10b981', '', 3);
        laArrow(ctx, 0, 0, b * cellPx, -d * cellPx, '#ef4444', '', 3);
        ctx.restore();
    }

    function updateResult() {
        const A = [parseFloat(a11.value)||0, parseFloat(a12.value)||0, parseFloat(a21.value)||0, parseFloat(a22.value)||0];
        const B = [parseFloat(b11.value)||0, parseFloat(b12.value)||0, parseFloat(b21.value)||0, parseFloat(b22.value)||0];
        const C = [
            A[0]*B[0] + A[1]*B[2], A[0]*B[1] + A[1]*B[3],
            A[2]*B[0] + A[3]*B[2], A[2]*B[1] + A[3]*B[3]
        ];
        resDiv.innerHTML = "<div>" + C[0].toFixed(1) + "</div><div>" + C[1].toFixed(1) + "</div><div>" + C[2].toFixed(1) + "</div><div>" + C[3].toFixed(1) + "</div>";
        return { A: A, B: B, C: C };
    }

    function animateSequence() {
        if (animId) cancelAnimationFrame(animId);
        const { B, C } = updateResult();
        let startTime = performance.now();
        
        function step(now) {
            let t = (now - startTime) / 1000;
            if (t < 1.0) {
                let ease = 0.5 - 0.5 * Math.cos(Math.PI * t);
                currentM = [1 + (B[0]-1)*ease, 0 + (B[1]-0)*ease, 0 + (B[2]-0)*ease, 1 + (B[3]-1)*ease];
            } else if (t < 1.5) {
                currentM = [...B];
            } else if (t < 2.5) {
                let ease = 0.5 - 0.5 * Math.cos(Math.PI * (t - 1.5));
                currentM = [B[0] + (C[0]-B[0])*ease, B[1] + (C[1]-B[1])*ease, B[2] + (C[2]-B[2])*ease, B[3] + (C[3]-B[3])*ease];
            } else {
                currentM = [...C];
                drawGrid(currentM);
                return;
            }
            drawGrid(currentM);
            animId = requestAnimationFrame(step);
        }
        animId = requestAnimationFrame(step);
    }

    [b11, b12, b21, b22, a11, a12, a21, a22].forEach(el => el.addEventListener('input', updateResult));
    document.getElementById('la-mul-play').onclick = animateSequence;
    document.getElementById('la-mul-reset').onclick = () => { if(animId) cancelAnimationFrame(animId); currentM = [1,0,0,1]; drawGrid(currentM); };

    updateResult();
    drawGrid(currentM);
};

// ============================================================================
// LA 6: DETERMINANTS
// ============================================================================
window.initLADeterminants = function() {
    const canvas = document.getElementById('la-det-canvas-2d');
    const container3d = document.getElementById('la-det-canvas-3d');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cellPx = 100;
    const ox = W / 2, oy = H / 2;

    let is3D = false;

    document.getElementById('la-det-mode-2d').onclick = function() { 
        is3D = false; 
        canvas.style.display = 'block'; container3d.style.display = 'none'; 
        document.getElementById('la-det-2d-inputs').style.display = 'block';
        document.getElementById('la-det-3d-inputs').style.display = 'none';
        this.style.background = '#3b82f6'; document.getElementById('la-det-mode-3d').style.background = '#64748b';
        update2D();
    };
    document.getElementById('la-det-mode-3d').onclick = function() { 
        is3D = true; 
        canvas.style.display = 'none'; container3d.style.display = 'block'; 
        document.getElementById('la-det-2d-inputs').style.display = 'none';
        document.getElementById('la-det-3d-inputs').style.display = 'block';
        this.style.background = '#3b82f6'; document.getElementById('la-det-mode-2d').style.background = '#64748b';
        if (!scene3d) init3D();
        update3D();
    };

    const a11 = document.getElementById('la-det-a11'), a12 = document.getElementById('la-det-a12');
    const a21 = document.getElementById('la-det-a21'), a22 = document.getElementById('la-det-a22');
    const valDisplay = document.getElementById('la-det-value');
    const msgDisplay = document.getElementById('la-det-message');

    function update2D() {
        if (is3D) return;
        const a = parseFloat(a11.value)||0, b = parseFloat(a12.value)||0, c = parseFloat(a21.value)||0, d = parseFloat(a22.value)||0;
        const det = a*d - b*c;
        
        valDisplay.innerText = det.toFixed(2);
        msgDisplay.innerText = det < 0 ? 'Negative Orientation (Flipped)' : (det === 0 ? 'Zero Area (Collapsed)' : 'Positive Orientation');
        msgDisplay.style.color = det < 0 ? '#ef4444' : (det === 0 ? '#f59e0b' : '#4ade80');

        ctx.clearRect(0, 0, W, H);
        ctx.save(); ctx.translate(ox, oy);

        ctx.lineWidth = 1; ctx.strokeStyle = '#e2e8f0';
        for (let i=-5; i<=5; i++) {
            ctx.beginPath(); ctx.moveTo(i*cellPx, -5*cellPx); ctx.lineTo(i*cellPx, 5*cellPx); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-5*cellPx, i*cellPx); ctx.lineTo(5*cellPx, i*cellPx); ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(a*cellPx, -c*cellPx);
        ctx.lineTo((a+b)*cellPx, -(c+d)*cellPx);
        ctx.lineTo(b*cellPx, -d*cellPx);
        ctx.closePath();
        ctx.fillStyle = det < 0 ? 'rgba(239,68,68,0.4)' : 'rgba(74,222,128,0.4)';
        ctx.fill();
        ctx.strokeStyle = det < 0 ? '#dc2626' : '#16a34a';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    [a11, a12, a21, a22].forEach(el => el.addEventListener('input', update2D));
    update2D();

    let scene3d, camera3d, renderer3d, cubeEdges, controls3d;
    function init3D() {
        scene3d = new THREE.Scene();
        scene3d.background = new THREE.Color(0xffffff);
        camera3d = new THREE.PerspectiveCamera(45, container3d.clientWidth / container3d.clientHeight, 0.1, 100);
        camera3d.position.set(3, 2, 4);
        camera3d.lookAt(0, 0, 0);

        renderer3d = new THREE.WebGLRenderer({ antialias: true });
        renderer3d.setSize(container3d.clientWidth, container3d.clientHeight);
        container3d.appendChild(renderer3d.domElement);

        let axes = new THREE.AxesHelper(3);
        scene3d.add(axes);

        let geo = new THREE.BoxGeometry(1, 1, 1);
        geo.translate(0.5, 0.5, 0.5); 
        let edges = new THREE.EdgesGeometry(geo);
        cubeEdges = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x4ade80, linewidth: 2 }));
        scene3d.add(cubeEdges);

        controls3d = new THREE.OrbitControls(camera3d, renderer3d.domElement);
        controls3d.target.set(0.5, 0.5, 0.5);
        
        function render() {
            if (is3D) {
                controls3d.update();
                renderer3d.render(scene3d, camera3d);
            }
            requestAnimationFrame(render);
        }
        render();
    }

    function update3D() {
        if (!is3D) return;
        const m = [];
        for (let i=1; i<=3; i++) {
            for (let j=1; j<=3; j++) {
                m.push(parseFloat(document.getElementById('la-det-m'+i+j).value)||0);
            }
        }
        let mat = new THREE.Matrix4();
        mat.set(
            m[0], m[1], m[2], 0,
            m[3], m[4], m[5], 0,
            m[6], m[7], m[8], 0,
            0,    0,    0,    1
        );
        cubeEdges.matrixAutoUpdate = false;
        cubeEdges.matrix.copy(mat);
        
        let det = mat.determinant();
        valDisplay.innerText = det.toFixed(2);
        msgDisplay.innerText = det < 0 ? 'Negative Volume (Flipped)' : (det === 0 ? 'Zero Volume (Collapsed)' : 'Positive Volume');
        msgDisplay.style.color = det < 0 ? '#ef4444' : (det === 0 ? '#f59e0b' : '#4ade80');
        cubeEdges.material.color.setHex(det < 0 ? 0xef4444 : 0x4ade80);
    }

    for (let i=1; i<=3; i++) {
        for (let j=1; j<=3; j++) {
            document.getElementById('la-det-m'+i+j).addEventListener('input', update3D);
        }
    }
};

// ============================================================================
// LA 7: INVERSE MATRICES
// ============================================================================
window.initLAInverse = function() {
    const canvas = document.getElementById('la-inv-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cellPx = 50;
    const ox = W / 2, oy = H / 2;

    const inA = [
        document.getElementById('la-inv-a11'), document.getElementById('la-inv-a12'),
        document.getElementById('la-inv-a21'), document.getElementById('la-inv-a22')
    ];
    const detDisplay = document.getElementById('la-inv-det');

    let currentM = [1, 0, 0, 1];
    let animId = null;

    function drawGrid(m) {
        ctx.clearRect(0, 0, W, H);
        const a = m[0], b = m[1], c = m[2], d = m[3];
        ctx.save(); ctx.translate(ox, oy);
        ctx.lineWidth = 1;
        for (let i = -10; i <= 10; i++) {
            ctx.strokeStyle = i === 0 ? '#10b981' : '#e2e8f0';
            ctx.beginPath(); ctx.moveTo((a*i - b*10)*cellPx, -(c*i - d*10)*cellPx); ctx.lineTo((a*i + b*10)*cellPx, -(c*i + d*10)*cellPx); ctx.stroke();
            ctx.strokeStyle = i === 0 ? '#ef4444' : '#e2e8f0';
            ctx.beginPath(); ctx.moveTo((a*-10 + b*i)*cellPx, -(c*-10 + d*i)*cellPx); ctx.lineTo((a*10 + b*i)*cellPx, -(c*10 + d*i)*cellPx); ctx.stroke();
        }
        ctx.lineWidth = 3;
        laArrow(ctx, 0, 0, a * cellPx, -c * cellPx, '#10b981', '', 3);
        laArrow(ctx, 0, 0, b * cellPx, -d * cellPx, '#ef4444', '', 3);
        ctx.restore();
    }

    function getA() {
        return [parseFloat(inA[0].value)||0, parseFloat(inA[1].value)||0, parseFloat(inA[2].value)||0, parseFloat(inA[3].value)||0];
    }

    function updateDet() {
        const A = getA();
        const det = A[0]*A[3] - A[1]*A[2];
        detDisplay.innerText = det.toFixed(2);
        detDisplay.style.color = det === 0 ? '#ef4444' : '#1e293b';
        return det;
    }

    inA.forEach(el => el.addEventListener('input', updateDet));

    function animateTo(target) {
        if (animId) cancelAnimationFrame(animId);
        let start = [...currentM];
        let startTime = performance.now();
        function step(now) {
            let t = (now - startTime) / 1000;
            if (t > 1.0) t = 1.0;
            let ease = 0.5 - 0.5 * Math.cos(Math.PI * t);
            for (let i = 0; i < 4; i++) currentM[i] = start[i] + (target[i] - start[i]) * ease;
            drawGrid(currentM);
            if (t < 1.0) animId = requestAnimationFrame(step);
        }
        animId = requestAnimationFrame(step);
    }

    document.getElementById('la-inv-btn-apply').onclick = () => { animateTo(getA()); updateDet(); };
    
    document.getElementById('la-inv-btn-undo').onclick = () => {
        if (Math.abs(updateDet()) < 0.001) {
            alert('Cannot invert! Determinant is 0. Information has been lost, so you cannot "undo" the transformation.');
        } else {
            animateTo([1, 0, 0, 1]);
        }
    };

    document.getElementById('la-inv-preset-collapse').onclick = () => {
        inA[0].value = 1; inA[1].value = 1; inA[2].value = 1; inA[3].value = 1;
        updateDet();
        animateTo([1, 1, 1, 1]);
    };

    updateDet();
    animateTo(getA());
};
