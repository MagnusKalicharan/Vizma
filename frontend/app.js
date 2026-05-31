/* ═══════════════════════════════════════════════════════════════
   KINEMATICS MASTERCLASS — APPLICATION LOGIC
   Pure JS: Navigation, 2D/3D Canvas Simulations, Chart.js Graphs
   ═══════════════════════════════════════════════════════════════ */

// ═══════════════ CHAPTER NAVIGATION ═══════════════
const chapterSelect = document.getElementById('chapter-select');
const navKinematics = document.getElementById('nav-kinematics');
const navVibrations = document.getElementById('nav-vibrations');
const sidebarTitle = document.getElementById('sidebar-title');

if (chapterSelect) {
    chapterSelect.addEventListener('change', (e) => {
        const chapter = e.target.value;
        if (chapter === 'kinematics') {
            if(navKinematics) navKinematics.style.display = 'block';
            if(navVibrations) navVibrations.style.display = 'none';
            if(sidebarTitle) sidebarTitle.innerText = "Kinematics";
            document.querySelector('[data-page="kinematics-index"]').click();
        } else if (chapter === 'vibrations') {
            if(navKinematics) navKinematics.style.display = 'none';
            if(navVibrations) navVibrations.style.display = 'block';
            if(sidebarTitle) sidebarTitle.innerText = "Vibrations & Waves";
            document.querySelector('[data-page="vibrations-index"]').click();
        }
    });
}

function buildIndexPages() {
    const kinList = document.getElementById('kinematics-index-list');
    const vibList = document.getElementById('vibrations-index-list');
    
    const kinTopics = [
        { id: 'products', title: 'Dot & Cross Products', desc: 'Interactive visualization of vector multiplication, showing projection for dot products and normal vectors for cross products.' },
        { id: 'vectors', title: 'Vector Addition', desc: 'Visualize the addition of 3D vectors head-to-tail.' },
        { id: 'motion1d', title: '1D Motion Graphs', desc: 'Explore position, velocity, and acceleration over time.' },
        { id: 'projectile', title: 'Projectile Motion', desc: 'Simulate the parabolic trajectory of a fired cannonball.' },
        { id: 'calculus', title: 'Live Calculus Sandbox', desc: 'Write mathematical functions for acceleration and watch the system integrate them live.' },
        { id: 'overtaking', title: 'Two-Body Overtaking', desc: 'Determine where and when two objects will meet.' },
        { id: 'multiproj', title: 'Multi-Projectile Lab', desc: 'Compare multiple projectiles fired at different angles and speeds.' },
        { id: 'relative-vel', title: 'Boat & River', desc: 'Calculate the resultant vector of a boat crossing a flowing river.' },
        { id: 'carchase', title: 'Car Chase', desc: 'Relative velocity applied to a police car chasing a speeder.' },
        { id: 'rainman', title: 'Rain & Umbrella', desc: 'Relative velocity of rain drops as observed by a moving person.' },
        { id: 'practice-1', title: 'Practice Questions I', desc: 'A set of challenging kinematics problems with live interactive visualizers.' },
        { id: 'practice-2', title: 'Practice Questions II', desc: 'Advanced kinematics problems including the Parabola of Safety and the Hidden Cardioid.' }
    ];
    
    const vibTopics = [
        { id: 'vib-spring', title: 'Mass on a Spring', desc: 'Shows the oscillation of a mass attached to a spring, along with a live energy bar chart tracking Kinetic and Potential energy.' },
        { id: 'vib-circular', title: 'SHM vs Circular Motion', desc: 'An exploration of the mathematical relationships between Simple Harmonic Motion and Uniform Circular Motion.' },
        { id: 'vib-pendulum', title: 'The Pendulum', desc: 'Simulate a simple pendulum at both small and extreme angles using true numerical integration.' },
        { id: 'vib-waves', title: 'Transverse vs Longitudinal', desc: 'Observe how wave energy propagates through a medium in perpendicular and parallel particle oscillations.' },
        { id: 'vib-interfere', title: 'Wave Interference', desc: 'Fire two pulses and observe how their displacements superimpose algebraically when they meet.' },
        { id: 'vib-standing', title: 'Standing Waves', desc: 'Explore resonance and harmonics on a string by matching the excitation frequency to the natural modes.' },
        { id: 'vib-surface', title: 'Surface Waves', desc: 'Observe particles moving in circular orbits, demonstrating how surface waves combine transverse and longitudinal motion.' },
        { id: 'vib-doppler', title: 'The Doppler Effect', desc: 'Visualize expanding circular wavefronts and frequency shifts when a source or observer is in motion.' },
        { id: 'vib-beats', title: 'Beat Frequencies', desc: 'Hear and visualize the pulsing envelope created by the superposition of two waves with slightly different frequencies.' },
        { id: 'vib-tubes', title: 'Sound Tubes', desc: 'Explore the longitudinal standing waves and resonant harmonics inside open and closed air columns.' },
        { id: 'vib-em', title: 'Electromagnetic Waves', desc: 'A 3D visualization of light as oscillating electric and magnetic fields, including the effect of a polarizing filter.' },
        { id: 'vib-double-pendulum', title: 'Double Pendulum', desc: 'Explore deterministic chaos through real-time phase space plotting and path tracing.' }
    ];
    
    function createCard(t) {
        return `
            <div style="border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; display: flex; gap: 1.5rem; background: var(--bg); align-items: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.05)';" onmouseout="this.style.transform='none'; this.style.boxShadow='none';" onclick="document.querySelector('[data-page=${t.id}]').click();">
                <div style="width: 200px; height: 120px; background: #e2e8f0; border-radius: 8px; flex-shrink: 0; display:flex; align-items:center; justify-content:center; color:#64748b; overflow: hidden; position: relative; border: 1px solid #cbd5e1;">
                    <img src="images/thumb_${t.id}.png" alt="Screenshot" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null; this.parentElement.innerHTML='<span style=&quot;font-size: 0.8rem; text-align: center; padding: 1rem;&quot;>Placeholder<br><br>Save screenshot as:<br>images/thumb_${t.id}.png</span>';">
                </div>
                <div>
                    <h3 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--blue); font-size: 1.25rem;">${t.title}</h3>
                    <p style="margin: 0; color: #475569; line-height: 1.4;">${t.desc}</p>
                </div>
            </div>
        `;
    }
    
    if (kinList) kinList.innerHTML = kinTopics.map(createCard).join('');
    if (vibList) vibList.innerHTML = vibTopics.map(createCard).join('');
}

document.addEventListener('DOMContentLoaded', buildIndexPages);


// ═══════════════ NAVIGATION ═══════════════
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const pageId = 'page-' + link.dataset.page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
        document.getElementById(pageId).classList.add('active-page');

        // Re-init simulations for the newly visible page
        if (link.dataset.page === 'vectors') initVectors();
        if (link.dataset.page === 'products') initProducts();
        if (link.dataset.page === 'motion1d') initMotion1D();
        if (link.dataset.page === 'projectile') initProjectile();
        if (link.dataset.page === 'calculus') initCalculus();
        if (link.dataset.page === 'overtaking') initOvertaking();
        if (link.dataset.page === 'multiproj') initMultiProj();
        if (link.dataset.page === 'relative-vel') initRelativeVel();
        if (link.dataset.page === 'carchase') initCarChase();
        if (link.dataset.page === 'rainman') initRainMan();
        if (link.dataset.page === 'practice-1') { if(window.initPractice1) initPractice1(); }
        if (link.dataset.page === 'practice-2') { if(window.initPractice2) initPractice2(); }
        if (link.dataset.page === 'vib-spring') { if(window.initVibrations) initVibQ1(); }
        if (link.dataset.page === 'vib-circular') { if(window.initVibrations) initVibQ2(); }
        if (link.dataset.page === 'vib-pendulum') { if(window.initVibrations) initVibQ3(); }
        if (link.dataset.page === 'vib-waves') { if(window.initVibWaves) initVibWaves(); }
        if (link.dataset.page === 'vib-interfere') { if(window.initVibInterfere) initVibInterfere(); }
        if (link.dataset.page === 'vib-standing') { if(window.initVibStanding) initVibStanding(); }
        if (link.dataset.page === 'vib-surface') { if(window.initVibSurface) initVibSurface(); }
        if (link.dataset.page === 'vib-doppler') { if(window.initVibDoppler) initVibDoppler(); }
        if (link.dataset.page === 'vib-beats') { if(window.initVibBeats) initVibBeats(); }
        if (link.dataset.page === 'vib-tubes') { if(window.initVibTubes) initVibTubes(); }
        if (link.dataset.page === 'vib-em') { if(window.initVibEM) initVibEM(); }
        if (link.dataset.page === 'vib-double-pendulum') { if(window.initVibDoublePendulum) initVibDoublePendulum(); }
    });
});

// ═══════════════ MATH TABS ═══════════════
document.querySelectorAll('.math-tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.math-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            tabGroup.querySelectorAll('.math-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const section = tabGroup.closest('.math-section');
            section.querySelectorAll('.math-tab-content').forEach(c => c.classList.remove('active'));
            section.querySelector('#' + tab.dataset.tab).classList.add('active');
        });
    });
});

// ═══════════════ SLIDER VALUE DISPLAY ═══════════════
document.querySelectorAll('input[type="range"]').forEach(slider => {
    const valSpan = document.getElementById(slider.id + '-val');
    if (valSpan) {
        slider.addEventListener('input', () => { valSpan.textContent = slider.value; });
    }
});

// ═══════════════ KATEX RENDERING ═══════════════
document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(document.body, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '\\(', right: '\\)', display: false },
                { left: '$', right: '$', display: false },
            ],
            throwOnError: false
        });
    }
    initProducts();
});

// ═══════════════ UTILITIES ═══════════════

function drawFormattedLabel(ctx, text, x, y, color) {
    ctx.fillStyle = color;
    const match = text.match(/^([a-zA-Z]+)_\{?([a-zA-Z0-9]+)\}?(.*)$/);
    if (match) {
        const main = match[1];
        const sub = match[2];
        const rest = match[3];
        
        ctx.font = 'bold 14px "Cambria Math", "Segoe UI Symbol", Arial';
        const mainW = ctx.measureText(main).width;
        ctx.font = 'bold 10px "Cambria Math", "Segoe UI Symbol", Arial';
        const subW = ctx.measureText(sub).width;
        ctx.font = 'bold 14px "Cambria Math", "Segoe UI Symbol", Arial';
        const restW = ctx.measureText(rest).width;
        
        const totalW = mainW + subW + restW;
        const startX = x - totalW/2;
        
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 14px "Cambria Math", "Segoe UI Symbol", Arial';
        ctx.fillText(main, startX, y);
        ctx.font = 'bold 10px "Cambria Math", "Segoe UI Symbol", Arial';
        ctx.fillText(sub, startX + mainW, y + 4);
        ctx.font = 'bold 14px "Cambria Math", "Segoe UI Symbol", Arial';
        ctx.fillText(rest, startX + mainW + subW, y);
    } else {
        ctx.font = 'bold 14px "Cambria Math", "Segoe UI Symbol", Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
        
        if (['A', 'B', 'R', '-B', 'A×B', 'A - B', 'A + B'].includes(text)) {
            const tw = ctx.measureText(text).width;
            const arrY = y - 10;
            ctx.beginPath();
            
            if (text === 'A - B' || text === 'A + B') {
                const wA = ctx.measureText('A').width;
                const wB = ctx.measureText('B').width;
                
                // Arrow over A
                const ax1 = x - tw/2;
                const ax2 = ax1 + wA;
                ctx.moveTo(ax1, arrY);
                ctx.lineTo(ax2, arrY);
                ctx.lineTo(ax2 - 3, arrY - 3);
                ctx.moveTo(ax2, arrY);
                ctx.lineTo(ax2 - 3, arrY + 3);
                
                // Arrow over B
                const bx2 = x + tw/2;
                const bx1 = bx2 - wB;
                ctx.moveTo(bx1, arrY);
                ctx.lineTo(bx2, arrY);
                ctx.lineTo(bx2 - 3, arrY - 3);
                ctx.moveTo(bx2, arrY);
                ctx.lineTo(bx2 - 3, arrY + 3);
            } else {
                const arrX1 = x - tw/2;
                const arrX2 = x + tw/2;
                ctx.moveTo(arrX1, arrY);
                ctx.lineTo(arrX2, arrY);
                ctx.lineTo(arrX2 - 3, arrY - 3);
                ctx.moveTo(arrX2, arrY);
                ctx.lineTo(arrX2 - 3, arrY + 3);
            }
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

// ═══════════════════════════════════════════════════════════════
// PAGE 1: VECTOR ADDITION (2D Canvas)
// ═══════════════════════════════════════════════════════════════
let vecAnimId = null;
function initVectors() {
    if (vecAnimId) cancelAnimationFrame(vecAnimId);
    const canvas = document.getElementById('vec-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const wrap = canvas.parentElement;
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
        resize();
        const W = canvas.width, H = canvas.height;
        const cx = W * 0.35, cy = H * 0.6;
        const scale = Math.min(W, H) / 30;

        ctx.clearRect(0, 0, W, H);

        ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
        for (let i = -20; i <= 20; i++) {
            ctx.beginPath(); ctx.moveTo(cx + i * scale, 0); ctx.lineTo(cx + i * scale, H); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, cy + i * scale); ctx.lineTo(W, cy + i * scale); ctx.stroke();
        }

        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, H); ctx.lineTo(cx, 0); ctx.stroke();

        ctx.fillStyle = '#94a3b8'; ctx.font = '13px "Cambria Math", "Segoe UI Symbol", Arial';
        ctx.fillText('x', W - 15, cy - 8);
        ctx.fillText('y', cx + 8, 15);

        const v1m = parseFloat(document.getElementById('v-v1mag').value);
        const v1a = parseFloat(document.getElementById('v-v1ang').value) * Math.PI / 180;
        const v2m = parseFloat(document.getElementById('v-v2mag').value);
        const v2a = parseFloat(document.getElementById('v-v2ang').value) * Math.PI / 180;
        const showComp = document.getElementById('v-showcomp').checked;
        const showPara = document.getElementById('v-showpara').checked;
        const mode = document.querySelector('input[name="vec_mode"]:checked')?.value || 'add';

        // NOTE: We rely on the python backend for math!
        const ax = v1m * Math.cos(v1a), ay = v1m * Math.sin(v1a);
        const bx = v2m * Math.cos(v2a), by = v2m * Math.sin(v2a);
        
        const stateStr = `${ax},${ay},${bx},${by},${mode}`;
        if (window._vecLastState !== stateStr) {
            window._vecLastState = stateStr;
            let realAx = ax, realAy = ay, realBx = bx, realBy = by;
            if (mode === 'sub') { realBx = -bx; realBy = -by; }
            fetch('/api/vectors', {
                method: 'POST',
                body: JSON.stringify({ax: realAx, ay: realAy, bx: realBx, by: realBy})
            }).then(r => r.json()).then(data => {
                window._vecData = data;
            }).catch(e => console.error(e));
        }
        const vecData = window._vecData || { rx: mode==='add'?ax+bx:ax-bx, ry: mode==='add'?ay+by:ay-by };
        const rx = vecData.rx;
        const ry = vecData.ry;

        function drawArrow(x0, y0, x1, y1, color, lineW, label, isDashed=false) {
            const dx = x1 - x0, dy = y1 - y0;
            const len = Math.sqrt(dx*dx + dy*dy);
            if (len < 1) return;
            const ux = dx/len, uy = dy/len;
            const headLen = Math.min(14, len * 0.3);

            ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lineW; ctx.lineCap = 'round';
            if (isDashed) ctx.setLineDash([5, 5]); else ctx.setLineDash([]);
            
            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux * headLen, y1 - uy * headLen); ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 - ux * headLen - uy * headLen * 0.4, y1 - uy * headLen + ux * headLen * 0.4);
            ctx.lineTo(x1 - ux * headLen + uy * headLen * 0.4, y1 - uy * headLen - ux * headLen * 0.4);
            ctx.closePath(); ctx.fill();

            if (label) {
                ctx.font = 'bold 16px "Cambria Math", "Segoe UI Symbol", Arial';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                const tx = (x0+x1)/2 + uy * 20;
                const ty = (y0+y1)/2 - ux * 20;
                drawFormattedLabel(ctx, label, tx, ty, color);
            }
        }

        // Draw Parallelogram
        if (showPara) {
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
            if (mode === 'add') {
                ctx.beginPath(); ctx.moveTo(cx + bx*scale, cy - by*scale); ctx.lineTo(cx + rx*scale, cy - ry*scale); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + ax*scale, cy - ay*scale); ctx.lineTo(cx + rx*scale, cy - ry*scale); ctx.stroke();
            } else {
                ctx.beginPath(); ctx.moveTo(cx - bx*scale, cy + by*scale); ctx.lineTo(cx + rx*scale, cy - ry*scale); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + ax*scale, cy - ay*scale); ctx.lineTo(cx + rx*scale, cy - ry*scale); ctx.stroke();
            }
            ctx.setLineDash([]);
        }

        // Draw Base Vectors
        drawArrow(cx, cy, cx + ax*scale, cy - ay*scale, '#ef4444', 3.5, 'A');
        
        if (mode === 'add') {
            drawArrow(cx, cy, cx + bx*scale, cy - by*scale, '#3b82f6', 3.5, 'B');
            drawArrow(cx, cy, cx + rx*scale, cy - ry*scale, '#10b981', 4.5, 'R');
        } else {
            drawArrow(cx, cy, cx + bx*scale, cy - by*scale, '#94a3b8', 2, 'B');
            drawArrow(cx, cy, cx - bx*scale, cy + by*scale, '#3b82f6', 3.5, '-B');
            drawArrow(cx, cy, cx + rx*scale, cy - ry*scale, '#f59e0b', 4.5, 'R');
            
            // Alternate connection from tip of B to tip of A
            if (showPara) {
                drawArrow(cx + bx*scale, cy - by*scale, cx + ax*scale, cy - ay*scale, '#f59e0b', 2, 'A - B', true);
            }
        }

        if (showComp) {
            ctx.setLineDash([4, 4]); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + ax*scale, cy); ctx.lineTo(cx + ax*scale, cy - ay*scale); ctx.stroke();
            
            if (mode === 'add') {
                ctx.strokeStyle = '#10b981';
                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + rx*scale, cy); ctx.lineTo(cx + rx*scale, cy - ry*scale); ctx.stroke();
            } else {
                ctx.strokeStyle = '#f59e0b';
                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + rx*scale, cy); ctx.lineTo(cx + rx*scale, cy - ry*scale); ctx.stroke();
            }
            ctx.setLineDash([]);
        }

        vecAnimId = requestAnimationFrame(draw);
    }
    draw();
}

// ═══════════════════════════════════════════════════════════════
// PAGE 2: DOT & CROSS PRODUCTS (Isometric Projection)
// ═══════════════════════════════════════════════════════════════
let prodAnimId = null;
let prodAngle = Math.PI / 6; // Isometric rotation angle
let prodTilt = Math.PI / 8; // Vertical tilt angle

function initProducts() {
    if (prodAnimId) cancelAnimationFrame(prodAnimId);
    const canvas = document.getElementById('prod-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const wrap = canvas.parentElement;
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
    }
    resize();

    // Mouse drag to rotate view
    let isDragging = false;
    let lastX = 0, lastY = 0;
    canvas.onmousedown = e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; };
    window.onmouseup = () => { isDragging = false; };
    window.onmousemove = e => {
        if (isDragging) {
            prodAngle -= (e.clientX - lastX) * 0.01;
            prodTilt += (e.clientY - lastY) * 0.01;
            // Clamp tilt to prevent upside-down flipping
            prodTilt = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, prodTilt));
            lastX = e.clientX;
            lastY = e.clientY;
        }
    };

    function animate() {
        if (!document.getElementById('page-products').classList.contains('active-page')) return;
        resize();
        
        const mode = document.querySelector('input[name="prod_mode"]:checked').value;
        const inputMode = document.querySelector('input[name="pr_input_mode"]:checked').value;
        
        let ax, ay, az, bx, by, bz;
        if (inputMode === 'cartesian') {
            ax = parseFloat(document.getElementById('pr-ax').value);
            ay = parseFloat(document.getElementById('pr-ay').value);
            az = parseFloat(document.getElementById('pr-az').value);
            bx = parseFloat(document.getElementById('pr-bx').value);
            by = parseFloat(document.getElementById('pr-by').value);
            bz = parseFloat(document.getElementById('pr-bz').value);
        } else {
            const maga = parseFloat(document.getElementById('pr-maga').value);
            const anga = parseFloat(document.getElementById('pr-anga').value) * Math.PI / 180;
            const magb = parseFloat(document.getElementById('pr-magb').value);
            const angb = parseFloat(document.getElementById('pr-angb').value) * Math.PI / 180;
            
            ax = maga * Math.cos(anga);
            ay = maga * Math.sin(anga);
            az = 0;
            bx = magb * Math.cos(angb);
            by = magb * Math.sin(angb);
            bz = 0;
        }
        const resText = document.getElementById('pr-res-text');

        // Fetch math from backend
        const stateStr = `${ax},${ay},${az},${bx},${by},${bz}`;
        if (window._prodLastState !== stateStr) {
            window._prodLastState = stateStr;
            fetch('/api/vectors', {
                method: 'POST',
                body: JSON.stringify({ax: ax, ay: ay, az: az, bx: bx, by: by, bz: bz})
            }).then(r => r.json()).then(data => {
                window._prodData = data;
            }).catch(e => console.error(e));
        }
        
        // Fallback for first frame
        const fallback = { dot: ax*bx+ay*by+az*bz, cross_x: ay*bz-az*by, cross_y: az*bx-ax*bz, cross_z: ax*by-ay*bx, mag_a: Math.sqrt(ax*ax+ay*ay+az*az) };
        const prodData = window._prodData || fallback;

        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);

        // 3D Perspective Engine
        const sc = 35; // Scale
        const cx = W / 2, cy = H / 2 + 30;
        const fov = 800; // Perspective depth
        
        function proj(x, y, z) {
            const rx = x * Math.cos(prodAngle) - z * Math.sin(prodAngle);
            const rz = x * Math.sin(prodAngle) + z * Math.cos(prodAngle);
            const ry = y * Math.cos(prodTilt) - rz * Math.sin(prodTilt);
            const rz2 = y * Math.sin(prodTilt) + rz * Math.cos(prodTilt);
            const scale = fov / (fov + rz2 * sc);
            return { x: cx + rx * sc * scale, y: cy - ry * sc * scale, z: rz2, scale };
        }

        let renderQueue = [];

        function drawLine(p1, p2, color, width, dash = []) {
            renderQueue.push({ z: (p1.z + p2.z) / 2, draw: () => {
                ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, width * ((p1.scale+p2.scale)/2));
                ctx.setLineDash(dash); ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                ctx.setLineDash([]);
            }});
        }

        // Draw ground grid
        for (let i = -8; i <= 8; i+=2) {
            drawLine(proj(i, 0, -8), proj(i, 0, 8), '#e2e8f0', 1);
            drawLine(proj(-8, 0, i), proj(8, 0, i), '#e2e8f0', 1);
        }

        // Draw Axes
        drawLine(proj(0,0,0), proj(8,0,0), '#94a3b8', 2);
        drawLine(proj(0,0,0), proj(0,8,0), '#94a3b8', 2);
        drawLine(proj(0,0,0), proj(0,0,8), '#94a3b8', 2);

        // Arrow drawer
        function drawVector(vX, vY, vZ, color, label) {
            const p0 = proj(0,0,0);
            const p1 = proj(vX, vY, vZ);
            
            renderQueue.push({ z: p1.z - 0.1, draw: () => {
                ctx.strokeStyle = color; ctx.lineWidth = 4 * p1.scale; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
                
                // Real 3D Arrowhead
                const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
                const headLen = 14 * p1.scale;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p1.x - headLen * Math.cos(angle - Math.PI/7), p1.y - headLen * Math.sin(angle - Math.PI/7));
                ctx.lineTo(p1.x - headLen * Math.cos(angle + Math.PI/7), p1.y - headLen * Math.sin(angle + Math.PI/7));
                ctx.closePath(); ctx.fill();
                
                ctx.font = `bold ${Math.max(12, 16*p1.scale)}px "Cambria Math", "Segoe UI Symbol", Arial`; ctx.textAlign = 'left';
                drawFormattedLabel(ctx, label, p1.x + 12*p1.scale, p1.y - 12*p1.scale, color);
            }});
        }

        if (mode === 'dot') {
            const dot = prodData.dot;
            resText.innerHTML = `Scalar Result (A · B) = <span style="color:#f59e0b">${dot.toFixed(2)}</span>`;
            
            // Vector magnitudes
            const magA = prodData.mag_a;
            if (magA > 0.001) {
                const pFactor = dot / (magA*magA);
                const px = ax * pFactor, py = ay * pFactor, pz = az * pFactor;
                
                // Draw projection line
                const ptB = proj(bx, by, bz);
                const ptP = proj(px, py, pz);
                drawLine(ptB, ptP, '#64748b', 2, [4, 4]);
            }
            
            drawVector(ax, ay, az, '#ef4444', 'A');
            drawVector(bx, by, bz, '#3b82f6', 'B');
            
        } else {
            const cx_vec = prodData.cross_x;
            const cy_vec = prodData.cross_y;
            const cz_vec = prodData.cross_z;
            resText.innerHTML = `Vector Result (A × B) = <span style="color:#10b981">(${cx_vec.toFixed(2)}, ${cy_vec.toFixed(2)}, ${cz_vec.toFixed(2)})</span>`;
            
            // Draw parallelogram base
            const pt0 = proj(0,0,0);
            const ptA = proj(ax, ay, az);
            const ptB = proj(bx, by, bz);
            const ptAB = proj(ax+bx, ay+by, az+bz);
            const zAvg = (pt0.z + ptA.z + ptB.z + ptAB.z) / 4;
            
            renderQueue.push({ z: zAvg, draw: () => {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(pt0.x, pt0.y); ctx.lineTo(ptA.x, ptA.y); ctx.lineTo(ptAB.x, ptAB.y); ctx.lineTo(ptB.x, ptB.y); ctx.closePath();
                ctx.fill(); ctx.stroke();
            }});
            
            drawVector(ax, ay, az, '#ef4444', 'A');
            drawVector(bx, by, bz, '#3b82f6', 'B');
            if (Math.sqrt(cx_vec*cx_vec + cy_vec*cy_vec + cz_vec*cz_vec) > 0.001) {
                drawVector(cx_vec, cy_vec, cz_vec, '#10b981', 'A×B');
            }
        }
        
        // Execute Z-Sorted Render Queue (Painter's Algorithm)
        renderQueue.sort((a, b) => b.z - a.z);
        renderQueue.forEach(q => q.draw());

        ctx.fillStyle = '#64748b'; ctx.font = '12px "Cambria Math", "Segoe UI Symbol", Arial'; ctx.textAlign = 'right';
        ctx.fillText('Drag to rotate view in 3D', W - 15, H - 15);

        prodAnimId = requestAnimationFrame(animate);
    }
    
    animate();
}

// ═══════════════════════════════════════════════════════════════
// PAGE 3: 1D MOTION (2D Canvas + Chart.js)
// ═══════════════════════════════════════════════════════════════
let motionAnimId = null;
let chartXInst = null, chartVInst = null, chartAInst = null;

function initMotion1D() {
    if (motionAnimId) cancelAnimationFrame(motionAnimId);
    if (chartXInst) chartXInst.destroy();
    if (chartVInst) chartVInst.destroy();
    if (chartAInst) chartAInst.destroy();

    const canvas = document.getElementById('motion-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const wrap = canvas.parentElement;
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
    }
    resize();

    const cOpts = {
        responsive: true, maintainAspectRatio: false, animation: false,
        scales: {
            x: { type: 'linear', min: 0, max: 10, title: { display: true, text: 'Time (s)', color: '#475569' }, grid: { display: true, color: '#e2e8f0' } },
            y: { title: { display: true, color: '#475569' }, grid: { display: true, color: '#e2e8f0' } }
        },
        plugins: { legend: { position: 'top', align: 'end', labels: { color: '#222', font: { weight: 'bold', family: '"Cambria Math", "Segoe UI Symbol", Arial', size: 11 }, boxWidth: 12, padding: 8 } } }
    };

    chartXInst = new Chart(document.getElementById('chart-x'), {
        type: 'line', data: { datasets: [{ label: 'x(t)', data: [], borderColor: '#3b82f6', borderWidth: 2.5, pointRadius: 0, tension: 0.1 }] },
        options: { ...cOpts, scales: { ...cOpts.scales, y: { ...cOpts.scales.y, title: { ...cOpts.scales.y.title, text: 'x (m)' } } } }
    });
    chartVInst = new Chart(document.getElementById('chart-v'), {
        type: 'line', data: { datasets: [{ label: 'v(t)', data: [], borderColor: '#10b981', borderWidth: 2.5, pointRadius: 0, tension: 0.1 }] },
        options: { ...cOpts, scales: { ...cOpts.scales, y: { ...cOpts.scales.y, title: { ...cOpts.scales.y.title, text: 'v (m/s)' } } } }
    });
    chartAInst = new Chart(document.getElementById('chart-a'), {
        type: 'line', data: { datasets: [{ label: 'a(t)', data: [], borderColor: '#f59e0b', borderWidth: 2.5, pointRadius: 0, tension: 0.1 }] },
        options: { ...cOpts, scales: { ...cOpts.scales, y: { ...cOpts.scales.y, min: -6, max: 6, title: { ...cOpts.scales.y.title, text: 'a (m/s²)' } } } }
    });

    let t = 0;
    let frameCount = 0;
    let isMoving = false;
    let isPaused = false;

    function drawCar(cx, cy, scale, vel, acc, wheelAngle = 0) {
        // The road is infinite
        ctx.fillStyle = '#64748b'; ctx.fillRect(0, cy, canvas.width, 30);
        
        const wheelR = 10 * scale;
        
        // Back Wheel
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(cx - 22*scale, cy, wheelR, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx - 22*scale, cy); ctx.lineTo(cx - 22*scale + Math.cos(wheelAngle)*wheelR, cy + Math.sin(wheelAngle)*wheelR); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - 22*scale, cy); ctx.lineTo(cx - 22*scale + Math.cos(wheelAngle + Math.PI/2)*wheelR, cy + Math.sin(wheelAngle + Math.PI/2)*wheelR); ctx.stroke();
        
        // Front Wheel
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(cx + 22*scale, cy, wheelR, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + 22*scale, cy); ctx.lineTo(cx + 22*scale + Math.cos(wheelAngle)*wheelR, cy + Math.sin(wheelAngle)*wheelR); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 22*scale, cy); ctx.lineTo(cx + 22*scale + Math.cos(wheelAngle + Math.PI/2)*wheelR, cy + Math.sin(wheelAngle + Math.PI/2)*wheelR); ctx.stroke();

        ctx.fillStyle = '#3b82f6';
        roundRect(ctx, cx - 40*scale, cy - 28*scale, 80*scale, 25*scale, 6); ctx.fill();
        ctx.fillStyle = '#1e40af';
        roundRect(ctx, cx - 20*scale, cy - 48*scale, 40*scale, 22*scale, 5); ctx.fill();
    }

    function animate() {
        if (!document.getElementById('page-motion1d').classList.contains('active-page')) return;
        resize();
        const W = canvas.width, H = canvas.height;
        const v0_input = document.getElementById('m-v0');
        const a_input = document.getElementById('m-a');
        const v0 = parseFloat(v0_input.value);
        const a = parseFloat(a_input.value);

        if (isMoving) {
            v0_input.disabled = true;
            a_input.disabled = true;
        } else {
            v0_input.disabled = false;
            a_input.disabled = false;
        }

        ctx.clearRect(0, 0, W, H);

        if (isMoving && !isPaused) {
            if (t <= 10) {
                t += 0.016;
            } else {
                isMoving = false;
            }
        }

        const v = v0 + a * t;
        const x = v0 * t + 0.5 * a * t * t;

        const carX = W * 0.3; // Place car further left
        const carY = H * 0.7;
        const sc = Math.min(W, H) / 400;
        const pxToMeters = 10 * sc;

        if (pxToMeters === 0) {
            motionAnimId = requestAnimationFrame(animate);
            return;
        }

        // Sky
        ctx.fillStyle = '#e0f2fe'; ctx.fillRect(0, 0, W, carY);
        
        // Clouds (parallax, move slower)
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 6; i++) {
            const cx = (W * (i/4) - (x * pxToMeters * 0.2)) % (W + 200);
            const drawX = cx < -100 ? cx + W + 200 : cx;
            ctx.beginPath(); ctx.arc(drawX, H*0.2, 30*sc, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(drawX+20*sc, H*0.2+10*sc, 25*sc, 0, Math.PI*2); ctx.fill();
        }

        // Grass
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, carY + 30, W, H - carY - 30);

        // Ground Markers
        ctx.save();
        ctx.translate(carX - x * pxToMeters, 0);
        
        const startM = Math.floor((x * pxToMeters - carX) / pxToMeters / 5) * 5;
        for (let m = startM - 20; m <= startM + W/pxToMeters + 20; m += 5) {
            const mx = m * pxToMeters;
            // Road lines
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(mx, carY + 12, 15, 4);
            
            // Trees / Poles
            if (m % 20 === 0) {
                ctx.fillStyle = '#8b4513'; ctx.fillRect(mx - 4, carY - 40*sc, 8, 40*sc); // trunk
                ctx.fillStyle = '#059669'; ctx.beginPath(); ctx.arc(mx, carY - 40*sc, 20*sc, 0, Math.PI*2); ctx.fill(); // leaves
            }

            if (m % 10 === 0) {
                ctx.fillStyle = '#0f172a'; ctx.font = `bold ${12*sc}px "Cambria Math", "Segoe UI Symbol", Arial`;
                ctx.fillText(m + 'm', mx - 10, carY + 28);
            }
        }
        ctx.restore();

        const wheelAngle = (x * pxToMeters) / (10 * sc); // rotation = distance / radius
        drawCar(carX, carY, sc, v, a, wheelAngle);
        ctx.fillStyle = '#ef4444'; ctx.font = `bold ${14*sc}px "Cambria Math", "Segoe UI Symbol", Arial`;
        ctx.fillText(`x = ${x.toFixed(1)} m`, carX - 30*sc, H * 0.7 + 45*sc);

        if (isMoving && !isPaused) {
            frameCount++;
            if (frameCount % 3 === 0) {
                const updateWindow = (chart) => {
                    if (t > 10) {
                        chart.options.scales.x.min = t - 10;
                        chart.options.scales.x.max = t;
                    }
                };
                chartXInst.data.datasets[0].data.push({ x: t, y: x });
                chartVInst.data.datasets[0].data.push({ x: t, y: v });
                chartAInst.data.datasets[0].data.push({ x: t, y: a });
                chartXInst.update('none'); chartVInst.update('none'); chartAInst.update('none');
            }
        }
        motionAnimId = requestAnimationFrame(animate);
    }

    document.getElementById('m-restart').addEventListener('click', () => {
        t = 0; frameCount = 0; isMoving = true; isPaused = false;
        document.getElementById('m-pause').textContent = 'Pause';
        chartXInst.data.datasets[0].data = []; chartVInst.data.datasets[0].data = []; chartAInst.data.datasets[0].data = [];
        chartXInst.update(); chartVInst.update(); chartAInst.update();
    });

    document.getElementById('m-pause').addEventListener('click', () => {
        if (!isMoving) return;
        isPaused = !isPaused;
        document.getElementById('m-pause').textContent = isPaused ? 'Resume' : 'Pause';
    });

    animate();
}


// ═══════════════════════════════════════════════════════════════
// PAGE 4: PROJECTILE MOTION (2D Canvas + Chart.js)
// ═══════════════════════════════════════════════════════════════
let projAnimId = null;
let chartYxInst = null, chartYtInst = null;

function initProjectile() {
    if (projAnimId) cancelAnimationFrame(projAnimId);
    if (chartYxInst) chartYxInst.destroy();
    if (chartYtInst) chartYtInst.destroy();

    const canvas = document.getElementById('proj-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const wrap = canvas.parentElement;
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
    }
    resize();

    const cOpts = { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { position: 'top', align: 'end', labels: { color: '#222', font: { weight: 'bold', size: 11 }, boxWidth: 12, padding: 8 } } } };
    chartYxInst = new Chart(document.getElementById('chart-yx'), {
        type: 'line', data: { datasets: [{ label: 'y(x)', data: [], borderColor: '#ef4444', borderWidth: 2.5, pointRadius: 0 }] },
        options: { ...cOpts, scales: { x: { type: 'linear', min: 0, max: 60, title: { display: true, text: 'x (m)' }, grid: { display: true, color: '#e2e8f0' } }, y: { min: 0, max: 30, title: { display: true, text: 'y (m)' }, grid: { display: true, color: '#e2e8f0' } } } }
    });
    chartYtInst = new Chart(document.getElementById('chart-yt'), {
        type: 'line', data: { datasets: [{ label: 'y(t)', data: [], borderColor: '#3b82f6', borderWidth: 2.5, pointRadius: 0 }] },
        options: { ...cOpts, scales: { x: { type: 'linear', min: 0, max: 5, title: { display: true, text: 't (s)' }, grid: { display: true, color: '#e2e8f0' } }, y: { min: 0, max: 30, grid: { display: true, color: '#e2e8f0' } } } }
    });

    let t = 0;
    let trail = [];
    let frameCount = 0;
    let isFiring = false;
    let isPaused = false;

    function animate() {
        if (!document.getElementById('page-projectile').classList.contains('active-page')) return;
        resize();
        const W = canvas.width, H = canvas.height;
        const v0 = parseFloat(document.getElementById('p-v0').value);
        const theta = parseFloat(document.getElementById('p-theta').value) * Math.PI / 180;
        const g = 9.81;
        const vx0 = v0 * Math.cos(theta), vy0 = v0 * Math.sin(theta);

        const groundY = H * 0.85;
        const originX = W * 0.08;
        const sc = Math.min(W, H) / 50; 

        ctx.clearRect(0, 0, W, H);

        // Sky
        ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, W, groundY);
        
        // Clouds
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for(let i=0; i<4; i++) {
            const cx = ((i*300 + (isFiring ? t*10 : 0)) % (W+200)) - 100;
            ctx.beginPath();
            ctx.arc(cx, 40+i*20, 25, 0, Math.PI*2);
            ctx.arc(cx+30, 30+i*20, 35, 0, Math.PI*2);
            ctx.arc(cx+60, 40+i*20, 25, 0, Math.PI*2);
            ctx.fill();
        }

        // Grass
        ctx.fillStyle = '#3d8c40'; ctx.fillRect(0, groundY, W, H - groundY);
        ctx.strokeStyle = '#2f6e31'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

        ctx.save();
        ctx.translate(originX, groundY);
        ctx.fillStyle = '#64748b'; roundRect(ctx, -15, -12, 30, 12, 4); ctx.fill();
        ctx.rotate(-theta);
        ctx.fillStyle = '#334155'; roundRect(ctx, 0, -6, 40, 12, 3); ctx.fill();
        ctx.restore();

        const px = vx0 * t;
        const py = vy0 * t - 0.5 * g * t * t;
        const screenX = originX + px * sc;
        const screenY = groundY - py * sc;

        const showVec = document.getElementById('p-showvec').checked;
        const p_v0_input = document.getElementById('p-v0');
        const p_theta_input = document.getElementById('p-theta');

        if (isFiring) {
            p_v0_input.disabled = true;
            p_theta_input.disabled = true;
        } else {
            p_v0_input.disabled = false;
            p_theta_input.disabled = false;
        }

        if (isFiring && !isPaused && py >= 0) {
            t += 0.016;
            if (t === 0.016) trail.push({ x: screenX, y: screenY }); // first point
            trail.push({ x: screenX, y: screenY });
        }
        
        if (isFiring && py < 0) {
            isFiring = false;
        }

        if (trail.length > 1) {
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
            ctx.beginPath(); ctx.moveTo(trail[0].x, trail[0].y);
            for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
            ctx.stroke();
        }

        if (py >= 0) {
            
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(screenX, screenY, 6, 0, Math.PI * 2); ctx.fill();
            
            // Draw distances
            ctx.fillStyle = '#334155'; ctx.font = 'bold 12px "Cambria Math", "Segoe UI Symbol", Arial'; ctx.textAlign = 'left';
            ctx.fillText(`x = ${px.toFixed(1)} m`, screenX - 70, screenY + 25);
            ctx.fillText(`y = ${py.toFixed(1)} m`, screenX - 70, screenY + 40);

            
            if (showVec) {
                const vx = vx0;
                const vy = vy0 - g * t;
                const screenAngle = Math.atan2(-vy, vx);

                function drawArr(x0, y0, dx, dy, color, label) {
                    const x1 = x0 + dx, y1 = y0 + dy;
                    const len = Math.sqrt(dx*dx + dy*dy);
                    if(len < 1) return;
                    const ux = dx/len, uy = dy/len;
                    const hl = 12;
                    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
                    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux*hl, y1 - uy*hl); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x1, y1);
                    ctx.lineTo(x1 - ux*hl - uy*hl*0.4, y1 - uy*hl + ux*hl*0.4);
                    ctx.lineTo(x1 - ux*hl + uy*hl*0.4, y1 - uy*hl - ux*hl*0.4);
                    ctx.fill();

                    if(label) {
                        ctx.font = 'bold 14px "Cambria Math", "Segoe UI Symbol", Arial';
                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                        const tx = x1 + ux*20, ty = y1 + uy*20;
                        drawFormattedLabel(ctx, label, tx, ty, color);
                    }
                }

                const vScale = 1.2 * sc;
                const vMag = Math.sqrt(vx*vx + vy*vy).toFixed(1);
                
                // Components
                drawArr(screenX, screenY, vx * vScale, 0, '#3b82f6', `v_x=${vx.toFixed(1)}`);
                drawArr(screenX + vx*vScale, screenY, 0, -vy * vScale, '#3b82f6', `v_y=${vy.toFixed(1)}`);
                
                // Main velocity vector
                drawArr(screenX, screenY, vx * vScale, -vy * vScale, '#10b981', `v=${vMag}`);
                
                // Gravity vector
                drawArr(screenX, screenY, 0, g * 1.5 * sc, '#f59e0b', `g=9.8`);

                ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([4,4]); ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(screenX, screenY); ctx.lineTo(screenX + 50*sc, screenY); ctx.stroke();
                ctx.setLineDash([]);

                ctx.beginPath();
                ctx.arc(screenX, screenY, 20, 0, screenAngle, screenAngle < 0);
                ctx.strokeStyle = '#3b82f6'; ctx.stroke();
                
                const displayTheta = (Math.atan2(vy, vx) * 180 / Math.PI).toFixed(0);
                ctx.fillStyle = '#3b82f6'; ctx.font = `bold 12px "Cambria Math", "Segoe UI Symbol", Arial`;
                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                const arcTx = screenX + 24 * Math.cos(screenAngle/2);
                const arcTy = screenY + 24 * Math.sin(screenAngle/2);
                ctx.fillText(displayTheta + '°', arcTx, arcTy);
            }

            if (isFiring && !isPaused) {
                frameCount++;
                if (frameCount % 3 === 0) {
                    chartYxInst.data.datasets[0].data.push({ x: px, y: py });
                    chartYtInst.data.datasets[0].data.push({ x: t, y: py });
                    chartYxInst.update('none'); chartYtInst.update('none');
                }
            }
        }

        projAnimId = requestAnimationFrame(animate);
    }

    document.getElementById('p-restart').addEventListener('click', () => {
        t = 0; trail = []; frameCount = 0;
        isFiring = true; isPaused = false;
        document.getElementById('p-pause').textContent = 'Pause';
        chartYxInst.data.datasets[0].data = []; chartYtInst.data.datasets[0].data = [];
        chartYxInst.update(); chartYtInst.update();
    });

    document.getElementById('p-pause').addEventListener('click', () => {
        if (!isFiring) return;
        isPaused = !isPaused;
        document.getElementById('p-pause').textContent = isPaused ? 'Resume' : 'Pause';
    });

    animate();
}

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ═══════════════════════════════════════════════════════════════
// PAGE 5: LIVE CALCULUS SANDBOX
// ═══════════════════════════════════════════════════════════════
let calcAnimId = null;
let chartCxInst = null, chartCvInst = null, chartCaInst = null;

function initCalculus() {
    if (calcAnimId) cancelAnimationFrame(calcAnimId);
    if (chartCxInst) chartCxInst.destroy();
    if (chartCvInst) chartCvInst.destroy();
    if (chartCaInst) chartCaInst.destroy();

    const canvas = document.getElementById('calc-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const wrap = canvas.parentElement;
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
    }
    resize();

    const cOpts = { 
        responsive: true, maintainAspectRatio: false, animation: false, 
        scales: {
            x: { type: 'linear', min: 0, max: 10, title: { display: true, color: '#475569' }, grid: { display: true, color: '#e2e8f0' } },
            y: { title: { display: true, color: '#475569' }, grid: { display: true, color: '#e2e8f0' } }
        },
        plugins: { legend: { display: true, position: 'top', align: 'end', labels: { color: '#222', font: { weight: 'bold', family: '"Cambria Math", "Segoe UI Symbol", Arial', size: 11 }, boxWidth: 12, padding: 8 } } }
    };
    
    chartCaInst = new Chart(document.getElementById('chart-ca'), {
        type: 'line', data: { datasets: [{ label: 'a(t)', data: [], borderColor: '#f59e0b', borderWidth: 2.5, pointRadius: 0 }] },
        options: { ...cOpts, scales: { x: { type: 'linear', min: 0, max: 10, title: { display: true, text: 't (s)' } }, y: { suggestedMin: -12, suggestedMax: 12 } } }
    });
    chartCvInst = new Chart(document.getElementById('chart-cv'), {
        type: 'line', data: { datasets: [{ label: 'v(t)', data: [], borderColor: '#3b82f6', borderWidth: 2.5, pointRadius: 0 }] },
        options: { ...cOpts, scales: { x: { type: 'linear', min: 0, max: 10, title: { display: true, text: 't (s)' } }, y: { suggestedMin: -20, suggestedMax: 20 } } }
    });
    chartCxInst = new Chart(document.getElementById('chart-cx'), {
        type: 'line', data: { datasets: [{ label: 'x(t)', data: [], borderColor: '#ef4444', borderWidth: 2.5, pointRadius: 0 }] },
        options: { ...cOpts, scales: { x: { type: 'linear', min: 0, max: 10, title: { display: true, text: 't (s)' } }, y: { suggestedMin: -50, suggestedMax: 50 } } }
    });

    let t = 0;
    let v = 0;
    let x = 0;
    let frameCount = 0;
    let isPaused = true;
    
    const slider = document.getElementById('c-a');
    const valDisplay = document.getElementById('c-a-val');

    document.getElementById('c-restart').addEventListener('click', () => {
        t = 0; v = 0; x = 0; frameCount = 0; isPaused = true;
        slider.value = 0;
        valDisplay.textContent = '0';
        document.getElementById('c-pause').textContent = 'Start';
        chartCaInst.data.datasets[0].data = [];
        chartCvInst.data.datasets[0].data = [];
        chartCxInst.data.datasets[0].data = [];
        chartCaInst.options.scales.x.min = 0;
        chartCaInst.options.scales.x.max = 10;
        chartCvInst.options.scales.x.min = 0;
        chartCvInst.options.scales.x.max = 10;
        chartCxInst.options.scales.x.min = 0;
        chartCxInst.options.scales.x.max = 10;
        chartCaInst.update(); chartCvInst.update(); chartCxInst.update();
    });

    document.getElementById('c-pause').addEventListener('click', () => {
        isPaused = !isPaused;
        document.getElementById('c-pause').textContent = isPaused ? 'Resume' : 'Pause';
    });

    slider.addEventListener('input', () => {
        valDisplay.textContent = slider.value;
    });

    function animate() {
        if (!document.getElementById('page-calculus').classList.contains('active-page')) return;
        resize();
        
        const dt = 0.016; // 60 FPS
        const a = parseFloat(slider.value);
        
        if (!isPaused) {
            t += dt;
            v += a * dt;
            x += v * dt;
            
            frameCount++;
            if (frameCount % 3 === 0) {
                chartCaInst.data.datasets[0].data.push({ x: t, y: a });
                chartCvInst.data.datasets[0].data.push({ x: t, y: v });
                chartCxInst.data.datasets[0].data.push({ x: t, y: x });
                
                if (t > 10) {
                    chartCaInst.options.scales.x.max = t;
                    chartCvInst.options.scales.x.max = t;
                    chartCxInst.options.scales.x.max = t;
                }
                
                chartCaInst.update('none'); chartCvInst.update('none'); chartCxInst.update('none');
            }
        }
        
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
        
        const cy = H / 2;
        const cx = W / 2;
        const sc = W / 100; // pixels per meter
        
        // Draw scrolling background grid
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
        const startGrid = Math.floor((x * sc - cx) / 50) * 50;
        
        for (let gX = startGrid - 50; gX <= startGrid + W + 50; gX += 50) {
            const screenX = gX - (x * sc - cx);
            ctx.beginPath(); ctx.moveTo(screenX, 0); ctx.lineTo(screenX, H); ctx.stroke();
            
            if (gX % 100 === 0) {
                ctx.fillStyle = '#94a3b8'; ctx.font = '11px "Cambria Math", "Segoe UI Symbol", Arial'; ctx.textAlign = 'center';
                const meterVal = (gX / sc).toFixed(0);
                ctx.fillText(meterVal + 'm', screenX, cy + 80);
            }
        }
        
        // Draw central track line
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
        
        const drawX = cx; // Particle always in center
        
        // Vector arrow drawing function
        function drawArr(x0, y0, dx, dy, color) {
            const x1 = x0 + dx, y1 = y0 + dy;
            const len = Math.sqrt(dx*dx + dy*dy);
            if(len < 1) return;
            const ux = dx/len, uy = dy/len;
            const hl = Math.min(12, len * 0.4);
            ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux*hl, y1 - uy*hl); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x1, y1);
            ctx.lineTo(x1 - ux*hl - uy*hl*0.4, y1 - uy*hl + ux*hl*0.4);
            ctx.lineTo(x1 - ux*hl + uy*hl*0.4, y1 - uy*hl - ux*hl*0.4);
            ctx.fill();
        }
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(drawX, cy, 15, 0, Math.PI*2); ctx.fill();
        
        if (Math.abs(v) > 0.1) {
            drawArr(drawX, cy, v * sc * 0.5, 0, '#3b82f6');
        }
        
        if (Math.abs(a) > 0.1) {
            drawArr(drawX, cy + 25, a * sc * 1.5, 0, '#f59e0b');
        }
        
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 14px "Cambria Math", "Segoe UI Symbol", Arial'; ctx.textAlign = 'center';
        ctx.fillText(`x = ${x.toFixed(2)} m`, drawX, cy - 25);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(`v = ${v.toFixed(2)} m/s`, drawX, cy - 45);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`a = ${a.toFixed(2)} m/s²`, drawX, cy + 50);

        calcAnimId = requestAnimationFrame(animate);
    }
    
    animate();
}

// ═══════════════════════════════════════════════════════════════
// PAGE 6: 1D OVERTAKING (Two-Body Kinematics)
// ═══════════════════════════════════════════════════════════════
let overAnimId = null;
let chartOvertakeInst = null;

function initOvertaking() {
    if (overAnimId) cancelAnimationFrame(overAnimId);
    if (chartOvertakeInst) chartOvertakeInst.destroy();

    const canvas = document.getElementById('overtake-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const wrap = canvas.parentElement;
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
    }
    resize();

    const cOpts = {
        responsive: true, maintainAspectRatio: false, animation: false,
        scales: {
            x: { type: 'linear', min: 0, max: 10, title: { display: true, text: 'Time (s)', color: '#475569' }, grid: { display: true, color: '#e2e8f0' } },
            y: { title: { display: true, text: 'Position x (m)', color: '#475569' }, grid: { display: true, color: '#e2e8f0' } }
        },
        plugins: { legend: { position: 'top', align: 'end', labels: { color: '#222', font: { weight: 'bold', family: '"Cambria Math", "Segoe UI Symbol", Arial', size: 11 }, boxWidth: 12, padding: 8 } } }
    };

    chartOvertakeInst = new Chart(document.getElementById('chart-overtake'), {
        type: 'line',
        data: {
            datasets: [
                { label: 'Car A (Red)', data: [], borderColor: '#ef4444', borderWidth: 2.5, pointRadius: 0, tension: 0.1 },
                { label: 'Car B (Blue)', data: [], borderColor: '#3b82f6', borderWidth: 2.5, pointRadius: 0, tension: 0.1 }
            ]
        },
        options: cOpts
    });

    let t = 0;
    let isMoving = false;
    let isPaused = false;

    // Helper to draw a distinct colored car
    function drawColoredCar(cx, cy, scale, wheelAngle, colorMain, colorTop) {
        ctx.fillStyle = '#64748b'; ctx.fillRect(0, cy, canvas.width, 10);
        
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
        roundRect(ctx, cx - 40*scale, cy - 28*scale, 80*scale, 25*scale, 6); ctx.fill();
        ctx.fillStyle = colorTop;
        roundRect(ctx, cx - 20*scale, cy - 48*scale, 40*scale, 22*scale, 5); ctx.fill();
    }

    function animate() {
        if (!document.getElementById('page-overtaking').classList.contains('active-page')) return;
        resize();
        
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#e0f2fe'; ctx.fillRect(0, 0, W, H);

        const x0A = parseFloat(document.getElementById('o-xa').value);
        const v0A = parseFloat(document.getElementById('o-va').value);
        const aA = parseFloat(document.getElementById('o-aa').value);

        const x0B = parseFloat(document.getElementById('o-xb').value);
        const v0B = parseFloat(document.getElementById('o-vb').value);
        const aB = parseFloat(document.getElementById('o-ab').value);

        const ids = ['o-xa', 'o-va', 'o-aa', 'o-xb', 'o-vb', 'o-ab'];
        ids.forEach(id => document.getElementById(id).disabled = isMoving);

        if (isMoving && !isPaused) {
            t += 0.016;
            if (t > 15) isMoving = false; // Auto-stop after 15 seconds
        }

        const xA = x0A + v0A * t + 0.5 * aA * t * t;
        const xB = x0B + v0B * t + 0.5 * aB * t * t;

        // Camera strictly tracks the midpoint to keep both on screen
        const midX = (xA + xB) / 2;
        
        const sc = Math.min(W, H) / 250;
        const pxToMeters = 8 * sc;
        const cameraOffsetX = W/2 - midX * pxToMeters;

        const screenXA = cameraOffsetX + xA * pxToMeters;
        const screenXB = cameraOffsetX + xB * pxToMeters;

        // Draw track markers relative to camera
        ctx.fillStyle = '#0f172a'; ctx.font = `bold ${12*sc}px "Cambria Math", "Segoe UI Symbol", Arial`; ctx.textAlign = 'center';
        for (let m = -100; m <= 300; m += 10) {
            const screenM = cameraOffsetX + m * pxToMeters;
            if (screenM > -50 && screenM < W + 50) {
                ctx.fillText(m + 'm', screenM, H * 0.9);
                ctx.fillRect(screenM - 1, H * 0.9 - 25*sc, 2, 10*sc);
            }
        }

        const wheelAngleA = (xA * pxToMeters) / (10 * sc);
        const wheelAngleB = (xB * pxToMeters) / (10 * sc);

        // Draw Car B (Blue) on top track
        drawColoredCar(screenXB, H * 0.35, sc, wheelAngleB, '#3b82f6', '#1e40af');
        ctx.fillStyle = '#3b82f6'; ctx.fillText(`B: ${xB.toFixed(1)} m`, screenXB, H * 0.35 - 55*sc);

        // Draw Car A (Red) on bottom track
        drawColoredCar(screenXA, H * 0.65, sc, wheelAngleA, '#ef4444', '#991b1b');
        ctx.fillStyle = '#ef4444'; ctx.fillText(`A: ${xA.toFixed(1)} m`, screenXA, H * 0.65 - 55*sc);

        if (isMoving && !isPaused && (Math.floor(t * 60) % 3 === 0)) {
            chartOvertakeInst.data.datasets[0].data.push({ x: t, y: xA });
            chartOvertakeInst.data.datasets[1].data.push({ x: t, y: xB });
            if (t > 10) {
                chartOvertakeInst.options.scales.x.min = t - 10;
                chartOvertakeInst.options.scales.x.max = t;
            }
            chartOvertakeInst.update('none');
        }

        overAnimId = requestAnimationFrame(animate);
    }

    document.getElementById('o-start').addEventListener('click', () => {
        if (!isMoving && t > 0) {
            chartOvertakeInst.data.datasets[0].data = [];
            chartOvertakeInst.data.datasets[1].data = [];
            chartOvertakeInst.options.scales.x.min = 0;
            chartOvertakeInst.options.scales.x.max = 10;
            chartOvertakeInst.update();
        }
        t = 0; 
        isMoving = true; 
        isPaused = false;
        document.getElementById('o-pause').textContent = 'Pause';
    });

    document.getElementById('o-restart').addEventListener('click', () => {
        t = 0; 
        isMoving = false; 
        isPaused = false;
        document.getElementById('o-pause').textContent = 'Pause';
        
        // Hard reset the graph data completely
        chartOvertakeInst.data.datasets[0].data = [];
        chartOvertakeInst.data.datasets[1].data = [];
        
        chartOvertakeInst.options.scales.x.min = 0;
        chartOvertakeInst.options.scales.x.max = 10;
        chartOvertakeInst.update();
    });

    document.getElementById('o-pause').addEventListener('click', () => {
        if (!isMoving) return;
        isPaused = !isPaused;
        document.getElementById('o-pause').textContent = isPaused ? 'Resume' : 'Pause';
    });

    animate();
}

// ═══════════════════════════════════════════════════════════════
// PAGE 7: MULTI-PROJECTILE COMPARISON LAB
// ═══════════════════════════════════════════════════════════════
let mpAnimId = null;

function initMultiProj() {
    if (mpAnimId) cancelAnimationFrame(mpAnimId);

    const canvas = document.getElementById('multiproj-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        const wrap = canvas.parentElement;
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
    }
    resize();

    const g = 9.8;
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
    const names = ['P1', 'P2', 'P3', 'P4'];

    let t = 0;
    let isLaunched = false;
    let isPaused = false;
    let trails = [[], [], [], []];
    let allLanded = false;

    function getMode() {
        return document.querySelector('input[name="mp_mode"]:checked')?.value || 'same_speed';
    }

    // Get params for projectile i (0-3)
    function getParams(i) {
        const idx = i + 1;
        const enabled = document.getElementById('mp-en' + idx).checked;
        const angle = parseFloat(document.getElementById('mp-a' + idx).value);
        const mode = getMode();

        let speed;
        if (mode === 'same_speed') {
            speed = parseFloat(document.getElementById('mp-v0').value);
        } else if (mode === 'free') {
            speed = parseFloat(document.getElementById('mp-s' + idx).value);
        } else if (mode === 'same_range') {
            // Compute speed so range matches P1's range
            const refSpeed = parseFloat(document.getElementById('mp-v0').value);
            const refAngle = parseFloat(document.getElementById('mp-a1').value) * Math.PI / 180;
            const refRange = (refSpeed * refSpeed * Math.sin(2 * refAngle)) / g;
            const theta = angle * Math.PI / 180;
            const sin2t = Math.sin(2 * theta);
            speed = sin2t > 0.001 ? Math.sqrt(refRange * g / sin2t) : refSpeed;
        } else if (mode === 'same_height') {
            // H = v0^2 sin^2(theta) / (2g) => v0 = sqrt(2gH / sin^2(theta))
            const refSpeed = parseFloat(document.getElementById('mp-v0').value);
            const refAngle = parseFloat(document.getElementById('mp-a1').value) * Math.PI / 180;
            const refH = (refSpeed * refSpeed * Math.sin(refAngle) * Math.sin(refAngle)) / (2 * g);
            const theta = angle * Math.PI / 180;
            const sinT = Math.sin(theta);
            speed = sinT > 0.001 ? Math.sqrt(2 * g * refH) / sinT : refSpeed;
        } else if (mode === 'same_time') {
            // T = 2 v0 sin(theta) / g => v0 = T * g / (2 sin(theta))
            const refSpeed = parseFloat(document.getElementById('mp-v0').value);
            const refAngle = parseFloat(document.getElementById('mp-a1').value) * Math.PI / 180;
            const refT = (2 * refSpeed * Math.sin(refAngle)) / g;
            const theta = angle * Math.PI / 180;
            const sinT = Math.sin(theta);
            speed = sinT > 0.001 ? (refT * g) / (2 * sinT) : refSpeed;
        } else {
            speed = parseFloat(document.getElementById('mp-v0').value);
        }

        return { enabled, angle, speed };
    }

    // Update mode-dependent UI
    function updateModeUI() {
        const mode = getMode();
        const sharedBox = document.getElementById('mp-v0').parentElement;
        const speedSliders = document.querySelectorAll('.mp-speed-slider');
        const speedLabels = document.querySelectorAll('.mp-speed-label');

        if (mode === 'same_speed') {
            sharedBox.style.display = 'block';
            speedSliders.forEach(s => { s.disabled = true; s.style.opacity = '0.4'; });
            speedLabels.forEach(l => l.style.opacity = '0.4');
        } else if (mode === 'same_range' || mode === 'same_height' || mode === 'same_time') {
            sharedBox.style.display = 'block';
            speedSliders.forEach(s => { s.disabled = true; s.style.opacity = '0.4'; });
            speedLabels.forEach(l => l.style.opacity = '0.4');
        } else {
            sharedBox.style.display = 'none';
            speedSliders.forEach(s => { s.disabled = false; s.style.opacity = '1'; });
            speedLabels.forEach(l => l.style.opacity = '1');
        }
    }

    document.querySelectorAll('input[name="mp_mode"]').forEach(r => {
        r.addEventListener('change', () => {
            updateModeUI();
            updateTable();
        });
    });
    updateModeUI();

    // Update the readout table
    function updateTable() {
        for (let i = 0; i < 4; i++) {
            const p = getParams(i);
            const row = document.getElementById('mp-row' + (i + 1));
            const cells = row.querySelectorAll('td');

            if (!p.enabled) {
                for (let c = 1; c < cells.length; c++) cells[c].textContent = '—';
                row.style.opacity = '0.4';
                continue;
            }
            row.style.opacity = '1';

            const theta = p.angle * Math.PI / 180;
            const vx = p.speed * Math.cos(theta);
            const vy = p.speed * Math.sin(theta);
            const R = (p.speed * p.speed * Math.sin(2 * theta)) / g;
            const H = (p.speed * p.speed * Math.sin(theta) * Math.sin(theta)) / (2 * g);
            const T = (2 * p.speed * Math.sin(theta)) / g;

            cells[1].textContent = p.angle + '°';
            cells[2].textContent = p.speed.toFixed(1);
            cells[3].textContent = vx.toFixed(2);
            cells[4].textContent = vy.toFixed(2);
            cells[5].textContent = R.toFixed(2);
            cells[6].textContent = H.toFixed(2);
            cells[7].textContent = T.toFixed(2);
        }
    }
    updateTable();

    // Listen for slider changes to update table live
    ['mp-v0', 'mp-a1', 'mp-a2', 'mp-a3', 'mp-a4', 'mp-s1', 'mp-s2', 'mp-s3', 'mp-s4'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateTable);
    });
    ['mp-en1', 'mp-en2', 'mp-en3', 'mp-en4'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateTable);
    });

    function drawArrow(x0, y0, x1, y1, color, label, showVals, valText) {
        const dx = x1 - x0, dy = y1 - y0;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 2) return;
        const ux = dx / len, uy = dy / len;
        const hl = Math.min(10, len * 0.3);

        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux * hl, y1 - uy * hl); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - ux * hl - uy * hl * 0.4, y1 - uy * hl + ux * hl * 0.4);
        ctx.lineTo(x1 - ux * hl + uy * hl * 0.4, y1 - uy * hl - ux * hl * 0.4);
        ctx.closePath(); ctx.fill();

        if (showVals && label) {
            ctx.font = 'bold 12px "Cambria Math", "Segoe UI Symbol", Arial';
            drawFormattedLabel(ctx, label + (valText ? '=' + valText : ''), x1 + 8, y1 - 8, color);
        }
    }

    function animate() {
        if (!document.getElementById('page-multiproj').classList.contains('active-page')) return;
        resize();

        const W = canvas.width, H = canvas.height;
        if (W === 0 || H === 0) { mpAnimId = requestAnimationFrame(animate); return; }

        ctx.clearRect(0, 0, W, H);

        const groundY = H * 0.85;
        const originX = W * 0.08;
        const sc = Math.min(W, H) / 55;

        // Sky
        ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, W, groundY);
        
        // Clouds
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for(let i=0; i<4; i++) {
            const cx = ((i*300 + (isLaunched ? t*10 : 0)) % (W+200)) - 100;
            ctx.beginPath();
            ctx.arc(cx, 40+i*20, 25, 0, Math.PI*2);
            ctx.arc(cx+30, 30+i*20, 35, 0, Math.PI*2);
            ctx.arc(cx+60, 40+i*20, 25, 0, Math.PI*2);
            ctx.fill();
        }

        // Grass
        ctx.fillStyle = '#3d8c40'; ctx.fillRect(0, groundY, W, H - groundY);
        ctx.strokeStyle = '#2f6e31'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

        // Cannon base matches initProjectile
        ctx.save();
        ctx.translate(originX, groundY);
        ctx.fillStyle = '#64748b'; roundRect(ctx, -15, -12, 30, 12, 4); ctx.fill();
        ctx.restore();

        // Compute max time for auto-stop
        let maxT = 0;
        const projData = [];
        for (let i = 0; i < 4; i++) {
            const p = getParams(i);
            if (!p.enabled) { projData.push(null); continue; }
            const theta = p.angle * Math.PI / 180;
            const vx = p.speed * Math.cos(theta);
            const vy = p.speed * Math.sin(theta);
            const T = (2 * p.speed * Math.sin(theta)) / g;
            if (T > maxT) maxT = T;
            projData.push({ theta, vx, vy, speed: p.speed, T, angle: p.angle });
        }

        if (isLaunched && !isPaused) {
            t += 0.016;
            if (t > maxT + 0.5) {
                allLanded = true;
            }
        }

        // Draw each projectile
        for (let i = 0; i < 4; i++) {
            const pd = projData[i];
            if (!pd) continue;

            const color = colors[i];

            // Draw cannon barrel
            ctx.save();
            ctx.translate(originX, groundY);
            ctx.rotate(-pd.theta);
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = color;
            roundRect(ctx, 0, -4, 30, 8, 3); ctx.fill();
            ctx.restore();

            const currentT = isLaunched ? Math.min(t, pd.T) : 0;
            const px = pd.vx * currentT;
            const py = pd.vy * currentT - 0.5 * g * currentT * currentT;
            const screenX = originX + px * sc;
            const screenY = groundY - Math.max(0, py) * sc;

            // Add to trail
            if (t <= pd.T + 0.016) {
                trails[i].push({ x: screenX, y: screenY });
            }

            // Draw trail
            if (trails[i].length > 1) {
                ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(trails[i][0].x, trails[i][0].y);
                for (let j = 1; j < trails[i].length; j++) {
                    ctx.lineTo(trails[i][j].x, trails[i][j].y);
                }
                ctx.stroke();
            }

            // Draw ball
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(screenX, screenY, 6, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(screenX, screenY, 6, 0, Math.PI * 2); ctx.stroke();

            // Label
            ctx.fillStyle = color; ctx.font = 'bold 12px "Cambria Math", "Segoe UI Symbol", Arial'; ctx.textAlign = 'left';
            ctx.fillText(names[i] + ' (' + pd.angle + '°)', screenX + 10, screenY - 8);

            // Draw velocity arrow if still flying or not launched yet
            if (currentT < pd.T) {
                const curVx = pd.vx;
                const curVy = pd.vy - (isLaunched ? g * currentT : 0);
                const vScale = sc * 0.15;
                const vMag = Math.sqrt(curVx*curVx + curVy*curVy);
                const showVals = document.getElementById('mp-showvec').checked;
                drawArrow(screenX, screenY, screenX + curVx * vScale, screenY - curVy * vScale, color, 'v', showVals, vMag.toFixed(1));
            }

            // Draw range marker on ground when landed
            if (t >= pd.T) {
                const rangeX = originX + pd.vx * pd.T * sc;
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
                ctx.beginPath(); ctx.moveTo(rangeX, groundY); ctx.lineTo(rangeX, groundY - 20); ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = color; ctx.font = 'bold 11px "Cambria Math", "Segoe UI Symbol", Arial'; ctx.textAlign = 'center';
                const R = (pd.speed * pd.speed * Math.sin(2 * pd.theta)) / g;
                ctx.fillText(R.toFixed(1) + 'm', rangeX, groundY - 24);
            }
        }

        // Lock sliders while launched
        const sliderIds = ['mp-v0', 'mp-a1', 'mp-a2', 'mp-a3', 'mp-a4', 'mp-s1', 'mp-s2', 'mp-s3', 'mp-s4'];
        sliderIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = isLaunched || (getMode() !== 'free' && id.startsWith('mp-s'));
        });
        ['mp-en1', 'mp-en2', 'mp-en3', 'mp-en4'].forEach(id => {
            document.getElementById(id).disabled = isLaunched;
        });

        mpAnimId = requestAnimationFrame(animate);
    }

    document.getElementById('mp-start').addEventListener('click', () => {
        t = 0; isLaunched = true; isPaused = false; allLanded = false;
        trails = [[], [], [], []];
        document.getElementById('mp-pause').textContent = 'Pause';
        updateTable();
    });

    document.getElementById('mp-pause').addEventListener('click', () => {
        if (!isLaunched) return;
        isPaused = !isPaused;
        document.getElementById('mp-pause').textContent = isPaused ? 'Resume' : 'Pause';
    });

    document.getElementById('mp-reset').addEventListener('click', () => {
        t = 0; isLaunched = false; isPaused = false; allLanded = false;
        trails = [[], [], [], []];
        document.getElementById('mp-pause').textContent = 'Pause';
        updateModeUI();
        updateTable();
    });

    animate();
}

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
            ctx.font = 'bold 12px "Cambria Math", "Segoe UI Symbol", Arial';
            
        let yOff = -5;
        let xOff = 5;
        if (label === 'v_r') { yOff = 35; xOff = 10; }
        if (label === 'v_{net}' || label === 'v_{rm}') { yOff = -30; xOff = -15; }
        drawFormattedLabel(ctx, label + (valText ? '=' + valText : ''), x0 + dx/2 + xOff, y0 + dy/2 + yOff, color);

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

        ctx.fillStyle = '#3d8c40'; 
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

        ctx.fillStyle = '#222'; ctx.font = 'bold 12px "Cambria Math", "Segoe UI Symbol", Arial'; ctx.textAlign = 'right';
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
            drawArrow(0, 0, bVx, bVy, '#c62828', 'v_b', showVals, vb.toFixed(1));
            const rVx = vr * scaleV;
            drawArrow(bVx, bVy, bVx + rVx, bVy, '#1565c0', 'v_r', showVals, vr.toFixed(1));
            drawArrow(0, 0, bVx + rVx, bVy, '#2e7d32', 'v_{net}', showVals, vnet.toFixed(1));
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

    const canvas2d = document.getElementById('cc-canvas-2d');
    const canvas3d = document.getElementById('cc-canvas-3d');
    if (!canvas2d || !canvas3d) return;
    const ctx = canvas2d.getContext('2d');
    
    let renderer, scene, camera, meshB, road, lines;
    let is3DInitialized = false;

    function resize() {
        const wrap = canvas2d.parentElement;
        if (canvas2d.width !== wrap.clientWidth || canvas2d.height !== wrap.clientHeight) {
            canvas2d.width = wrap.clientWidth;
            canvas2d.height = wrap.clientHeight;
            if (is3DInitialized && renderer) {
                renderer.setSize(wrap.clientWidth, wrap.clientHeight);
                camera.aspect = wrap.clientWidth / wrap.clientHeight;
                camera.updateProjectionMatrix();
            }
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

        // A simple 3D block car with wheels
        meshB = new THREE.Group();
        
        const bodyGeo = new THREE.BoxGeometry(2, 1.0, 4.5);
        const carBMat = new THREE.MeshLambertMaterial({ color: 0x1565c0 });
        const body = new THREE.Mesh(bodyGeo, carBMat);
        body.position.y = 1.0;
        
        const topGeo = new THREE.BoxGeometry(1.6, 0.8, 2.5);
        const topMat = new THREE.MeshLambertMaterial({ color: 0x0d47a1 });
        const carTop = new THREE.Mesh(topGeo, topMat);
        carTop.position.set(0, 1.8, -0.5);
        
        meshB.add(body);
        meshB.add(carTop);

        const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
        const wheelMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const positions = [
            [-1.1, 0.5, 1.5], [1.1, 0.5, 1.5],
            [-1.1, 0.5, -1.5], [1.1, 0.5, -1.5]
        ];
        
        positions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos[0], pos[1], pos[2]);
            meshB.add(wheel);
        });

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

    function animateSideView(W, H, vA, vB, d0, showVals) {
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
                    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px "Cambria Math", "Segoe UI Symbol", Arial'; ctx.textAlign = 'center';
                    ctx.fillText('Gap: ' + Math.max(0, (xB - xA)/scaleX).toFixed(1) + ' m', (drawXA + 80 + drawXB)/2, H/2 - 5);
                }
            }
        }
        
        if (showVals) {
            ctx.fillStyle = '#fff'; ctx.font = 'bold 12px "Cambria Math", "Segoe UI Symbol", Arial'; ctx.textAlign = 'center';
            drawFormattedLabel(ctx, 'v_A='+vA, drawXA + 40, H/2 - 60, '#ef4444');
            if (drawXB < W + 100) drawFormattedLabel(ctx, 'v_B='+vB, drawXB + 40, H/2 + 50, '#3b82f6');
        }
    }

    function animatePOV(W, H, vA, vB, d0) {
        if (typeof THREE === 'undefined') return;
        if (!is3DInitialized) init3D(W, H);

        // Camera follows car A (our car)
        const posA = -vA * t;

        // Compute physics-based desired position for car B
        const desiredPosB = -(d0 + vB * t);
        const minGap = 6; // meters minimum separation to avoid visual overlap
        // Clamp so that car B never crosses into the camera's immediate space
        const clampedPosB = Math.min(desiredPosB, posA - minGap);

        camera.position.set(0, 1.2, posA);
        meshB.position.z = clampedPosB;

        // Ensure lines wrap correctly for negative Z
        lines.position.z = camera.position.z - (Math.abs(camera.position.z) % 2);

        renderer.render(scene, camera);
    }

    function animate() {
        if (!document.getElementById('page-carchase').classList.contains('active-page')) return;
        
        const viewMode = getMode();
        resize();
        const W = canvas2d.width, H = canvas2d.height;
        
        if (viewMode === 'side') {
            canvas2d.style.display = 'block';
            canvas3d.style.display = 'none';
            ctx.clearRect(0, 0, W, H);
            
            const vA = parseFloat(document.getElementById('cc-va').value);
            const vB = parseFloat(document.getElementById('cc-vb').value);
            const d0 = parseFloat(document.getElementById('cc-d0').value);
            const showVals = document.getElementById('cc-show-vals').checked;
            
            animateSideView(W, H, vA, vB, d0, showVals);
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
            if (tc !== Infinity && t >= tc) { t = tc; isMoving = false; }
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


// ═══════════════ CH 10: RAIN & UMBRELLA ═══════════════
let rmAnimId;
function initRainMan() {
    if (rmAnimId) cancelAnimationFrame(rmAnimId);

    const canvas2d = document.getElementById('rm-canvas-2d');
    const canvas3d = document.getElementById('rm-canvas-3d');
    if (!canvas2d || !canvas3d) return;
    const ctx = canvas2d.getContext('2d');

    let renderer, scene, camera, rainParticles, rainGeo, umbrellaGroup;
    let is3DInitialized = false;

    function resize() {
        const wrap = canvas2d.parentElement;
        if (canvas2d.width !== wrap.clientWidth || canvas2d.height !== wrap.clientHeight) {
            canvas2d.width = wrap.clientWidth;
            canvas2d.height = wrap.clientHeight;
            if (is3DInitialized && renderer) {
                renderer.setSize(wrap.clientWidth, wrap.clientHeight);
                camera.aspect = wrap.clientWidth / wrap.clientHeight;
                camera.updateProjectionMatrix();
            }
        }
    }
    resize();

    let t = 0;
    let isMoving = false;
    let isPaused = false;

    function getMode() {
        const viewEl = document.querySelector('input[name="rm_view"]:checked');
        return viewEl ? viewEl.value : 'side';
    }

    function init3D(W, H) {
        if (is3DInitialized) return;
        if (typeof THREE === 'undefined') return;
        
        renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true });
        renderer.setSize(W, H);
        renderer.setClearColor(0xa0a0a0); // Lighter sky for better contrast

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xa0a0a0, 20, 400);

        camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 1000);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(50, 150, 100);
        dirLight.castShadow = true;
        scene.add(dirLight);

        // Ground - more visible with better contrast
        const groundGeo = new THREE.PlaneGeometry(1000, 1000);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x555555 }); // Darker asphalt
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        scene.add(ground);
        
        // Add ground grid for better depth perception
        const gridGeo = new THREE.BufferGeometry();
        const gridPositions = [];
        for (let i = -500; i <= 500; i += 50) {
            gridPositions.push(i, 0.01, -500, i, 0.01, 500);
            gridPositions.push(-500, 0.01, i, 500, 0.01, i);
        }
        gridGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridPositions), 3));
        const gridMat = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.4 });
        const gridLines = new THREE.LineSegments(gridGeo, gridMat);
        scene.add(gridLines);
        
        // Rain drops represented as short line segments for clarity
        const rainCount = 1200;
        rainGeo = new THREE.BufferGeometry();
        // Each drop is a segment (start + end) => 6 floats per drop
        const rainPos = new Float32Array(rainCount * 6);
        const rainVel = new Float32Array(rainCount * 3);

        for (let i = 0; i < rainCount; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = 80 + Math.random() * 200;
            const z = (Math.random() - 0.5) * 200;
            // start point
            rainPos[i * 6] = x;
            rainPos[i * 6 + 1] = y;
            rainPos[i * 6 + 2] = z;
            // end point (short streak)
            rainPos[i * 6 + 3] = x + 0.6; // small x offset for visibility
            rainPos[i * 6 + 4] = y - 6;   // falling length
            rainPos[i * 6 + 5] = z + 1;   // slight forward

            rainVel[i * 3] = 0;
            rainVel[i * 3 + 1] = -18; // faster fall to make streaks
            rainVel[i * 3 + 2] = 0;
        }

        rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
        rainGeo.setAttribute('velocity', new THREE.BufferAttribute(rainVel, 3));

        const rainMat = new THREE.LineBasicMaterial({ color: 0x78d6ff, transparent: true, opacity: 0.95 });

        rainParticles = new THREE.LineSegments(rainGeo, rainMat);
        scene.add(rainParticles);

        // Umbrella mesh - larger and more visible
        umbrellaGroup = new THREE.Group();
        const canopyGeo = new THREE.ConeGeometry(5, 2, 16);
        const canopyMat = new THREE.MeshLambertMaterial({ color: 0xff6b6b, side: THREE.DoubleSide });
        const canopy = new THREE.Mesh(canopyGeo, canopyMat);
        canopy.position.y = 1.5;
        
        const handleGeo = new THREE.CylinderGeometry(0.15, 0.15, 4);
        const handleMat = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = -0.5;
        
        umbrellaGroup.add(canopy);
        umbrellaGroup.add(handle);
        
        // Position slightly above ground
        umbrellaGroup.position.set(0, 2.5, 0);
        scene.add(umbrellaGroup);
        
        // Add visible head/body of person
        const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
        const headMat = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, 2.2, 0);
        scene.add(head);
        
        const bodyGeo = new THREE.BoxGeometry(0.6, 1.2, 0.4);
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2196f3 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.set(0, 1.2, 0);
        scene.add(body);

        is3DInitialized = true;
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
            ctx.font = 'bold 12px "Cambria Math", "Segoe UI Symbol", Arial';
            drawFormattedLabel(ctx, label + (valText ? '=' + valText : ''), x1 + 8, y1 - 8, color);
        }
    }

    function animateSideView(W, H, vm, vr, windAngDeg, showVals) {
        const windAng = windAngDeg * Math.PI / 180;
        
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

        ctx.fillStyle = '#3d8c40'; ctx.fillRect(0, H*0.8, W, H*0.2);
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

        const manSc = H * 0.15;
        const px = W/2;
        const py = H*0.8;
        
        const bob = isMoving ? Math.abs(Math.sin(t * vm * 0.5)) * 10 : 0;
        
        ctx.save();
        ctx.translate(px, py - bob);
        
        if(vm > 0 || vr > 0) {
            const sV = 10;
            drawArrow(0, -manSc/2, vmx*sV, -manSc/2, '#c62828', 'v_m', showVals, vm.toFixed(1));
            drawArrow(vmx*sV, -manSc/2, vmx*sV + vrx*sV, -manSc/2 + vry*sV, '#1565c0', 'v_r', showVals, vr.toFixed(1));
            drawArrow(0, -manSc/2, vrmx*sV, -manSc/2 + vrmy*sV, '#9c27b0', 'v_{rm}', showVals, vrm.toFixed(1));
        }

        ctx.strokeStyle = '#222'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, -manSc * 0.6); ctx.lineTo(0, -manSc);
        if (isMoving) {
            const legSwing = Math.sin(t * vm * 0.5) * 20;
            ctx.moveTo(0, -manSc*0.6); ctx.lineTo(-10 - legSwing, 0);
            ctx.moveTo(0, -manSc*0.6); ctx.lineTo(-10 + legSwing, 0);
        } else {
            ctx.moveTo(0, -manSc*0.6); ctx.lineTo(-10, 0);
            ctx.moveTo(0, -manSc*0.6); ctx.lineTo(10, 0);
        }
        ctx.stroke();
        
        ctx.fillStyle = '#ffb74d';
        ctx.beginPath(); ctx.arc(0, -manSc - 10, 12, 0, Math.PI*2); ctx.fill();

        ctx.beginPath(); ctx.moveTo(0, -manSc*0.8); ctx.lineTo(15, -manSc - 20); ctx.stroke();

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

        // Draw theta
        ctx.save();
        ctx.translate(px, py - bob - manSc - 20 + 15);
        ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([4,4]);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, -60); ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.beginPath();
        ctx.arc(0, 0, 40, -Math.PI/2, -Math.PI/2 + umbrellaAng * Math.PI/180, umbrellaAng < 0);
        ctx.strokeStyle = '#eab308'; ctx.stroke(); // yellow
        
        ctx.fillStyle = '#eab308'; ctx.font = 'bold 12px "Cambria Math", "Segoe UI Symbol", Arial'; // yellow
        ctx.fillText('θ = ' + Math.abs(umbrellaAng).toFixed(1) + '°', umbrellaAng < 0 ? -45 : 10, -45);
        ctx.restore();
    }

    function animatePOV(W, H, vm, vr, windAngDeg, showVals) {
        if (typeof THREE === 'undefined') return;
        if (!is3DInitialized) init3D(W, H);

        const windAng = windAngDeg * Math.PI / 180;
        
        // In 3D, the man is moving along negative Z axis.
        // So v_man = vm in the -Z direction.
        const vrmx = vr * Math.sin(windAng);
        const vrmy = -vr * Math.cos(windAng); // falling down
        // Relative to man moving along -Z:
        // v_rm,z = v_rz - v_mz = 0 - (-vm) = vm
        // Wait, if man moves -Z, rain appears to hit from front (-Z).
        // Actually, if man velocity is (0, 0, -vm)
        // v_rain = (vrx, vry, 0)
        // v_rel = v_rain - v_man = (vrx, vry, vm)
        // So rain moves towards positive Z relative to man! Yes.

        const vrmz = vm;

        const vrm = Math.sqrt(vrmx * vrmx + vrmy * vrmy + vrmz * vrmz);
        // Tilt angle: forward/backward tilt
        // umbrella should point towards the incoming rain.
        // rain comes from (vrmx, -vrmy, vrmz). 
        // We will tilt umbrella to block it.
        const umbrellaPitch = Math.atan2(vrmz, -vrmy); // forward tilt (pitch)
        const umbrellaRoll = Math.atan2(-vrmx, -vrmy); // side tilt (roll)

        document.getElementById('rm-out-vrm').textContent = vrm.toFixed(2);
        // Calculate total tilt angle from vertical
        const totalTilt = Math.acos(-vrmy / vrm) * 180 / Math.PI;
        document.getElementById('rm-out-uang').textContent = totalTilt.toFixed(1);

        if (isMoving && !isPaused) t += 0.05;

        // Man position
        const bob = isMoving ? Math.sin(t * vm * 0.5) * 0.15 : 0;
        const manY = 2.5 + bob;
        const manZ = -t * vm * 2; // move forward in Z
        
        // Camera in 3rd person perspective tracking the man
        camera.position.set(8, manY + 4, manZ + 12);
        camera.lookAt(0, manY, manZ);
        
        // Umbrella and body follows position
        umbrellaGroup.position.set(0, manY + 1.5, manZ);
        const brolly = umbrellaGroup.getObjectByName("brolly");
        if (brolly) brolly.rotation.set(umbrellaPitch, 0, umbrellaRoll);

        // Update rain segments
        const segPos = rainGeo.attributes.position.array;
        const drops = segPos.length / 6;
        for (let i = 0; i < drops; i++) {
            const s = i * 6;
            
            // Move drops by world velocity
            segPos[s] += vrmx * 0.05;
            segPos[s + 1] += vrmy * 0.05;
            // No movement in Z for the rain, the man is moving!
            
            segPos[s + 3] += vrmx * 0.05;
            segPos[s + 4] += vrmy * 0.05;

            // Reset drops that fall below ground or go too far behind/ahead of man
            if (segPos[s + 1] < -2 || segPos[s + 2] > manZ + 40 || segPos[s + 2] < manZ - 100) {
                const nx = (Math.random() - 0.5) * 160;
                const ny = 60 + Math.random() * 100;
                const nz = manZ - 20 - Math.random() * 80;
                segPos[s] = nx; segPos[s + 1] = ny; segPos[s + 2] = nz;
                segPos[s + 3] = nx + vrmx * 0.1; segPos[s + 4] = ny + vrmy * 0.1; segPos[s + 5] = nz;
            }
        }
        rainGeo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    function animate() {
        if (!document.getElementById('page-rainman').classList.contains('active-page')) return;
        
        const viewMode = getMode();
        resize();
        const W = canvas2d.width, H = canvas2d.height;
        
        const vm = parseFloat(document.getElementById('rm-vm').value);
        const vr = parseFloat(document.getElementById('rm-vr').value);
        const wind = parseFloat(document.getElementById('rm-wind').value);
        const showVals = document.getElementById('rm-show-vals').checked;

        if (viewMode === 'side') {
            canvas2d.style.display = 'block';
            canvas3d.style.display = 'none';
            ctx.clearRect(0, 0, W, H);
            animateSideView(W, H, vm, vr, wind, showVals);
        } else {
            canvas2d.style.display = 'none';
            canvas3d.style.display = 'block';
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
