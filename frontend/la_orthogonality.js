/* la_orthogonality.js */
window.laOrthInitialized = false;

window.initLAOrthogonality = function () {
    if (window.laOrthInitialized) {
        if (window.laOrthUpdate) window.laOrthUpdate();
        return;
    }
    window.laOrthInitialized = true;

    let renderer, scene, camera, controls;
    let rowGroup, nullGroup, colGroup, leftNullGroup, arrowsGroup;

    const canvasWrap = document.getElementById('la-orth-canvas');
    if (!canvasWrap) return;

    function init3D() {
        if (renderer) return;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
        canvasWrap.appendChild(renderer.domElement);
        
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        
        camera = new THREE.PerspectiveCamera(45, canvasWrap.clientWidth / canvasWrap.clientHeight, 0.1, 100);
        camera.position.set(6, 4, 8);
        
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(5, 10, 7);
        scene.add(ambientLight);
        scene.add(dirLight);

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        const gridHelper = new THREE.GridHelper(10, 10, 0x94a3b8, 0xe2e8f0);
        scene.add(gridHelper);

        rowGroup = new THREE.Group(); scene.add(rowGroup);
        nullGroup = new THREE.Group(); scene.add(nullGroup);
        colGroup = new THREE.Group(); scene.add(colGroup);
        leftNullGroup = new THREE.Group(); scene.add(leftNullGroup);
        arrowsGroup = new THREE.Group(); scene.add(arrowsGroup);

        animate();
    }

    function createPlane(normal, color) {
        if (normal.length() < 0.01) return new THREE.Group();
        const planeGeom = new THREE.PlaneGeometry(10, 10);
        const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false });
        const mesh = new THREE.Mesh(planeGeom, mat);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), normal.clone().normalize());
        return mesh;
    }

    function createLine(dir, color) {
        if (dir.length() < 0.01) return new THREE.Group();
        const d = dir.clone().normalize().multiplyScalar(10);
        const points = [d.clone(), d.clone().negate()];
        const tubeGeom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 2, 0.03, 8, false);
        const mesh = new THREE.Mesh(tubeGeom, new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.8}));
        return mesh;
    }

    function createArrow(dir, origin, color) {
        const len = dir.length();
        if (len < 0.001) return new THREE.Group();
        return new THREE.ArrowHelper(dir.clone().normalize(), origin, len, color, 0.3, 0.2);
    }

    function drawSubspace(group, v1, v2, v3, color) {
        while(group.children.length > 0){ group.remove(group.children[0]); }
        
        const n12 = new THREE.Vector3().crossVectors(v1, v2);
        const n23 = new THREE.Vector3().crossVectors(v2, v3);
        const n31 = new THREE.Vector3().crossVectors(v3, v1);
        
        const maxCrossLen = Math.max(n12.length(), n23.length(), n31.length());
        
        if (v1.length() < 0.01 && v2.length() < 0.01 && v3.length() < 0.01) {
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: color}));
            group.add(mesh);
        } else if (maxCrossLen < 0.05) {
            let dir = v1.length() > 0.01 ? v1 : (v2.length() > 0.01 ? v2 : v3);
            group.add(createLine(dir, color));
        } else {
            let normal = n12;
            if (n23.length() > normal.length()) normal = n23;
            if (n31.length() > normal.length()) normal = n31;
            
            let dot = 0;
            if (normal === n12) dot = Math.abs(normal.dot(v3));
            if (normal === n23) dot = Math.abs(normal.dot(v1));
            if (normal === n31) dot = Math.abs(normal.dot(v2));
            
            if (dot > 0.05) {
                const mesh = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({color: color, transparent:true, opacity:0.1}));
                group.add(mesh);
            } else {
                group.add(createPlane(normal, color));
            }
        }
    }

    let currentNullBasis = [];
    let currentRowBasis = [];

    window.laOrthUpdate = function update() {
        if (!renderer) init3D();
        
        const m = [];
        for (let i=1; i<=3; i++) {
            for (let j=1; j<=3; j++) {
                m.push(parseFloat(document.getElementById('la-orth-a'+i+j).value) || 0);
            }
        }
        
        const r1 = new THREE.Vector3(m[0], m[1], m[2]);
        const r2 = new THREE.Vector3(m[3], m[4], m[5]);
        const r3 = new THREE.Vector3(m[6], m[7], m[8]);

        const c1 = new THREE.Vector3(m[0], m[3], m[6]);
        const c2 = new THREE.Vector3(m[1], m[4], m[7]);
        const c3 = new THREE.Vector3(m[2], m[5], m[8]);

        drawSubspace(rowGroup, r1, r2, r3, 0x3b82f6); // Blue
        currentRowBasis = [r1, r2, r3];
        
        drawSubspace(colGroup, c1, c2, c3, 0x16a34a); // Green

        const n12 = new THREE.Vector3().crossVectors(r1, r2);
        const n23 = new THREE.Vector3().crossVectors(r2, r3);
        const n31 = new THREE.Vector3().crossVectors(r3, r1);
        let nNormal = n12;
        if (n23.length() > nNormal.length()) nNormal = n23;
        if (n31.length() > nNormal.length()) nNormal = n31;
        
        currentNullBasis = [];
        while(nullGroup.children.length > 0) nullGroup.remove(nullGroup.children[0]);
        
        if (r1.length() < 0.01 && r2.length() < 0.01 && r3.length() < 0.01) {
            nullGroup.add(new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({color: 0xdc2626, transparent:true, opacity:0.1})));
            currentNullBasis = [new THREE.Vector3(1,0,0), new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,1)];
        } else if (nNormal.length() < 0.05) {
            let dir = r1.length() > 0.01 ? r1 : (r2.length() > 0.01 ? r2 : r3);
            nullGroup.add(createPlane(dir, 0xdc2626)); // Red
            let u = new THREE.Vector3(1,0,0);
            if (Math.abs(dir.x) > 0.9) u.set(0,1,0);
            currentNullBasis.push(new THREE.Vector3().crossVectors(dir, u).normalize());
            currentNullBasis.push(new THREE.Vector3().crossVectors(dir, currentNullBasis[0]).normalize());
        } else {
            let dot = Math.abs(nNormal.dot(r1)) + Math.abs(nNormal.dot(r2)) + Math.abs(nNormal.dot(r3));
            if (dot < 0.05) {
                nullGroup.add(createLine(nNormal, 0xdc2626)); // Red
                currentNullBasis.push(nNormal.clone().normalize());
            } else {
                nullGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0xdc2626})));
            }
        }

        const l12 = new THREE.Vector3().crossVectors(c1, c2);
        const l23 = new THREE.Vector3().crossVectors(c2, c3);
        const l31 = new THREE.Vector3().crossVectors(c3, c1);
        let lNormal = l12;
        if (l23.length() > lNormal.length()) lNormal = l23;
        if (l31.length() > lNormal.length()) lNormal = l31;
        
        while(leftNullGroup.children.length > 0) leftNullGroup.remove(leftNullGroup.children[0]);
        if (c1.length() < 0.01 && c2.length() < 0.01 && c3.length() < 0.01) {
            leftNullGroup.add(new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({color: 0x9333ea, transparent:true, opacity:0.1})));
        } else if (lNormal.length() < 0.05) {
            let dir = c1.length() > 0.01 ? c1 : (c2.length() > 0.01 ? c2 : c3);
            leftNullGroup.add(createPlane(dir, 0x9333ea)); // Purple
        } else {
            let dot = Math.abs(lNormal.dot(c1)) + Math.abs(lNormal.dot(c2)) + Math.abs(lNormal.dot(c3));
            if (dot < 0.05) {
                leftNullGroup.add(createLine(lNormal, 0x9333ea)); // Purple
            } else {
                leftNullGroup.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x9333ea})));
            }
        }
        
        while(arrowsGroup.children.length > 0) arrowsGroup.remove(arrowsGroup.children[0]);
        document.getElementById('la-orth-math-result').innerHTML = 'v<sub>r</sub> &middot; v<sub>n</sub> = ?';
        
        updateVisibility();
    };

    function updateVisibility() {
        if (!rowGroup) return;
        rowGroup.visible = document.getElementById('la-orth-show-row').checked;
        nullGroup.visible = document.getElementById('la-orth-show-null').checked;
        colGroup.visible = document.getElementById('la-orth-show-col').checked;
        leftNullGroup.visible = document.getElementById('la-orth-show-leftnull').checked;
    }

    document.getElementById('la-orth-show-row').addEventListener('change', updateVisibility);
    document.getElementById('la-orth-show-null').addEventListener('change', updateVisibility);
    document.getElementById('la-orth-show-col').addEventListener('change', updateVisibility);
    document.getElementById('la-orth-show-leftnull').addEventListener('change', updateVisibility);

    for (let i=1; i<=3; i++) {
        for (let j=1; j<=3; j++) {
            document.getElementById('la-orth-a'+i+j).addEventListener('input', () => {
                window.laOrthUpdate();
            });
        }
    }

    document.getElementById('la-orth-btn-check').addEventListener('click', () => {
        while(arrowsGroup.children.length > 0) arrowsGroup.remove(arrowsGroup.children[0]);
        
        let vr = new THREE.Vector3(0,0,0);
        if (currentRowBasis.length > 0) {
            currentRowBasis.forEach(b => {
                vr.add(b.clone().multiplyScalar((Math.random() - 0.5) * 2));
            });
        }
        
        let vn = new THREE.Vector3(0,0,0);
        if (currentNullBasis.length > 0) {
            currentNullBasis.forEach(b => {
                vn.add(b.clone().multiplyScalar((Math.random() - 0.5) * 4));
            });
        }

        arrowsGroup.add(createArrow(vr, new THREE.Vector3(0,0,0), 0x3b82f6));
        arrowsGroup.add(createArrow(vn, new THREE.Vector3(0,0,0), 0xdc2626));
        
        let dot = vr.dot(vn);
        let resHTML = `
            <span style="color:#3b82f6;">v_r = [${vr.x.toFixed(2)}, ${vr.y.toFixed(2)}, ${vr.z.toFixed(2)}]</span><br>
            <span style="color:#dc2626;">v_n = [${vn.x.toFixed(2)}, ${vn.y.toFixed(2)}, ${vn.z.toFixed(2)}]</span><br>
            <strong style="font-size:1.3rem;">v_r &middot; v_n = ${dot.toFixed(5)} &approx; 0</strong>
        `;
        document.getElementById('la-orth-math-result').innerHTML = resHTML;
    });

    function animate() {
        requestAnimationFrame(animate);
        if (controls) controls.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
    }

    setTimeout(() => {
        if (!renderer) init3D();
        window.laOrthUpdate();
    }, 100);
    
    window.addEventListener('resize', () => {
        if (renderer) {
            camera.aspect = canvasWrap.clientWidth / canvasWrap.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
        }
    });
};
