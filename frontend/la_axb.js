/* la_axb.js */
window.laAxbInitialized = false;

window.initLAAxb = function () {
    if (window.laAxbInitialized) {
        if (window.laAxbUpdate) window.laAxbUpdate();
        return;
    }
    window.laAxbInitialized = true;

    // We have two scenes!
    let rRenderer, rScene, rCamera, rControls; // Row Picture
    let cRenderer, cScene, cCamera, cControls; // Column Picture
    
    let rGroup, cGroup;

    const rCanvasWrap = document.getElementById('la-axb-row-canvas');
    const cCanvasWrap = document.getElementById('la-axb-col-canvas');
    if (!rCanvasWrap || !cCanvasWrap) return;

    function init3D() {
        if (rRenderer) return;

        // --- Init Row Scene ---
        rRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rRenderer.setSize(rCanvasWrap.clientWidth, rCanvasWrap.clientHeight);
        rCanvasWrap.appendChild(rRenderer.domElement);
        rScene = new THREE.Scene();
        rScene.background = new THREE.Color(0xffffff);
        rCamera = new THREE.PerspectiveCamera(45, rCanvasWrap.clientWidth / rCanvasWrap.clientHeight, 0.1, 100);
        rCamera.position.set(8, 6, 10);
        rControls = new THREE.OrbitControls(rCamera, rRenderer.domElement);
        rControls.enableDamping = true;
        rScene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const rDir = new THREE.DirectionalLight(0xffffff, 0.6); rDir.position.set(5, 10, 7); rScene.add(rDir);
        rScene.add(new THREE.AxesHelper(5));
        rScene.add(new THREE.GridHelper(10, 10, 0x94a3b8, 0xe2e8f0));
        rGroup = new THREE.Group(); rScene.add(rGroup);

        // --- Init Col Scene ---
        cRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        cRenderer.setSize(cCanvasWrap.clientWidth, cCanvasWrap.clientHeight);
        cCanvasWrap.appendChild(cRenderer.domElement);
        cScene = new THREE.Scene();
        cScene.background = new THREE.Color(0xffffff);
        cCamera = new THREE.PerspectiveCamera(45, cCanvasWrap.clientWidth / cCanvasWrap.clientHeight, 0.1, 100);
        cCamera.position.set(8, 6, 10);
        cControls = new THREE.OrbitControls(cCamera, cRenderer.domElement);
        cControls.enableDamping = true;
        cScene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const cDir = new THREE.DirectionalLight(0xffffff, 0.6); cDir.position.set(5, 10, 7); cScene.add(cDir);
        cScene.add(new THREE.AxesHelper(5));
        cScene.add(new THREE.GridHelper(10, 10, 0x94a3b8, 0xe2e8f0));
        cGroup = new THREE.Group(); cScene.add(cGroup);

        animate();
    }

    function createPlane(normal, dist, color) {
        if (normal.length() < 0.001) return new THREE.Group();
        const planeGeom = new THREE.PlaneGeometry(10, 10);
        const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false });
        const mesh = new THREE.Mesh(planeGeom, mat);
        
        let n = normal.clone().normalize();
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), n);
        
        // Position the plane so that it is distance 'd' from origin along the normal
        // Equation is n . x = dist, so a point on the plane is n * dist (assuming n is unit)
        mesh.position.copy(n).multiplyScalar(dist / normal.length());
        
        // Give it a solid border
        const edges = new THREE.EdgesGeometry(planeGeom);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color, linewidth: 2 }));
        mesh.add(line);
        
        return mesh;
    }

    function createArrow(dir, origin, color, width=0.2) {
        const len = dir.length();
        if (len < 0.001) return new THREE.Group();
        return new THREE.ArrowHelper(dir.clone().normalize(), origin, len, color, width, width*0.75);
    }

    function solve3x3(m, b) {
        // Cramer's rule / adjugate
        const detA = m[0]*(m[4]*m[8] - m[5]*m[7]) - m[1]*(m[3]*m[8] - m[5]*m[6]) + m[2]*(m[3]*m[7] - m[4]*m[6]);
        if (Math.abs(detA) < 0.0001) return null; // Singular

        const x1 = (b[0]*(m[4]*m[8] - m[5]*m[7]) - m[1]*(b[1]*m[8] - m[5]*b[2]) + m[2]*(b[1]*m[7] - m[4]*b[2])) / detA;
        const x2 = (m[0]*(b[1]*m[8] - m[5]*b[2]) - b[0]*(m[3]*m[8] - m[5]*m[6]) + m[2]*(m[3]*b[2] - b[1]*m[6])) / detA;
        const x3 = (m[0]*(m[4]*b[2] - b[1]*m[7]) - m[1]*(m[3]*b[2] - b[1]*m[6]) + b[0]*(m[3]*m[7] - m[4]*m[6])) / detA;

        return [x1, x2, x3];
    }

    window.laAxbUpdate = function update() {
        if (!rRenderer) init3D();
        
        const m = [];
        for (let i=1; i<=3; i++) {
            for (let j=1; j<=3; j++) {
                m.push(parseFloat(document.getElementById('la-axb-a'+i+j).value) || 0);
            }
        }
        
        const b = [];
        for (let i=1; i<=3; i++) {
            b.push(parseFloat(document.getElementById('la-axb-b'+i).value) || 0);
        }
        
        const r1 = new THREE.Vector3(m[0], m[1], m[2]);
        const r2 = new THREE.Vector3(m[3], m[4], m[5]);
        const r3 = new THREE.Vector3(m[6], m[7], m[8]);

        const c1 = new THREE.Vector3(m[0], m[3], m[6]);
        const c2 = new THREE.Vector3(m[1], m[4], m[7]);
        const c3 = new THREE.Vector3(m[2], m[5], m[8]);
        
        const bVec = new THREE.Vector3(b[0], b[1], b[2]);

        const sol = solve3x3(m, b);
        let solText = "No Unique Solution (Det = 0)";
        if (sol) {
            solText = `x = [${sol[0].toFixed(2)}, ${sol[1].toFixed(2)}, ${sol[2].toFixed(2)}]`;
        }
        document.getElementById('la-axb-solution').innerText = solText;

        // --- Update Row Picture ---
        while(rGroup.children.length > 0) rGroup.remove(rGroup.children[0]);
        rGroup.add(createPlane(r1, b[0], 0xef4444)); // Red
        rGroup.add(createPlane(r2, b[1], 0x22c55e)); // Green
        rGroup.add(createPlane(r3, b[2], 0x3b82f6)); // Blue
        
        if (sol) {
            const solPt = new THREE.Vector3(sol[0], sol[1], sol[2]);
            const ptMesh = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), new THREE.MeshBasicMaterial({color: 0xfacc15}));
            ptMesh.position.copy(solPt);
            rGroup.add(ptMesh);
            
            // Draw a line from origin to solution just to help find it
            const solLine = new THREE.ArrowHelper(solPt.clone().normalize(), new THREE.Vector3(0,0,0), solPt.length(), 0xfacc15, 0.2, 0.15);
            rGroup.add(solLine);
        }

        // --- Update Column Picture ---
        while(cGroup.children.length > 0) cGroup.remove(cGroup.children[0]);
        // Draw the target b vector
        cGroup.add(createArrow(bVec, new THREE.Vector3(0,0,0), 0x000000, 0.3));
        
        if (sol) {
            // Draw scaled columns tip to tail
            let curr = new THREE.Vector3(0,0,0);
            
            let v1 = c1.clone().multiplyScalar(sol[0]);
            cGroup.add(createArrow(v1, curr, 0xef4444)); // Red
            curr.add(v1);
            
            let v2 = c2.clone().multiplyScalar(sol[1]);
            cGroup.add(createArrow(v2, curr, 0x22c55e)); // Green
            curr.add(v2);
            
            let v3 = c3.clone().multiplyScalar(sol[2]);
            cGroup.add(createArrow(v3, curr, 0x3b82f6)); // Blue
        }
    };

    // Bind inputs
    for (let i=1; i<=3; i++) {
        for (let j=1; j<=3; j++) {
            document.getElementById('la-axb-a'+i+j).addEventListener('input', () => { window.laAxbUpdate(); });
        }
        document.getElementById('la-axb-b'+i).addEventListener('input', () => { window.laAxbUpdate(); });
    }

    function animate() {
        requestAnimationFrame(animate);
        if (rControls) rControls.update();
        if (cControls) cControls.update();
        if (rRenderer && rScene && rCamera) rRenderer.render(rScene, rCamera);
        if (cRenderer && cScene && cCamera) cRenderer.render(cScene, cCamera);
    }

    setTimeout(() => {
        if (!rRenderer) init3D();
        window.laAxbUpdate();
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
