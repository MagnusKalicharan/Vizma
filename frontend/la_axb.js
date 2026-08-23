/* la_axb.js - Advanced Interactivity & Animations */
window.laAxbInitialized = false;

window.initLAAxb = function () {
    if (window.laAxbInitialized) {
        if (window.laAxbUpdate) window.laAxbUpdate(true);
        return;
    }
    window.laAxbInitialized = true;

    // --- State ---
    let animTime = 1.0;
    let isAnimating = false;
    let hoverState = null; // 'row1', 'col1', 'b', etc.
    let dragActive = false;

    // --- Scenes ---
    let rRenderer, rScene, rCamera, rControls;
    let cRenderer, cScene, cCamera, cControls;
    let rGroup, cGroup, rDragGroup, cDragGroup;
    let rRaycaster = new THREE.Raycaster();
    let cRaycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    const rCanvasWrap = document.getElementById('la-axb-row-canvas');
    const cCanvasWrap = document.getElementById('la-axb-col-canvas');
    if (!rCanvasWrap || !cCanvasWrap) return;

    // Drag planes restricted to camera plane
    let dragPlane = new THREE.Plane();
    let dragOffset = new THREE.Vector3();
    let dragObject = null;

    function init3D() {
        if (rRenderer) return;

        // --- Row Scene ---
        rRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rRenderer.setSize(rCanvasWrap.clientWidth, rCanvasWrap.clientHeight);
        rCanvasWrap.appendChild(rRenderer.domElement);
        rScene = new THREE.Scene();
        rScene.background = new THREE.Color(0xffffff);
        rCamera = new THREE.PerspectiveCamera(45, rCanvasWrap.clientWidth / rCanvasWrap.clientHeight, 0.1, 100);
        rCamera.position.set(12, 10, 15);
        rControls = new THREE.OrbitControls(rCamera, rRenderer.domElement);
        rControls.enableDamping = true;
        rScene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const rDir = new THREE.DirectionalLight(0xffffff, 0.6); rDir.position.set(5, 10, 7); rScene.add(rDir);
        rScene.add(new THREE.AxesHelper(5));
        rScene.add(new THREE.GridHelper(10, 10, 0x94a3b8, 0xe2e8f0));
        rGroup = new THREE.Group(); rScene.add(rGroup);
        rDragGroup = new THREE.Group(); rScene.add(rDragGroup);

        // --- Col Scene ---
        cRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        cRenderer.setSize(cCanvasWrap.clientWidth, cCanvasWrap.clientHeight);
        cCanvasWrap.appendChild(cRenderer.domElement);
        cScene = new THREE.Scene();
        cScene.background = new THREE.Color(0xffffff);
        cCamera = new THREE.PerspectiveCamera(45, cCanvasWrap.clientWidth / cCanvasWrap.clientHeight, 0.1, 100);
        cCamera.position.set(12, 10, 15);
        cControls = new THREE.OrbitControls(cCamera, cRenderer.domElement);
        cControls.enableDamping = true;
        cScene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const cDir = new THREE.DirectionalLight(0xffffff, 0.6); cDir.position.set(5, 10, 7); cScene.add(cDir);
        cScene.add(new THREE.AxesHelper(5));
        cScene.add(new THREE.GridHelper(10, 10, 0x94a3b8, 0xe2e8f0));
        cGroup = new THREE.Group(); cScene.add(cGroup);
        cDragGroup = new THREE.Group(); cScene.add(cDragGroup);

        // Sync Cameras
        rControls.addEventListener('change', () => {
            if (document.getElementById('la-axb-sync-cam').checked && !dragActive) {
                cCamera.position.copy(rCamera.position);
                cCamera.quaternion.copy(rCamera.quaternion);
                cCamera.updateProjectionMatrix();
            }
        });
        cControls.addEventListener('change', () => {
            if (document.getElementById('la-axb-sync-cam').checked && !dragActive) {
                rCamera.position.copy(cCamera.position);
                rCamera.quaternion.copy(cCamera.quaternion);
                rCamera.updateProjectionMatrix();
            }
        });

        // Setup Dragging
        setupDragging(rRenderer.domElement, rCamera, rControls, rDragGroup, 'row');
        setupDragging(cRenderer.domElement, cCamera, cControls, cDragGroup, 'col');

        animate();
    }

    // --- Math Solvers ---
    function solveLeastSquares(A, b) {
        // Solves A^T A x = A^T b using simple pseudo-inverse or Cramer's if non-singular
        const detA = A[0]*(A[4]*A[8] - A[5]*A[7]) - A[1]*(A[3]*A[8] - A[5]*A[6]) + A[2]*(A[3]*A[7] - A[4]*A[6]);
        if (Math.abs(detA) > 0.0001) {
            // Unique solution
            const x1 = (b[0]*(A[4]*A[8] - A[5]*A[7]) - A[1]*(b[1]*A[8] - A[5]*b[2]) + A[2]*(b[1]*A[7] - A[4]*b[2])) / detA;
            const x2 = (A[0]*(b[1]*A[8] - A[5]*b[2]) - b[0]*(A[3]*A[8] - A[5]*A[6]) + A[2]*(A[3]*b[2] - b[1]*A[6])) / detA;
            const x3 = (A[0]*(A[4]*b[2] - b[1]*A[7]) - A[1]*(A[3]*b[2] - b[1]*A[6]) + b[0]*(A[3]*A[7] - A[4]*A[6])) / detA;
            return { x: [x1, x2, x3], unique: true };
        }
        
        // Singular - Use gradient descent for a quick least squares fit (since it's interactive and just 3x3)
        let x = [0,0,0];
        const lr = 0.01;
        for(let i=0; i<1000; i++) {
            let p0 = A[0]*x[0] + A[1]*x[1] + A[2]*x[2];
            let p1 = A[3]*x[0] + A[4]*x[1] + A[5]*x[2];
            let p2 = A[6]*x[0] + A[7]*x[1] + A[8]*x[2];
            let e0 = p0 - b[0];
            let e1 = p1 - b[1];
            let e2 = p2 - b[2];
            x[0] -= lr * (A[0]*e0 + A[3]*e1 + A[6]*e2);
            x[1] -= lr * (A[1]*e0 + A[4]*e1 + A[7]*e2);
            x[2] -= lr * (A[2]*e0 + A[5]*e1 + A[8]*e2);
        }
        return { x: x, unique: false };
    }

    // --- Helpers ---
    function getInputs() {
        const A = [];
        for (let i=1; i<=3; i++) {
            for (let j=1; j<=3; j++) {
                A.push(parseFloat(document.getElementById('la-axb-a'+i+j).value) || 0);
            }
        }
        const b = [];
        for (let i=1; i<=3; i++) {
            b.push(parseFloat(document.getElementById('la-axb-b'+i).value) || 0);
        }
        return { A, b };
    }

    function createPlane(normal, dist, color, opacity) {
        if (normal.length() < 0.001) return new THREE.Group();
        const planeGeom = new THREE.PlaneGeometry(10, 10);
        const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: opacity, side: THREE.DoubleSide, depthWrite: false });
        const mesh = new THREE.Mesh(planeGeom, mat);
        let n = normal.clone().normalize();
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), n);
        mesh.position.copy(n).multiplyScalar(dist / normal.length());
        
        const edges = new THREE.EdgesGeometry(planeGeom);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color, linewidth: 2, transparent:true, opacity: Math.min(1, opacity+0.3) }));
        mesh.add(line);
        return mesh;
    }

    function createDragHandle(pos, color, id) {
        const geom = new THREE.SphereGeometry(0.3, 16, 16);
        const mat = new THREE.MeshBasicMaterial({ color: color, transparent:true, opacity: 0.6 });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.copy(pos);
        mesh.userData = { id: id };
        return mesh;
    }

    window.laAxbUpdate = function update(forceResetAnim = false) {
        if (!rRenderer) init3D();
        if (forceResetAnim) animTime = 1.0;

        const { A, b } = getInputs();
        
        const r1 = new THREE.Vector3(A[0], A[1], A[2]);
        const r2 = new THREE.Vector3(A[3], A[4], A[5]);
        const r3 = new THREE.Vector3(A[6], A[7], A[8]);

        const c1 = new THREE.Vector3(A[0], A[3], A[6]);
        const c2 = new THREE.Vector3(A[1], A[4], A[7]);
        const c3 = new THREE.Vector3(A[2], A[5], A[8]);
        const bVec = new THREE.Vector3(b[0], b[1], b[2]);

        const detA = A[0]*(A[4]*A[8] - A[5]*A[7]) - A[1]*(A[3]*A[8] - A[5]*A[6]) + A[2]*(A[3]*A[7] - A[4]*A[6]);
        document.getElementById('la-axb-det-readout').innerText = detA.toFixed(2);
        if (Math.abs(detA) < 0.05) {
            document.getElementById('la-axb-det-readout').style.color = '#ef4444';
        } else {
            document.getElementById('la-axb-det-readout').style.color = '#334155';
        }

        const solData = solveLeastSquares(A, b);
        const x = solData.x;
        
        // Calculate Residual
        const p = new THREE.Vector3(
            A[0]*x[0] + A[1]*x[1] + A[2]*x[2],
            A[3]*x[0] + A[4]*x[1] + A[5]*x[2],
            A[6]*x[0] + A[7]*x[1] + A[8]*x[2]
        );
        const res = bVec.clone().sub(p).length();
        document.getElementById('la-axb-res-readout').innerText = res.toFixed(3);
        
        let solText = `x = [${x[0].toFixed(2)}, ${x[1].toFixed(2)}, ${x[2].toFixed(2)}]`;
        if (!solData.unique) {
            solText = (res > 0.1) ? `No Sol. Least Squares: [${x[0].toFixed(2)}, ${x[1].toFixed(2)}, ${x[2].toFixed(2)}]` 
                                  : `Inf Sol. One Sol: [${x[0].toFixed(2)}, ${x[1].toFixed(2)}, ${x[2].toFixed(2)}]`;
        }
        document.getElementById('la-axb-solution').innerText = solText;

        // --- ROW SCENE ---
        while(rGroup.children.length > 0) rGroup.remove(rGroup.children[0]);
        while(rDragGroup.children.length > 0) rDragGroup.remove(rDragGroup.children[0]);

        // Draw Planes based on animTime
        let op1 = (hoverState === 'row1') ? 0.8 : (animTime > 0.1 ? 0.4 : 0.1);
        let op2 = (hoverState === 'row2') ? 0.8 : (animTime > 0.4 ? 0.4 : 0.1);
        let op3 = (hoverState === 'row3') ? 0.8 : (animTime > 0.7 ? 0.4 : 0.1);

        if (hoverState && hoverState.startsWith('col')) { op1=0.1; op2=0.1; op3=0.1; }

        rGroup.add(createPlane(r1, b[0], 0xef4444, op1));
        rGroup.add(createPlane(r2, b[1], 0x22c55e, op2));
        rGroup.add(createPlane(r3, b[2], 0x3b82f6, op3));

        // Row Drag Handles (normals)
        rDragGroup.add(createDragHandle(r1, 0xef4444, 'row1'));
        rDragGroup.add(createDragHandle(r2, 0x22c55e, 'row2'));
        rDragGroup.add(createDragHandle(r3, 0x3b82f6, 'row3'));
        rDragGroup.children.forEach(c => rGroup.add(new THREE.ArrowHelper(c.position.clone().normalize(), new THREE.Vector3(), c.position.length(), c.material.color, 0.2, 0.1)));

        // Solution point
        if (animTime > 0.9) {
            const ptMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xfacc15}));
            ptMesh.position.copy(p); // use projected point
            rGroup.add(ptMesh);
        }

        // --- COLUMN SCENE ---
        while(cGroup.children.length > 0) cGroup.remove(cGroup.children[0]);
        while(cDragGroup.children.length > 0) cDragGroup.remove(cDragGroup.children[0]);

        cDragGroup.add(createDragHandle(c1, 0xef4444, 'col1'));
        cDragGroup.add(createDragHandle(c2, 0x22c55e, 'col2'));
        cDragGroup.add(createDragHandle(c3, 0x3b82f6, 'col3'));
        cDragGroup.add(createDragHandle(bVec, 0x000000, 'b'));

        // Draw basic column vectors (faded)
        cGroup.add(new THREE.ArrowHelper(c1.clone().normalize(), new THREE.Vector3(), c1.length(), 0xef4444, 0.2, 0.15));
        cGroup.add(new THREE.ArrowHelper(c2.clone().normalize(), new THREE.Vector3(), c2.length(), 0x22c55e, 0.2, 0.15));
        cGroup.add(new THREE.ArrowHelper(c3.clone().normalize(), new THREE.Vector3(), c3.length(), 0x3b82f6, 0.2, 0.15));
        
        let curr = new THREE.Vector3();
        // Anim 1: x1*c1
        if (animTime > 0.1) {
            let prog = Math.min(1, (animTime - 0.1) / 0.2);
            let v1 = c1.clone().multiplyScalar(x[0] * prog);
            let color = hoverState === 'col1' ? 0xff0000 : 0xef4444;
            if(v1.length() > 0.01) cGroup.add(new THREE.ArrowHelper(v1.clone().normalize(), curr, v1.length(), color, 0.3, 0.2));
            if(prog === 1) curr.add(v1);
        }
        // Anim 2: x2*c2
        if (animTime > 0.4) {
            let prog = Math.min(1, (animTime - 0.4) / 0.2);
            let v2 = c2.clone().multiplyScalar(x[1] * prog);
            let color = hoverState === 'col2' ? 0x00ff00 : 0x22c55e;
            if(v2.length() > 0.01) cGroup.add(new THREE.ArrowHelper(v2.clone().normalize(), curr, v2.length(), color, 0.3, 0.2));
            if(prog === 1) curr.add(v2);
        }
        // Anim 3: x3*c3
        if (animTime > 0.7) {
            let prog = Math.min(1, (animTime - 0.7) / 0.2);
            let v3 = c3.clone().multiplyScalar(x[2] * prog);
            let color = hoverState === 'col3' ? 0x0000ff : 0x3b82f6;
            if(v3.length() > 0.01) cGroup.add(new THREE.ArrowHelper(v3.clone().normalize(), curr, v3.length(), color, 0.3, 0.2));
            if(prog === 1) curr.add(v3);
        }

        // Draw b
        cGroup.add(new THREE.ArrowHelper(bVec.clone().normalize(), new THREE.Vector3(), bVec.length(), hoverState==='b'?0x000000:0x555555, 0.3, 0.25));

        // Residual line
        if (res > 0.1 && animTime > 0.9) {
            const geom = new THREE.BufferGeometry().setFromPoints([p, bVec]);
            const mat = new THREE.LineDashedMaterial({ color: 0xef4444, dashSize: 0.2, gapSize: 0.2 });
            const line = new THREE.Line(geom, mat);
            line.computeLineDistances();
            cGroup.add(line);
        }
    };

    // --- Dragging Logic ---
    function setupDragging(domElement, camera, orbit, dragGroup, type) {
        domElement.addEventListener('pointerdown', (e) => {
            const rect = domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            let ray = type === 'row' ? rRaycaster : cRaycaster;
            ray.setFromCamera(mouse, camera);
            const intersects = ray.intersectObjects(dragGroup.children);
            if (intersects.length > 0) {
                dragObject = intersects[0].object;
                dragActive = true;
                orbit.enabled = false;
                dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(dragPlane.normal), dragObject.position);
                if (ray.ray.intersectPlane(dragPlane, dragOffset)) {
                    dragOffset.sub(dragObject.position);
                }
            }
        });

        domElement.addEventListener('pointermove', (e) => {
            if (!dragActive || !dragObject) return;
            const rect = domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            let ray = type === 'row' ? rRaycaster : cRaycaster;
            ray.setFromCamera(mouse, camera);
            let pt = new THREE.Vector3();
            if (ray.ray.intersectPlane(dragPlane, pt)) {
                dragObject.position.copy(pt.sub(dragOffset));
                updateInputsFromDrag(dragObject.userData.id, dragObject.position);
                window.laAxbUpdate(false); // don't reset anim
            }
        });

        domElement.addEventListener('pointerup', () => {
            dragActive = false;
            dragObject = null;
            orbit.enabled = true;
        });
    }

    function updateInputsFromDrag(id, pos) {
        if (id === 'row1') { document.getElementById('la-axb-a11').value = pos.x.toFixed(1); document.getElementById('la-axb-a12').value = pos.y.toFixed(1); document.getElementById('la-axb-a13').value = pos.z.toFixed(1); }
        if (id === 'row2') { document.getElementById('la-axb-a21').value = pos.x.toFixed(1); document.getElementById('la-axb-a22').value = pos.y.toFixed(1); document.getElementById('la-axb-a23').value = pos.z.toFixed(1); }
        if (id === 'row3') { document.getElementById('la-axb-a31').value = pos.x.toFixed(1); document.getElementById('la-axb-a32').value = pos.y.toFixed(1); document.getElementById('la-axb-a33').value = pos.z.toFixed(1); }
        
        if (id === 'col1') { document.getElementById('la-axb-a11').value = pos.x.toFixed(1); document.getElementById('la-axb-a21').value = pos.y.toFixed(1); document.getElementById('la-axb-a31').value = pos.z.toFixed(1); }
        if (id === 'col2') { document.getElementById('la-axb-a12').value = pos.x.toFixed(1); document.getElementById('la-axb-a22').value = pos.y.toFixed(1); document.getElementById('la-axb-a32').value = pos.z.toFixed(1); }
        if (id === 'col3') { document.getElementById('la-axb-a13').value = pos.x.toFixed(1); document.getElementById('la-axb-a23').value = pos.y.toFixed(1); document.getElementById('la-axb-a33').value = pos.z.toFixed(1); }
        
        if (id === 'b') { document.getElementById('la-axb-b1').value = pos.x.toFixed(1); document.getElementById('la-axb-b2').value = pos.y.toFixed(1); document.getElementById('la-axb-b3').value = pos.z.toFixed(1); }
    }

    // --- Interaction Bindings ---
    for (let i=1; i<=3; i++) {
        for (let j=1; j<=3; j++) {
            let el = document.getElementById('la-axb-a'+i+j);
            el.addEventListener('input', () => window.laAxbUpdate(false));
            el.addEventListener('mouseenter', () => { hoverState = 'col'+j; window.laAxbUpdate(false); }); // Could do row or col, let's just highlight col to show relation
            el.addEventListener('mouseleave', () => { hoverState = null; window.laAxbUpdate(false); });
        }
        let bEl = document.getElementById('la-axb-b'+i);
        bEl.addEventListener('input', () => window.laAxbUpdate(false));
        bEl.addEventListener('mouseenter', () => { hoverState = 'b'; window.laAxbUpdate(false); });
        bEl.addEventListener('mouseleave', () => { hoverState = null; window.laAxbUpdate(false); });
    }

    document.getElementById('la-axb-btn-play').addEventListener('click', () => {
        animTime = 0.0;
        isAnimating = true;
    });
    
    document.getElementById('la-axb-btn-reset').addEventListener('click', () => {
        animTime = 1.0;
        isAnimating = false;
        rControls.reset();
        cControls.reset();
        window.laAxbUpdate(true);
    });

    function setVals(A, b) {
        for(let i=0; i<3; i++) {
            document.getElementById(`la-axb-a${i+1}1`).value = A[i*3+0];
            document.getElementById(`la-axb-a${i+1}2`).value = A[i*3+1];
            document.getElementById(`la-axb-a${i+1}3`).value = A[i*3+2];
            document.getElementById(`la-axb-b${i+1}`).value = b[i];
        }
        window.laAxbUpdate(true);
    }

    document.getElementById('la-axb-preset-unique').addEventListener('click', () => {
        setVals([2,-1,0, -1,2,-1, 0,-1,2], [0,0,4]);
    });
    document.getElementById('la-axb-preset-none').addEventListener('click', () => {
        setVals([1,1,1, 1,1,1, 1,1,1], [1,2,3]); // parallel planes, b not in span
    });
    document.getElementById('la-axb-preset-inf').addEventListener('click', () => {
        setVals([1,1,1, 1,1,1, 1,1,1], [2,2,2]); // parallel planes, b in span
    });
    document.getElementById('la-axb-preset-rand').addEventListener('click', () => {
        let A = [], b = [];
        for(let i=0; i<9; i++) A.push(Math.floor(Math.random()*9 - 4));
        for(let i=0; i<3; i++) b.push(Math.floor(Math.random()*9 - 4));
        setVals(A, b);
    });

    function animate() {
        requestAnimationFrame(animate);
        if (isAnimating) {
            animTime += 0.005;
            if (animTime >= 1.2) {
                isAnimating = false;
                animTime = 1.0;
            }
            window.laAxbUpdate(false);
        }
        if (rControls && !dragActive) rControls.update();
        if (cControls && !dragActive) cControls.update();
        if (rRenderer && rScene && rCamera) rRenderer.render(rScene, rCamera);
        if (cRenderer && cScene && cCamera) cRenderer.render(cScene, cCamera);
    }

    setTimeout(() => {
        if (!rRenderer) init3D();
        window.laAxbUpdate(true);
    }, 100);
    
    window.addEventListener('resize', () => {
        if (rRenderer) {
            rCamera.aspect = rCanvasWrap.clientWidth / rCanvasWrap.clientHeight;
            rCamera.updateProjectionMatrix();
            rRenderer.setSize(rCanvasWrap.clientWidth, rCanvasWrap.clientHeight);
        }
        if (cRenderer) {
            cCamera.aspect = cCanvasWrap.clientWidth / cCanvasWrap.clientHeight;
            cCamera.updateProjectionMatrix();
            cRenderer.setSize(cCanvasWrap.clientWidth, cCanvasWrap.clientHeight);
        }
    });
};
