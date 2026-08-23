/* la_eigen.js - Eigenvectors and Eigenvalues */
window.laEigenInitialized = false;

window.initLAEigen = function () {
    if (window.laEigenInitialized) {
        if (window.laEigenUpdate) window.laEigenUpdate();
        return;
    }
    window.laEigenInitialized = true;

    let renderer, scene, camera, controls;
    let particlesGroup, linesGroup, ghostGroup;
    const canvasWrap = document.getElementById('la-eigen-canvas');
    if (!canvasWrap) return;
    
    const chartCanvas = document.getElementById('la-eigen-chart');
    const ctx = chartCanvas.getContext('2d');

    // State
    let isAnimating = false;
    let isSingleMode = false;
    let currentIteration = 0;
    
    // Data structures
    const numParticles = 200;
    let particles = []; // array of THREE.Vector3
    let singleVector = new THREE.Vector3(1, 0, 0);
    
    function init3D() {
        if (renderer) return;
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
        canvasWrap.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        
        // Use Orthographic or Perspective? Let's use Perspective but looking straight down Z
        camera = new THREE.PerspectiveCamera(45, canvasWrap.clientWidth / canvasWrap.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 8);
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableRotate = false; // Lock to 2D plane for clearer viewing
        
        scene.add(new THREE.AmbientLight(0xffffff, 1.0));
        scene.add(new THREE.AxesHelper(5));
        
        // Unit circle
        const circleGeom = new THREE.RingGeometry(0.98, 1.02, 64);
        const circleMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, side: THREE.DoubleSide });
        scene.add(new THREE.Mesh(circleGeom, circleMat));

        linesGroup = new THREE.Group(); scene.add(linesGroup);
        particlesGroup = new THREE.Group(); scene.add(particlesGroup);
        ghostGroup = new THREE.Group(); scene.add(ghostGroup);

        animate();
    }

    function getMatrix() {
        const a = parseFloat(document.getElementById('la-eigen-a11').value) || 0;
        const b = parseFloat(document.getElementById('la-eigen-a12').value) || 0;
        const c = parseFloat(document.getElementById('la-eigen-a21').value) || 0;
        const d = parseFloat(document.getElementById('la-eigen-a22').value) || 0;
        return { a, b, c, d };
    }

    function computeEigenData(A) {
        const { a, b, c, d } = A;
        const T = a + d;
        const D = a*d - b*c;
        const delta = T*T - 4*D;
        
        let vals = [];
        let vecs = [];
        
        if (delta >= 0) {
            const l1 = (T + Math.sqrt(delta)) / 2;
            const l2 = (T - Math.sqrt(delta)) / 2;
            vals.push(l1);
            if (delta > 0.0001) vals.push(l2);
            
            vals.forEach(lambda => {
                let vec;
                if (Math.abs(c) > 0.0001) vec = new THREE.Vector3(lambda - d, c, 0).normalize();
                else if (Math.abs(b) > 0.0001) vec = new THREE.Vector3(b, lambda - a, 0).normalize();
                else vec = (lambda === a) ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
                vecs.push(vec);
            });
        }
        return { vals, vecs };
    }
    
    function resetParticles() {
        particles = [];
        while(particlesGroup.children.length > 0) particlesGroup.remove(particlesGroup.children[0]);
        while(ghostGroup.children.length > 0) ghostGroup.remove(ghostGroup.children[0]);
        
        for (let i = 0; i < numParticles; i++) {
            const theta = (i / numParticles) * Math.PI * 2;
            let v = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);
            particles.push(v.clone());
            
            const arrow = new THREE.ArrowHelper(v, new THREE.Vector3(), 1.0, 0x94a3b8, 0.1, 0.08);
            particlesGroup.add(arrow);
        }
        
        singleVector = new THREE.Vector3(1, 0, 0); // Start at X axis
        const arrow = new THREE.ArrowHelper(singleVector, new THREE.Vector3(), 1.0, 0xef4444, 0.15, 0.12);
        ghostGroup.add(arrow);
        
        currentIteration = 0;
        isAnimating = false;
    }
    
    function drawChart(A) {
        // Resize canvas for sharp rendering
        const rect = chartCanvas.parentElement.getBoundingClientRect();
        chartCanvas.width = rect.width;
        chartCanvas.height = 200;
        const w = chartCanvas.width;
        const h = chartCanvas.height;
        
        ctx.clearRect(0, 0, w, h);
        
        // Grid lines
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
        ctx.beginPath();
        // y = 0 line
        ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
        // y = +/- pi lines
        ctx.moveTo(0, h*0.1); ctx.lineTo(w, h*0.1); // +180
        ctx.moveTo(0, h*0.9); ctx.lineTo(w, h*0.9); // -180
        ctx.stroke();
        
        ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif';
        ctx.fillText('+180°', 5, h*0.1 + 12);
        ctx.fillText('0°', 5, h/2 - 5);
        ctx.fillText('-180°', 5, h*0.9 - 5);
        
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
        ctx.beginPath();
        
        let zeroCrossings = [];
        let prevY = 0;
        
        for(let x=0; x<=w; x++) {
            let theta = (x / w) * Math.PI * 2;
            let vx = Math.cos(theta);
            let vy = Math.sin(theta);
            
            // Apply A
            let tx = A.a * vx + A.b * vy;
            let ty = A.c * vx + A.d * vy;
            
            // Angle deviation: signed angle from v to Tv
            let dev = Math.atan2(vx*ty - vy*tx, vx*tx + vy*ty); 
            
            let cy = h/2 - (dev / Math.PI) * (h*0.4);
            
            if (x === 0) ctx.moveTo(x, cy);
            else {
                // Don't draw lines across the wrap-around (e.g. from PI to -PI)
                if (Math.abs(cy - prevY) > h*0.5) ctx.moveTo(x, cy);
                else ctx.lineTo(x, cy);
            }
            
            // Detect zero crossings
            if (x > 0 && Math.abs(cy - prevY) < h*0.5) {
                if ((prevY < h/2 && cy >= h/2) || (prevY > h/2 && cy <= h/2)) {
                    zeroCrossings.push({x: x, type: 'pos'});
                }
                if ((prevY < h*0.1 && cy >= h*0.1) || (prevY > h*0.1 && cy <= h*0.1) || 
                    (prevY < h*0.9 && cy >= h*0.9) || (prevY > h*0.9 && cy <= h*0.9)) {
                    zeroCrossings.push({x: x, type: 'neg'});
                }
            }
            
            prevY = cy;
        }
        ctx.stroke();
        
        // Draw tick marks for eigenvectors
        ctx.lineWidth = 2;
        zeroCrossings.forEach(zc => {
            ctx.strokeStyle = zc.type === 'pos' ? '#eab308' : '#f97316'; // gold for pos, orange for neg
            ctx.beginPath();
            ctx.moveTo(zc.x, 0);
            ctx.lineTo(zc.x, h);
            ctx.stroke();
        });
    }

    window.laEigenUpdate = function () {
        if (!renderer) init3D();
        
        const A = getMatrix();
        const { vals, vecs } = computeEigenData(A);
        
        let valText = "Complex (Rotation)";
        if (vals.length > 0) {
            valText = vals.map(v => `λ = ${v.toFixed(2)}`).join('<br>');
        }
        document.getElementById('la-eigen-values-readout').innerHTML = valText;
        
        // Draw Eigenlines in 3D
        while(linesGroup.children.length > 0) linesGroup.remove(linesGroup.children[0]);
        vecs.forEach((v, i) => {
            const lambda = vals[i];
            const color = lambda > 0 ? 0xeab308 : 0xf97316; // gold positive, orange negative
            const geom = new THREE.BufferGeometry().setFromPoints([v.clone().multiplyScalar(-5), v.clone().multiplyScalar(5)]);
            const mat = new THREE.LineBasicMaterial({ color: color, linewidth: 2, transparent:true, opacity: 0.5 });
            linesGroup.add(new THREE.Line(geom, mat));
        });
        
        drawChart(A);
        
        // Show/hide based on mode
        const mode = document.querySelector('input[name="eigen-mode"]:checked').value;
        isSingleMode = (mode === 'single');
        particlesGroup.visible = !isSingleMode;
        ghostGroup.visible = isSingleMode;
    };
    
    function applyPowerIteration() {
        const A = getMatrix();
        currentIteration++;
        
        if (!isSingleMode) {
            // Iron Filings mode
            particles.forEach((v, i) => {
                let tx = A.a * v.x + A.b * v.y;
                let ty = A.c * v.x + A.d * v.y;
                let tv = new THREE.Vector3(tx, ty, 0);
                if (tv.length() > 0.0001) tv.normalize();
                particles[i] = tv;
                
                // Update ArrowHelper
                let arrow = particlesGroup.children[i];
                arrow.setDirection(tv);
                arrow.setColor(0x3b82f6); // turn blue when iter starts
            });
        } else {
            // Single Vector mode
            let tx = A.a * singleVector.x + A.b * singleVector.y;
            let ty = A.c * singleVector.x + A.d * singleVector.y;
            let tv = new THREE.Vector3(tx, ty, 0);
            let len = tv.length();
            if (len > 0.0001) tv.normalize();
            
            // Draw ghost of previous
            const prevArrow = new THREE.ArrowHelper(singleVector, new THREE.Vector3(), 1.0, 0xef4444, 0.15, 0.12);
            prevArrow.line.material.transparent = true; prevArrow.line.material.opacity = 0.3;
            prevArrow.cone.material.transparent = true; prevArrow.cone.material.opacity = 0.3;
            ghostGroup.add(prevArrow);
            
            // The newest is solid
            // Remove previous solid
            if (ghostGroup.children.length > 0) {
                let last = ghostGroup.children[ghostGroup.children.length-1];
                if (last.line.material.opacity === 1) ghostGroup.remove(last);
            }
            const currArrow = new THREE.ArrowHelper(tv, new THREE.Vector3(), 1.0, 0xef4444, 0.15, 0.12);
            ghostGroup.add(currArrow);
            
            singleVector = tv;
        }
    }

    // Bind inputs
    const inputs = ['a11', 'a12', 'a21', 'a22'];
    inputs.forEach(id => {
        document.getElementById('la-eigen-'+id).addEventListener('input', () => {
            resetParticles();
            window.laEigenUpdate();
        });
    });
    
    document.querySelectorAll('input[name="eigen-mode"]').forEach(el => {
        el.addEventListener('change', () => {
            resetParticles();
            window.laEigenUpdate();
        });
    });

    document.getElementById('la-eigen-btn-play').addEventListener('click', () => {
        applyPowerIteration();
    });
    
    document.getElementById('la-eigen-btn-reset').addEventListener('click', () => {
        resetParticles();
        window.laEigenUpdate();
    });

    function setVals(a,b,c,d) {
        document.getElementById('la-eigen-a11').value = a;
        document.getElementById('la-eigen-a12').value = b;
        document.getElementById('la-eigen-a21').value = c;
        document.getElementById('la-eigen-a22').value = d;
        resetParticles();
        window.laEigenUpdate();
    }

    document.getElementById('la-eigen-preset-sym').addEventListener('click', () => setVals(1.5, 0.5, 0.5, 1.0));
    document.getElementById('la-eigen-preset-shear').addEventListener('click', () => setVals(1.0, 1.0, 0.0, 1.0));
    document.getElementById('la-eigen-preset-rot').addEventListener('click', () => setVals(0.0, -1.0, 1.0, 0.0));

    function animate() {
        requestAnimationFrame(animate);
        if (controls) controls.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
    }

    setTimeout(() => {
        if (!renderer) init3D();
        resetParticles();
        window.laEigenUpdate();
        
        // Window resize handler for the chart
        window.addEventListener('resize', () => {
            if (chartCanvas) drawChart(getMatrix());
        });
    }, 100);
    
    window.addEventListener('resize', () => {
        if (renderer) {
            camera.aspect = canvasWrap.clientWidth / canvasWrap.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
        }
    });
};
