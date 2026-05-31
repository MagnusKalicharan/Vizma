window.initPractice2 = function() {
    initP2Q4();
    initP2Q5();
    initP2Q6();
    initP2Q7();
};

function initP2Q4() {
    const canvas = document.getElementById('p2-q4-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let a_wedge = parseFloat(document.getElementById('p2-a').value) * 10;
    let theta = parseFloat(document.getElementById('p2-theta').value) * Math.PI / 180;
    
    let isRelative = false;
    let t = 0;
    let playing = false;
    let trail = [];
    const g = 9.8 * 10;
    const alpha = 30 * Math.PI / 180;
    const u = 80;
    
    document.getElementById('p2-q4-toggle').addEventListener('click', (e) => {
        isRelative = !isRelative;
        e.target.textContent = isRelative ? "Jump to Ground Frame" : "Jump to Wedge Frame";
        e.target.style.background = isRelative ? "var(--blue)" : "var(--orange)";
        t = 0;
        playing = false;
        trail = [];
    });

    let speedMultQ4 = 1.0;
    const speedInputQ4 = document.getElementById('p2-q4-speed');
    if(speedInputQ4) {
        speedInputQ4.addEventListener('input', (e) => {
            speedMultQ4 = parseFloat(e.target.value);
            document.getElementById('p2-q4-speed-val').textContent = speedMultQ4.toFixed(1) + 'x';
        });
    }

    document.getElementById('p2-q4-play').addEventListener('click', () => { playing = true; });
    document.getElementById('p2-q4-pause').addEventListener('click', () => { playing = false; });
    document.getElementById('p2-q4-reset').addEventListener('click', () => { t = 0; playing = false; trail = []; });

    document.getElementById('p2-a').addEventListener('input', (e) => { 
        a_wedge = parseFloat(e.target.value)*10;
        document.getElementById('p2-a-val').textContent = parseFloat(e.target.value).toFixed(1);
        t=0; trail=[]; playing=false;
    });
    document.getElementById('p2-theta').addEventListener('input', (e) => { 
        theta = parseFloat(e.target.value)*Math.PI/180;
        document.getElementById('p2-theta-val').textContent = parseFloat(e.target.value).toFixed(0);
        t=0; trail=[]; playing=false;
    });

    function drawArrow(fromX, fromY, toX, toY, color, label) {
        const dx = toX - fromX;
        const dy = toY - fromY;
        const mag = Math.hypot(dx, dy);
        if(mag < 0.1) return;
        
        const nx = dx / mag;
        const ny = dy / mag;
        const angle = Math.atan2(dy, dx);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        
        // Arrowhead
        ctx.fillStyle = color;
        ctx.save();
        ctx.translate(toX, toY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, 5);
        ctx.lineTo(-10, -5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        if(label) {
            ctx.fillStyle = color;
            ctx.font = "12px Arial";
            ctx.fillText(label, toX + 10, toY - 5);
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw sky
        const gradient = ctx.createLinearGradient(0, 0, 0, 280);
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 600, 280);
        
        let startX = 80, startY = 280;
        let D = 200;
        
        let wedgeX = startX + D;
        if(!isRelative) {
            wedgeX -= 0.5 * a_wedge * t * t;
        }
        
        // Clamp wedge position
        wedgeX = Math.max(100, Math.min(500, wedgeX));

        // Draw Ground
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, 280, 600, 120);

        // Draw Wedge with gradient - LARGE AND VISIBLE
        ctx.fillStyle = '#f59e0b';
        const wedgeHeight = 140 * Math.tan(alpha);
        ctx.beginPath();
        ctx.moveTo(wedgeX, 280);
        ctx.lineTo(wedgeX + 140, 280);
        ctx.lineTo(wedgeX + 140, 280 - wedgeHeight);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw wedge angle label
        ctx.fillStyle = '#1e293b';
        ctx.font = "bold 14px Arial";
        ctx.fillText("α=30°", wedgeX + 15, 265);

        // Particle Position - SCALED PROPERLY
        let px, py;
        if(isRelative) {
            px = startX + (u * Math.cos(theta)) * t * 0.5 + 0.5 * a_wedge * t * t * 0.1;
            py = startY - (u * Math.sin(theta)) * t * 0.5 + 0.5 * g * t * t * 0.1;
            
            // Draw pseudo-gravity vector at particle
            drawArrow(px, py, px + a_wedge*0.3, py + g*0.3, '#ef4444', 'g_eff');
            
            // Draw motion indicators
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(px, 280);
            ctx.lineTo(px, py);
            ctx.stroke();
            ctx.setLineDash([]);
        } else {
            px = startX + (u * Math.cos(theta)) * t * 0.5;
            py = startY - (u * Math.sin(theta)) * t * 0.5 + 0.5 * g * t * t * 0.1;
            
            // Draw gravity vector
            drawArrow(px, py, px, py + 30, '#3b82f6', 'g');
        }
        
        // Keep particle on screen
        px = Math.max(0, Math.min(600, px));

        // Draw particle trail
        if(playing && py < 300) {
            trail.push({x: px, y: py});
        }
        if(trail.length > 1) {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.lineWidth = 2;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            for(let i = 0; i < trail.length; i++) {
                if(i === 0) ctx.moveTo(trail[i].x, trail[i].y);
                else ctx.lineTo(trail[i].x, trail[i].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw Particle
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Frame indicator and physics info
        ctx.fillStyle = '#1e293b';
        ctx.font = "bold 13px Arial";
        ctx.textAlign = "left";
        if(isRelative) {
            ctx.fillText("📍 Wedge Frame (Rotating View)", 10, 25);
            ctx.font = "11px Arial";
            ctx.fillText("Pseudo-Gravity: g_eff = √(g² + a²)", 10, 45);
            ctx.fillText("Effective gravity tilted toward particle motion", 10, 62);
        } else {
            ctx.fillText("📍 Ground Frame", 10, 25);
            ctx.font = "11px Arial";
            ctx.fillText("Standard gravity acts downward", 10, 45);
            ctx.fillText("Wedge accelerates with a = " + (a_wedge/10).toFixed(1) + " m/s²", 10, 62);
        }

        if(playing) {
            t += 0.1 * speedMultQ4;
            if(px >= wedgeX && py >= 280 - (px - wedgeX)*Math.tan(alpha)) {
                playing = false;
                ctx.fillStyle = '#ef4444';
                ctx.globalAlpha = 0.8;
                ctx.font = "bold 20px Arial";
                ctx.textAlign = "center";
                ctx.fillText("💥 PERPENDICULAR STRIKE!", canvas.width/2, 150);
                ctx.globalAlpha = 1.0;
            }
            if(py > 280) playing = false;
        }

        requestAnimationFrame(draw);
    }
    draw();
}

function initP2Q5() {
    const canvas = document.getElementById('p2-q5-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let N = parseInt(document.getElementById('p2-n').value);
    let v = parseFloat(document.getElementById('p2-v').value);
    
    let particles = [];
    let trails = [];
    let playing = true;
    let totalTime = 0;
    let colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#eab308', '#6366f1'];
    const R = 150;
    const cx = 300, cy = 200;

    function initParticles() {
        particles = [];
        trails = [];
        for(let i=0; i<N; i++) {
            let angle = i * 2 * Math.PI / N;
            particles.push({
                x: cx + R * Math.cos(angle),
                y: cy + R * Math.sin(angle),
                angle: angle
            });
            trails.push([]);
        }
        playing = true;
        totalTime = 0;
    }
    initParticles();

    let speedMultQ5 = 1.0;
    const speedInputQ5 = document.getElementById('p2-q5-speed');
    if(speedInputQ5) {
        speedInputQ5.addEventListener('input', (e) => {
            speedMultQ5 = parseFloat(e.target.value);
            document.getElementById('p2-q5-speed-val').textContent = speedMultQ5.toFixed(1) + 'x';
        });
    }

    document.getElementById('p2-q5-play').addEventListener('click', () => { playing = true; });
    document.getElementById('p2-q5-pause').addEventListener('click', () => { playing = false; });
    document.getElementById('p2-q5-reset').addEventListener('click', () => { initParticles(); playing = false; });

    document.getElementById('p2-n').addEventListener('input', (e) => { 
        N = parseInt(e.target.value);
        document.getElementById('p2-n-val').textContent = N;
        initParticles(); 
        playing = false;
    });
    document.getElementById('p2-v').addEventListener('input', (e) => { 
        v = parseFloat(e.target.value);
        document.getElementById('p2-v-val').textContent = v.toFixed(1);
        initParticles();
        playing = false;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        const bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
        bgGradient.addColorStop(0, '#f0f9ff');
        bgGradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, 600, 400);

        let showLines = document.getElementById('p2-q5-lines').checked;

        // Draw trails with gradient effect
        for(let i=0; i<N; i++) {
            if(trails[i].length > 1) {
                // Draw trail with gradient
                ctx.strokeStyle = colors[i % colors.length];
                ctx.lineWidth = 1.5;
                ctx.setLineDash([]);
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                for(let j=0; j<trails[i].length; j++) {
                    if(j===0) ctx.moveTo(trails[i][j].x, trails[i][j].y);
                    else ctx.lineTo(trails[i][j].x, trails[i][j].y);
                }
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
        }

        // Draw polygon connections
        if(showLines && particles.length > 0) {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(particles[0].x, particles[0].y);
            for(let i=1; i<N; i++) {
                ctx.lineTo(particles[i].x, particles[i].y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Calculate statistics
        let minDist = Infinity;
        let maxDist = 0;
        let avgDist = 0;
        let allReached = true;
        
        if(playing) {
            let nextParticles = [];
            for(let i=0; i<N; i++) {
                let current = particles[i];
                let target = particles[(i+1)%N];
                
                let dx = target.x - current.x;
                let dy = target.y - current.y;
                let dist = Math.hypot(dx, dy);
                
                minDist = Math.min(minDist, dist);
                maxDist = Math.max(maxDist, dist);
                avgDist += dist;
                
                if(dist > 0.5) {
                    allReached = false;
                    let moveDist = v * speedMultQ5;
                    if (moveDist > dist) moveDist = dist;
                    let nx = current.x + (dx/dist) * moveDist;
                    let ny = current.y + (dy/dist) * moveDist;
                    nextParticles.push({
                        x: nx,
                        y: ny,
                        angle: Math.atan2(ny - cy, nx - cx)
                    });
                    trails[i].push({x: nx, y: ny});
                    if(trails[i].length > 500) trails[i].shift();
                } else {
                    nextParticles.push({
                        x: cx,
                        y: cy,
                        angle: current.angle
                    });
                }
            }
            particles = nextParticles;
            avgDist /= N;
            
            if(allReached) {
                playing = false;
            } else {
                totalTime += 0.01 * speedMultQ5;
            }
        } else {
            minDist = 0;
            for(let i=0; i<N; i++) {
                let current = particles[i];
                let target = particles[(i+1)%N];
                let dx = target.x - current.x;
                let dy = target.y - current.y;
                let dist = Math.hypot(dx, dy);
                avgDist += dist;
            }
            avgDist /= N;
        }

        // Draw particles with distinct colors
        for(let i=0; i<N; i++) {
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.arc(particles[i].x, particles[i].y, 5, 0, Math.PI*2);
            ctx.fill();
            
            // Draw particle number
            ctx.fillStyle = '#fff';
            ctx.font = "bold 8px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(i+1, particles[i].x, particles[i].y);
        }

        // Draw center point
        ctx.fillStyle = '#000';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Draw info panel
        ctx.fillStyle = '#1e293b';
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Symmetric Pursuit: N = " + N + " particles", 10, 25);
        ctx.font = "11px Arial";
        ctx.fillText("Speed v = " + v.toFixed(2) + " m/s", 10, 43);
        ctx.fillText("Time: " + totalTime.toFixed(2) + " s", 10, 61);
        ctx.fillText("Average Distance: " + avgDist.toFixed(1) + " m", 10, 79);

        // Draw legend
        if(N <= 6) {
            ctx.font = "10px Arial";
            for(let i=0; i<N; i++) {
                ctx.fillStyle = colors[i % colors.length];
                ctx.fillRect(480, 10 + i*20, 12, 12);
                ctx.fillStyle = '#1e293b';
                ctx.fillText("P" + (i+1), 500, 20 + i*20);
            }
        }

        // Draw conclusion message
        if(!playing && avgDist < 0.5) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(150, 150, 300, 100);
            ctx.fillStyle = '#fff';
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Particles Converged!", 300, 185);
            ctx.font = "14px Arial";
            ctx.fillText("Total spiral distance: " + Math.round(trails[0]?.length || 0) + " frames", 300, 210);
            ctx.fillText("All particles reached center", 300, 230);
        }

        requestAnimationFrame(draw);
    }
    draw();
}

function initP2Q6() {
    const canvas = document.getElementById('p2-q6-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let u = parseFloat(document.getElementById('p2-q6-u').value);
    let g = parseFloat(document.getElementById('p2-q6-g').value);
    
    let isBursting = false;
    let t = 0;
    let projectiles = [];
    
    const W = canvas.width;
    const H = canvas.height;
    const originX = W / 2;
    const originY = H - 20;
    
    function reset() {
        isBursting = false;
        t = 0;
        projectiles = [];
        ctx.clearRect(0, 0, W, H);
    }
    
    document.getElementById('p2-q6-fire').addEventListener('click', () => {
        reset();
        u = parseFloat(document.getElementById('p2-q6-u').value);
        g = parseFloat(document.getElementById('p2-q6-g').value);
        isBursting = true;
        // spawn projectiles 0 to 180 degrees in 3 degree increments
        for(let a=0; a<=180; a+=3) {
            let rad = a * Math.PI / 180;
            projectiles.push({
                vx: u * Math.cos(rad),
                vy: u * Math.sin(rad),
                points: [{x:0, y:0}]
            });
        }
    });
    
    document.getElementById('p2-q6-reset').addEventListener('click', reset);
    
    function draw() {
        if (!document.getElementById('p2-q6-canvas').offsetParent) {
            requestAnimationFrame(draw);
            return;
        }
        
        let speedMult = parseFloat(document.getElementById('p2-q6-speed').value);
        const showEnvelope = document.getElementById('p2-q6-envelope').checked;
        u = parseFloat(document.getElementById('p2-q6-u').value);
        g = parseFloat(document.getElementById('p2-q6-g').value);
        
        // Scale to fit the envelope
        let maxRange = (u*u)/g;
        let sc = (W/2 - 20) / maxRange;
        if (sc > 5) sc = 5; 
        
        ctx.clearRect(0, 0, W, H);
        
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(W, originY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, H); ctx.stroke();
        
        if(isBursting) {
            let dt = 0.05 * speedMult;
            t += dt;
            
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.lineWidth = 1.5;
            
            for(let p of projectiles) {
                let curX = p.vx * t;
                let curY = p.vy * t - 0.5 * g * t * t;
                if (curY >= 0) {
                    p.points.push({x: curX, y: curY});
                }
                
                ctx.beginPath();
                for(let i=0; i<p.points.length; i++) {
                    let sx = originX + p.points[i].x * sc;
                    let sy = originY - p.points[i].y * sc;
                    if(i===0) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                }
                ctx.stroke();
                
                if (p.points.length > 0) {
                    let last = p.points[p.points.length - 1];
                    ctx.fillStyle = '#3b82f6';
                    ctx.beginPath();
                    ctx.arc(originX + last.x * sc, originY - last.y * sc, 3, 0, Math.PI*2);
                    ctx.fill();
                }
            }
        }
        
        if (showEnvelope) {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();
            
            let drawn = false;
            for(let sx = 0; sx <= W; sx++) {
                let realX = (sx - originX) / sc;
                let envY = (u*u)/(2*g) - (g * realX * realX) / (2 * u * u);
                
                if (envY >= 0) {
                    let sy = originY - envY * sc;
                    if (!drawn) { ctx.moveTo(sx, sy); drawn = true; }
                    else { ctx.lineTo(sx, sy); }
                }
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(originX, originY, 8, 0, Math.PI*2); ctx.fill();
        
        requestAnimationFrame(draw);
    }
    draw();
}

function initP2Q7() {
    const canvas = document.getElementById('p2-q7-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let t = 0;
    let playing = false;
    let trail = [];
    let W = canvas.width, H = canvas.height;
    
    function reset() {
        t = 0;
        trail = [];
    }
    
    document.getElementById('p2-q7-play').addEventListener('click', () => { playing = true; });
    document.getElementById('p2-q7-pause').addEventListener('click', () => { playing = false; });
    document.getElementById('p2-q7-reset').addEventListener('click', reset);
    
    document.getElementById('p2-q7-frame').addEventListener('change', () => { trail = []; });
    document.getElementById('p2-q7-trace').addEventListener('change', () => { trail = []; });
    
    function draw() {
        if (!document.getElementById('p2-q7-canvas').offsetParent) {
            requestAnimationFrame(draw);
            return;
        }
        
        let omega = parseFloat(document.getElementById('p2-q7-omega').value);
        let speedMult = parseFloat(document.getElementById('p2-q7-speed').value);
        let isRelFrame = document.getElementById('p2-q7-frame').checked;
        let traceOn = document.getElementById('p2-q7-trace').checked;
        
        if (playing) t += 0.02 * speedMult;
        
        ctx.clearRect(0, 0, W, H);
        
        let cx = W/2, cy = H/2;
        let R = 60;
        
        // Note: For a cardioid, they must have the same linear speed, meaning wB = wA / 2.
        // We set wA = omega, wB = omega / 2 to produce the requested Cardioid visualization.
        let omegaA = omega;
        let omegaB = omega / 2; 
        
        let ax = R * Math.cos(omegaA * t);
        let ay = R * Math.sin(omegaA * t);
        
        let bx = 2 * R * Math.cos(omegaB * t);
        let by = 2 * R * Math.sin(omegaB * t);
        
        let shiftX = isRelFrame ? -ax : 0;
        let shiftY = isRelFrame ? -ay : 0;
        
        ctx.save();
        ctx.translate(cx + shiftX, cy + shiftY);
        
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 2*R, 0, Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI*2); ctx.fill();
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(ax, ay, 6, 0, Math.PI*2); ctx.fill();
        ctx.font = "bold 12px Arial"; ctx.fillText("A", ax + 10, ay + 10);
        
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillText("B", bx + 10, by + 10);
        
        ctx.restore();
        
        if (playing && traceOn) {
            let screenBx = cx + shiftX + bx;
            let screenBy = cy + shiftY + by;
            trail.push({x: screenBx, y: screenBy});
            if (trail.length > 800) trail.shift();
        }
        
        if (traceOn && trail.length > 0) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);
            for(let i=1; i<trail.length; i++) {
                ctx.lineTo(trail[i].x, trail[i].y);
            }
            ctx.stroke();
        }
        
        requestAnimationFrame(draw);
    }
    draw();
}
