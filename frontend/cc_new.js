function initCarChase() {
    if (ccAnimId) cancelAnimationFrame(ccAnimId);

    const canvas2d = document.getElementById('cc-canvas-2d');
    const canvas3d = document.getElementById('cc-canvas-3d');
    if (!canvas2d || !canvas3d) return;
    const ctx = canvas2d.getContext('2d');
    
    let renderer, scene, camera, meshB, road, lines;
    let is3DInitialized = false;

    function resize() {
        const wrap = canvas2d.parentElement;
        canvas2d.width = wrap.clientWidth;
        canvas2d.height = wrap.clientHeight;
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
    
    // Copy drawColoredCar from initOvertaking
    function drawColoredCar(cx, cy, scale, wheelAngle, colorMain, colorTop) {
        const wheelR = 10 * scale;
        const drawWheel = (wx) => {
            ctx.fillStyle = '#1e293b';
            ctx.beginPath(); ctx.arc(wx, cy, wheelR, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(wx, cy); ctx.lineTo(wx + Math.cos(wheelAngle)*wheelR, cy + Math.sin(wheelAngle)*wheelR); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(wx, cy); ctx.lineTo(wx + Math.cos(wheelAngle + Math.PI/2)*wheelR, cy + Math.sin(wheelAngle + Math.PI/2)*wheelR); ctx.stroke();
        };
        drawWheel(cx - 22*scale);
        drawWheel(cx + 22*scale);

        ctx.fillStyle = colorMain;
        
        // Custom roundRect since global one might not be available or just standard fillRect with arc
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(cx - 40*scale, cy - 28*scale, 80*scale, 25*scale, 6) : ctx.fillRect(cx - 40*scale, cy - 28*scale, 80*scale, 25*scale);
        ctx.fill();
        
        ctx.fillStyle = colorTop;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(cx - 20*scale, cy - 48*scale, 40*scale, 22*scale, 5) : ctx.fillRect(cx - 20*scale, cy - 48*scale, 40*scale, 22*scale);
        ctx.fill();
    }

    function getMode() {
        const viewEl = document.querySelector('input[name="cc_view"]:checked');
        return viewEl ? viewEl.value : 'top';
    }

    function init3D(W, H) {
        if (is3DInitialized) return;
        if (typeof THREE === 'undefined') return;
        
        renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true });
        renderer.setSize(W, H);
        renderer.setClearColor(0x87CEEB);

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x87CEEB, 10, 500);

        camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 1000);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(100, 200, 50);
        scene.add(dirLight);

        const groundGeo = new THREE.PlaneGeometry(2000, 2000);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x3d8c40 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        scene.add(ground);

        const roadGeo = new THREE.PlaneGeometry(12, 2000);
        const roadMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
        road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        scene.add(road);

        const linesGeo = new THREE.PlaneGeometry(0.5, 2000);
        const linesMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        lines = new THREE.Mesh(linesGeo, linesMat);
        lines.rotation.x = -Math.PI / 2;
        lines.position.y = 0.01;
        scene.add(lines);

        // A simple 3D block car
        const carGeo = new THREE.BoxGeometry(2, 1.5, 4.5);
        const carBMat = new THREE.MeshLambertMaterial({ color: 0x1565c0 });
        meshB = new THREE.Mesh(carGeo, carBMat);
        meshB.position.y = 0.75;
        scene.add(meshB);
        
        // Add some basic 3D clouds
        const cloudGeo = new THREE.SphereGeometry(15, 7, 7);
        const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        for(let i=0; i<20; i++) {
            const cl = new THREE.Mesh(cloudGeo, cloudMat);
            cl.position.set((Math.random()-0.5)*400, 30 + Math.random()*20, (Math.random()-0.5)*1000);
            cl.scale.set(1, 0.6, 1);
            scene.add(cl);
        }

        is3DInitialized = true;
    }

    function animateTopView(W, H, vA, vB, d0, showVals) {
        // Sky & grass
        ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, W, H/2 - 40);
        ctx.fillStyle = '#3d8c40'; ctx.fillRect(0, H/2 + 40, W, H/2 - 40);
        
        // Draw some clouds
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for(let i=0; i<3; i++) {
            const cx = ((i*300 + (isMoving ? t*2 : 0)) % (W+200)) - 100;
            ctx.beginPath();
            ctx.arc(cx, 30+i*10, 20, 0, Math.PI*2);
            ctx.arc(cx+20, 25+i*10, 25, 0, Math.PI*2);
            ctx.arc(cx+40, 30+i*10, 20, 0, Math.PI*2);
            ctx.fill();
        }

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

        const scaleX = 2; // px per meter
        const carAw = 80, carAh = 25;
        const xA = 50 + vA * t * scaleX;
        
        let camOffset = 0;
        if (xA > W * 0.3) {
            camOffset = xA - W * 0.3;
        }
        
        const drawXA = xA - camOffset;
        const wheelAngleA = isMoving ? (xA / (10 * 0.8)) : 0;
        
        // Use drawColoredCar instead of blocks
        drawColoredCar(drawXA + 40, H/2 - 15, 0.8, wheelAngleA, '#ef4444', '#991b1b'); // Car A (Red)
        
        const xB = 50 + d0 * scaleX + vB * t * scaleX;
        const drawXB = xB - camOffset;
        const wheelAngleB = isMoving ? (xB / (10 * 0.8)) : 0;
        
        if (drawXB < W + 100) {
            drawColoredCar(drawXB + 40, H/2 + 25, 0.8, wheelAngleB, '#3b82f6', '#1e40af'); // Car B (Blue)
            
            if (showVals) {
                if (drawXB > drawXA + 80) {
                    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
                    ctx.beginPath();
                    ctx.moveTo(drawXA + 80, H/2);
                    ctx.lineTo(drawXB, H/2);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center';
                    ctx.fillText('Gap: ' + Math.max(0, (xB - xA)/scaleX).toFixed(1) + ' m', (drawXA + 80 + drawXB)/2, H/2 - 5);
                }
            }
        }
        
        if (showVals) {
            ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center';
            ctx.fillText('vA='+vA, drawXA + 40, H/2 - 40);
            if (drawXB < W + 100) ctx.fillText('vB='+vB, drawXB + 40, H/2 + 40);
        }
    }

    function animatePOV(W, H, vA, vB, d0) {
        if (typeof THREE === 'undefined') return;
        if (!is3DInitialized) init3D(W, H);

        const posA = vA * t;
        const posB = d0 + vB * t;
        
        camera.position.set(0, 1.2, -posA);
        meshB.position.z = -posB;
        
        lines.position.z = camera.position.z - (Math.abs(camera.position.z) % 2);

        renderer.render(scene, camera);
    }

    function animate() {
        if (!document.getElementById('page-carchase').classList.contains('active-page')) return;
        
        const viewMode = getMode();
        const W = canvas2d.width, H = canvas2d.height;
        
        if (viewMode === 'top') {
            canvas2d.style.display = 'block';
            canvas3d.style.display = 'none';
            resize();
            ctx.clearRect(0, 0, W, H);
            
            const vA = parseFloat(document.getElementById('cc-va').value);
            const vB = parseFloat(document.getElementById('cc-vb').value);
            const d0 = parseFloat(document.getElementById('cc-d0').value);
            const showVals = document.getElementById('cc-show-vals').checked;
            
            animateTopView(W, H, vA, vB, d0, showVals);
        } else {
            canvas2d.style.display = 'none';
            canvas3d.style.display = 'block';
            
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
            if (t >= tc && tc > 0) t = tc;
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
    
    animate();
}
