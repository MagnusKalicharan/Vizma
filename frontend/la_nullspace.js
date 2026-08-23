/* la_nullspace.js */
window.laNullSpaceInitialized = false;

window.initLANullSpace = function () {
    if (window.laNullSpaceInitialized) {
        if (window.laNullSpaceUpdate) window.laNullSpaceUpdate();
        return;
    }
    window.laNullSpaceInitialized = true;

    let renderer, scene, camera, controls, pointsGroup, nsGroup;
    let originalPoints = [];
    let transformedPoints = [];
    let pointMeshes = [];
    
    let animationProgress = 0;
    let isAnimating = false;
    let animStartTime = 0;
    const ANIM_DURATION = 2000; // ms

    const canvasWrap = document.getElementById('la-ns-canvas');
    if (!canvasWrap) return;

    function init3D() {
        if (renderer) return;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
        canvasWrap.appendChild(renderer.domElement);
        
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff); // White background
        
        camera = new THREE.PerspectiveCamera(45, canvasWrap.clientWidth / canvasWrap.clientHeight, 0.1, 100);
        camera.position.set(6, 4, 8);
        
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 7);
        scene.add(ambientLight);
        scene.add(dirLight);

        const gridHelper = new THREE.GridHelper(10, 10, 0x94a3b8, 0xe2e8f0);
        scene.add(gridHelper);
        
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        pointsGroup = new THREE.Group();
        scene.add(pointsGroup);
        
        nsGroup = new THREE.Group();
        scene.add(nsGroup);

        animate(0);
    }

    function addVector(pos, matrix, isNullSpace) {
        const len = pos.length();
        if (len < 0.001) return;

        let color = new THREE.Color();
        if (isNullSpace) {
            color.setHex(0xf59e0b); // Amber for null space
        } else {
            // Rainbow coloring based on angle in xy plane + z
            const hue = (Math.atan2(pos.y, pos.x) + Math.PI) / (2 * Math.PI);
            color.setHSL(hue, 0.8, 0.5);
        }

        const dir = pos.clone().normalize();
        const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0,0,0), len, color.getHex(), 0.2, 0.15);
        pointsGroup.add(arrow);
        
        originalPoints.push(pos.clone());
        let tPos = pos.clone().applyMatrix4(matrix);
        transformedPoints.push(tPos);
        pointMeshes.push(arrow);
    }

    function generatePoints(matrix, nullSpaceType, nullSpaceDir) {
        while(pointsGroup.children.length > 0){ pointsGroup.remove(pointsGroup.children[0]); }
        originalPoints = [];
        transformedPoints = [];
        pointMeshes = [];

        // Generate a grid of background vectors
        for (let x = -2; x <= 2; x += 2) {
            for (let y = -2; y <= 2; y += 2) {
                for (let z = -2; z <= 2; z += 2) {
                    if (x===0 && y===0 && z===0) continue;
                    addVector(new THREE.Vector3(x, y, z), matrix, false);
                }
            }
        }

        // Add special vectors ON the null space
        if (nullSpaceType === 1) { // 1D line
            for (let t = -4; t <= 4; t += 1) {
                if (t === 0) continue;
                let pt = nullSpaceDir.clone().multiplyScalar(t);
                addVector(pt, matrix, true);
            }
        } else if (nullSpaceType === 2) { // 2D plane
            let u = new THREE.Vector3(1,0,0);
            if (Math.abs(nullSpaceDir.x) > 0.9) u.set(0,1,0);
            let v1 = new THREE.Vector3().crossVectors(nullSpaceDir, u).normalize();
            let v2 = new THREE.Vector3().crossVectors(nullSpaceDir, v1).normalize();
            
            for (let i = -2; i <= 2; i+=1.5) {
                for (let j = -2; j <= 2; j+=1.5) {
                    if (Math.abs(i) < 0.1 && Math.abs(j) < 0.1) continue;
                    let pt = v1.clone().multiplyScalar(i).add(v2.clone().multiplyScalar(j));
                    addVector(pt, matrix, true);
                }
            }
        }
    }

    function buildNullSpaceGeometry(nullSpaceType, nullSpaceDir) {
        while(nsGroup.children.length > 0){ nsGroup.remove(nsGroup.children[0]); }
        
        if (nullSpaceType === 1) {
            const dir = nullSpaceDir.clone().normalize().multiplyScalar(10);
            const points = [dir.clone(), dir.clone().negate()];
            const tubeGeom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 2, 0.03, 8, false);
            const mesh = new THREE.Mesh(tubeGeom, new THREE.MeshBasicMaterial({color: 0xfacc15, transparent: true, opacity: 0.8}));
            nsGroup.add(mesh);
        } else if (nullSpaceType === 2) {
            const planeGeom = new THREE.PlaneGeometry(10, 10);
            const mat = new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false });
            const mesh = new THREE.Mesh(planeGeom, mat);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), nullSpaceDir.clone().normalize());
            mesh.applyQuaternion(quaternion);
            nsGroup.add(mesh);
        }
    }

    window.laNullSpaceUpdate = function update() {
        if (!renderer) init3D();
        
        const m = [];
        for (let i=1; i<=3; i++) {
            for (let j=1; j<=3; j++) {
                m.push(parseFloat(document.getElementById('la-ns-a'+i+j).value) || 0);
            }
        }
        
        const mat = new THREE.Matrix4();
        mat.set(
            m[0], m[1], m[2], 0,
            m[3], m[4], m[5], 0,
            m[6], m[7], m[8], 0,
            0,    0,    0,    1
        );

        const r1 = new THREE.Vector3(m[0], m[1], m[2]);
        const r2 = new THREE.Vector3(m[3], m[4], m[5]);
        const r3 = new THREE.Vector3(m[6], m[7], m[8]);

        const n12 = new THREE.Vector3().crossVectors(r1, r2);
        const n23 = new THREE.Vector3().crossVectors(r2, r3);
        const n31 = new THREE.Vector3().crossVectors(r3, r1);
        
        const maxCrossLen = Math.max(n12.length(), n23.length(), n31.length());
        
        let nullSpaceType = 0; 
        let nullSpaceDir = new THREE.Vector3();

        if (r1.length() < 0.01 && r2.length() < 0.01 && r3.length() < 0.01) {
            nullSpaceType = 3; 
        } else if (maxCrossLen < 0.05) {
            nullSpaceType = 2;
            nullSpaceDir = r1.length() > 0.01 ? r1 : (r2.length() > 0.01 ? r2 : r3);
        } else {
            let normal = n12;
            if (n23.length() > normal.length()) normal = n23;
            if (n31.length() > normal.length()) normal = n31;
            
            let dot = 0;
            if (normal === n12) dot = Math.abs(normal.dot(r3));
            if (normal === n23) dot = Math.abs(normal.dot(r1));
            if (normal === n31) dot = Math.abs(normal.dot(r2));
            
            if (dot > 0.05) {
                nullSpaceType = 0; 
            } else {
                nullSpaceType = 1; 
                nullSpaceDir = normal; 
            }
        }

        buildNullSpaceGeometry(nullSpaceType, nullSpaceDir);
        generatePoints(mat, nullSpaceType, nullSpaceDir);
        
        animationProgress = 0;
        isAnimating = false;
        applyPositions();
    };

    function applyPositions() {
        const t = animationProgress;
        const ease = t * t * (3 - 2 * t); 
        
        for (let i = 0; i < pointMeshes.length; i++) {
            let currentPos = originalPoints[i].clone().lerp(transformedPoints[i], ease);
            let len = currentPos.length();
            
            if (len < 0.001) {
                pointMeshes[i].visible = false;
            } else {
                pointMeshes[i].visible = true;
                pointMeshes[i].setDirection(currentPos.clone().normalize());
                // For very short vectors, scale down the head
                let headL = Math.min(0.2, len * 0.5);
                let headW = Math.min(0.15, len * 0.3);
                pointMeshes[i].setLength(len, headL, headW);
            }
        }
        
        if (nsGroup.children.length > 0) {
            nsGroup.children[0].material.opacity = (1 - ease) * (nsGroup.children[0].geometry.type === 'TubeGeometry' ? 0.8 : 0.3);
        }
    }

    document.getElementById('la-ns-btn-transform').addEventListener('click', () => {
        if (!isAnimating && animationProgress === 0) {
            isAnimating = true;
            animStartTime = performance.now();
        }
    });

    document.getElementById('la-ns-btn-reset').addEventListener('click', () => {
        isAnimating = false;
        animationProgress = 0;
        applyPositions();
    });

    function setMatrix(arr) {
        for (let i=1; i<=3; i++) {
            for (let j=1; j<=3; j++) {
                document.getElementById('la-ns-a'+i+j).value = arr[(i-1)*3 + (j-1)];
            }
        }
        window.laNullSpaceUpdate();
    }

    // Bind inputs
    for (let i=1; i<=3; i++) {
        for (let j=1; j<=3; j++) {
            document.getElementById('la-ns-a'+i+j).addEventListener('input', () => {
                window.laNullSpaceUpdate();
            });
        }
    }

    document.getElementById('la-ns-btn-preset1').addEventListener('click', () => {
        setMatrix([
            1, 0, 0,
            0, 1, 0,
            0, 0, 0
        ]);
    });

    document.getElementById('la-ns-btn-preset2').addEventListener('click', () => {
        setMatrix([
            1, 0, 0,
            0, 0, 0,
            0, 0, 0
        ]);
    });

    document.getElementById('la-ns-btn-preset3').addEventListener('click', () => {
        setMatrix([
            0.707, 0, 0.707,
            0,     1, 0,
            -0.707,0, 0.707
        ]);
    });

    function animate(time) {
        requestAnimationFrame(animate);
        
        if (isAnimating) {
            let elapsed = time - animStartTime;
            animationProgress = Math.min(1.0, elapsed / ANIM_DURATION);
            applyPositions();
            if (animationProgress >= 1.0) {
                isAnimating = false;
            }
        }
        
        if (controls) controls.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
    }

    setTimeout(() => {
        if (!renderer) init3D();
        window.laNullSpaceUpdate();
    }, 100);
    
    window.addEventListener('resize', () => {
        if (renderer) {
            camera.aspect = canvasWrap.clientWidth / canvasWrap.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
        }
    });
};
