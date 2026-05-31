
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
