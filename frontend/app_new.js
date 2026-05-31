// ═══════════════ CH 08: RELATIVE VELOCITY (BOAT) ═══════════════
let rvAnimId;
function initRelativeVel() {
    if (rvAnimId) cancelAnimationFrame(rvAnimId);

    const canvas = document.getElementById('rv-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const wrap = canvas.parentElement;
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
    }
    resize();

    let t = 0;
    let isMoving = false;
    let isPaused = false;
    let trail = [];

    const outVnet = document.getElementById('rv-out-vnet');
    const outAng = document.getElementById('rv-out-ang');
    const outT = document.getElementById('rv-out-t');
    const outX = document.getElementById('rv-out-x');

    function drawArrow(x0, y0, x1, y1, color, label, showVals, valText) {
        const dx = x1 - x0, dy = y1 - y0;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 2) return;
        const ux = dx / len, uy = dy / len;
        const hl = Math.min(8, len * 0.3);

        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux * hl, y1 - uy * hl); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - ux * hl - uy * hl * 0.4, y1 - uy * hl + ux * hl * 0.4);
        ctx.lineTo(x1 - ux * hl + uy * hl * 0.4, y1 - uy * hl - ux * hl * 0.4);
        ctx.closePath(); ctx.fill();

        if (showVals) {
            ctx.font = 'bold 12px Arial';
            ctx.fillText(label + (valText ? ' (' + valText + ')' : ''), x0 + dx/2 + 5, y0 + dy/2 - 5);
        }
    }

    function animateBoat(W, H) {
        const vb = parseFloat(document.getElementById('rv-vb').value);
        const vr = parseFloat(document.getElementById('rv-vr').value);
        const thetaDeg = parseFloat(document.getElementById('rv-theta').value);
        const theta = thetaDeg * Math.PI / 180;
        const showVals = document.getElementById('rv-show-vals').checked;

        const vy = vb * Math.cos(theta); // Across the river
        const vx = vr + vb * Math.sin(theta); // Downstream

        const vnet = Math.sqrt(vx * vx + vy * vy);
        const netAng = Math.atan2(vy, vx) * 180 / Math.PI;
        
        const riverW = 100;
        const totalT = vy > 0 ? riverW / vy : 9999;
        
        const bankTopY = H * 0.15;
        const bankBotY = H * 0.85;
        const riverHeight = bankBotY - bankTopY;
        const sc = riverHeight / riverW;
        
        const originX = W * 0.15;
        const originY = bankBotY;

        ctx.fillStyle = '#f5f5f5'; 
        ctx.fillRect(0, 0, W, bankTopY);
        ctx.fillRect(0, bankBotY, W, H - bankBotY);
        
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(0, bankTopY, W, riverHeight);

        ctx.strokeStyle = '#d0d0d0'; ctx.lineWidth = 1;
        ctx.beginPath();
        for (let m = 0; m <= riverW; m += 10) {
            const my = originY - m * sc;
            ctx.moveTo(originX - 10, my); ctx.lineTo(originX + 10, my);
        }
        ctx.stroke();

        ctx.fillStyle = '#222'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'right';
        ctx.fillText('0m', originX - 15, originY + 5);
        ctx.fillText('100m', originX - 15, originY - riverW * sc + 5);

        ctx.strokeStyle = '#bae6fd'; ctx.lineWidth = 2;
        const timeOffset = Date.now() / 1000;
        for(let i=0; i<5; i++) {
            const ly = bankTopY + riverHeight * 0.2 * (i+0.5);
            const lx = ((timeOffset * vr * 10) + i*100) % W;
            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 40, ly); ctx.stroke();
        }

        if (isMoving && !isPaused) {
            if (t < totalT) {
                t += 0.008; 
                if (t >= totalT) t = totalT;
                trail.push({ x: originX + (vx * t) * sc, y: originY - (vy * t) * sc });
            }
        }

        const currentX = originX + (vx * t) * sc;
        const currentY = originY - (vy * t) * sc;

        outVnet.textContent = vnet.toFixed(2);
        outAng.textContent = (90 - netAng).toFixed(1);
        outT.textContent = (isMoving ? t : 0).toFixed(2);
        outX.textContent = (isMoving ? (vx * t) : 0).toFixed(2);

        if (trail.length > 1) {
            ctx.strokeStyle = '#c62828'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);
            for(let i=1; i<trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.rotate(-Math.PI/2 + theta);
        
        ctx.fillStyle = '#e65100';
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.quadraticCurveTo(0, 10, -12, 7);
        ctx.lineTo(-12, -7);
        ctx.quadraticCurveTo(0, -10, 18, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        if (t < totalT || !isMoving) {
            ctx.save();
            ctx.translate(currentX, currentY);
            ctx.rotate(0);
            const scaleV = 8;
            const bVx = vb * Math.sin(theta) * scaleV;
            const bVy = -vb * Math.cos(theta) * scaleV;
            ctx.textAlign = 'left';
            drawArrow(0, 0, bVx, bVy, '#c62828', 'vb', showVals, vb.toFixed(1));
            const rVx = vr * scaleV;
            drawArrow(bVx, bVy, bVx + rVx, bVy, '#1565c0', 'vr', showVals, vr.toFixed(1));
            drawArrow(0, 0, bVx + rVx, bVy, '#2e7d32', 'vnet', showVals, vnet.toFixed(1));
            ctx.restore();
        }
    }

    function animate() {
        if (!document.getElementById('page-relative-vel').classList.contains('active-page')) return;
        resize();
        const W = canvas.width, H = canvas.height;
        if (W === 0 || H === 0) { rvAnimId = requestAnimationFrame(animate); return; }
        ctx.clearRect(0, 0, W, H);

        animateBoat(W, H);

        rvAnimId = requestAnimationFrame(animate);
    }

    document.getElementById('rv-start').addEventListener('click', () => {
        t = 0; trail = []; isMoving = true; isPaused = false;
        document.getElementById('rv-pause').textContent = 'Pause';
    });
    document.getElementById('rv-pause').addEventListener('click', () => {
        if (!isMoving) return; isPaused = !isPaused;
        document.getElementById('rv-pause').textContent = isPaused ? 'Resume' : 'Pause';
    });
    document.getElementById('rv-reset').addEventListener('click', () => {
        t = 0; trail = []; isMoving = false; isPaused = false;
        document.getElementById('rv-pause').textContent = 'Pause';
    });

    ['rv-vb', 'rv-vr', 'rv-theta'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => {
            document.getElementById('rv-auto-msg').style.display = 'none';
            if (!isMoving) { requestAnimationFrame(animate); }
        });
    });

    document.getElementById('rv-auto-ang').addEventListener('click', () => {
        const vb = parseFloat(document.getElementById('rv-vb').value);
        const vr = parseFloat(document.getElementById('rv-vr').value);
        const msg = document.getElementById('rv-auto-msg');
        if (vb <= vr) {
            msg.textContent = 'Impossible! vb ('+vb+') must be > vr ('+vr+').';
            msg.style.display = 'block';
        } else {
            msg.style.display = 'none';
            const deg = Math.asin(-vr / vb) * 180 / Math.PI;
            document.getElementById('rv-theta').value = Math.round(deg);
            document.getElementById('rv-theta-val').textContent = Math.round(deg);
            if (!isMoving) requestAnimationFrame(animate);
        }
    });

    document.getElementById('rv-auto-vb').addEventListener('click', () => {
        const vr = parseFloat(document.getElementById('rv-vr').value);
        const thetaDeg = parseFloat(document.getElementById('rv-theta').value);
        const theta = thetaDeg * Math.PI / 180;
        const msg = document.getElementById('rv-auto-msg');
        if (theta >= 0 && vr > 0) {
            msg.textContent = 'Must aim upstream (- angle)!';
            msg.style.display = 'block';
        } else if (vr === 0) {
            msg.style.display = 'none';
            document.getElementById('rv-theta').value = 0;
            document.getElementById('rv-theta-val').textContent = 0;
            if (!isMoving) requestAnimationFrame(animate);
        } else {
            msg.style.display = 'none';
            const requiredVb = -vr / Math.sin(theta);
            if (requiredVb > 10) {
                msg.textContent = `Need vb=${requiredVb.toFixed(1)} m/s (> max).`;
                msg.style.display = 'block';
            } else {
                document.getElementById('rv-vb').value = requiredVb.toFixed(1);
                document.getElementById('rv-vb-val').textContent = requiredVb.toFixed(1);
                if (!isMoving) requestAnimationFrame(animate);
            }
        }
    });

    animate();
}

// ═══════════════ CH 09: CAR CHASE (1D) ═══════════════
let ccAnimId;
function initCarChase() {
    if (ccAnimId) cancelAnimationFrame(ccAnimId);

    const canvas = document.getElementById('cc-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // We will initialize Three.js inside here if 'pov' view is selected
    let renderer, scene, camera, meshA, meshB, road, lines;
    let is3DInitialized = false;

    function resize() {
        const wrap = canvas.parentElement;
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
        if (is3DInitialized && renderer) {
            renderer.setSize(wrap.clientWidth, wrap.clientHeight);
            camera.aspect = wrap.clientWidth / wrap.clientHeight;
            camera.updateProjectionMatrix();
        }
    }
    resize();

    let t = 0;
    let isMoving = false;
    let isPaused = false;

    function getMode() {
        const viewEl = document.querySelector('input[name="cc_view"]:checked');
        return viewEl ? viewEl.value : 'top';
    }

    function init3D(W, H) {
        if (is3DInitialized) return;
        if (typeof THREE === 'undefined') return; // Wait for Three.js
        
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(W, H);
        renderer.setClearColor(0x87CEEB); // Sky color

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x87CEEB, 10, 500);

        camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 1000);
        // Camera will be placed inside Car A

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(100, 200, 50);
        scene.add(dirLight);

        // Ground
        const groundGeo = new THREE.PlaneGeometry(2000, 2000);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x3d8c40 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        scene.add(ground);

        // Road
        const roadGeo = new THREE.PlaneGeometry(12, 2000);
        const roadMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
        road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        scene.add(road);

        // Road lines
        const linesGeo = new THREE.PlaneGeometry(0.5, 2000);
        const linesMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        lines = new THREE.Mesh(linesGeo, linesMat);
        lines.rotation.x = -Math.PI / 2;
        lines.position.y = 0.01;
        scene.add(lines);

        // Car B
        const carGeo = new THREE.BoxGeometry(2, 1.5, 4.5);
        const carBMat = new THREE.MeshLambertMaterial({ color: 0x1565c0 });
        meshB = new THREE.Mesh(carGeo, carBMat);
        meshB.position.y = 0.75;
        scene.add(meshB);

        is3DInitialized = true;
    }

    function animateTopView(W, H, vA, vB, d0, showVals) {
        // Road
        ctx.fillStyle = '#333';
        ctx.fillRect(0, H/2 - 40, W, 80);
        
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.setLineDash([20, 20]);
        ctx.beginPath();
        const roadOffset = isMoving ? (t * vA * 5) % 40 : 0;
        ctx.moveTo(0 - roadOffset, H/2);
        ctx.lineTo(W, H/2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Car A (Red)
        const scaleX = 2; // px per meter
        const carAw = 40, carAh = 20;
        const xA = 50 + vA * t * scaleX;
        
        // Wrap around camera
        let camOffset = 0;
        if (xA > W * 0.3) {
            camOffset = xA - W * 0.3;
        }
        
        const drawXA = xA - camOffset;
        ctx.fillStyle = '#c62828';
        ctx.fillRect(drawXA, H/2 + 5, carAw, carAh);
        
        // Car B (Blue)
        const xB = 50 + d0 * scaleX + vB * t * scaleX;
        const drawXB = xB - camOffset;
        
        if (drawXB < W + 100) {
            ctx.fillStyle = '#1565c0';
            ctx.fillRect(drawXB, H/2 + 5, carAw, carAh);
            
            if (showVals) {
                // Separation line
                if (drawXB > drawXA + carAw) {
                    ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(drawXA + carAw/2, H/2 + 35);
                    ctx.lineTo(drawXB + carAw/2, H/2 + 35);
                    ctx.stroke();
                    ctx.fillStyle = '#222'; ctx.font = '12px Arial'; ctx.textAlign = 'center';
                    ctx.fillText('Gap: ' + (xB - xA)/scaleX + ' m', (drawXA + drawXB + carAw)/2, H/2 + 48);
                }
            }
        }
        
        if (showVals) {
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.textAlign = 'center';
            ctx.fillText('vA='+vA, drawXA + carAw/2, H/2 + 18);
            if (drawXB < W) ctx.fillText('vB='+vB, drawXB + carAw/2, H/2 + 18);
        }
    }

    function animatePOV(W, H, vA, vB, d0) {
        if (typeof THREE === 'undefined') {
            ctx.fillStyle = '#f5f5f5'; ctx.fillRect(0,0,W,H);
            ctx.fillStyle = '#222'; ctx.font = '16px Arial'; ctx.fillText('Loading 3D...', W/2, H/2);
            return;
        }
        if (!is3DInitialized) init3D(W, H);

        const posA = vA * t;
        const posB = d0 + vB * t;
        
        // Camera inside Car A
        camera.position.set(0, 1.2, posA);
        
        // Car B in front
        meshB.position.z = posB;
        
        // Move road texture logic
        lines.position.z = camera.position.z - (camera.position.z % 2);

        renderer.render(scene, camera);

        // HUD overlay via canvas 2D would require a separate canvas, but we'll just let HTML handle readouts
        // Actually since we use the same canvas, ThreeJS took over the WebGL context.
        // We cannot easily mix 2D context and WebGL context on the SAME canvas.
        // I will draw HUD in HTML or just rely on the table below.
    }

    function animate() {
        if (!document.getElementById('page-carchase').classList.contains('active-page')) return;
        
        const viewMode = getMode();
        const W = canvas.width, H = canvas.height;
        
        if (viewMode === 'top') {
            if (is3DInitialized) {
                // If switching from WebGL to 2D, we might need to recreate the canvas!
                // WebGL contexts cannot be converted back to 2D easily.
                // Let's force a page reload of context if needed, or simply recreate canvas element:
                const wrap = canvas.parentElement;
                const newCanvas = document.createElement('canvas');
                newCanvas.id = 'cc-canvas';
                wrap.replaceChild(newCanvas, canvas);
                initCarChase(); // re-init entirely to grab new 2D context
                return;
            }
            resize();
            ctx.clearRect(0, 0, W, H);
            
            const vA = parseFloat(document.getElementById('cc-va').value);
            const vB = parseFloat(document.getElementById('cc-vb').value);
            const d0 = parseFloat(document.getElementById('cc-d0').value);
            const showVals = document.getElementById('cc-show-vals').checked;
            
            animateTopView(W, H, vA, vB, d0, showVals);
        } else {
            // POV (WebGL)
            if (!is3DInitialized) {
                // WebGL needs its context. Recreate canvas if it was 2D.
                if (ctx) {
                    const wrap = canvas.parentElement;
                    const newCanvas = document.createElement('canvas');
                    newCanvas.id = 'cc-canvas';
                    wrap.replaceChild(newCanvas, canvas);
                    initCarChase();
                    return;
                }
            }
            const vA = parseFloat(document.getElementById('cc-va').value);
            const vB = parseFloat(document.getElementById('cc-vb').value);
            const d0 = parseFloat(document.getElementById('cc-d0').value);
            
            animatePOV(W, H, vA, vB, d0);
        }

        const vA = parseFloat(document.getElementById('cc-va').value);
        const vB = parseFloat(document.getElementById('cc-vb').value);
        const d0 = parseFloat(document.getElementById('cc-d0').value);
        
        const vrel = vA - vB;
        const gap = d0 - vrel * t;
        const tc = vA > vB ? d0 / vrel : Infinity;

        if (isMoving && !isPaused) {
            t += 0.02;
            if (t >= tc && tc > 0) t = tc; // Catch happens
        }

        document.getElementById('cc-out-vrel').textContent = vrel.toFixed(1);
        document.getElementById('cc-out-gap').textContent = Math.max(0, gap).toFixed(1);
        document.getElementById('cc-out-t').textContent = t.toFixed(2);
        document.getElementById('cc-out-tc').textContent = tc === Infinity ? 'Never' : tc.toFixed(1);

        ccAnimId = requestAnimationFrame(animate);
    }

    document.getElementById('cc-start').addEventListener('click', () => {
        t = 0; isMoving = true; isPaused = false;
        document.getElementById('cc-pause').textContent = 'Pause';
    });
    document.getElementById('cc-pause').addEventListener('click', () => {
        if (!isMoving) return; isPaused = !isPaused;
        document.getElementById('cc-pause').textContent = isPaused ? 'Resume' : 'Pause';
    });
    document.getElementById('cc-reset').addEventListener('click', () => {
        t = 0; isMoving = false; isPaused = false;
        document.getElementById('cc-pause').textContent = 'Pause';
    });
    
    document.querySelectorAll('input[name="cc_view"]').forEach(r => {
        r.addEventListener('change', () => {
            // View change handled inside loop
        });
    });

    animate();
}

// ═══════════════ CH 10: RAIN & UMBRELLA ═══════════════
let rmAnimId;
function initRainMan() {
    if (rmAnimId) cancelAnimationFrame(rmAnimId);

    const canvas = document.getElementById('rm-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const wrap = canvas.parentElement;
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
    }
    resize();

    let t = 0;
    let isMoving = false;
    let isPaused = false;

    function getMode() {
        const viewEl = document.querySelector('input[name="rm_view"]:checked');
        return viewEl ? viewEl.value : 'side';
    }

    function drawArrow(x0, y0, x1, y1, color, label, showVals, valText) {
        const dx = x1 - x0, dy = y1 - y0;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 2) return;
        const ux = dx / len, uy = dy / len;
        const hl = Math.min(8, len * 0.3);

        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux * hl, y1 - uy * hl); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - ux * hl - uy * hl * 0.4, y1 - uy * hl + ux * hl * 0.4);
        ctx.lineTo(x1 - ux * hl + uy * hl * 0.4, y1 - uy * hl - ux * hl * 0.4);
        ctx.closePath(); ctx.fill();

        if (showVals && label) {
            ctx.font = 'bold 12px Arial';
            ctx.fillText(label + (valText ? ' (' + valText + ')' : ''), x1 + 5, y1);
        }
    }

    function animateSideView(W, H, vm, vr, windAngDeg, showVals) {
        const windAng = windAngDeg * Math.PI / 180;
        
        // vr vector (rain relative to earth)
        const vrx = vr * Math.sin(windAng);
        const vry = vr * Math.cos(windAng);

        const vmx = vm;
        const vmy = 0;

        const vrmx = vrx - vmx;
        const vrmy = vry - vmy;

        const vrm = Math.sqrt(vrmx * vrmx + vrmy * vrmy);
        const umbrellaAng = Math.atan2(-vrmx, vrmy) * 180 / Math.PI;

        document.getElementById('rm-out-vrm').textContent = vrm.toFixed(2);
        document.getElementById('rm-out-uang').textContent = umbrellaAng.toFixed(1);

        ctx.fillStyle = '#f5f5f5'; ctx.fillRect(0, H*0.8, W, H*0.2);
        ctx.strokeStyle = '#d0d0d0'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, H*0.8); ctx.lineTo(W, H*0.8); ctx.stroke();
        
        if (isMoving && !isPaused) t += 0.05;

        // Rain
        ctx.strokeStyle = '#1565c0'; ctx.lineWidth = 1;
        const dropSpacing = 40;
        for (let x = -W; x < W*2; x += dropSpacing) {
            for (let y = -H; y < H; y += dropSpacing) {
                const rx = x + vrx * (t*30); 
                const ry = y + vry * (t*30);
                const wrx = ((rx % (W*2)) + W*2) % (W*2) - 50;
                const wry = ((ry % (H*1.5)) + H*1.5) % (H*1.5) - 50;
                
                ctx.beginPath();
                ctx.moveTo(wrx, wry);
                ctx.lineTo(wrx + vrx*2, wry + vry*2);
                ctx.stroke();
            }
        }

        // Person
        const manSc = H * 0.15;
        const px = W/2;
        const py = H*0.8;
        
        const bob = isMoving ? Math.abs(Math.sin(t * vm * 0.5)) * 10 : 0;
        
        ctx.save();
        ctx.translate(px, py - bob);
        
        if(vm > 0 || vr > 0) {
            const sV = 10;
            drawArrow(0, -manSc/2, vmx*sV, -manSc/2, '#c62828', 'vm', showVals, vm.toFixed(1));
            drawArrow(vmx*sV, -manSc/2, vmx*sV + vrx*sV, -manSc/2 + vry*sV, '#1565c0', 'vr', showVals, vr.toFixed(1));
            drawArrow(0, -manSc/2, vrmx*sV, -manSc/2 + vrmy*sV, '#2e7d32', 'vrm', showVals, vrm.toFixed(1));
        }

        // Stick figure
        ctx.strokeStyle = '#222'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, -manSc * 0.6); // Body
        // Legs
        if (isMoving) {
            const legSwing = Math.sin(t * vm * 0.5) * 20;
            ctx.moveTo(0, -manSc*0.6); ctx.lineTo(-10 - legSwing, 0);
            ctx.moveTo(0, -manSc*0.6); ctx.lineTo(-10 + legSwing, 0);
        } else {
            ctx.moveTo(0, -manSc*0.6); ctx.lineTo(-10, 0);
            ctx.moveTo(0, -manSc*0.6); ctx.lineTo(10, 0);
        }
        ctx.stroke();
        
        // Head
        ctx.fillStyle = '#ffb74d';
        ctx.beginPath(); ctx.arc(0, -manSc - 10, 12, 0, Math.PI*2); ctx.fill();

        // Arm holding umbrella
        ctx.beginPath(); ctx.moveTo(0, -manSc*0.8); ctx.lineTo(15, -manSc - 20); ctx.stroke();

        // Umbrella tilted
        ctx.translate(15, -manSc - 20);
        ctx.rotate(umbrellaAng * Math.PI/180);
        
        ctx.fillStyle = '#6a1b9a';
        ctx.beginPath();
        ctx.arc(0, 0, 45, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#222'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, 40); ctx.stroke();
        
        ctx.restore();
    }

    function animatePOV(W, H, vm, vr, windAngDeg, showVals) {
        const windAng = windAngDeg * Math.PI / 180;
        const vrx = vr * Math.sin(windAng);
        const vry = vr * Math.cos(windAng);
        const vmx = vm;
        const vmy = 0;

        const vrmx = vrx - vmx; // X-speed of rain relative to person
        const vrmy = vry - vmy; // Y-speed

        const vrm = Math.sqrt(vrmx * vrmx + vrmy * vrmy);
        const umbrellaAng = Math.atan2(-vrmx, vrmy) * 180 / Math.PI;
        
        document.getElementById('rm-out-vrm').textContent = vrm.toFixed(2);
        document.getElementById('rm-out-uang').textContent = umbrellaAng.toFixed(1);

        if (isMoving && !isPaused) t += 0.05;

        // Background
        ctx.fillStyle = '#cfd8dc'; 
        ctx.fillRect(0, 0, W, H);
        
        // Ground perspective (simplified)
        ctx.fillStyle = '#9e9e9e';
        ctx.beginPath();
        ctx.moveTo(0, H); ctx.lineTo(W/2 - 50, H/2); ctx.lineTo(W/2 + 50, H/2); ctx.lineTo(W, H);
        ctx.fill();

        // Bobbing camera effect
        const bob = isMoving ? Math.sin(t * vm * 0.5) * 5 : 0;
        ctx.translate(0, bob);

        // Rain perspective
        ctx.strokeStyle = '#1565c0'; 
        ctx.lineWidth = 2;
        
        // In POV, rain comes AT the camera if vrmx < 0 (man walks forward faster than wind).
        // Let's render lines radiating from a vanishing point.
        // Vanishing point shifted by relative velocity X.
        const vpX = W/2 + vrmx * 20; 
        const vpY = H/4 - vry * 5;

        for(let i=0; i<100; i++) {
            // Pseudo-3D rain streaks
            // Depth value
            const z = ((i * 10 - t * vrm * 50) % 1000 + 1000) % 1000;
            if (z < 10) continue;
            
            // Random x, y in 3D space
            const rx = (Math.sin(i*123) * 2000) - 1000;
            const ry = (Math.cos(i*321) * 1000) + 500;
            
            const scale1 = 500 / z;
            const scale2 = 500 / (z + vrm*5); // Line length depends on relative speed

            const x1 = vpX + rx * scale1;
            const y1 = vpY - ry * scale1;
            const x2 = vpX + rx * scale2;
            const y2 = vpY - ry * scale2;

            if (y1 > 0 && y1 < H && x1 > 0 && x1 < W) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }

        // Umbrella canopy overhead
        ctx.translate(W/2, 20); // Top center
        
        // Tilt umbrella visually based on angle
        ctx.rotate(umbrellaAng * Math.PI/180);
        
        // Draw inside of umbrella
        ctx.fillStyle = '#4a148c'; // Dark purple inside
        ctx.beginPath();
        ctx.ellipse(0, 0, W*0.6, 100, 0, 0, Math.PI, false);
        ctx.fill();
        
        ctx.strokeStyle = '#222'; ctx.lineWidth = 4;
        ctx.beginPath();
        for(let i=-W*0.6; i<=W*0.6; i+=W*0.15) {
            ctx.moveTo(0, -50);
            ctx.quadraticCurveTo(i*0.5, 50, i, 0);
        }
        ctx.stroke();

        ctx.setTransform(1,0,0,1,0,0); // reset
        
        if (showVals) {
            ctx.fillStyle = '#222'; ctx.font = '14px Arial';
            ctx.fillText('v_rm = ' + vrm.toFixed(1) + ' m/s', 20, 30);
            ctx.fillText('Tilt = ' + umbrellaAng.toFixed(1) + '°', 20, 50);
        }
    }

    function animate() {
        if (!document.getElementById('page-rainman').classList.contains('active-page')) return;
        resize();
        const W = canvas.width, H = canvas.height;
        if (W === 0 || H === 0) { rmAnimId = requestAnimationFrame(animate); return; }
        ctx.clearRect(0, 0, W, H);

        const vm = parseFloat(document.getElementById('rm-vm').value);
        const vr = parseFloat(document.getElementById('rm-vr').value);
        const wind = parseFloat(document.getElementById('rm-wind').value);
        const showVals = document.getElementById('rm-show-vals').checked;

        if (getMode() === 'side') {
            animateSideView(W, H, vm, vr, wind, showVals);
        } else {
            animatePOV(W, H, vm, vr, wind, showVals);
        }

        rmAnimId = requestAnimationFrame(animate);
    }

    document.getElementById('rm-start').addEventListener('click', () => {
        isMoving = true; isPaused = false;
        document.getElementById('rm-pause').textContent = 'Pause';
    });
    document.getElementById('rm-pause').addEventListener('click', () => {
        if (!isMoving) return; isPaused = !isPaused;
        document.getElementById('rm-pause').textContent = isPaused ? 'Resume' : 'Pause';
    });
    document.getElementById('rm-reset').addEventListener('click', () => {
        t = 0; isMoving = false; isPaused = false;
        document.getElementById('rm-pause').textContent = 'Pause';
    });

    animate();
}
