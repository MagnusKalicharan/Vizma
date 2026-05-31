/* ═══════════════════════════════════════════════════════════════
   KINEMATICS MASTERCLASS — VIBRATIONS & WAVES
   ═══════════════════════════════════════════════════════════════ */

window.initVibrations = function() {
    initVibQ1();
    initVibQ2();
    initVibQ3();
};

window.initVibWaves = function() {
    const canvas = document.getElementById('vib-waves-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight || 400;
    const W = canvas.width, H = canvas.height;
    
    let isAnimating = true;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    let t = 0;
    
    const ampInput = document.getElementById('vw-amp');
    const freqInput = document.getElementById('vw-freq');
    const speedInput = document.getElementById('vw-speed');
    const btnPause = document.getElementById('vw-btn-pause');
    
    // Arrays for particles
    const numParticles = 60;
    const spacing = (W - 100) / numParticles;
    const startX = 50;
    
    function draw() {
        ctx.clearRect(0, 0, W, H);
        
        let A = parseFloat(ampInput.value) * 30; // Pixel scaling
        let f = parseFloat(freqInput.value);
        let v = parseFloat(speedInput.value) * 50; // Pixel scaling for speed
        let lambda = v / f;
        let k = 2 * Math.PI / lambda;
        let omega = 2 * Math.PI * f;
        
        document.getElementById('vw-amp-val').innerText = parseFloat(ampInput.value).toFixed(1);
        document.getElementById('vw-freq-val').innerText = f.toFixed(1);
        document.getElementById('vw-speed-val').innerText = parseFloat(speedInput.value).toFixed(1);
        
        // Transverse Wave (Top half)
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Transverse Wave', 20, 30);
        let transY = H * 0.3;
        
        // Draw equilibrium line
        ctx.strokeStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(0, transY); ctx.lineTo(W, transY); ctx.stroke();
        
        for (let i = 0; i < numParticles; i++) {
            let px0 = startX + i * spacing;
            let dy = A * Math.sin(k * px0 - omega * t);
            
            ctx.beginPath();
            ctx.arc(px0, transY + dy, 4, 0, Math.PI*2);
            ctx.fillStyle = (i === 15) ? '#ef4444' : '#3b82f6'; // Highlight one particle
            ctx.fill();
        }
        
        // Longitudinal Wave (Bottom half)
        ctx.fillStyle = '#1e293b';
        ctx.fillText('Longitudinal Wave', 20, H * 0.65);
        let longY = H * 0.8;
        
        // Draw equilibrium line
        ctx.strokeStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(0, longY); ctx.lineTo(W, longY); ctx.stroke();
        
        for (let i = 0; i < numParticles; i++) {
            let px0 = startX + i * spacing;
            let dx = A * Math.sin(k * px0 - omega * t);
            
            ctx.beginPath();
            // Draw a vertical line segment as a "coil" or particle
            ctx.moveTo(px0 + dx, longY - 15);
            ctx.lineTo(px0 + dx, longY + 15);
            ctx.strokeStyle = (i === 15) ? '#ef4444' : '#3b82f6'; // Highlight one particle
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        if (isAnimating) {
            t += 0.016;
            window.currentVibReqId = requestAnimationFrame(draw);
        }
    }
    
    draw();
    
    btnPause.onclick = () => {
        isAnimating = !isAnimating;
        btnPause.innerText = isAnimating ? "Pause" : "Play";
        if (isAnimating) draw();
        else cancelAnimationFrame(window.currentVibReqId);
    };
    [ampInput, freqInput, speedInput].forEach(el => el.addEventListener('input', () => { if(!isAnimating) draw(); }));
};

window.initVibInterfere = function() {
    const canvas = document.getElementById('vib-interfere-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight || 400;
    const W = canvas.width, H = canvas.height;
    
    let isAnimating = false;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    let t = 0;
    
    const ampAInput = document.getElementById('vi-ampa');
    const ampBInput = document.getElementById('vi-ampb');
    
    let speed = 200; // pixels per second
    
    function draw() {
        ctx.clearRect(0, 0, W, H);
        
        let A1 = parseFloat(ampAInput.value) * 50;
        let A2 = parseFloat(ampBInput.value) * 50;
        
        document.getElementById('vi-ampa-val').innerText = parseFloat(ampAInput.value).toFixed(1);
        document.getElementById('vi-ampb-val').innerText = parseFloat(ampBInput.value).toFixed(1);
        
        let centerY = H / 2;
        
        // Draw equilibrium line
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(W, centerY); ctx.stroke();
        
        // Pulse centers
        let c1 = 100 + speed * t;
        let c2 = W - 100 - speed * t;
        
        // Draw individual pulses (faint)
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'; // Pulse A (Blue)
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let x=0; x<W; x+=2) {
            let y1 = centerY - A1 * Math.exp(-Math.pow(x - c1, 2) / 2000);
            if(x===0) ctx.moveTo(x, y1); else ctx.lineTo(x, y1);
        }
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; // Pulse B (Red)
        ctx.beginPath();
        for(let x=0; x<W; x+=2) {
            let y2 = centerY - A2 * Math.exp(-Math.pow(x - c2, 2) / 2000);
            if(x===0) ctx.moveTo(x, y2); else ctx.lineTo(x, y2);
        }
        ctx.stroke();
        
        // Draw resultant superposition (solid purple)
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for(let x=0; x<W; x+=2) {
            let y1 = A1 * Math.exp(-Math.pow(x - c1, 2) / 2000);
            let y2 = A2 * Math.exp(-Math.pow(x - c2, 2) / 2000);
            let yRes = centerY - (y1 + y2);
            if(x===0) ctx.moveTo(x, yRes); else ctx.lineTo(x, yRes);
        }
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 14px Arial'; ctx.fillText('Pulse A', 20, 30);
        ctx.fillStyle = '#ef4444'; ctx.fillText('Pulse B', 20, 50);
        ctx.fillStyle = '#8b5cf6'; ctx.fillText('Superposition (A + B)', 20, 70);
        
        if (isAnimating) {
            t += 0.016;
            if (c1 > W + 200) { isAnimating = false; }
            window.currentVibReqId = requestAnimationFrame(draw);
        }
    }
    
    draw();
    
    document.getElementById('vi-btn-fire').onclick = () => { if(!isAnimating) { if(t > W/speed) t = 0; isAnimating = true; draw(); } };
    document.getElementById('vi-btn-pause').onclick = () => { 
        if(isAnimating) { isAnimating = false; cancelAnimationFrame(window.currentVibReqId); }
        else { t += 0.05; draw(); } // Step forward
    };
    document.getElementById('vi-btn-reset').onclick = () => { isAnimating = false; cancelAnimationFrame(window.currentVibReqId); t = 0; draw(); };
    [ampAInput, ampBInput].forEach(el => el.addEventListener('input', () => { if(!isAnimating) draw(); }));
};

window.initVibStanding = function() {
    const canvas = document.getElementById('vib-standing-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight || 400;
    const W = canvas.width, H = canvas.height;
    
    let isAnimating = true;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    let t = 0;
    
    const nInput = document.getElementById('vs-n');
    const tensionInput = document.getElementById('vs-tension');
    const muInput = document.getElementById('vs-mu');
    
    function draw() {
        ctx.clearRect(0, 0, W, H);
        
        let n = parseInt(nInput.value);
        let T = parseFloat(tensionInput.value);
        let mu = parseFloat(muInput.value);
        
        document.getElementById('vs-n-val').innerText = n;
        document.getElementById('vs-tension-val').innerText = T.toFixed(0);
        document.getElementById('vs-mu-val').innerText = mu.toFixed(2);
        
        let L = W - 100; // physical length of string in pixels
        let v = Math.sqrt(T / mu); // wave speed
        let lambda = 2 * L / n;
        let f = v / lambda;
        
        document.getElementById('vs-speed-calc').innerText = v.toFixed(1);
        document.getElementById('vs-freq-calc').innerText = f.toFixed(2);
        
        let centerY = H / 2;
        let startX = 50;
        
        // Draw string envelope (faint)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= L; x += 2) {
            let env = 60 * Math.sin(n * Math.PI * x / L);
            if(x===0) ctx.moveTo(startX + x, centerY - env); else ctx.lineTo(startX + x, centerY - env);
        }
        ctx.stroke();
        ctx.beginPath();
        for (let x = 0; x <= L; x += 2) {
            let env = 60 * Math.sin(n * Math.PI * x / L);
            if(x===0) ctx.moveTo(startX + x, centerY + env); else ctx.lineTo(startX + x, centerY + env);
        }
        ctx.stroke();
        
        // Draw actual oscillating string
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // The frequency for animation shouldn't be too fast, so scale it for visual comfort
        let displayOmega = 2 * Math.PI * Math.min(f, 2.0); 
        for (let x = 0; x <= L; x += 2) {
            // Standing wave equation: y(x,t) = 2A * sin(kx) * cos(wt)
            let y = 60 * Math.sin(n * Math.PI * x / L) * Math.cos(displayOmega * t);
            if (x === 0) ctx.moveTo(startX + x, centerY - y);
            else ctx.lineTo(startX + x, centerY - y);
        }
        ctx.stroke();
        
        // Draw fixed nodes
        ctx.fillStyle = '#475569';
        ctx.beginPath(); ctx.arc(startX, centerY, 6, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(startX + L, centerY, 6, 0, Math.PI*2); ctx.fill();
        
        // Draw nodes (points of zero displacement)
        ctx.fillStyle = '#ef4444';
        for (let i = 1; i < n; i++) {
            ctx.beginPath();
            ctx.arc(startX + i * (L/n), centerY, 4, 0, Math.PI*2);
            ctx.fill();
        }
        
        if (isAnimating) {
            t += 0.016;
            window.currentVibReqId = requestAnimationFrame(draw);
        }
    }
    
    draw();
    // Cleanup if leaving page
    window.addEventListener('hashchange', () => { isAnimating = false; cancelAnimationFrame(window.currentVibReqId); });
};

function initVibQ1() {
    const canvas = document.getElementById('vib-q1-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight || 400;
    const W = canvas.width, H = canvas.height;
    
    let isAnimating = false;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    let t = 0;
    
    const mInput = document.getElementById('vib-q1-m');
    const kInput = document.getElementById('vib-q1-k');
    const aInput = document.getElementById('vib-q1-A');
    
    const mVal = document.getElementById('vib-q1-m-val');
    const kVal = document.getElementById('vib-q1-k-val');
    const aVal = document.getElementById('vib-q1-A-val');

    if(!window.vibCharts) window.vibCharts = [];
    window.vibCharts.forEach(c => c.destroy());
    window.vibCharts = [];

    const ctxX = document.getElementById('chart-vib-x').getContext('2d');
    const ctxE = document.getElementById('chart-vib-e').getContext('2d');
    
    const chartX = new Chart(ctxX, {
        type: 'line', data: { labels: [], datasets: [{ label: 'Position (m)', borderColor: '#3b82f6', data: [], pointRadius: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { title: {display: true, text: 'Time (s)'} }, y: { suggestedMin: -5, suggestedMax: 5 } } }
    });
    const chartE = new Chart(ctxE, {
        type: 'line', data: { labels: [], datasets: [
            { label: 'Kinetic', borderColor: '#10b981', data: [], pointRadius: 0 },
            { label: 'Potential', borderColor: '#3b82f6', data: [], pointRadius: 0 },
            { label: 'Total', borderColor: '#f59e0b', borderDash: [5,5], data: [], pointRadius: 0 }
        ]},
        options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { title: {display: true, text: 'Time (s)'} }, y: { suggestedMin: 0, suggestedMax: 50 } } }
    });
    window.vibCharts.push(chartX, chartE);
    
    function draw() {
        ctx.clearRect(0, 0, W, H);
        
        let m = parseFloat(mInput.value);
        let k = parseFloat(kInput.value);
        let A = parseFloat(aInput.value);
        
        mVal.innerText = m.toFixed(1);
        kVal.innerText = k.toFixed(1);
        aVal.innerText = A.toFixed(1);
        
        let omega = Math.sqrt(k / m);
        let x = A * Math.cos(omega * t);
        let v = -A * omega * Math.sin(omega * t);
        let a = -A * omega * omega * Math.cos(omega * t);
        
        // Visual constants
        const originX = W / 2;
        const originY = H / 2;
        const scale = 40; // pixels per meter
        
        // Draw Equilibrium line
        ctx.strokeStyle = '#64748b';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(originX, 50);
        ctx.lineTo(originX, H - 50);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw Wall
        ctx.fillStyle = '#64748b';
        ctx.fillRect(originX - 250, originY - 10, 10, 20); // Anchor point
        
        // Draw Spring
        let massX = originX + x * scale;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX - 240, originY);
        let numCoils = 15;
        let coilWidth = (massX - (originX - 240)) / numCoils;
        for(let i=1; i<=numCoils; i++) {
            let sign = i % 2 === 0 ? 1 : -1;
            ctx.lineTo((originX - 240) + i * coilWidth - coilWidth/2, originY + sign * 15);
            ctx.lineTo((originX - 240) + i * coilWidth, originY);
        }
        ctx.stroke();
        
        // Draw Mass
        ctx.fillStyle = '#3b82f6';
        let boxSize = 40;
        ctx.fillRect(massX - boxSize/2, originY - boxSize/2, boxSize, boxSize);
        ctx.strokeStyle = '#1e40af';
        ctx.strokeRect(massX - boxSize/2, originY - boxSize/2, boxSize, boxSize);
        
        // Draw Vectors
        ctx.font = 'bold 14px Arial';
        if (Math.abs(v) > 0.1) {
            drawArrow(ctx, massX, originY - 30, massX + v * 10, originY - 30, '#10b981', 2);
            ctx.fillStyle = '#10b981'; ctx.fillText('v = ' + v.toFixed(2) + ' m/s', massX + v * 10 - (v < 0 ? 80 : 0), originY - 40);
        }
        if (Math.abs(a) > 0.1) {
            drawArrow(ctx, massX, originY + 30, massX + a * 5, originY + 30, '#ef4444', 2);
            ctx.fillStyle = '#ef4444'; 
            let F = m * a;
            let textX = massX + a * 5 - (a < 0 ? 100 : 0);
            ctx.fillText('a = ' + a.toFixed(2) + ' m/s²', textX, originY + 48);
            ctx.fillText('F = ' + F.toFixed(2) + ' N', textX, originY + 64);
        }
        
        let KE = 0.5 * m * v * v;
        let PE = 0.5 * k * x * x;
        let TE = KE + PE;
        
        if (isAnimating) {
            chartX.data.labels.push(t.toFixed(1));
            chartX.data.datasets[0].data.push(x);
            if (chartX.data.labels.length > 100) { chartX.data.labels.shift(); chartX.data.datasets.forEach(d => d.data.shift()); }
            chartX.update();

            chartE.data.labels.push(t.toFixed(1));
            chartE.data.datasets[0].data.push(KE);
            chartE.data.datasets[1].data.push(PE);
            chartE.data.datasets[2].data.push(TE);
            if (chartE.data.labels.length > 100) { chartE.data.labels.shift(); chartE.data.datasets.forEach(d => d.data.shift()); }
            chartE.update();

            t += 0.05;
            window.currentVibReqId = requestAnimationFrame(draw);
        }
    }
    
    draw();
    
    document.getElementById('vib-q1-play').onclick = () => { if(!isAnimating) { isAnimating = true; draw(); } };
    document.getElementById('vib-q1-pause').onclick = () => { isAnimating = false; cancelAnimationFrame(window.currentVibReqId); };
    document.getElementById('vib-q1-reset').onclick = () => { isAnimating = false; cancelAnimationFrame(window.currentVibReqId); t = 0; chartX.data.labels=[]; chartX.data.datasets[0].data=[]; chartE.data.labels=[]; chartE.data.datasets.forEach(d=>d.data=[]); chartX.update(); chartE.update(); draw(); };
    [mInput, kInput, aInput].forEach(el => el.addEventListener('input', () => { if(!isAnimating) draw(); }));
}

function initVibQ2() {
    const canvas = document.getElementById('vib-q2-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight || 300;
    const W = canvas.width, H = canvas.height;
    
    let isAnimating = false;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    let t = 0;
    let trace = [];
    
    const traceCb = document.getElementById('vib-q2-trace');

    if(!window.vibCharts) window.vibCharts = [];
    window.vibCharts.forEach(c => c.destroy());
    window.vibCharts = [];
    const ctxY = document.getElementById('chart-vib-circ-y').getContext('2d');
    const ctxTheta = document.getElementById('chart-vib-circ-theta').getContext('2d');
    
    const chartY = new Chart(ctxY, {
        type: 'line', data: { labels: [], datasets: [
            { label: 'Circular Projection', borderColor: '#ef4444', data: [], pointRadius: 0 },
            { label: 'SHM Oscillator', borderColor: '#3b82f6', borderDash: [5,5], data: [], pointRadius: 0 }
        ] },
        options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { title: {display: true, text: 'Time (s)'} }, y: { suggestedMin: -100, suggestedMax: 100 } } }
    });
    const chartTheta = new Chart(ctxTheta, {
        type: 'line', data: { labels: [], datasets: [{ label: 'Angle θ (rad)', borderColor: '#8b5cf6', data: [], pointRadius: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { title: {display: true, text: 'Time (s)'} } } }
    });
    window.vibCharts.push(chartY, chartTheta);
    
    function draw() {
        ctx.clearRect(0, 0, W, H);
        
        let omega = 2; // rad/s
        let R = 80;
        let cx = 200;
        let cy = H/2;
        
        let theta = omega * t;
        let px = cx + R * Math.cos(theta);
        let py = cy - R * Math.sin(theta); // Subtract because Canvas Y is down
        
        // Left side: Circular Motion
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2); ctx.strokeStyle = '#64748b'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.strokeStyle = '#94a3b8'; ctx.stroke();
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI*2); ctx.fillStyle = '#ef4444'; ctx.fill();
        
        // Right side: SHM trace
        let shmStartX = cx + 200;
        
        // Draw projection line
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(shmStartX, py); ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)'; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
        
        // Draw SHM dot
        ctx.beginPath(); ctx.arc(shmStartX, py, 6, 0, Math.PI*2); ctx.fillStyle = '#3b82f6'; ctx.fill();
        
        // Draw Trace
        if(isAnimating) { trace.push({y: py}); if(trace.length > W - shmStartX) trace.shift(); }
        
        if (traceCb.checked) {
            ctx.beginPath(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
            for(let i=0; i<trace.length; i++) {
                let tx = shmStartX + (trace.length - i);
                if(i===0) ctx.moveTo(tx, trace[i].y); else ctx.lineTo(tx, trace[i].y);
            }
            ctx.stroke();
            // Axis line
            ctx.beginPath(); ctx.moveTo(shmStartX, cy); ctx.lineTo(W, cy); ctx.strokeStyle = '#64748b'; ctx.stroke();
        }
        
        if (isAnimating) {
            chartY.data.labels.push(t.toFixed(1));
            chartY.data.datasets[0].data.push(R * Math.sin(theta));
            chartY.data.datasets[1].data.push(R * Math.sin(theta));
            if (chartY.data.labels.length > 100) { chartY.data.labels.shift(); chartY.data.datasets.forEach(d => d.data.shift()); }
            chartY.update();

            chartTheta.data.labels.push(t.toFixed(1));
            chartTheta.data.datasets[0].data.push(theta);
            if (chartTheta.data.labels.length > 100) { chartTheta.data.labels.shift(); chartTheta.data.datasets.forEach(d => d.data.shift()); }
            chartTheta.update();

            t += 0.02;
            window.currentVibReqId = requestAnimationFrame(draw);
        }
    }
    
    draw();
    
    document.getElementById('vib-q2-play').onclick = () => { if(!isAnimating) { isAnimating = true; draw(); } };
    document.getElementById('vib-q2-pause').onclick = () => { isAnimating = false; cancelAnimationFrame(window.currentVibReqId); };
    traceCb.onchange = () => { if(!traceCb.checked) trace = []; if(!isAnimating) draw(); };
}

// 3. The Pendulum
// 3. The Pendulum
window.initVibQ3 = function() {
    const canvas = document.getElementById('vib-q3-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = canvas.parentElement;
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight || 500;
    const W = canvas.width, H = canvas.height;
    
    let isAnimating = false;
    if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    let time = 0;
    
    let lInput = document.getElementById('vib-q3-L');
    let gInput = document.getElementById('vib-q3-g');
    let thetaInput = document.getElementById('vib-q3-theta');
    let lVal = document.getElementById('vib-q3-L-val');
    let gVal = document.getElementById('vib-q3-g-val');
    let thetaVal = document.getElementById('vib-q3-theta-val');
    
    let cbGraphs = document.getElementById('vib-q3-show-graphs');
    let cbValues = document.getElementById('vib-q3-show-values');
    let chartsRow = document.getElementById('vib-q3-charts-row');
    
    let L = parseFloat(lInput.value);
    let g = parseFloat(gInput.value);
    let theta0 = parseFloat(thetaInput.value) * Math.PI / 180;
    let theta = theta0;
    let omega = 0;
    
    let phaseTrail = [];
    
    if(!window.vibCharts) window.vibCharts = [];
    window.vibCharts.forEach(c => c.destroy());
    window.vibCharts = [];
    
    const ctxTheta = document.getElementById('chart-vib-pend-theta').getContext('2d');
    const ctxOmega = document.getElementById('chart-vib-pend-omega').getContext('2d');
    
    const chartTheta = new Chart(ctxTheta, {
        type: 'line', data: { labels: [], datasets: [{ label: 'Angle θ (rad)', borderColor: '#f59e0b', data: [], pointRadius: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { title: {display: true, text: 'Time (s)'}, ticks: {display: false} }, y: { suggestedMin: -3, suggestedMax: 3 } } }
    });
    const chartOmega = new Chart(ctxOmega, {
        type: 'line', data: { labels: [], datasets: [{ label: 'Angular Vel ω (rad/s)', borderColor: '#3b82f6', data: [], pointRadius: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { x: { title: {display: true, text: 'Time (s)'}, ticks: {display: false} }, y: { suggestedMin: -8, suggestedMax: 8 } } }
    });
    window.vibCharts.push(chartTheta, chartOmega);
    
    function reset() {
        L = parseFloat(lInput.value);
        g = parseFloat(gInput.value);
        theta0 = parseFloat(thetaInput.value) * Math.PI / 180;
        theta = theta0;
        omega = 0;
        time = 0;
        phaseTrail = [];
        
        chartTheta.data.labels = []; chartTheta.data.datasets[0].data = [];
        chartOmega.data.labels = []; chartOmega.data.datasets[0].data = [];
        chartTheta.update(); chartOmega.update();
        
        draw();
    }
    
    function rk4Step(dt) {
        let f1_t = omega;
        let f1_o = -(g/L) * Math.sin(theta);
        
        let t2 = theta + 0.5 * dt * f1_t;
        let o2 = omega + 0.5 * dt * f1_o;
        let f2_t = o2;
        let f2_o = -(g/L) * Math.sin(t2);
        
        let t3 = theta + 0.5 * dt * f2_t;
        let o3 = omega + 0.5 * dt * f2_o;
        let f3_t = o3;
        let f3_o = -(g/L) * Math.sin(t3);
        
        let t4 = theta + dt * f3_t;
        let o4 = omega + dt * f3_o;
        let f4_t = o4;
        let f4_o = -(g/L) * Math.sin(t4);
        
        theta += (dt/6) * (f1_t + 2*f2_t + 2*f3_t + f4_t);
        omega += (dt/6) * (f1_o + 2*f2_o + 2*f3_o + f4_o);
    }
    
    function drawArrow(ctx, fromx, fromy, tox, toy, color) {
        let dx = tox - fromx;
        let dy = toy - fromy;
        if(Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        let headlen = 10;
        let angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;
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
        
        let splitX = W * 0.6;
        
        // PENDULUM RENDERING
        let pivotX = splitX / 2;
        let pivotY = 100;
        let scaleL = 70;
        
        let bx = pivotX + L * scaleL * Math.sin(theta);
        let by = pivotY + L * scaleL * Math.cos(theta);
        
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 6, 0, 2*Math.PI);
        ctx.fillStyle = '#94a3b8';
        ctx.fill();
        
        let m = 1.0;
        let Fg_tangent = -m * g * Math.sin(theta); 
        let Ftension = m * g * Math.cos(theta) + m * L * omega * omega;
        
        let vecScale = 4;
        let dirX = Math.cos(theta); 
        let dirY = -Math.sin(theta); 
        
        let tangLen = Fg_tangent * vecScale;
        let arrgX = bx + tangLen * dirX;
        let arrgY = by + tangLen * dirY;
        drawArrow(ctx, bx, by, arrgX, arrgY, '#22c55e');
        
        let tenLen = Ftension * vecScale;
        let arrtX = bx - tenLen * Math.sin(theta);
        let arrtY = by - tenLen * Math.cos(theta);
        drawArrow(ctx, bx, by, arrtX, arrtY, '#a855f7');
        
        // Show Values
        if (cbValues.checked) {
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#16a34a'; // Darker Green for better contrast on white background
            ctx.fillText(`Fg(t) = ${Fg_tangent.toFixed(2)} N`, arrgX + 10, arrgY);
            ctx.fillStyle = '#9333ea'; // Darker Purple
            ctx.fillText(`T = ${Ftension.toFixed(2)} N`, arrtX - 10, arrtY - 10);
        }
        
        ctx.beginPath();
        ctx.arc(bx, by, 16, 0, 2*Math.PI);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        
        // PHASE SPACE RENDERING
        let psCX = splitX + (W - splitX) / 2;
        let psCY = H / 2;
        let thetaScale = (W - splitX) / (2 * Math.PI);
        let omegaScale = 25;
        
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(splitX + 20, psCY); ctx.lineTo(W - 20, psCY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(psCX, 20); ctx.lineTo(psCX, H-20); ctx.stroke();
        
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Arial';
        ctx.fillText('θ (Angle)', W - 60, psCY - 10);
        ctx.fillText('ω (Vel)', psCX + 10, 30);
        
        if(isAnimating) {
            phaseTrail.push({t: theta, o: omega});
            if(phaseTrail.length > 500) phaseTrail.shift();
        }
        
        if (phaseTrail.length > 1) {
            ctx.beginPath();
            for(let i=0; i<phaseTrail.length; i++) {
                let px = psCX + phaseTrail[i].t * thetaScale;
                let py = psCY - phaseTrail[i].o * omegaScale;
                if(i===0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        let curPX = psCX + theta * thetaScale;
        let curPY = psCY - omega * omegaScale;
        ctx.beginPath();
        ctx.arc(curPX, curPY, 5, 0, 2*Math.PI);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        
        // LIVE BAR CHART
        let PE = m * g * L * (1 - Math.cos(theta));
        let KE = 0.5 * m * (L * omega) * (L * omega);
        let TE = PE + KE;
        
        let barW = 30;
        let maxBarH = 150;
        let teScale = TE > 0 ? (maxBarH / TE) : 0;
        
        let barX = 30;
        let barY = H - 30;
        
        let keH = KE * teScale;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(barX, barY - keH, barW, keH);
        ctx.fillStyle = '#64748b'; ctx.fillText('KE', barX + 5, barY + 15);
        
        let peH = PE * teScale;
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(barX + barW + 10, barY - peH, barW, peH);
        ctx.fillStyle = '#64748b'; ctx.fillText('PE', barX + barW + 15, barY + 15);
        
        let teH = TE * teScale;
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(barX + 2*barW + 20, barY - teH, barW, teH);
        ctx.fillStyle = '#64748b'; ctx.fillText('TE', barX + 2*barW + 25, barY + 15);
        
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath(); ctx.moveTo(splitX, 0); ctx.lineTo(splitX, H); ctx.stroke();
        
        if(isAnimating) {
            let dt = 0.016;
            rk4Step(dt);
            time += dt;
            
            // Update charts
            if (cbGraphs.checked) {
                chartTheta.data.labels.push(time.toFixed(1));
                chartTheta.data.datasets[0].data.push(theta);
                if (chartTheta.data.labels.length > 150) { chartTheta.data.labels.shift(); chartTheta.data.datasets[0].data.shift(); }
                
                chartOmega.data.labels.push(time.toFixed(1));
                chartOmega.data.datasets[0].data.push(omega);
                if (chartOmega.data.labels.length > 150) { chartOmega.data.labels.shift(); chartOmega.data.datasets[0].data.shift(); }
                
                chartTheta.update();
                chartOmega.update();
            }
            
            window.currentVibReqId = requestAnimationFrame(draw);
        }
    }
    
    reset();
    
    lInput.oninput = () => { lVal.innerText = parseFloat(lInput.value).toFixed(1); reset(); };
    gInput.oninput = () => { gVal.innerText = parseFloat(gInput.value).toFixed(1); reset(); };
    thetaInput.oninput = () => { thetaVal.innerText = parseInt(thetaInput.value); reset(); };
    
    cbGraphs.onchange = () => { chartsRow.style.display = cbGraphs.checked ? 'flex' : 'none'; };
    chartsRow.style.display = cbGraphs.checked ? 'flex' : 'none';
    
    cbValues.onchange = () => { if(!isAnimating) draw(); };
    
    document.getElementById('vib-q3-play').onclick = () => { if(!isAnimating){ isAnimating = true; draw(); } };
    document.getElementById('vib-q3-pause').onclick = () => { isAnimating = false; if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId); };
    document.getElementById('vib-q3-reset').onclick = () => { isAnimating = false; if(window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId); reset(); };
};



// Utility
function drawArrow(ctx, fromx, fromy, tox, toy, color, width) {
    let headlen = 10; 
    let dx = tox - fromx;
    let dy = toy - fromy;
    let angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}


// 12. Double Pendulum
window.initVibDoublePendulum = function() {
    const canvas = document.getElementById('vib-dp-canvas');
    const graphCanvas = document.getElementById('vib-dp-graph');
    if (!canvas || !graphCanvas) return;
    
    const ctx = canvas.getContext('2d');
    const gCtx = graphCanvas.getContext('2d', { willReadFrequently: true });
    
    let isAnimating = true;
    if (window.currentVibReqId) cancelAnimationFrame(window.currentVibReqId);
    
    const W = canvas.width;
    const H = canvas.height;
    const gW = graphCanvas.width;
    const gH = graphCanvas.height;
    
    // UI Elements
    const m1Input = document.getElementById('vdp-m1');
    const m2Input = document.getElementById('vdp-m2');
    const l1Input = document.getElementById('vdp-l1');
    const l2Input = document.getElementById('vdp-l2');
    const gInput = document.getElementById('vdp-g');
    
    const trace1Check = document.getElementById('vdp-trace1');
    const trace2Check = document.getElementById('vdp-trace2');
    const graphModeSelect = document.getElementById('vdp-graph-mode');
    
    let m1 = parseFloat(m1Input.value);
    let m2 = parseFloat(m2Input.value);
    let l1 = parseFloat(l1Input.value);
    let l2 = parseFloat(l2Input.value);
    let G = parseFloat(gInput.value);
    
    // Physics State [theta1, theta2, omega1, omega2]
    // Default to a small angle to demonstrate periodic Lissajous figures
    let state = [0.5, 0, 0, 0]; 
    
    let trace1 = [];
    let trace2 = [];
    const MAX_TRACE = 300;
    
    let graphData = [];
    const MAX_GRAPH = 500;
    
    let time = 0;
    let lastTime = performance.now();
    
    // For persistent Lissajous
    let lastGraphMode = graphModeSelect.value;
    let lastLissajousX = -1;
    let lastLissajousY = -1;
    
    function reset() {
        m1Input.value = 10;
        m2Input.value = 10;
        l1Input.value = 1.5;
        l2Input.value = 1.5;
        gInput.value = 9.8;
        updateVals();
        
        state = [0.5, 0, 0, 0];
        trace1 = [];
        trace2 = [];
        graphData = [];
        time = 0;
        lastLissajousX = -1;
        lastLissajousY = -1;
        clearGraph();
    }
    
    function updateVals() {
        m1 = parseFloat(m1Input.value);
        m2 = parseFloat(m2Input.value);
        l1 = parseFloat(l1Input.value);
        l2 = parseFloat(l2Input.value);
        G = parseFloat(gInput.value);
        document.getElementById('vdp-m1-val').innerText = m1;
        document.getElementById('vdp-m2-val').innerText = m2;
        document.getElementById('vdp-l1-val').innerText = l1;
        document.getElementById('vdp-l2-val').innerText = l2;
        document.getElementById('vdp-g-val').innerText = G.toFixed(1);
    }
    
    m1Input.oninput = updateVals;
    m2Input.oninput = updateVals;
    l1Input.oninput = updateVals;
    l2Input.oninput = updateVals;
    gInput.oninput = updateVals;
    
    
    function clearGraph() {
        gCtx.fillStyle = '#ffffff';
        gCtx.fillRect(0, 0, gW, gH);
        
        let mode = graphModeSelect.value;
        if (mode === 'lissajous-theta' || mode === 'lissajous-xy') {
            // Draw grid
            gCtx.strokeStyle = '#f1f5f9'; gCtx.lineWidth = 1;
            gCtx.beginPath();
            for(let i=0; i<gW; i+=40) { gCtx.moveTo(i, 0); gCtx.lineTo(i, gH); }
            for(let i=0; i<gH; i+=40) { gCtx.moveTo(0, i); gCtx.lineTo(gW, i); }
            gCtx.stroke();
            
            // Draw axes
            gCtx.strokeStyle = '#cbd5e1'; gCtx.lineWidth = 2;
            gCtx.beginPath(); gCtx.moveTo(gW/2, 0); gCtx.lineTo(gW/2, gH); gCtx.stroke();
            gCtx.beginPath(); gCtx.moveTo(0, gH/2); gCtx.lineTo(gW, gH/2); gCtx.stroke();
            
            gCtx.fillStyle = '#64748b';
            gCtx.font = '12px Arial';
            if (mode === 'lissajous-theta') {
                gCtx.fillText("Lissajous: θ₁ vs θ₂", 10, 20);
                gCtx.fillText("θ₁", gW - 20, gH/2 - 10);
                gCtx.fillText("θ₂", gW/2 + 10, 20);
            } else {
                gCtx.fillText("Lissajous: x2 vs y2", 10, 20);
            }
        }
    }
graphModeSelect.onchange = () => {
        lastGraphMode = graphModeSelect.value;
        lastLissajousX = -1;
        lastLissajousY = -1;
        clearGraph();
    };
    
    function getDerivatives(s) {
        let t1 = s[0], t2 = s[1], w1 = s[2], w2 = s[3];
        let delta = t1 - t2;
        
        let den1 = l1 * (2*m1 + m2 - m2*Math.cos(2*t1 - 2*t2));
        let num1 = -G*(2*m1 + m2)*Math.sin(t1) - m2*G*Math.sin(t1 - 2*t2) - 2*Math.sin(delta)*m2*(w2*w2*l2 + w1*w1*l1*Math.cos(delta));
        let alpha1 = num1 / den1;
        
        let den2 = l2 * (2*m1 + m2 - m2*Math.cos(2*t1 - 2*t2));
        let num2 = 2*Math.sin(delta)*(w1*w1*l1*(m1+m2) + G*(m1+m2)*Math.cos(t1) + w2*w2*l2*m2*Math.cos(delta));
        let alpha2 = num2 / den2;
        
        return [w1, w2, alpha1, alpha2];
    }
    
    function rk4Step(dt) {
        let k1 = getDerivatives(state);
        let s2 = state.map((v, i) => v + k1[i] * dt * 0.5);
        let k2 = getDerivatives(s2);
        let s3 = state.map((v, i) => v + k2[i] * dt * 0.5);
        let k3 = getDerivatives(s3);
        let s4 = state.map((v, i) => v + k3[i] * dt);
        let k4 = getDerivatives(s4);
        
        for(let i=0; i<4; i++) {
            state[i] += (dt / 6) * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]);
        }
    }
    
    
    function drawGraph() {
        let mode = graphModeSelect.value;
        
        // Let's use 1.0 rad as the max scale for the graph height/width instead of Math.PI (which is 3.14)
        // This will make small angles (0.5) appear much larger on the graph!
        const maxAngleScale = 1.2; 
        
        if (mode === 'time') {
            gCtx.fillStyle = '#ffffff';
            gCtx.fillRect(0, 0, gW, gH);
            
            // Draw time series background grid and axes
            gCtx.strokeStyle = '#f1f5f9'; gCtx.lineWidth = 1;
            gCtx.beginPath();
            for(let i=0; i<gW; i+=50) { gCtx.moveTo(i, 0); gCtx.lineTo(i, gH); }
            for(let i=0; i<gH; i+=25) { gCtx.moveTo(0, i); gCtx.lineTo(gW, i); }
            gCtx.stroke();
            
            // Zero line (x-axis)
            gCtx.strokeStyle = '#cbd5e1'; gCtx.lineWidth = 2;
            gCtx.beginPath(); gCtx.moveTo(0, gH/2); gCtx.lineTo(gW, gH/2); gCtx.stroke();
            // Y-axis
            gCtx.beginPath(); gCtx.moveTo(0, 0); gCtx.lineTo(0, gH); gCtx.stroke();
            
            gCtx.fillStyle = '#64748b'; gCtx.font = '10px Arial';
            gCtx.fillText("0", 5, gH/2 - 5);
            gCtx.fillText("+1.0", 5, gH/2 - (1.0 / maxAngleScale) * (gH/2.2) + 4);
            gCtx.fillText("-1.0", 5, gH/2 - (-1.0 / maxAngleScale) * (gH/2.2) + 4);
            
            gCtx.strokeStyle = '#22c55e'; // m1 green
            gCtx.lineWidth = 2;
            gCtx.beginPath();
            for(let i=0; i<graphData.length; i++) {
                let x = (i / MAX_GRAPH) * gW;
                let y = gH/2 - (graphData[i].t1 / maxAngleScale) * (gH/2.2);
                if (i===0) gCtx.moveTo(x, y);
                else gCtx.lineTo(x, y);
            }
            gCtx.stroke();
            
            gCtx.strokeStyle = '#3b82f6'; // m2 blue
            gCtx.beginPath();
            for(let i=0; i<graphData.length; i++) {
                let x = (i / MAX_GRAPH) * gW;
                let y = gH/2 - (graphData[i].t2 / maxAngleScale) * (gH/2.2);
                if (i===0) gCtx.moveTo(x, y);
                else gCtx.lineTo(x, y);
            }
            gCtx.stroke();
            
            gCtx.fillStyle = '#64748b';
            gCtx.font = '12px Arial';
            gCtx.fillText("Time Series: Angles vs Time", 30, 20);
            gCtx.fillStyle = '#22c55e'; gCtx.fillText("θ₁ (Mass 1)", 30, 40);
            gCtx.fillStyle = '#3b82f6'; gCtx.fillText("θ₂ (Mass 2)", 30, 60);
        } else if (mode === 'lissajous-theta') {
            // Persistent Phase Space without fading rectangle!
            let d = graphData[graphData.length - 1];
            if (d) {
                let x = gW/2 + (d.t1 / maxAngleScale) * (gW/2.5);
                let y = gH/2 - (d.t2 / maxAngleScale) * (gH/2.5);
                
                if (lastLissajousX !== -1 && Math.abs(x - lastLissajousX) < 100 && Math.abs(y - lastLissajousY) < 100) {
                    gCtx.strokeStyle = 'rgba(239, 68, 68, 0.5)'; // Use slight transparency for the red line so crossing over creates darker spots
                    gCtx.lineWidth = 1.5;
                    gCtx.beginPath();
                    gCtx.moveTo(lastLissajousX, lastLissajousY);
                    gCtx.lineTo(x, y);
                    gCtx.stroke();
                }
                lastLissajousX = x;
                lastLissajousY = y;
            }
        } else if (mode === 'energy') {
            gCtx.fillStyle = '#ffffff';
            gCtx.fillRect(0, 0, gW, gH);
            
            // Draw grid
            gCtx.strokeStyle = '#f1f5f9'; gCtx.lineWidth = 1;
            gCtx.beginPath();
            for(let i=0; i<gW; i+=50) { gCtx.moveTo(i, 0); gCtx.lineTo(i, gH); }
            for(let i=0; i<gH; i+=25) { gCtx.moveTo(0, i); gCtx.lineTo(gW, i); }
            gCtx.stroke();
            
            // Zero line
            gCtx.strokeStyle = '#cbd5e1'; gCtx.lineWidth = 2;
            gCtx.beginPath(); gCtx.moveTo(0, gH/2); gCtx.lineTo(gW, gH/2); gCtx.stroke();
            
            
            // Dynamic scale based on the current Total Energy so graphs are always perfectly sized
            let currentTotE = graphData.length > 0 ? graphData[graphData.length-1].tot : 100;
            let maxE = currentTotE * 1.2; 
            if (maxE < 1) maxE = 10;
            
            gCtx.fillStyle = '#64748b'; gCtx.font = '10px Arial';
            gCtx.fillText("0 J", 5, gH/2 - 5);
            gCtx.fillText("+" + maxE.toFixed(1) + " J", 5, 15);
            gCtx.fillText("-" + maxE.toFixed(1) + " J", 5, gH - 5);

            
            // Draw T (Kinetic) - Orange
            gCtx.strokeStyle = '#f97316'; 
            gCtx.lineWidth = 2;
            gCtx.beginPath();
            for(let i=0; i<graphData.length; i++) {
                let x = (i / MAX_GRAPH) * gW;
                let y = gH/2 - (graphData[i].kin / maxE) * (gH/2);
                if (i===0) gCtx.moveTo(x, y);
                else gCtx.lineTo(x, y);
            }
            gCtx.stroke();
            
            // Draw V (Potential) - Indigo
            gCtx.strokeStyle = '#6366f1'; 
            gCtx.beginPath();
            for(let i=0; i<graphData.length; i++) {
                let x = (i / MAX_GRAPH) * gW;
                let y = gH/2 - (graphData[i].pot / maxE) * (gH/2);
                if (i===0) gCtx.moveTo(x, y);
                else gCtx.lineTo(x, y);
            }
            gCtx.stroke();
            
            // Draw E (Total) - Slate (Blackish)
            gCtx.strokeStyle = '#0f172a'; 
            gCtx.lineWidth = 3;
            gCtx.beginPath();
            for(let i=0; i<graphData.length; i++) {
                let x = (i / MAX_GRAPH) * gW;
                let y = gH/2 - (graphData[i].tot / maxE) * (gH/2);
                if (i===0) gCtx.moveTo(x, y);
                else gCtx.lineTo(x, y);
            }
            gCtx.stroke();
            
            gCtx.fillStyle = '#64748b';
            gCtx.font = '12px Arial';
            gCtx.fillText("Energy Conservation", 30, 20);
            gCtx.fillStyle = '#f97316'; gCtx.fillText("T (Kinetic)", 30, 40);
            gCtx.fillStyle = '#6366f1'; gCtx.fillText("V (Potential)", 30, 60);
            gCtx.fillStyle = '#0f172a'; gCtx.fillText("E (Total = T + V)", 30, 80);
        }

    }
function animate(currentTime) {
        if (!isAnimating) {
            lastTime = currentTime;
            window.currentVibReqId = requestAnimationFrame(animate);
            return;
        }
        
        let dt = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        if (dt > 0.1) dt = 0.016; 
        
        const subSteps = 15;
        let subDt = dt / subSteps;
        for(let i=0; i<subSteps; i++) {
            rk4Step(subDt);
        }
        time += dt;
        
        let wrapT1 = state[0] % (2*Math.PI);
        if(wrapT1 > Math.PI) wrapT1 -= 2*Math.PI;
        else if (wrapT1 < -Math.PI) wrapT1 += 2*Math.PI;
        
        let wrapT2 = state[1] % (2*Math.PI);
        if(wrapT2 > Math.PI) wrapT2 -= 2*Math.PI;
        else if (wrapT2 < -Math.PI) wrapT2 += 2*Math.PI;
        
        let realX1 = l1 * Math.sin(state[0]);
        let realY1 = l1 * Math.cos(state[0]);
        let realX2 = realX1 + l2 * Math.sin(state[1]);
        let realY2 = realY1 + l2 * Math.cos(state[1]);
        

        // Calculate Energy
        let w1 = state[2], w2 = state[3];
        let v1_sq = l1*l1 * w1*w1;
        let v2_sq = l1*l1 * w1*w1 + l2*l2 * w2*w2 + 2*l1*l2*w1*w2*Math.cos(state[0] - state[1]);
        
        let kinT = 0.5 * m1 * v1_sq + 0.5 * m2 * v2_sq;
        // Using pivot as zero potential energy (y is down)
        let potV = (m1 + m2) * G * l1 * (1 - Math.cos(state[0])) + m2 * G * l2 * (1 - Math.cos(state[1]));
        let totE = kinT + potV;

        graphData.push({ t1: wrapT1, t2: wrapT2, x2: realX2, y2: realY2, kin: kinT, pot: potV, tot: totE });

        if(graphData.length > MAX_GRAPH) graphData.shift();
        
        // Scale meters to pixels (e.g. 1 meter = 80 pixels)
        const pxPerMeter = 80;
        
        let pivotX = W / 2;
        let pivotY = H / 3;
        
        let canvasX1 = pivotX + realX1 * pxPerMeter;
        let canvasY1 = pivotY + realY1 * pxPerMeter;
        
        let canvasX2 = pivotX + realX2 * pxPerMeter;
        let canvasY2 = pivotY + realY2 * pxPerMeter;
        
        if (trace1Check && trace1Check.checked) trace1.push({x: canvasX1, y: canvasY1});
        if (trace2Check && trace2Check.checked) trace2.push({x: canvasX2, y: canvasY2});
        
        if (trace1.length > MAX_TRACE) trace1.shift();
        if (trace2.length > MAX_TRACE) trace2.shift();
        
        ctx.clearRect(0, 0, W, H);
        
        // Draw Traces
        if (trace1Check && trace1Check.checked && trace1.length > 1) {
            ctx.beginPath();
            for(let i=0; i<trace1.length; i++) {
                ctx.lineTo(trace1[i].x, trace1[i].y);
            }
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)'; 
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        if (trace2Check && trace2Check.checked && trace2.length > 1) {
            ctx.beginPath();
            for(let i=0; i<trace2.length; i++) {
                ctx.lineTo(trace2[i].x, trace2[i].y);
            }
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw rods
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(canvasX1, canvasY1);
        ctx.lineTo(canvasX2, canvasY2);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw pivot
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 5, 0, 2*Math.PI);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        
        // Draw masses (scale visually)
        let r1 = 8 + (m1 / 30) * 12;
        ctx.beginPath();
        ctx.arc(canvasX1, canvasY1, r1, 0, 2*Math.PI);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        let r2 = 8 + (m2 / 30) * 12;
        ctx.beginPath();
        ctx.arc(canvasX2, canvasY2, r2, 0, 2*Math.PI);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.stroke();
        

        
        // Draw velocity vectors and values
        const vectorsCheck = document.getElementById('vdp-vectors');
        if (vectorsCheck && vectorsCheck.checked) {
            let vX1 = state[2] * l1 * Math.cos(state[0]);
            let vY1 = -state[2] * l1 * Math.sin(state[0]);
            
            let vX2 = vX1 + state[3] * l2 * Math.cos(state[1]);
            let vY2 = vY1 - state[3] * l2 * Math.sin(state[1]);
            
            let v1Mag = Math.sqrt(vX1*vX1 + vY1*vY1);
            let v2Mag = Math.sqrt(vX2*vX2 + vY2*vY2);
            
            let endX1 = canvasX1 + vX1 * pxPerMeter * 0.5;
            let endY1 = canvasY1 + vY1 * pxPerMeter * 0.5;
            let endX2 = canvasX2 + vX2 * pxPerMeter * 0.5;
            let endY2 = canvasY2 + vY2 * pxPerMeter * 0.5;
            
            function drawArrow(x1, y1, x2, y2, color) {
                let headlen = 12;
                let angle = Math.atan2(y2 - y1, x2 - x1);
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            
            drawArrow(canvasX1, canvasY1, endX1, endY1, '#ef4444');
            drawArrow(canvasX2, canvasY2, endX2, endY2, '#ef4444');
            
            // Draw text values
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 12px Arial';
            
            let deg1 = (state[0] * 180 / Math.PI).toFixed(0);
            let deg2 = (state[1] * 180 / Math.PI).toFixed(0);
            
            let text1 = "v₁: " + v1Mag.toFixed(1) + " m/s | θ₁: " + deg1 + "°";
            let text2 = "v₂: " + v2Mag.toFixed(1) + " m/s | θ₂: " + deg2 + "°";
            
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillRect(canvasX1 + 15, canvasY1 - 25, ctx.measureText(text1).width + 10, 20);
            ctx.fillRect(canvasX2 + 15, canvasY2 - 25, ctx.measureText(text2).width + 10, 20);
            
            ctx.fillStyle = '#1e293b';
            ctx.fillText(text1, canvasX1 + 20, canvasY1 - 10);
            ctx.fillText(text2, canvasX2 + 20, canvasY2 - 10);
        }
        
        drawGraph();


        
        window.currentVibReqId = requestAnimationFrame(animate);
    }
    
    document.getElementById('vdp-play').onclick = () => {
        isAnimating = !isAnimating;
    };
    
    document.getElementById('vdp-reset').onclick = reset;
    
    clearGraph();
    animate(performance.now());
};

