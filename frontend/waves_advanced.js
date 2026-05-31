// ═══════════════════════════════════════════════════════════════
// PHASE 3: ADVANCED WAVES (O-PHYSICS INTEGRATIONS)
// ═══════════════════════════════════════════════════════════════

// 7. Surface Waves (Water Waves)
// 9. Surface Waves & Interference
// 9. Surface Waves & Interference
window.initVibSurface = function() {
    const container = document.getElementById('vib-surface-canvas');
    if(!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    const W = container.clientWidth;
    const H = container.clientHeight || 500;
    
    let isAnimating = true;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    
    // UI Elements
    const lambdaInput = document.getElementById('vsurf-lambda');
    const dInput = document.getElementById('vsurf-d');
    const lambdaVal = document.getElementById('vsurf-lambda-val');
    const dVal = document.getElementById('vsurf-d-val');
    const playBtn = document.getElementById('vsurf-play');
    const btnPersp = document.getElementById('vsurf-view-persp');
    const btnTop = document.getElementById('vsurf-view-top');
    const btnSide = document.getElementById('vsurf-view-side');
    const vectorsCheck = document.getElementById('vsurf-vectors');
    
    let lambda = parseFloat(lambdaInput.value);
    let d = parseFloat(dInput.value);
    let time = 0;
    const A = 1.0;
    const omega = 5.0; // angular frequency
    
    // Three.js Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    
    const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 1000);
    camera.position.set(0, -25, 20);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    container.appendChild(renderer.domElement);
    
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(0, -10, 20);
    scene.add(dirLight);
    
    // Water Surface
    const size = 30;
    const segments = 200;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const material = new THREE.MeshPhongMaterial({
        color: 0x0284c7,
        specular: 0x38bdf8,
        shininess: 50,
        wireframe: false,
        side: THREE.DoubleSide
    });
    const water = new THREE.Mesh(geometry, material);
    scene.add(water);
    
    // Balls
    const ballGeo = new THREE.SphereGeometry(0.5, 32, 32);
    
    // Constructive Ball (Green) - Central antinode
    const constrMat = new THREE.MeshPhongMaterial({ color: 0x22c55e, shininess: 100 });
    const constrBall = new THREE.Mesh(ballGeo, constrMat);
    scene.add(constrBall);
    
    // Destructive Ball (Red) - First nodal line
    const destrMat = new THREE.MeshPhongMaterial({ color: 0xef4444, shininess: 100 });
    const destrBall = new THREE.Mesh(ballGeo, destrMat);
    scene.add(destrBall);
    
    // Vectors (Larger Heads)
    const constrVec = new THREE.ArrowHelper(new THREE.Vector3(0,0,1), constrBall.position, 0.1, 0x16a34a, 0.8, 0.5);
    const destrVec = new THREE.ArrowHelper(new THREE.Vector3(0,0,1), destrBall.position, 0.1, 0xdc2626, 0.8, 0.5);
    constrVec.visible = false;
    destrVec.visible = false;
    scene.add(constrVec);
    scene.add(destrVec);
    
    // Source Indicators (Yellow)
    const srcGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const srcMat = new THREE.MeshBasicMaterial({ color: 0xeab308 });
    const src1 = new THREE.Mesh(srcGeo, srcMat);
    const src2 = new THREE.Mesh(srcGeo, srcMat);
    scene.add(src1);
    scene.add(src2);
    
    function updateBalls() {
        // Moved balls a little closer to y = 12.0
        let cx = 0;
        let cy = 12.0;
        
        // Destructive Ball on first nodal line (path diff = lambda/2)
        let a = lambda / 4;
        let c = d / 2;
        let b2 = c*c - a*a;
        
        let dx = 0;
        let dy = 12.0;
        if (b2 > 0) {
            dx = a * Math.sqrt(1 + (dy*dy)/b2);
        } else {
            dx = 5.0; 
        }
        
        constrBall.position.x = cx;
        constrBall.position.y = cy;
        
        destrBall.position.x = dx;
        destrBall.position.y = dy;
        
        src1.position.set(-d/2, 0, 0);
        src2.position.set(d/2, 0, 0);
    }
    
    updateBalls();
    
    function updateWater() {
        const positions = water.geometry.attributes.position.array;
        let k = (2 * Math.PI) / lambda;
        
        for (let i = 0; i < positions.length; i += 3) {
            let x = positions[i];
            let y = positions[i+1];
            
            let r1 = Math.sqrt(Math.pow(x - (-d/2), 2) + Math.pow(y - 0, 2));
            let r2 = Math.sqrt(Math.pow(x - (d/2), 2) + Math.pow(y - 0, 2));
            
            let decay1 = Math.exp(-r1 * 0.1);
            let decay2 = Math.exp(-r2 * 0.1);
            
            let z = A * decay1 * Math.sin(k * r1 - omega * time) + 
                    A * decay2 * Math.sin(k * r2 - omega * time);
                    
            positions[i+2] = z;
        }
        water.geometry.attributes.position.needsUpdate = true;
        water.geometry.computeVertexNormals(); 
    }
    
    function animate() {
        if(isAnimating) {
            time += 0.016; // 60fps
            updateWater();
            
            let k = (2 * Math.PI) / lambda;
            
            // Constructive Ball
            let cx = constrBall.position.x;
            let cy = constrBall.position.y;
            let cr1 = Math.sqrt(Math.pow(cx - (-d/2), 2) + Math.pow(cy, 2));
            let cr2 = Math.sqrt(Math.pow(cx - (d/2), 2) + Math.pow(cy, 2));
            let cz = A * Math.exp(-cr1 * 0.1) * Math.sin(k * cr1 - omega * time) + 
                     A * Math.exp(-cr2 * 0.1) * Math.sin(k * cr2 - omega * time);
            constrBall.position.z = cz;
            
            // Destructive Ball
            let dx = destrBall.position.x;
            let dy = destrBall.position.y;
            let dr1 = Math.sqrt(Math.pow(dx - (-d/2), 2) + Math.pow(dy, 2));
            let dr2 = Math.sqrt(Math.pow(dx - (d/2), 2) + Math.pow(dy, 2));
            let dz = A * Math.exp(-dr1 * 0.1) * Math.sin(k * dr1 - omega * time) + 
                     A * Math.exp(-dr2 * 0.1) * Math.sin(k * dr2 - omega * time);
            destrBall.position.z = dz;
            
            // Update Vectors
            if (vectorsCheck && vectorsCheck.checked) {
                let c_len = Math.abs(cz) * 8.0;
                if (c_len > 0.05) {
                    constrVec.visible = true;
                    constrVec.setDirection(new THREE.Vector3(0, 0, cz >= 0 ? 1 : -1));
                    let hl = Math.min(1.5, c_len * 0.5);
                    let hw = Math.min(1.0, c_len * 0.35);
                    constrVec.setLength(c_len, hl, hw);
                } else {
                    constrVec.visible = false;
                }
                constrVec.position.copy(constrBall.position);
                
                let d_len = Math.abs(dz) * 8.0;
                if (d_len > 0.05) {
                    destrVec.visible = true;
                    destrVec.setDirection(new THREE.Vector3(0, 0, dz >= 0 ? 1 : -1));
                    let hl = Math.min(1.5, d_len * 0.5);
                    let hw = Math.min(1.0, d_len * 0.35);
                    destrVec.setLength(d_len, hl, hw);
                } else {
                    destrVec.visible = false;
                }
                destrVec.position.copy(destrBall.position);
            } else {
                constrVec.visible = false;
                destrVec.visible = false;
            }
        }
        
        controls.update();
        renderer.render(scene, camera);
        window.currentVibReqId = requestAnimationFrame(animate);
    }
    
    animate();
    
    lambdaInput.oninput = () => {
        lambda = parseFloat(lambdaInput.value);
        lambdaVal.innerText = lambda.toFixed(1);
        updateBalls();
    };
    
    dInput.oninput = () => {
        d = parseFloat(dInput.value);
        dVal.innerText = d.toFixed(1);
        updateBalls();
    };
    
    if (btnPersp) {
        btnPersp.onchange = () => {
            if (btnPersp.checked) {
                camera.position.set(0, -25, 20);
                camera.lookAt(0, 0, 0);
                controls.target.set(0,0,0);
                controls.update();
                if (!isAnimating) renderer.render(scene, camera);
            }
        };
    }
    if (btnTop) {
        btnTop.onchange = () => {
            if (btnTop.checked) {
                camera.position.set(0, 0, 30);
                camera.lookAt(0, 0, 0);
                controls.target.set(0,0,0);
                controls.update();
                if (!isAnimating) renderer.render(scene, camera);
            }
        };
    }
    if (btnSide) {
        btnSide.onchange = () => {
            if (btnSide.checked) {
                camera.position.set(25, 12.0, 2);
                camera.lookAt(0, 12.0, 0);
                controls.target.set(0, 12.0, 0);
                controls.update();
                if (!isAnimating) renderer.render(scene, camera);
            }
        };
    }
    
    if (vectorsCheck) {
        vectorsCheck.onchange = () => {
            constrVec.visible = vectorsCheck.checked;
            destrVec.visible = vectorsCheck.checked;
            if (!isAnimating) renderer.render(scene, camera);
        };
    }
    
    playBtn.onclick = () => {
        isAnimating = !isAnimating;
    };
};

// 8. The Doppler Effect
window.initVibDoppler = function() {
    const canvas = document.getElementById('vib-doppler-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let isAnimating = true;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    
    const W = canvas.width;
    const H = canvas.height;
    
    const vsInput = document.getElementById('vdop-vs');
    const voInput = document.getElementById('vdop-vo');
    const vsVal = document.getElementById('vdop-vs-val');
    const voVal = document.getElementById('vdop-vo-val');
    const playBtn = document.getElementById('vdop-play');
    const resetBtn = document.getElementById('vdop-reset');
    
    const v = 150; // speed of sound (pixels / sec)
    let vs = parseFloat(vsInput.value) * v;
    let vo = parseFloat(voInput.value) * v;
    
    let sourceX = W/2;
    let obsX = W * 0.8;
    const sourceY = H/2;
    
    let wavefronts = [];
    const T = 0.5; // emit every 0.5s
    const f = 1.0 / T;
    let timeSinceLastEmit = 0;
    
    let t = 0;
    let lastTime = performance.now();
    
    let obsFlash = 0;
    let lastWaveHit = 0; // to calculate observed frequency
    let obsFreq = 0;
    
    function reset() {
        sourceX = W/2;
        wavefronts = [];
        t = 0;
        obsFlash = 0;
        obsFreq = 0;
        lastWaveHit = 0;
    }
    
    function animate(currentTime) {
        if(!isAnimating) {
            lastTime = currentTime;
            window.currentVibReqId = requestAnimationFrame(animate);
            return;
        }
        
        let dt = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        if(dt > 0.1) dt = 0.016;
        
        t += dt;
        timeSinceLastEmit += dt;
        
        sourceX += vs * dt;
        obsX += vo * dt;
        
        if(sourceX > W + 50) sourceX = -50;
        if(obsX > W + 50) obsX = -50;
        if(obsX < -50) obsX = W + 50;
        
        if(timeSinceLastEmit >= T) {
            wavefronts.push({ x: sourceX, y: sourceY, t_emit: t });
            timeSinceLastEmit = 0;
        }
        
        ctx.clearRect(0, 0, W, H);
        
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        
        for(let i=wavefronts.length-1; i>=0; i--) {
            let wf = wavefronts[i];
            let r = v * (t - wf.t_emit);
            
            // Fading wavefronts based on radius
            let alpha = 1.0 - (r / (W * 0.8));
            if(alpha <= 0) {
                wavefronts.splice(i, 1);
                continue;
            }
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.beginPath();
            ctx.arc(wf.x, wf.y, r, 0, Math.PI*2);
            ctx.stroke();
            
            // Check if wavefront just passed the observer
            if(wf.x < obsX && !wf.passed_obs) {
                let distToObs = obsX - wf.x;
                if(r >= distToObs) {
                    wf.passed_obs = true;
                    obsFlash = 1.0;
                }
            }
        }
        ctx.globalAlpha = 1.0;
        
        // Draw Source
        ctx.beginPath();
        ctx.arc(sourceX, H/2, 6, 0, Math.PI*2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        
        // Draw Observer
        if(isAnimating && obsFlash > 0) obsFlash -= 0.05;
        ctx.beginPath();
        ctx.arc(obsX, H/2, 8, 0, Math.PI*2);
        ctx.fillStyle = obsFlash > 0 ? `rgba(250, 204, 21, ${0.5 + obsFlash*0.5})` : '#94a3b8';
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Display observed frequency f'
        // f' = f * (v +- vo) / (v -+ vs)
        // Since source moves right (towards obs) vs is positive in the denominator subtraction.
        let f_prime = f * (v + vo) / (v - vs);
        
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px Arial';
        ctx.fillText(`Source f = ${f.toFixed(1)} Hz`, 20, 30);
        
        if (vs === v) {
            ctx.fillStyle = '#ef4444';
            ctx.fillText(`Observed f' = ∞ (Sonic Boom!)`, 20, 60);
        } else if (vs > v) {
            ctx.fillStyle = '#ef4444';
            ctx.fillText(`Observed f' = Mach Cone`, 20, 60);
        } else {
            ctx.fillStyle = '#34d399';
            ctx.fillText(`Observed f' = ${f_prime.toFixed(1)} Hz`, 20, 60);
        }
        
        if (isAnimating) {
            window.currentVibReqId = requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
    
    document.getElementById('vdop-play').onclick = () => {
        isAnimating = !isAnimating;
    };
    document.getElementById('vdop-reset').onclick = () => { reset(); };
};

// 9. Beat Frequencies
window.initVibBeats = function() {
    const canvas = document.getElementById('vib-beats-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight || 200;
    const W = canvas.width, H = canvas.height;
    
    let isAnimating = true;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    let t = 0;
    
    const f1Input = document.getElementById('vbeat-f1');
    const f2Input = document.getElementById('vbeat-f2');
    
    if(!window.vibCharts) window.vibCharts = [];
    window.vibCharts.forEach(c => c.destroy());
    window.vibCharts = [];
    
    const chartCtx = document.getElementById('chart-vib-beats').getContext('2d');
    const beatChart = new Chart(chartCtx, {
        type: 'line', data: { labels: [], datasets: [
            { label: 'Superposition (y1 + y2)', borderColor: '#8b5cf6', data: [], pointRadius: 0, borderWidth: 2 }
        ]},
        options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { display: false }, y: { suggestedMin: -2.5, suggestedMax: 2.5 } } }
    });
    window.vibCharts.push(beatChart);
    
    function draw() {
        ctx.clearRect(0, 0, W, H);
        
        let f1 = parseFloat(f1Input.value);
        let f2 = parseFloat(f2Input.value);
        document.getElementById('vbeat-f1-val').innerText = f1.toFixed(1);
        document.getElementById('vbeat-f2-val').innerText = f2.toFixed(1);
        
        // Draw individual waves on canvas
        ctx.lineWidth = 2;
        
        // Wave 1
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        for(let x=0; x<W; x++) {
            let y = Math.sin(2 * Math.PI * f1 * (x/W) - t * f1 * 0.1) * 30;
            if(x===0) ctx.moveTo(x, H/4 + y);
            else ctx.lineTo(x, H/4 + y);
        }
        ctx.stroke();
        
        // Wave 2
        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath();
        for(let x=0; x<W; x++) {
            let y = Math.sin(2 * Math.PI * f2 * (x/W) - t * f2 * 0.1) * 30;
            if(x===0) ctx.moveTo(x, H*3/4 + y);
            else ctx.lineTo(x, H*3/4 + y);
        }
        ctx.stroke();
        
        if (isAnimating) {
            let y1 = Math.sin(2 * Math.PI * f1 * t * 0.5);
            let y2 = Math.sin(2 * Math.PI * f2 * t * 0.5);
            
            beatChart.data.labels.push(t.toFixed(2));
            beatChart.data.datasets[0].data.push(y1 + y2);
            if(beatChart.data.labels.length > 300) {
                beatChart.data.labels.shift();
                beatChart.data.datasets[0].data.shift();
            }
            beatChart.update();
            
            t += 0.016;
            window.currentVibReqId = requestAnimationFrame(draw);
        }
    }
    
    draw();
    
    document.getElementById('vbeat-play').onclick = () => {
        isAnimating = !isAnimating;
        if (isAnimating) draw();
        else cancelAnimationFrame(window.currentVibReqId);
    };
};

// 10. Sound Tubes
window.initVibTubes = function() {
    const canvas = document.getElementById('vib-tubes-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight || 400;
    const W = canvas.width, H = canvas.height;
    
    let isAnimating = true;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    let t = 0;
    
    const nInput = document.getElementById('vtube-n');
    let isClosed = false;
    
    document.getElementById('vtube-open').onchange = () => isClosed = false;
    document.getElementById('vtube-closed').onchange = () => isClosed = true;
    
    function draw() {
        ctx.clearRect(0, 0, W, H);
        
        let n = parseInt(nInput.value);
        document.getElementById('vtube-n-val').innerText = n;
        
        // Draw Pipe
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(100, 100, W-200, 200);
        
        if(isClosed) {
            ctx.fillStyle = '#475569';
            ctx.fillRect(W-100, 100, 10, 200);
        }
        
        // Draw standing wave envelope
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        
        let length = W - 200;
        let k;
        if(isClosed) {
            // odd harmonics only for closed tube? Wait, standard is n=1,3,5
            // But let's just use n as number of quarter wavelengths: L = n * lambda / 4
            // So k = (n * pi) / (2 * L)
            k = (n * Math.PI) / (2 * length);
        } else {
            // open tube: L = n * lambda / 2
            k = (n * Math.PI) / length;
        }
        
        let omega = 5;
        let maxA = 80;
        
        ctx.beginPath();
        for(let x=0; x<=length; x++) {
            // open at x=0 (antinode -> cos), closed at x=L (node -> sin)
            // Displacement wave:
            let env = Math.cos(k * x); 
            if(isClosed && n%2===0) {
                // If the user selects n=2 for a closed tube, physics says it's technically the 3rd harmonic.
                // We'll just map n directly to harmonic modes. n=1 (1st), n=2(3rd), n=3(5th)
                let harm = 2*n - 1;
                k = (harm * Math.PI) / (2 * length);
                env = Math.cos(k * x);
            }
            
            let y = maxA * env * Math.sin(omega * t);
            if(x===0) ctx.moveTo(100+x, 200 + y);
            else ctx.lineTo(100+x, 200 + y);
        }
        ctx.stroke();
        
        // Draw lower envelope mirrored
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        for(let x=0; x<=length; x++) {
            let env = Math.cos(k * x);
            if(isClosed) env = Math.cos(k * x);
            let y = maxA * env * Math.sin(omega * t + Math.PI);
            if(x===0) ctx.moveTo(100+x, 200 + y);
            else ctx.lineTo(100+x, 200 + y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        if (isAnimating) {
            t += 0.016;
            window.currentVibReqId = requestAnimationFrame(draw);
        }
    }
    
    draw();
    
    document.getElementById('vtube-play').onclick = () => {
        isAnimating = !isAnimating;
        if (isAnimating) draw();
        else cancelAnimationFrame(window.currentVibReqId);
    };
    [nInput].forEach(el => el.addEventListener('input', () => { if(!isAnimating) draw(); }));
};

// 11. EM Waves (Canvas 2D)
window.initVibEM = function() {
    const canvas = document.getElementById('vib-em-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight || 400;
    const W = canvas.width, H = canvas.height;
    
    let isAnimating = true;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    let t = 0;
    
    const lambdaInput = document.getElementById('vem-lambda');
    const polCb = document.getElementById('vem-polarizer');
    
    // Isometric Projection parameters
    const isoAngle = Math.PI / 6; // 30 degrees
    const cx = W / 2 - 250;
    const cy = H / 2;
    
    function project3D(x, y, z) {
        // x-axis is horizontal. 
        // y-axis is purely vertical. 
        // z-axis is diagonal.
        let cX = cx + x - z * Math.cos(isoAngle);
        let cY = cy - y + z * Math.sin(isoAngle);
        return { x: cX, y: cY };
    }
    
    function drawArrow(ctx, fromx, fromy, tox, toy, color) {
        let dx = tox - fromx;
        let dy = toy - fromy;
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return; // Too short
        
        let headlen = 8;
        let angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(tox, toy);
        ctx.fill();
    }
    
    function draw() {
        ctx.clearRect(0, 0, W, H);
        
        let lambda = parseFloat(lambdaInput.value) * 30; // Scale for visual
        let k = 2 * Math.PI / lambda;
        let omega = 2;
        let A = 80; // Amplitude in pixels
        
        let isPol = polCb.checked;
        const length = 550;
        
        // Draw Axes
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        
        // X-axis (propagation direction)
        let xStart = project3D(-20, 0, 0);
        let xEnd = project3D(length + 50, 0, 0);
        drawArrow(ctx, xStart.x, xStart.y, xEnd.x, xEnd.y, '#64748b');
        ctx.fillStyle = '#64748b'; ctx.font = '14px Arial'; ctx.fillText("x (Direction)", xEnd.x + 10, xEnd.y);
        
        // Y-axis (Electric Field direction)
        let yStart = project3D(0, -A-20, 0);
        let yEnd = project3D(0, A+20, 0);
        drawArrow(ctx, yStart.x, yStart.y, yEnd.x, yEnd.y, '#64748b');
        ctx.fillText("y (Electric Field E)", yEnd.x, yEnd.y - 10);
        
        // Z-axis (Magnetic Field direction)
        let zStart = project3D(0, 0, -A-20);
        let zEnd = project3D(0, 0, A+20);
        drawArrow(ctx, zStart.x, zStart.y, zEnd.x, zEnd.y, '#64748b');
        ctx.fillText("z (Magnetic Field B)", zEnd.x - 120, zEnd.y + 20);
        
        // Draw polarizing filter plane if checked
        let polX = 250;
        if (isPol) {
            let p1 = project3D(polX, -A-40, -A-40);
            let p2 = project3D(polX, A+40, -A-40);
            let p3 = project3D(polX, A+40, A+40);
            let p4 = project3D(polX, -A-40, A+40);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.strokeStyle = '#94a3b8';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Draw polarization vertical slits
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            for(let i=-A-20; i<=A+20; i+=15) {
                let v1 = project3D(polX, -A-40, i);
                let v2 = project3D(polX, A+40, i);
                ctx.beginPath(); ctx.moveTo(v1.x, v1.y); ctx.lineTo(v2.x, v2.y); ctx.stroke();
            }
        }
        
        // Magnetic Field (Blue, xz-plane)
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x <= length; x += 2) {
            let bVal = A * Math.sin(k * x - omega * t);
            if (isPol && x > polX) bVal *= Math.exp(-0.1 * (x - polX)); // Smooth decay instead of hard cut
            
            let p = project3D(x, 0, bVal);
            if (x === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        
        // Electric Field (Red, xy-plane)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x <= length; x += 2) {
            let eVal = A * Math.sin(k * x - omega * t);
            
            let p = project3D(x, eVal, 0);
            if (x === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        
        // Draw Field Vectors
        for (let x = 0; x <= length; x += 20) {
            let eVal = A * Math.sin(k * x - omega * t);
            let bVal = A * Math.sin(k * x - omega * t);
            if (isPol && x > polX) bVal *= Math.exp(-0.1 * (x - polX));
            
            let origin = project3D(x, 0, 0);
            let ePoint = project3D(x, eVal, 0);
            let bPoint = project3D(x, 0, bVal);
            
            // Draw Magnetic vector (Blue) first so it's behind Electric
            if (Math.abs(bVal) > 1) {
                drawArrow(ctx, origin.x, origin.y, bPoint.x, bPoint.y, '#3b82f6');
            }
            // Draw Electric vector (Red)
            if (Math.abs(eVal) > 1) {
                drawArrow(ctx, origin.x, origin.y, ePoint.x, ePoint.y, '#ef4444');
            }
        }
        
        if (isAnimating) {
            t += 0.03;
            window.currentVibReqId = requestAnimationFrame(draw);
        }
    }
    
    draw();
    
    document.getElementById('vem-play').onclick = () => {
        isAnimating = !isAnimating;
        if (isAnimating) draw();
        else cancelAnimationFrame(window.currentVibReqId);
    };
    [lambdaInput, polCb].forEach(el => el.addEventListener('input', () => { if(!isAnimating) draw(); }));
};
