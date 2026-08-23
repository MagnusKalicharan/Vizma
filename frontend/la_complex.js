/* la_complex.js - Complex Eigenvalues & Inverted Pendulum */
window.laComplexInitialized = false;

window.initLAComplex = function () {
    if (window.laComplexInitialized) {
        if (window.laComplexUpdate) window.laComplexUpdate();
        return;
    }
    window.laComplexInitialized = true;

    const canvasRoots = document.getElementById('la-cx-canvas-roots');
    const canvasPhase = document.getElementById('la-cx-canvas-phase');
    const canvasTower = document.getElementById('la-cx-canvas-tower');
    
    if (!canvasRoots || !canvasPhase || !canvasTower) return;
    
    const ctxRoots = canvasRoots.getContext('2d');
    const ctxPhase = canvasPhase.getContext('2d');
    const ctxTower = canvasTower.getContext('2d');
    
    // Simulation state
    let theta = 0.1; // Initial slight tilt
    let theta_dot = 0;
    let history = []; // For phase portrait
    
    // Physics constants
    const dt = 0.016; // 60fps approx
    let isFallen = false;

    // Reset function
    function resetSim() {
        theta = 0.1;
        theta_dot = 0;
        history = [];
        isFallen = false;
    }

    document.getElementById('la-cx-btn-reset').addEventListener('click', resetSim);

    // Main animation loop
    function animate() {
        requestAnimationFrame(animate);
        updatePhysics();
        drawAll();
    }

    function updatePhysics() {
        if (isFallen) return;

        // Get slider value (0 to 100)
        const val = parseFloat(document.getElementById('la-cx-slider').value);
        
        // Map slider to K and D
        // A = [0, 1; K, -D]
        // Char Eq: L^2 + D*L - K = 0
        // Roots: L = (-D +/- sqrt(D^2 + 4K)) / 2
        
        let K, D;
        if (val < 33) {
            // Unstable to less unstable
            // val 0 -> K=5, D=-1
            // val 33 -> K=0, D=0
            let t = val / 33;
            K = 5 * (1 - t);
            D = -1 * (1 - t);
        } else if (val < 66) {
            // Underdamped (Complex roots)
            // val 33 -> K=0, D=0
            // val 66 -> K=-10, D=2
            let t = (val - 33) / 33;
            K = -10 * t;
            D = 2 * t;
        } else {
            // Overdamped
            // val 66 -> K=-10, D=2
            // val 100 -> K=-10, D=10
            let t = (val - 66) / 34;
            K = -10;
            D = 2 + 8 * t;
        }

        // Integration (Euler)
        let theta_ddot = K * theta - D * theta_dot;
        theta_dot += theta_ddot * dt;
        theta += theta_dot * dt;

        // Collision with ground
        if (Math.abs(theta) > Math.PI / 2) {
            theta = Math.sign(theta) * Math.PI / 2;
            theta_dot = 0;
            isFallen = true;
        }

        history.push({ t: theta, td: theta_dot });
        if (history.length > 300) history.shift();
    }

    function getRoots(K, D) {
        let discriminant = D * D + 4 * K;
        if (discriminant >= 0) {
            let r1 = (-D + Math.sqrt(discriminant)) / 2;
            let r2 = (-D - Math.sqrt(discriminant)) / 2;
            return { type: 'real', r1, r2 };
        } else {
            let real = -D / 2;
            let imag = Math.sqrt(-discriminant) / 2;
            return { type: 'complex', real, imag };
        }
    }

    function drawAll() {
        const val = parseFloat(document.getElementById('la-cx-slider').value);
        let K, D;
        if (val < 33) {
            let t = val / 33; K = 5 * (1 - t); D = -1 * (1 - t);
        } else if (val < 66) {
            let t = (val - 33) / 33; K = -10 * t; D = 2 * t;
        } else {
            let t = (val - 66) / 34; K = -10; D = 2 + 8 * t;
        }
        const roots = getRoots(K, D);

        drawRoots(roots);
        drawPhase();
        drawTower();
    }

    function drawRoots(roots) {
        let w = canvasRoots.width;
        let h = canvasRoots.height;
        let cx = w / 2;
        let cy = h / 2;
        let scale = 30;

        ctxRoots.clearRect(0, 0, w, h);

        // Shaded regions
        ctxRoots.fillStyle = 'rgba(239, 68, 68, 0.1)'; // Red right half
        ctxRoots.fillRect(cx, 0, w/2, h);
        ctxRoots.fillStyle = 'rgba(34, 197, 94, 0.1)'; // Green left half
        ctxRoots.fillRect(0, 0, cx, h);

        // Axes
        ctxRoots.strokeStyle = '#cbd5e1';
        ctxRoots.lineWidth = 1;
        ctxRoots.beginPath();
        ctxRoots.moveTo(0, cy); ctxRoots.lineTo(w, cy); // Real
        ctxRoots.moveTo(cx, 0); ctxRoots.lineTo(cx, h); // Imag
        ctxRoots.stroke();

        // Draw dots
        ctxRoots.fillStyle = '#0f172a';
        if (roots.type === 'real') {
            let x1 = cx + roots.r1 * scale;
            let x2 = cx + roots.r2 * scale;
            ctxRoots.beginPath(); ctxRoots.arc(x1, cy, 6, 0, Math.PI*2); ctxRoots.fill();
            ctxRoots.beginPath(); ctxRoots.arc(x2, cy, 6, 0, Math.PI*2); ctxRoots.fill();
        } else {
            let x = cx + roots.real * scale;
            let y1 = cy - roots.imag * scale;
            let y2 = cy + roots.imag * scale;
            ctxRoots.beginPath(); ctxRoots.arc(x, y1, 6, 0, Math.PI*2); ctxRoots.fill();
            ctxRoots.beginPath(); ctxRoots.arc(x, y2, 6, 0, Math.PI*2); ctxRoots.fill();
            
            // Connect to real axis lightly
            ctxRoots.strokeStyle = '#94a3b8';
            ctxRoots.setLineDash([4, 4]);
            ctxRoots.beginPath();
            ctxRoots.moveTo(x, y1); ctxRoots.lineTo(x, y2);
            ctxRoots.stroke();
            ctxRoots.setLineDash([]);
        }
    }

    function drawPhase() {
        let w = canvasPhase.width;
        let h = canvasPhase.height;
        let cx = w / 2;
        let cy = h / 2;
        let scaleTh = 100;
        let scaleTd = 40;

        ctxPhase.clearRect(0, 0, w, h);

        // Axes
        ctxPhase.strokeStyle = '#cbd5e1';
        ctxPhase.lineWidth = 1;
        ctxPhase.beginPath();
        ctxPhase.moveTo(0, cy); ctxPhase.lineTo(w, cy); // Theta
        ctxPhase.moveTo(cx, 0); ctxPhase.lineTo(cx, h); // Theta dot
        ctxPhase.stroke();

        if (history.length === 0) return;

        // Trace
        ctxPhase.strokeStyle = '#3b82f6';
        ctxPhase.lineWidth = 2;
        ctxPhase.beginPath();
        for (let i = 0; i < history.length; i++) {
            let x = cx + history[i].t * scaleTh;
            let y = cy - history[i].td * scaleTd;
            if (i === 0) ctxPhase.moveTo(x, y);
            else ctxPhase.lineTo(x, y);
        }
        ctxPhase.stroke();

        // Current point dot
        let current = history[history.length - 1];
        ctxPhase.fillStyle = '#ef4444';
        ctxPhase.beginPath();
        ctxPhase.arc(cx + current.t * scaleTh, cy - current.td * scaleTd, 5, 0, Math.PI*2);
        ctxPhase.fill();
    }

    function drawTower() {
        let w = canvasTower.width;
        let h = canvasTower.height;
        let cx = w / 2;
        let cy = h - 50; // Ground level

        ctxTower.clearRect(0, 0, w, h);

        // Ground
        ctxTower.fillStyle = '#94a3b8';
        ctxTower.fillRect(0, cy, w, h - cy);

        // Cart
        let cartW = 60, cartH = 30;
        ctxTower.fillStyle = '#334155';
        ctxTower.fillRect(cx - cartW/2, cy - cartH, cartW, cartH);
        
        // Wheels
        ctxTower.fillStyle = '#0f172a';
        ctxTower.beginPath(); ctxTower.arc(cx - 20, cy, 10, 0, Math.PI*2); ctxTower.fill();
        ctxTower.beginPath(); ctxTower.arc(cx + 20, cy, 10, 0, Math.PI*2); ctxTower.fill();

        // Rod
        let rodL = 200;
        ctxTower.save();
        ctxTower.translate(cx, cy - cartH);
        ctxTower.rotate(theta);
        
        ctxTower.fillStyle = '#eab308';
        ctxTower.fillRect(-10, -rodL, 20, rodL);
        
        // Payload (Bob)
        ctxTower.fillStyle = '#ef4444';
        ctxTower.beginPath(); ctxTower.arc(0, -rodL, 20, 0, Math.PI*2); ctxTower.fill();
        
        ctxTower.restore();
    }

    animate();
};
