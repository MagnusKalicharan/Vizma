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

    function getMode() {
        const viewEl = document.querySelector('input[name="rm_view"]:checked');
        return viewEl ? viewEl.value : 'side';
    }

    function init3D(W, H) {
        if (is3DInitialized) return;
        if (typeof THREE === 'undefined') return;
        
        renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true });
        renderer.setSize(W, H);
        renderer.setClearColor(0x9e9e9e); // Gloomy grey sky

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x9e9e9e, 10, 300);

        camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 1000);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 100, 50);
        scene.add(dirLight);

        // Ground
        const groundGeo = new THREE.PlaneGeometry(1000, 1000);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x424242 }); // Wet asphalt
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        scene.add(ground);
        
        // Rain particles
        const rainCount = 1500;
        rainGeo = new THREE.BufferGeometry();
        const rainPos = new Float32Array(rainCount * 3);
        const rainVel = new Float32Array(rainCount * 3);
        
        for(let i=0; i<rainCount; i++) {
            rainPos[i*3] = (Math.random() - 0.5) * 400;     // x
            rainPos[i*3+1] = Math.random() * 200;           // y
            rainPos[i*3+2] = (Math.random() - 0.5) * 400;   // z
            
            // We will update velocity dynamically in animatePOV
            rainVel[i*3] = 0;
            rainVel[i*3+1] = -5;
            rainVel[i*3+2] = 0;
        }
        
        rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
        rainGeo.setAttribute('velocity', new THREE.BufferAttribute(rainVel, 3));
        
        const rainMat = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        rainParticles = new THREE.Points(rainGeo, rainMat);
        scene.add(rainParticles);

        // Umbrella mesh
        umbrellaGroup = new THREE.Group();
        const canopyGeo = new THREE.ConeGeometry(3, 1.5, 16);
        const canopyMat = new THREE.MeshLambertMaterial({ color: 0x4a148c, side: THREE.DoubleSide });
        const canopy = new THREE.Mesh(canopyGeo, canopyMat);
        canopy.position.y = 1;
        
        const handleGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
        const handleMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = -0.5;
        
        // Man body
        const bodyGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.8);
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0xffa500 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = -1.5;
        
        const headGeo = new THREE.SphereGeometry(0.4);
        const headMat = new THREE.MeshLambertMaterial({ color: 0xffccaa });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = -0.2;
        
        umbrellaGroup.add(canopy);
        umbrellaGroup.add(handle);
        umbrellaGroup.add(body);
        umbrellaGroup.add(head);
        
        // Position slightly above ground
        umbrellaGroup.position.set(0, 2.5, 0);
        scene.add(umbrellaGroup);

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
            ctx.font = 'bold 12px Arial';
            ctx.fillText(label + (valText ? ' (' + valText + ')' : ''), x1 + 5, y1);
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

        ctx.fillStyle = '#f5f5f5'; ctx.fillRect(0, H*0.8, W, H*0.2);
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
            drawArrow(0, -manSc/2, vmx*sV, -manSc/2, '#c62828', 'vm', showVals, vm.toFixed(1));
            drawArrow(vmx*sV, -manSc/2, vmx*sV + vrx*sV, -manSc/2 + vry*sV, '#1565c0', 'vr', showVals, vr.toFixed(1));
            drawArrow(0, -manSc/2, vrmx*sV, -manSc/2 + vrmy*sV, '#2e7d32', 'vrm', showVals, vrm.toFixed(1));
        }

        ctx.strokeStyle = '#222'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, -manSc * 0.6);
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

        // Man position (origin)
        const bob = isMoving ? Math.sin(t * vm * 0.5) * 0.1 : 0;
        const manY = 2.5 + bob;
        
        // Camera in 3rd person perspective
        camera.position.set(6, manY + 3, 10);
        camera.lookAt(0, manY, 0);
        
        // Ground texture moves past to simulate walking
        const ground = scene.children.find(c => c.geometry.type === 'PlaneGeometry');
        if (ground && ground.material.map) {
             // If we had a map, we'd move it. But we just have a solid color.
        }

        // Umbrella and Man follow position
        umbrellaGroup.position.set(0, manY, 0);
        // Tilt ONLY the umbrella/handle, so we apply rotation to the group, but wait, the body will tilt too!
        // To fix this, we should rotate the group but maybe it's fine if the man leans into the wind? 
        // Or better, let's keep it simple: the whole group tilts.
        umbrellaGroup.rotation.set(umbrellaPitch, 0, umbrellaRoll);

        // Update rain particles
        const pos = rainGeo.attributes.position.array;
        for(let i=0; i<1500; i++) {
            // Move rain relative to camera
            pos[i*3] += vrmx * 0.1;       // x
            pos[i*3+1] += vrmy * 0.1;     // y (falling)
            pos[i*3+2] += vrmz * 0.1;     // z (moving toward camera)

            // Reset drops that fall below ground or go too far
            if (pos[i*3+1] < 0 || pos[i*3+2] > 50) {
                pos[i*3] = (Math.random() - 0.5) * 100;
                pos[i*3+1] = 50 + Math.random() * 50;
                pos[i*3+2] = -100 - Math.random() * 100;
            }
        }
        rainGeo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    function animate() {
        if (!document.getElementById('page-rainman').classList.contains('active-page')) return;
        
        const viewMode = getMode();
        const W = canvas2d.width, H = canvas2d.height;
        
        const vm = parseFloat(document.getElementById('rm-vm').value);
        const vr = parseFloat(document.getElementById('rm-vr').value);
        const wind = parseFloat(document.getElementById('rm-wind').value);
        const showVals = document.getElementById('rm-show-vals').checked;

        if (viewMode === 'side') {
            canvas2d.style.display = 'block';
            canvas3d.style.display = 'none';
            resize();
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
