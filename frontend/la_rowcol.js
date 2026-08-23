/* la_rowcol.js */
window.initLARowCol = function () {
    let initialized = false;
    let colRenderer, colScene, colCamera, colControls;
    let rowRenderer, rowScene, rowCamera, rowControls;

    const colCanvas = document.getElementById('la-rc-col-canvas');
    const rowCanvas = document.getElementById('la-rc-row-canvas');

    if (!colCanvas || !rowCanvas) return;

    function init3D() {
        if (initialized) return;

        // Init Column Space
        colRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        colRenderer.setSize(colCanvas.clientWidth, colCanvas.clientHeight);
        colCanvas.appendChild(colRenderer.domElement);
        colScene = new THREE.Scene();
        colScene.background = new THREE.Color(0xf1f5f9);
        colCamera = new THREE.PerspectiveCamera(45, colCanvas.clientWidth / colCanvas.clientHeight, 0.1, 100);
        colCamera.position.set(4, 3, 5);
        colControls = new THREE.OrbitControls(colCamera, colRenderer.domElement);
        colControls.enableDamping = true;
        
        // Init Row Space
        rowRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rowRenderer.setSize(rowCanvas.clientWidth, rowCanvas.clientHeight);
        rowCanvas.appendChild(rowRenderer.domElement);
        rowScene = new THREE.Scene();
        rowScene.background = new THREE.Color(0xf1f5f9);
        rowCamera = new THREE.PerspectiveCamera(45, rowCanvas.clientWidth / rowCanvas.clientHeight, 0.1, 100);
        rowCamera.position.set(4, 3, 5);
        rowControls = new THREE.OrbitControls(rowCamera, rowRenderer.domElement);
        rowControls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
        dirLight.position.set(2, 5, 3);
        
        colScene.add(ambientLight);
        colScene.add(dirLight);
        rowScene.add(ambientLight.clone());
        rowScene.add(dirLight.clone());

        initialized = true;

        animate();
    }

    function createAxes() {
        const group = new THREE.Group();
        const ax = new THREE.AxesHelper(3);
        group.add(ax);
        return group;
    }

    function createArrow(vec, colorStr) {
        const len = vec.length();
        if (len < 0.001) return new THREE.Group();
        const dir = vec.clone().normalize();
        const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0,0,0), len, colorStr, 0.3, 0.2);
        return arrow;
    }

    function calcRank(v1, v2, v3) {
        const n12 = new THREE.Vector3().crossVectors(v1, v2);
        const n23 = new THREE.Vector3().crossVectors(v2, v3);
        const n31 = new THREE.Vector3().crossVectors(v3, v1);

        const v1Len = v1.length();
        const v2Len = v2.length();
        const v3Len = v3.length();

        if (v1Len < 0.01 && v2Len < 0.01 && v3Len < 0.01) return 0;

        const maxNLen = Math.max(n12.length(), n23.length(), n31.length());
        
        if (maxNLen < 0.05) {
            return 1; // Collinear
        }

        let normal = n12;
        if (n23.length() > normal.length()) normal = n23;
        if (n31.length() > normal.length()) normal = n31;
        normal.normalize();

        let dot = 0;
        if (normal === n12) dot = Math.abs(normal.dot(v3));
        if (normal === n23) dot = Math.abs(normal.dot(v1));
        if (normal === n31) dot = Math.abs(normal.dot(v2));

        if (dot > 0.05) return 3;
        return 2;
    }

    function drawSpan(scene, v1, v2, v3, rank) {
        if (rank === 0) return;
        
        const mat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false });
        
        if (rank === 1) {
            let dir = v1.length() > 0.01 ? v1.clone() : (v2.length() > 0.01 ? v2.clone() : v3.clone());
            dir.normalize().multiplyScalar(4);
            const points = [dir.clone(), dir.clone().negate()];
            const tubeGeom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 2, 0.05, 8, false);
            const mesh = new THREE.Mesh(tubeGeom, new THREE.MeshBasicMaterial({color:0x3b82f6, transparent:true, opacity:0.4}));
            scene.add(mesh);
        } else if (rank === 2) {
            const planeGeom = new THREE.PlaneGeometry(8, 8);
            const mesh = new THREE.Mesh(planeGeom, mat);
            
            let n = new THREE.Vector3().crossVectors(v1, v2);
            if (n.length() < 0.01) n = new THREE.Vector3().crossVectors(v2, v3);
            if (n.length() < 0.01) n = new THREE.Vector3().crossVectors(v1, v3);
            n.normalize();
            
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), n);
            mesh.applyQuaternion(quaternion);
            scene.add(mesh);
        } else if (rank === 3) {
            const sphereGeom = new THREE.SphereGeometry(3, 32, 32);
            const mesh = new THREE.Mesh(sphereGeom, mat);
            scene.add(mesh);
        }
    }

    function update() {
        init3D();
        
        const a11 = parseFloat(document.getElementById('la-rc-a11').value) || 0;
        const a12 = parseFloat(document.getElementById('la-rc-a12').value) || 0;
        const a13 = parseFloat(document.getElementById('la-rc-a13').value) || 0;
        
        const a21 = parseFloat(document.getElementById('la-rc-a21').value) || 0;
        const a22 = parseFloat(document.getElementById('la-rc-a22').value) || 0;
        const a23 = parseFloat(document.getElementById('la-rc-a23').value) || 0;
        
        const a31 = parseFloat(document.getElementById('la-rc-a31').value) || 0;
        const a32 = parseFloat(document.getElementById('la-rc-a32').value) || 0;
        const a33 = parseFloat(document.getElementById('la-rc-a33').value) || 0;

        const c1 = new THREE.Vector3(a11, a21, a31);
        const c2 = new THREE.Vector3(a12, a22, a32);
        const c3 = new THREE.Vector3(a13, a23, a33);

        const r1 = new THREE.Vector3(a11, a12, a13);
        const r2 = new THREE.Vector3(a21, a22, a23);
        const r3 = new THREE.Vector3(a31, a32, a33);

        colScene.children = colScene.children.filter(c => c.isLight);
        rowScene.children = rowScene.children.filter(c => c.isLight);

        colScene.add(createAxes());
        rowScene.add(createAxes());

        colScene.add(createArrow(c1, 0xdc2626)); // Red
        colScene.add(createArrow(c2, 0x16a34a)); // Green
        colScene.add(createArrow(c3, 0x2563eb)); // Blue

        rowScene.add(createArrow(r1, 0xdc2626));
        rowScene.add(createArrow(r2, 0x16a34a));
        rowScene.add(createArrow(r3, 0x2563eb));

        const rankC = calcRank(c1, c2, c3);
        const rankR = calcRank(r1, r2, r3); 
        
        document.getElementById('la-rc-rank-val').innerText = rankC;

        drawSpan(colScene, c1, c2, c3, rankC);
        drawSpan(rowScene, r1, r2, r3, rankR);
    }

    function setMatrix(m) {
        document.getElementById('la-rc-a11').value = m[0];
        document.getElementById('la-rc-a12').value = m[1];
        document.getElementById('la-rc-a13').value = m[2];
        document.getElementById('la-rc-a21').value = m[3];
        document.getElementById('la-rc-a22').value = m[4];
        document.getElementById('la-rc-a23').value = m[5];
        document.getElementById('la-rc-a31').value = m[6];
        document.getElementById('la-rc-a32').value = m[7];
        document.getElementById('la-rc-a33').value = m[8];
        update();
    }

    document.getElementById('la-rc-btn-update').addEventListener('click', update);
    
    document.getElementById('la-rc-btn-rank1').addEventListener('click', () => {
        setMatrix([
            1, 2, -1,
            1, 2, -1,
            1, 2, -1
        ]);
    });
    
    document.getElementById('la-rc-btn-rank2').addEventListener('click', () => {
        setMatrix([
            1, -1, 0,
            2,  1, 0,
            0,  0, 0
        ]);
    });
    
    document.getElementById('la-rc-btn-rank3').addEventListener('click', () => {
        setMatrix([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    });

    function animate() {
        requestAnimationFrame(animate);
        if (colControls) colControls.update();
        if (rowControls) rowControls.update();
        if (colRenderer && colScene && colCamera) colRenderer.render(colScene, colCamera);
        if (rowRenderer && rowScene && rowCamera) rowRenderer.render(rowScene, rowCamera);
    }

    // Initialize dimensions and render
    setTimeout(() => {
        if (!initialized) init3D();
        update();
    }, 100);
    
    // Add window resize handling
    window.addEventListener('resize', () => {
        if (initialized) {
            colCamera.aspect = colCanvas.clientWidth / colCanvas.clientHeight;
            colCamera.updateProjectionMatrix();
            colRenderer.setSize(colCanvas.clientWidth, colCanvas.clientHeight);
            
            rowCamera.aspect = rowCanvas.clientWidth / rowCanvas.clientHeight;
            rowCamera.updateProjectionMatrix();
            rowRenderer.setSize(rowCanvas.clientWidth, rowCanvas.clientHeight);
        }
    });
};
