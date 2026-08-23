/* la_eigen.js - Simplified Grid Transformation Morph */
window.laEigenInitialized = false;

window.initLAEigen = function () {
    if (window.laEigenInitialized) {
        if (window.laEigenUpdate) window.laEigenUpdate();
        return;
    }
    window.laEigenInitialized = true;

    let renderer, scene, camera, controls;
    let transformGroup;
    let eigenLinesGroup; // Keep eigen lines inside transformGroup so they stretch, but maybe we want to redraw them to keep their thickness uniform? Actually, keeping them inside transformGroup is exactly what we want! They will stretch/shrink naturally. But wait, if they are lines, their thickness won't change in ThreeJS (linewidth is constant in screen space for LineBasicMaterial). This is perfect!
    
    const canvasWrap = document.getElementById('la-eigen-canvas');
    if (!canvasWrap) return;
    
    // State
    let isAnimating = false;
    let animTime = parseFloat(document.getElementById('la-eigen-t').value);
    
    function init3D() {
        if (renderer) return;
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
        canvasWrap.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        
        // Orthographic is better for 2D transformations to avoid perspective distortion
        const aspect = canvasWrap.clientWidth / canvasWrap.clientHeight;
        const d = 5;
        camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 100);
        camera.position.set(0, 0, 10);
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableRotate = false; // Lock rotation
        controls.enableDamping = true;
        
        scene.add(new THREE.AmbientLight(0xffffff, 1.0));
        
        // Background fixed axes (faint)
        scene.add(new THREE.AxesHelper(10));

        transformGroup = new THREE.Group();
        transformGroup.matrixAutoUpdate = false;
        scene.add(transformGroup);
        
        buildGrid();
        buildSampleVectors();
        
        eigenLinesGroup = new THREE.Group();
        transformGroup.add(eigenLinesGroup);

        animate();
    }
    
    function buildGrid() {
        const size = 10;
        const step = 1;
        const geom = new THREE.BufferGeometry();
        const pts = [];
        for (let i = -size; i <= size; i += step) {
            pts.push(new THREE.Vector3(-size, i, 0), new THREE.Vector3(size, i, 0));
            pts.push(new THREE.Vector3(i, -size, 0), new THREE.Vector3(i, size, 0));
        }
        geom.setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: 0xcbd5e1, transparent:true, opacity: 0.5 });
        const grid = new THREE.LineSegments(geom, mat);
        transformGroup.add(grid);
    }
    
    function buildSampleVectors() {
        const numVecs = 8;
        for (let i = 0; i < numVecs; i++) {
            const theta = (i / numVecs) * Math.PI * 2;
            const dir = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);
            const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(), 1.5, 0x3b82f6, 0.2, 0.15);
            transformGroup.add(arrow);
        }
        
        // A single circle outline to see the shear clearly
        const circleGeom = new THREE.RingGeometry(1.48, 1.52, 64);
        const circleMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, side: THREE.DoubleSide });
        transformGroup.add(new THREE.Mesh(circleGeom, circleMat));
    }

    function getMatrix() {
        const a = parseFloat(document.getElementById('la-eigen-a11').value) || 0;
        const b = parseFloat(document.getElementById('la-eigen-a12').value) || 0;
        const c = parseFloat(document.getElementById('la-eigen-a21').value) || 0;
        const d = parseFloat(document.getElementById('la-eigen-a22').value) || 0;
        return { a, b, c, d };
    }

    function computeEigenData(A) {
        const { a, b, c, d } = A;
        const T = a + d;
        const D = a*d - b*c;
        const delta = T*T - 4*D;
        
        let vals = [];
        let vecs = [];
        
        if (delta >= 0) {
            const l1 = (T + Math.sqrt(delta)) / 2;
            const l2 = (T - Math.sqrt(delta)) / 2;
            vals.push(l1);
            if (delta > 0.0001) vals.push(l2);
            
            vals.forEach(lambda => {
                let vec;
                if (Math.abs(c) > 0.0001) vec = new THREE.Vector3(lambda - d, c, 0).normalize();
                else if (Math.abs(b) > 0.0001) vec = new THREE.Vector3(b, lambda - a, 0).normalize();
                else vec = (lambda === a) ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
                vecs.push(vec);
            });
        }
        return { vals, vecs };
    }

    window.laEigenUpdate = function () {
        if (!renderer) init3D();
        
        const A = getMatrix();
        const { vals, vecs } = computeEigenData(A);
        
        let valText = "Complex (No Real Eigenvectors)";
        if (vals.length > 0) {
            valText = vals.map(v => `λ = ${v.toFixed(2)}`).join('<br>');
        }
        document.getElementById('la-eigen-values-readout').innerHTML = valText;
        
        // Draw True Eigenlines
        while(eigenLinesGroup.children.length > 0) eigenLinesGroup.remove(eigenLinesGroup.children[0]);
        vecs.forEach((v, i) => {
            const lambda = vals[i];
            const color = lambda > 0 ? 0xeab308 : 0xf97316; // gold pos, orange neg
            
            // Draw a long line spanning the grid
            const geom = new THREE.BufferGeometry().setFromPoints([v.clone().multiplyScalar(-10), v.clone().multiplyScalar(10)]);
            const mat = new THREE.LineBasicMaterial({ color: color, linewidth: 3 });
            eigenLinesGroup.add(new THREE.Line(geom, mat));
            
            // Also add an arrow to show direction explicitly
            const arrow = new THREE.ArrowHelper(v, new THREE.Vector3(), 3, color, 0.4, 0.3);
            eigenLinesGroup.add(arrow);
            const arrowOpp = new THREE.ArrowHelper(v.clone().negate(), new THREE.Vector3(), 3, color, 0.4, 0.3);
            eigenLinesGroup.add(arrowOpp);
        });
        
        applyTransformation(animTime);
    };
    
    function applyTransformation(t) {
        const A = getMatrix();
        // M(t) = (1-t)I + tA
        const m11 = (1 - t) * 1 + t * A.a;
        const m12 = (1 - t) * 0 + t * A.b;
        const m21 = (1 - t) * 0 + t * A.c;
        const m22 = (1 - t) * 1 + t * A.d;
        
        const m = new THREE.Matrix4();
        m.set(
            m11, m12, 0, 0,
            m21, m22, 0, 0,
            0,   0,   1, 0,
            0,   0,   0, 1
        );
        transformGroup.matrix.copy(m);
    }

    // Bind inputs
    const inputs = ['a11', 'a12', 'a21', 'a22'];
    inputs.forEach(id => {
        document.getElementById('la-eigen-'+id).addEventListener('input', () => {
            window.laEigenUpdate();
        });
    });
    
    document.getElementById('la-eigen-t').addEventListener('input', (e) => {
        animTime = parseFloat(e.target.value);
        isAnimating = false;
        applyTransformation(animTime);
    });

    document.getElementById('la-eigen-btn-play').addEventListener('click', () => {
        if (animTime >= 1) animTime = 0;
        isAnimating = true;
    });
    
    document.getElementById('la-eigen-btn-reset').addEventListener('click', () => {
        animTime = 0;
        isAnimating = false;
        document.getElementById('la-eigen-t').value = 0;
        applyTransformation(0);
        if (controls) controls.reset();
    });

    function setVals(a,b,c,d) {
        document.getElementById('la-eigen-a11').value = a;
        document.getElementById('la-eigen-a12').value = b;
        document.getElementById('la-eigen-a21').value = c;
        document.getElementById('la-eigen-a22').value = d;
        window.laEigenUpdate();
    }

    document.getElementById('la-eigen-preset-sym').addEventListener('click', () => setVals(1.5, 0.5, 0.5, 1.0));
    document.getElementById('la-eigen-preset-shear').addEventListener('click', () => setVals(1.0, 1.0, 0.0, 1.0));
    document.getElementById('la-eigen-preset-rot').addEventListener('click', () => setVals(0.0, -1.0, 1.0, 0.0));

    function animate() {
        requestAnimationFrame(animate);
        
        if (isAnimating) {
            animTime += 0.005;
            if (animTime >= 1) {
                animTime = 1;
                isAnimating = false;
            }
            document.getElementById('la-eigen-t').value = animTime;
            applyTransformation(animTime);
        }
        
        if (controls) controls.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
    }

    setTimeout(() => {
        if (!renderer) init3D();
        window.laEigenUpdate();
    }, 100);
    
    window.addEventListener('resize', () => {
        if (renderer && camera) {
            const aspect = canvasWrap.clientWidth / canvasWrap.clientHeight;
            const d = 5;
            camera.left = -d * aspect;
            camera.right = d * aspect;
            camera.top = d;
            camera.bottom = -d;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
        }
    });
};
