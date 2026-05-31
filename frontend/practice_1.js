window.initPractice1 = function() {
    initP1Q1();
    initP1Q2();
    initP1Q3();
};

function initP1Q1() {
    const canvas = document.getElementById('p1-q1-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let va = parseFloat(document.getElementById('p1-va').value);
    let vb = parseFloat(document.getElementById('p1-vb').value);
    let thetaB = parseFloat(document.getElementById('p1-theta').value) * Math.PI / 180;
    
    let isRelative = false;
    let t = 0;
    let playing = true;
    let pathHistory = [];
    let distanceHistory = [];
    
    document.getElementById('p1-q1-toggle').addEventListener('click', (e) => {
        isRelative = !isRelative;
        e.target.textContent = isRelative ? "Switch to Ground Frame" : "Switch to Ship A Frame";
        e.target.style.background = isRelative ? "var(--red)" : "var(--blue)";
        t = 0;
        pathHistory = [];
        distanceHistory = [];
    });

    document.getElementById('p1-q1-play').addEventListener('click', () => { playing = true; });
    document.getElementById('p1-q1-pause').addEventListener('click', () => { playing = false; });
    document.getElementById('p1-q1-reset').addEventListener('click', () => { 
        t = 0; 
        pathHistory = []; 
        distanceHistory = []; 
    });

    document.getElementById('p1-va').addEventListener('input', (e) => { 
        va = parseFloat(e.target.value);
        document.getElementById('p1-va-val').textContent = va.toFixed(2);
        t=0; pathHistory=[]; distanceHistory=[];
    });
    document.getElementById('p1-vb').addEventListener('input', (e) => { 
        vb = parseFloat(e.target.value);
        document.getElementById('p1-vb-val').textContent = vb.toFixed(2);
        t=0; pathHistory=[]; distanceHistory=[];
    });
    document.getElementById('p1-theta').addEventListener('input', (e) => { 
        thetaB = parseFloat(e.target.value) * Math.PI/180;
        document.getElementById('p1-theta-val').textContent = parseFloat(e.target.value).toFixed(0);
        t=0; pathHistory=[]; distanceHistory=[];
    });
    
    let speedMult = 1.0;
    const speedInput = document.getElementById('p1-speed');
    if (speedInput) {
        speedInput.addEventListener('input', (e) => {
            speedMult = parseFloat(e.target.value);
            document.getElementById('p1-speed-val').textContent = speedMult.toFixed(1) + 'x';
        });
    }

    function drawGrid(offsetX, offsetY) {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for(let i = -1000; i < 1000; i += 40) {
            ctx.beginPath(); ctx.moveTo(i + offsetX, -1000); ctx.lineTo(i + offsetX, 1000); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-1000, i + offsetY); ctx.lineTo(1000, i + offsetY); ctx.stroke();
        }
    }

    function drawSubscriptLabel(ctx, textMain, textSub, x, y, color) {
        ctx.fillStyle = color;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(textMain, x, y);
        let w = ctx.measureText(textMain).width;
        ctx.font = 'bold 9px Arial';
        ctx.fillText(textSub, x + w + 1, y + 4);
    }

    function drawArrow(x, y, angle, size, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(size/2, 0);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(size/2, size/3);
        ctx.lineTo(size/2, -size/3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let gridOffsetX = 0;
        if(isRelative) {
            gridOffsetX = (-va * t) % 40;
        }
        drawGrid(gridOffsetX, 0);

        // Ground frame coords
        let ax_g = 400 + va * t;
        let ay_g = 200;
        let bx_g = 400 + vb * Math.cos(thetaB) * t;
        let by_g = 300 - vb * Math.sin(thetaB) * t;

        let ax, ay, bx, by;
        if(isRelative) {
            ax = 400; ay = 200;
            bx = 400 + (vb * Math.cos(thetaB) - va) * t;
            by = 300 - vb * Math.sin(thetaB) * t;
        } else {
            ax = ax_g; ay = ay_g;
            bx = bx_g; by = by_g;
        }

        // Store path history for relative frame
        if(isRelative) {
            pathHistory.push({x: bx, y: by});
            if(pathHistory.length > 200) pathHistory.shift();
        }

        // Draw path trail
        if(pathHistory.length > 1) {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            for(let i = 0; i < pathHistory.length; i++) {
                if(i === 0) ctx.moveTo(pathHistory[i].x, pathHistory[i].y);
                else ctx.lineTo(pathHistory[i].x, pathHistory[i].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw coordinate axes to give context
        let originX = isRelative ? 400 - va * t : 400;
        let originY = 200;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, originY); ctx.lineTo(canvas.width, originY);
        ctx.moveTo(originX, 0); ctx.lineTo(originX, canvas.height);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = '11px Arial';
        ctx.textAlign = 'right';
        ctx.fillText("Origin (0,0)", originX - 5, originY - 5);
        
        let initialBx = originX;
        let initialBy = 300;
        ctx.beginPath(); ctx.arc(initialBx, initialBy, 3, 0, Math.PI*2); ctx.fill();
        ctx.textAlign = 'left';
        ctx.fillText("B_initial (0, -100)", initialBx + 8, initialBy + 4);

        // Draw position vectors from origin (relative to ground)
        if (!isRelative) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            
            // r_A
            ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(ax, ay); ctx.stroke();
            drawSubscriptLabel(ctx, "r", "A", (originX + ax)/2, (originY + ay)/2 - 10, 'rgba(0, 0, 0, 0.6)');

            // r_B
            ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(bx, by); ctx.stroke();
            drawSubscriptLabel(ctx, "r", "B", (originX + bx)/2 + 5, (originY + by)/2, 'rgba(0, 0, 0, 0.6)');
            
            ctx.setLineDash([]);
        }

        // Draw Ship A with velocity arrow
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath(); ctx.arc(ax, ay, 12, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = "bold 10px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("A", ax, ay);
        
        if(!isRelative) {
            drawArrow(ax, ay - 20, 0, 15, '#3b82f6');
            drawSubscriptLabel(ctx, "v", "A", ax + 20, ay - 25, '#3b82f6');
        }

        // Draw Ship B with velocity arrow
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(bx, by, 12, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = "bold 10px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("B", bx, by);
        
        if(isRelative) {
            let relVx = vb * Math.cos(thetaB) - va;
            let relVy = -vb * Math.sin(thetaB);
            let relVmag = Math.hypot(relVx, relVy);
            if(relVmag > 0.1) {
                drawArrow(bx, by - 20, Math.atan2(relVy, relVx), 15, '#ef4444');
                drawSubscriptLabel(ctx, "v", "BA", bx + 20, by - 25, '#ef4444');
            }
        } else {
            let angleBVel = Math.atan2(-Math.sin(thetaB), Math.cos(thetaB));
            drawArrow(bx, by - 20, angleBVel, 15, '#ef4444');
            drawSubscriptLabel(ctx, "v", "B", bx + 20, by - 25, '#ef4444');
        }

        // Draw connecting line and distance
        let dist = Math.hypot(bx-ax, by-ay);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        
        distanceHistory.push(dist);
        if(distanceHistory.length > 200) distanceHistory.shift();
        
        // Find and mark minimum distance
        let minDist = Math.min(...distanceHistory);
        let minIndex = distanceHistory.indexOf(minDist);
        
        // Draw distance label and perpendicular indicator
        ctx.fillStyle = '#10b981';
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText("D: " + dist.toFixed(1) + " km", (ax+bx)/2, (ay+by)/2 - 15);

        // Draw perpendicular from A to relative path
        if(isRelative && pathHistory.length > 2) {
            let pathVx = bx - 400;
            let pathVy = by - 300;
            let pathVmag = Math.hypot(pathVx, pathVy);
            if(pathVmag > 1) {
                let pathNormX = pathVx / pathVmag;
                let pathNormY = pathVy / pathVmag;
                let perpX = ax - 400;
                let perpY = ay - 300;
                let projLen = perpX * pathNormX + perpY * pathNormY;
                let projX = 400 + projLen * pathNormX;
                let projY = 300 + projLen * pathNormY;
                
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
                ctx.lineWidth = 2;
                ctx.setLineDash([3, 3]);
                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(projX, projY); ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // Draw frame indicator
        ctx.fillStyle = '#1e293b';
        ctx.font = "14px Arial";
        ctx.textAlign = "left";
        ctx.fillText(isRelative ? "📍 Ship A Reference Frame" : "📍 Ground Frame", 10, 20);

        if (playing) {
            t += 0.05 * speedMult;
            if (t > 100 || 
                ax > canvas.width + 50 || ax < -50 || ay > canvas.height + 50 || ay < -50 ||
                bx > canvas.width + 50 || bx < -50 || by > canvas.height + 50 || by < -50) {
                t = 0;
                pathHistory = [];
                distanceHistory = [];
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

function initP1Q2() {
    const canvas = document.getElementById('p1-q2-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let u = parseFloat(document.getElementById('p1-u').value);
    let v = parseFloat(document.getElementById('p1-v').value);
    let theta = parseFloat(document.getElementById('p1-q2-theta').value) * Math.PI / 180;
    
    let gravityOn = true;
    let isRelative = false;
    let t = 0;
    let playing = false;
    const g = 9.8;
    let p1Trail = [];
    let p2Trail = [];
    
    let H = 200, D = 400;

    document.getElementById('p1-q2-toggle').addEventListener('click', (e) => {
        isRelative = !isRelative;
        gravityOn = !isRelative;
        e.target.textContent = isRelative ? "Turn On Gravity (Ground Frame)" : "Turn Off Gravity (Relative Frame)";
        e.target.style.background = isRelative ? "var(--red)" : "var(--green)";
        t = 0;
        p1Trail = [];
        p2Trail = [];
    });

    document.getElementById('p1-q2-play').addEventListener('click', () => { playing = true; });
    document.getElementById('p1-q2-pause').addEventListener('click', () => { playing = false; });
    document.getElementById('p1-q2-reset').addEventListener('click', () => { t = 0; playing = false; p1Trail = []; p2Trail = []; });
    
    let speedMult = 1.0;
    const speedInputQ2 = document.getElementById('p1-q2-speed');
    if(speedInputQ2) {
        speedInputQ2.addEventListener('input', (e) => {
            speedMult = parseFloat(e.target.value);
            document.getElementById('p1-q2-speed-val').textContent = speedMult.toFixed(1) + 'x';
        });
    }

    function drawArrow2(fromX, fromY, toX, toY, color, label) {
        const dx = toX - fromX;
        const dy = toY - fromY;
        const mag = Math.hypot(dx, dy);
        if(mag < 0.1) return;
        const angle = Math.atan2(dy, dx);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(fromX, fromY); ctx.lineTo(toX, toY); ctx.stroke();
        ctx.fillStyle = color;
        ctx.save(); ctx.translate(toX, toY); ctx.rotate(angle);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-10, 5); ctx.lineTo(-10, -5); ctx.closePath(); ctx.fill();
        ctx.restore();
        if(label) {
            ctx.fillStyle = color; ctx.font = "12px Arial";
            ctx.fillText(label, toX + 5, toY - 5);
        }
    }

    function updateU() {
        u = v * (2 * Math.sin(theta) - Math.cos(theta));
        if (u < 0) u = 0;
        document.getElementById('p1-u').value = u;
        document.getElementById('p1-u-val').textContent = u.toFixed(1);
    }

    document.getElementById('p1-v').addEventListener('input', (e) => { 
        v = parseFloat(e.target.value);
        document.getElementById('p1-v-val').textContent = v.toFixed(0);
        updateU();
        t=0; p1Trail=[]; p2Trail=[];
    });
    document.getElementById('p1-q2-theta').addEventListener('input', (e) => { 
        theta = parseFloat(e.target.value) * Math.PI/180;
        document.getElementById('p1-q2-theta-val').textContent = parseFloat(e.target.value).toFixed(0);
        updateU();
        t=0; p1Trail=[]; p2Trail=[];
    });
    
    // Initial calculation
    updateU();

    function drawBuilding(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        // Add window details
        ctx.fillStyle = '#cbd5e1';
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 2; j++) {
                ctx.fillRect(x + 5 + i*10, y + 10 + j*30, 6, 6);
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 350);
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, 350);
        
        // Draw Ground
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, 350, 600, 50);

        // Draw Tower and Platform
        drawBuilding(50, 350 - H, 40, H, '#cbd5e1');
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(35, 350 - H - 5, 70, 5);
        
        let p1x_0 = 90; let p1y_0 = 350 - H;
        let p2x_0 = 90 + D; let p2y_0 = 350;

        let p1x, p1y, p2x, p2y;

        if(isRelative) {
            p2x = p2x_0; p2y = p2y_0;
            p1x = p1x_0 + (u + v*Math.cos(theta)) * t;
            p1y = p1y_0 + (v*Math.sin(theta)) * t;
        } else {
            p1x = p1x_0 + u * t;
            p1y = p1y_0 + 0.5 * g * t * t;
            
            p2x = p2x_0 - v * Math.cos(theta) * t;
            p2y = p2y_0 - v * Math.sin(theta) * t + 0.5 * g * t * t;
        }
        
        // Keep particles in frame
        p1x = Math.max(0, Math.min(canvas.width, p1x));
        p2x = Math.max(0, Math.min(canvas.width, p2x));

        // Draw trails
        if(playing && (p1y < 350 && p2y < 350)) {
            p1Trail.push({x: p1x, y: p1y});
            p2Trail.push({x: p2x, y: p2y});
        }
        
        if(p1Trail.length > 1) {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
            ctx.lineWidth = 2;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            for(let i = 0; i < p1Trail.length; i++) {
                if(i === 0) ctx.moveTo(p1Trail[i].x, p1Trail[i].y);
                else ctx.lineTo(p1Trail[i].x, p1Trail[i].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        if(p2Trail.length > 1) {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.lineWidth = 2;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            for(let i = 0; i < p2Trail.length; i++) {
                if(i === 0) ctx.moveTo(p2Trail[i].x, p2Trail[i].y);
                else ctx.lineTo(p2Trail[i].x, p2Trail[i].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw Line of Sight in Relative Frame
        if(isRelative) {
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(p1x_0, p1y_0); ctx.lineTo(p2x_0, p2y_0); ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw relative velocity vector
            let relVx = u + v*Math.cos(theta);
            let relVy = v*Math.sin(theta);
            let relVmag = Math.hypot(relVx, relVy);
            if(relVmag > 0.1) {
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 3;
                ctx.beginPath(); 
                ctx.moveTo(p1x, p1y); 
                ctx.lineTo(p1x + relVx/5, p1y + relVy/5);
                ctx.stroke();
                ctx.fillStyle = '#10b981';
                ctx.font = "11px Arial";
                ctx.fillText("v_rel", p1x + relVx/5 + 5, p1y + relVy/5 - 5);
            }
        }

        // Draw H, D and theta
        ctx.strokeStyle = '#64748b';
        ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(p1x_0 - 20, p1y_0); ctx.lineTo(p1x_0 - 20, 350); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p1x_0, 350 + 15); ctx.lineTo(p2x_0, 350 + 15); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#64748b';
        ctx.font = "bold 12px Arial";
        ctx.fillText("H", p1x_0 - 35, 350 - H/2);
        ctx.fillText("D", p1x_0 + D/2, 350 + 30);

        ctx.beginPath();
        ctx.arc(p2x_0, p2y_0, 25, Math.PI, Math.PI + theta);
        ctx.strokeStyle = '#1e293b';
        ctx.stroke();
        ctx.fillStyle = '#1e293b';
        ctx.fillText("θ", p2x_0 - 35, p2y_0 - 15);

        // Position vectors
        if (!isRelative) {
            drawArrow2(p1x_0, 350, p1x, p1y, 'rgba(239, 68, 68, 0.4)', 'r1');
            drawArrow2(p1x_0, 350, p2x, p2y, 'rgba(59, 130, 246, 0.4)', 'r2');
            
            // Velocity vectors (scaled down slightly for display)
            drawArrow2(p1x, p1y, p1x + u * 0.5, p1y + g*t * 0.5, '#ef4444', 'v1');
            drawArrow2(p2x, p2y, p2x - v*Math.cos(theta) * 0.5, p2y - v*Math.sin(theta)*0.5 + g*t * 0.5, '#3b82f6', 'v2');
        }

        // Draw Particle 1 (Red - from tower)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(p1x, p1y, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = "bold 8px Arial";
        ctx.textAlign = "center";
        ctx.fillText("1", p1x, p1y);

        // Draw Particle 2 (Blue - from ground)
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath(); ctx.arc(p2x, p2y, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = "bold 8px Arial";
        ctx.textAlign = "center";
        ctx.fillText("2", p2x, p2y);

        // Check collision (distance threshold and both particles alive)
        let dist = Math.hypot(p1x - p2x, p1y - p2y);
        
        // Check collision (distance threshold and both particles alive)
        if(dist < 20 && playing && p1y < 340 && p2y < 340) {
            playing = false;
        }

        // Frame indicator
        ctx.fillStyle = '#1e293b';
        ctx.font = "12px Arial";
        ctx.fillText(isRelative ? "📍 Particle 2's Frame (No Gravity)" : "📍 Ground Frame (With Gravity)", 10, canvas.height - 20);

        if(playing) {
            t += 0.1 * speedMult;
            if(p1y > 350 || (t > 0.1 && p2y > 350) || p1x > 600 || p2x < 0) playing = false;
        }

        requestAnimationFrame(animate);
    }
    animate();
}

function initP1Q3() {
    const canvas = document.getElementById('p1-q3-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let u = 60; // Reduced from 120 so it fits in frame
    let theta = parseFloat(document.getElementById('p1-q3-theta').value) * Math.PI / 180;
    const g = 9.8;

    let playingQ3 = false;
    let speedMultQ3 = 1.0;

    document.getElementById('p1-q3-play').addEventListener('click', () => { playingQ3 = true; });
    document.getElementById('p1-q3-pause').addEventListener('click', () => { playingQ3 = false; });
    document.getElementById('p1-q3-reset').addEventListener('click', () => { 
        playingQ3 = false; 
        currentT_Q3 = 0.0;
        document.getElementById('p1-t').value = 0;
        document.getElementById('p1-t-val').textContent = "0.00";
    });

    const speedInputQ3 = document.getElementById('p1-q3-speed');
    if(speedInputQ3) {
        speedInputQ3.addEventListener('input', (e) => {
            speedMultQ3 = parseFloat(e.target.value);
            document.getElementById('p1-q3-speed-val').textContent = speedMultQ3.toFixed(1) + 'x';
        });
    }

    let currentT_Q3 = 0.0;

    document.getElementById('p1-q3-theta').addEventListener('input', (e) => { 
        theta = parseFloat(e.target.value) * Math.PI/180;
        document.getElementById('p1-q3-theta-val').textContent = parseFloat(e.target.value).toFixed(0);
        let maxT = (2 * u * Math.sin(theta) / g).toFixed(1);
        document.getElementById('p1-t').max = maxT;
        currentT_Q3 = 0.0;
        document.getElementById('p1-t').value = 0;
        document.getElementById('p1-t-val').textContent = "0.00";
    });

    document.getElementById('p1-t').addEventListener('input', (e) => {
        currentT_Q3 = parseFloat(e.target.value);
        document.getElementById('p1-t-val').textContent = currentT_Q3.toFixed(2);
    });

    let y0 = 320;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let t = currentT_Q3;
        theta = parseFloat(document.getElementById('p1-q3-theta').value) * Math.PI / 180;
        
        // Dynamically compute x0 to center the max height
        let R_max = (u * u * Math.sin(2 * theta)) / g;
        let x0 = (canvas.width / 2) - (R_max / 2);

        // Draw sky and ground
        const gradient = ctx.createLinearGradient(0, 0, 0, 320);
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, 320);
        
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, 320, canvas.width, 80);

        // Draw Launch Point
        ctx.fillStyle = '#475569';
        ctx.beginPath(); ctx.arc(x0, y0, 8, 0, Math.PI*2); ctx.fill();

        // Draw Full Trajectory
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        let maxT = 2*u*Math.sin(theta)/g;
        for(let time=0; time <= maxT; time+=0.05) {
            let px = x0 + u * Math.cos(theta) * time;
            let py = y0 - (u * Math.sin(theta) * time - 0.5 * g * time * time);
            if(time===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Ensure px stays visible
        // Current particle position
        let px = x0 + u * Math.cos(theta) * t;
        let py = y0 - (u * Math.sin(theta) * t - 0.5 * g * t * t);
        px = Math.max(0, Math.min(canvas.width, px));

        // Velocity vector components
        let vx = u * Math.cos(theta);
        let vy = -(u * Math.sin(theta) - g * t);
        let v_mag = Math.hypot(vx, vy);
        let phi = Math.atan2(vy, vx);

        // Draw velocity angle arc
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(px - 20, py);
        ctx.lineTo(px + 50, py);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.beginPath();
        if(phi < 0) {
            ctx.arc(px, py, 25, phi, 0);
        } else {
            ctx.arc(px, py, 25, 0, phi);
        }
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw particle
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI*2); ctx.fill();

        // Draw Velocity Vector
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath(); 
        ctx.moveTo(px, py); 
        ctx.lineTo(px + vx*1.5, py + vy*1.5); 
        ctx.stroke();
        
        // Draw arrow head
        ctx.save();
        ctx.translate(px + vx*1.5, py + vy*1.5);
        ctx.rotate(phi);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-8, 5);
        ctx.lineTo(-8, -5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Draw Osculating Circle
        let a_perp = g * Math.cos(phi);
        if(a_perp > 0.1 && t < maxT) {
            let R = (v_mag * v_mag) / a_perp;
            let nx = Math.sin(phi);
            let ny = -Math.cos(phi);
            
            let cx = px + R * nx;
            let cy = py + R * ny;
            
            // Draw osculating circle with gradient
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2); ctx.stroke();
            
            // Draw center point
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
            
            // Draw radius line
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy); ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw acceleration decomposition
            let a_tan = g * Math.sin(phi);  // Tangential
            let a_norm = g * Math.cos(phi); // Normal
            
            // Tangential component (along velocity)
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + a_tan * Math.cos(phi) * 2, py + a_tan * Math.sin(phi) * 2);
            ctx.stroke();
            
            // Normal component (perpendicular to velocity)
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px - a_norm * Math.sin(phi) * 2, py + a_norm * Math.cos(phi) * 2);
            ctx.stroke();
            
            // Labels for acceleration components
            ctx.fillStyle = '#f59e0b';
            ctx.font = "11px Arial";
            ctx.fillText("a_t=" + a_tan.toFixed(2), px + a_tan * Math.cos(phi) * 2 + 5, py + a_tan * Math.sin(phi) * 2 - 5);
            
            ctx.fillStyle = '#8b5cf6';
            ctx.fillText("a_n=" + a_norm.toFixed(2), px - a_norm * Math.sin(phi) * 2 - 35, py + a_norm * Math.cos(phi) * 2 + 5);
            
            // Display radius and formula
            ctx.fillStyle = '#1e293b';
            ctx.font = "bold 12px Arial";
            ctx.fillText(`R = v²/a⊥ = ${v_mag.toFixed(1)}²/${a_perp.toFixed(2)} = ${R.toFixed(1)} m`, px + 20, py - 50);
            ctx.font = "11px Arial";
            ctx.fillText(`v = ${v_mag.toFixed(1)} m/s`, px + 20, py - 35);
            ctx.fillText(`θ_v = ${(phi * 180/Math.PI).toFixed(1)}°`, px + 20, py - 20);
        }

        // Legend
        ctx.fillStyle = '#1e293b';
        ctx.font = "10px Arial";
        ctx.textAlign = "left";
        ctx.fillText("🟠 Velocity Vector (green)   |   🔵 Osculating Circle (blue)   |   🟡 Tangential (orange)   |   🟣 Normal (purple)", 10, canvas.height - 10);

        if(playingQ3) {
            currentT_Q3 += 0.05 * speedMultQ3;
            if (currentT_Q3 > maxT) {
                currentT_Q3 = parseFloat(maxT);
                playingQ3 = false;
            }
            document.getElementById('p1-t').value = currentT_Q3;
            document.getElementById('p1-t-val').textContent = currentT_Q3.toFixed(2);
        }

        requestAnimationFrame(draw);
    }
    
    let maxT = (2 * u * Math.sin(theta) / g).toFixed(1);
    document.getElementById('p1-t').max = maxT;
    
    draw();
}
