/* la_complex.js - Detailed Damped Pendulum (Complex Eigenvalues) */
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
    
    // Sliders & UI Elements
    const sl_c = document.getElementById('la-cx-slider-c');
    const sl_m = document.getElementById('la-cx-slider-m');
    const sl_l = document.getElementById('la-cx-slider-l');
    const sl_g = document.getElementById('la-cx-slider-g');
    const sl_th = document.getElementById('la-cx-slider-th');
    
    const val_c = document.getElementById('la-cx-val-c');
    const val_m = document.getElementById('la-cx-val-m');
    const val_l = document.getElementById('la-cx-val-l');
    const val_g = document.getElementById('la-cx-val-g');
    const val_th = document.getElementById('la-cx-val-th');
    
    const regimeBox = document.getElementById('la-cx-regime-box');
    const regimeLabel = document.getElementById('la-cx-regime-label');
    const wrapRoots = document.getElementById('la-cx-wrap-roots');
    const wrapPhase = document.getElementById('la-cx-wrap-phase');
    const wrapTower = document.getElementById('la-cx-wrap-tower');
    const readoutRoots = document.getElementById('la-cx-readout-roots');

    // Simulation state
    let state = {
        theta: parseFloat(sl_th.value),
        theta_dot: 0
    };
    
    let history = []; // For phase portrait {t, td}
    let ghostTrail = []; // For physical pendulum bob positions
    const dt = 0.016; // Fixed timestep (~60fps)

    // Setup Event Listeners
    function getParams() {
        return {
            c: parseFloat(sl_c.value),
            m: parseFloat(sl_m.value),
            L: parseFloat(sl_l.value),
            g: parseFloat(sl_g.value)
        };
    }

    function updateLabels() {
        val_c.innerText = parseFloat(sl_c.value).toFixed(2);
        val_m.innerText = parseFloat(sl_m.value).toFixed(1);
        val_l.innerText = parseFloat(sl_l.value).toFixed(1);
        val_g.innerText = parseFloat(sl_g.value).toFixed(2);
        val_th.innerText = parseFloat(sl_th.value).toFixed(2);
    }

    [sl_c, sl_m, sl_l, sl_g].forEach(el => {
        el.addEventListener('input', updateLabels);
    });
    
    sl_th.addEventListener('input', () => {
        updateLabels();
        resetSim(false); // Reset but don't change sliders
    });

    document.getElementById('la-cx-btn-reset').addEventListener('click', () => resetSim(false));
    document.getElementById('la-cx-btn-rand').addEventListener('click', () => {
        const p = getParams();
        // Critical damping c_crit = 2m*w0 = 2m*sqrt(g/L)
        const c_crit = 2 * p.m * Math.sqrt(p.g / p.L);
        // Random c between 0 and 1.5 * c_crit
        sl_c.value = (Math.random() * 1.5 * c_crit).toFixed(2);
        updateLabels();
    });

    function resetSim(resetSliders = true) {
        if (resetSliders) {
            sl_c.value = 0.5; sl_m.value = 1.0; sl_l.value = 1.0; sl_g.value = 9.81; sl_th.value = 0.6;
            updateLabels();
        }
        state.theta = parseFloat(sl_th.value);
        state.theta_dot = 0;
        history = [];
        ghostTrail = [];
    }

    // Math functions
    function getEigenvalues(beta, w0sq) {
        const discriminant = beta * beta - w0sq;
        if (discriminant > 0) {
            // Overdamped (real, distinct)
            let r1 = -beta + Math.sqrt(discriminant);
            let r2 = -beta - Math.sqrt(discriminant);
            return { type: 'real', r1, r2, delta: discriminant, beta };
        } else if (discriminant === 0) {
            // Critically damped (real, repeated)
            return { type: 'critical', r1: -beta, r2: -beta, delta: discriminant, beta };
        } else {
            // Underdamped (complex conjugate)
            let real = -beta;
            let imag = Math.sqrt(-discriminant);
            return { type: 'complex', real, imag, delta: discriminant, beta };
        }
    }

    function f(theta, theta_dot, w0sq, beta) {
        return -w0sq * theta - 2 * beta * theta_dot;
    }

    function rk4(s, w0sq, beta, dt) {
        let t1 = s.theta;
        let v1 = s.theta_dot;
        let a1 = f(t1, v1, w0sq, beta);

        let t2 = s.theta + 0.5 * v1 * dt;
        let v2 = s.theta_dot + 0.5 * a1 * dt;
        let a2 = f(t2, v2, w0sq, beta);

        let t3 = s.theta + 0.5 * v2 * dt;
        let v3 = s.theta_dot + 0.5 * a2 * dt;
        let a3 = f(t3, v3, w0sq, beta);

        let t4 = s.theta + v3 * dt;
        let v4 = s.theta_dot + a3 * dt;
        let a4 = f(t4, v4, w0sq, beta);

        return {
            theta: s.theta + (dt / 6.0) * (v1 + 2 * v2 + 2 * v3 + v4),
            theta_dot: s.theta_dot + (dt / 6.0) * (a1 + 2 * a2 + 2 * a3 + a4)
        };
    }

    // Main animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const p = getParams();
        const beta = p.c / (2 * p.m);
        const w0sq = p.g / p.L;
        const eigen = getEigenvalues(beta, w0sq);

        // Update UI styling based on regime
        updateUI(eigen);

        // Update Physics
        state = rk4(state, w0sq, beta, dt);
        
        // Track history for phase portrait
        history.push({ t: state.theta, td: state.theta_dot });
        if (history.length > 200) history.shift();
        
        // Track ghost trail for physical pendulum
        ghostTrail.push({ t: state.theta });
        if (ghostTrail.length > 30) ghostTrail.shift();

        // Render
        drawRoots(eigen);
        drawPhase(eigen);
        drawTower(p.L);
    }

    function updateUI(eigen) {
        let color = '';
        let label = '';
        let readout = '';
        
        if (eigen.beta === 0) {
            color = '#7c3aed'; // Purple
            label = 'Undamped';
            readout = `\u03BB = \u00B1 ${eigen.imag.toFixed(2)}i`;
        } else if (eigen.type === 'complex') {
            color = '#2563eb'; // Blue
            label = 'Underdamped';
            readout = `\u03BB = ${eigen.real.toFixed(2)} \u00B1 ${eigen.imag.toFixed(2)}i`;
        } else if (eigen.type === 'critical') {
            color = '#059669'; // Green
            label = 'Critically Damped';
            readout = `\u03BB = ${eigen.r1.toFixed(2)} (repeated)`;
        } else {
            color = '#d97706'; // Amber
            label = 'Overdamped';
            readout = `\u03BB\u2081 = ${eigen.r1.toFixed(2)}, \u03BB\u2082 = ${eigen.r2.toFixed(2)}`;
        }

        regimeLabel.innerText = label;
        regimeLabel.style.color = color;
        regimeBox.style.borderColor = color;
        wrapRoots.style.borderColor = color;
        wrapPhase.style.borderColor = color;
        wrapTower.style.borderColor = color;
        readoutRoots.innerText = readout;
    }

    function drawRoots(eigen) {
        let w = canvasRoots.width;
        let h = canvasRoots.height;
        let cx = w / 2;
        let cy = h / 2;
        // Scale to comfortably fit values up to ~10
        let scale = 25; 

        ctxRoots.clearRect(0, 0, w, h);

        // Shaded regions
        ctxRoots.fillStyle = 'rgba(239, 68, 68, 0.1)'; // Red right half (Unstable, technically inaccessible here since c>=0)
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
        
        ctxRoots.fillStyle = '#64748b';
        ctxRoots.font = '10px Arial';
        ctxRoots.fillText("Re", w - 20, cy - 5);
        ctxRoots.fillText("Im", cx + 5, 15);

        // Draw dots
        ctxRoots.fillStyle = '#0f172a';
        if (eigen.type === 'real' || eigen.type === 'critical') {
            let x1 = cx + eigen.r1 * scale;
            let x2 = cx + eigen.r2 * scale;
            
            // If critical, they overlap. Draw slightly offset visually or just one bigger dot
            if (eigen.type === 'critical') {
                ctxRoots.beginPath(); ctxRoots.arc(x1, cy, 7, 0, Math.PI*2); ctxRoots.fill();
                ctxRoots.strokeStyle = '#fff'; ctxRoots.lineWidth = 2; ctxRoots.stroke();
            } else {
                ctxRoots.beginPath(); ctxRoots.arc(x1, cy, 6, 0, Math.PI*2); ctxRoots.fill();
                ctxRoots.beginPath(); ctxRoots.arc(x2, cy, 6, 0, Math.PI*2); ctxRoots.fill();
            }
        } else {
            let x = cx + eigen.real * scale;
            let y1 = cy - eigen.imag * scale;
            let y2 = cy + eigen.imag * scale;
            
            ctxRoots.beginPath(); ctxRoots.arc(x, y1, 6, 0, Math.PI*2); ctxRoots.fill();
            ctxRoots.beginPath(); ctxRoots.arc(x, y2, 6, 0, Math.PI*2); ctxRoots.fill();
            
            // Connect pair with dashed line
            ctxRoots.strokeStyle = '#94a3b8';
            ctxRoots.lineWidth = 2;
            ctxRoots.setLineDash([4, 4]);
            ctxRoots.beginPath();
            ctxRoots.moveTo(x, y1); ctxRoots.lineTo(x, y2);
            ctxRoots.stroke();
            ctxRoots.setLineDash([]);
        }
    }

    function drawPhase(eigen) {
        let w = canvasPhase.width;
        let h = canvasPhase.height;
        let cx = w / 2;
        let cy = h / 2;
        let scaleTh = 50; // theta scale
        let scaleTd = 20; // theta_dot scale

        ctxPhase.clearRect(0, 0, w, h);

        // Axes
        ctxPhase.strokeStyle = '#e2e8f0';
        ctxPhase.lineWidth = 1;
        ctxPhase.beginPath();
        ctxPhase.moveTo(0, cy); ctxPhase.lineTo(w, cy); // Theta
        ctxPhase.moveTo(cx, 0); ctxPhase.lineTo(cx, h); // Theta dot
        ctxPhase.stroke();
        
        ctxPhase.fillStyle = '#64748b';
        ctxPhase.font = '10px Arial';
        ctxPhase.fillText("\u03B8", w - 15, cy - 5);
        ctxPhase.fillText("\u03B8\u02D9", cx + 5, 15);

        // Eigenvector guidelines (only if real distinct)
        if (eigen.type === 'real') {
            // A = [0 1; -w0^2 -2beta]
            // Eigenvectors satisfy Av = lambda v
            // v = [1, lambda]^T
            ctxPhase.strokeStyle = 'rgba(217, 119, 6, 0.2)'; // Faint amber
            ctxPhase.lineWidth = 2;
            
            // Draw line for lambda_1
            ctxPhase.beginPath();
            let l1_y = eigen.r1 * (w/2 / scaleTh) * scaleTd;
            ctxPhase.moveTo(0, cy - (-l1_y));
            ctxPhase.lineTo(w, cy - l1_y);
            ctxPhase.stroke();
            
            // Draw line for lambda_2
            ctxPhase.beginPath();
            let l2_y = eigen.r2 * (w/2 / scaleTh) * scaleTd;
            ctxPhase.moveTo(0, cy - (-l2_y));
            ctxPhase.lineTo(w, cy - l2_y);
            ctxPhase.stroke();
        }

        if (history.length === 0) return;

        // Trace with fading alpha
        for (let i = 1; i < history.length; i++) {
            let hPrev = history[i-1];
            let hCurr = history[i];
            let x1 = cx + hPrev.t * scaleTh;
            let y1 = cy - hPrev.td * scaleTd;
            let x2 = cx + hCurr.t * scaleTh;
            let y2 = cy - hCurr.td * scaleTd;
            
            let alpha = i / history.length;
            ctxPhase.strokeStyle = `rgba(15, 23, 42, ${alpha})`;
            ctxPhase.lineWidth = 2;
            ctxPhase.beginPath();
            ctxPhase.moveTo(x1, y1);
            ctxPhase.lineTo(x2, y2);
            ctxPhase.stroke();
        }

        // Current point dot
        let current = history[history.length - 1];
        ctxPhase.fillStyle = '#ef4444'; // Red dot
        ctxPhase.beginPath();
        ctxPhase.arc(cx + current.t * scaleTh, cy - current.td * scaleTd, 5, 0, Math.PI*2);
        ctxPhase.fill();
    }

    function drawTower(L) {
        let w = canvasTower.width;
        let h = canvasTower.height;
        let cx = w / 2;
        let cy = 50; // Pivot point at top

        ctxTower.clearRect(0, 0, w, h);

        // Ceiling/Pivot mount
        ctxTower.fillStyle = '#94a3b8';
        ctxTower.fillRect(cx - 30, cy - 10, 60, 10);
        ctxTower.beginPath(); ctxTower.arc(cx, cy, 6, 0, Math.PI*2); ctxTower.fill();

        let baseRodL = 120; // Visual base length
        let rodL = baseRodL + (L * 20); // Scale visual length slightly by L parameter

        // Draw ghost trails
        for (let i = 0; i < ghostTrail.length; i += 2) { // Step by 2 for performance/spacing
            let gt = ghostTrail[i];
            let alpha = (i / ghostTrail.length) * 0.3;
            ctxTower.save();
            ctxTower.translate(cx, cy);
            ctxTower.rotate(gt.t);
            
            // Faint bob
            ctxTower.fillStyle = `rgba(239, 68, 68, ${alpha})`;
            ctxTower.beginPath(); ctxTower.arc(0, rodL, 16, 0, Math.PI*2); ctxTower.fill();
            
            ctxTower.restore();
        }

        // Current Rod and Bob
        ctxTower.save();
        ctxTower.translate(cx, cy);
        ctxTower.rotate(state.theta);
        
        // Rod
        ctxTower.fillStyle = '#eab308'; // Golden rod
        ctxTower.fillRect(-4, 0, 8, rodL);
        
        // Bob
        ctxTower.fillStyle = '#ef4444'; // Red payload
        ctxTower.beginPath(); ctxTower.arc(0, rodL, 16, 0, Math.PI*2); ctxTower.fill();
        
        // Bob highlight (simple 3D effect)
        ctxTower.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctxTower.beginPath(); ctxTower.arc(-4, rodL - 4, 4, 0, Math.PI*2); ctxTower.fill();

        ctxTower.restore();
    }

    // Start
    updateLabels();
    animate();
};
