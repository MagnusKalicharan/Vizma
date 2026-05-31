import re
import os

html_path = 'd:/math/kinematics/frontend/index.html'
app_js_path = 'd:/math/kinematics/frontend/app.js'

with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Add navigation links
nav_str = '<li><a href="#" class="nav-link" data-page="rainman"><span class="nav-num">10</span> Rain & Umbrella (2D POV)</a></li>'
new_nav = '''<li><a href="#" class="nav-link" data-page="rainman"><span class="nav-num">10</span> Rain & Umbrella (2D POV)</a></li>
            <li><a href="#" class="nav-link" data-page="practice-1"><span class="nav-num">11</span> Practice Questions I</a></li>
            <li><a href="#" class="nav-link" data-page="practice-2"><span class="nav-num">12</span> Practice Questions II</a></li>'''

if 'data-page="practice-1"' not in html_content:
    html_content = html_content.replace(nav_str, new_nav)

# Add scripts
script_str = '<script src="app.js?v=3"></script>'
new_script = '<script src="app.js?v=3"></script>\n    <script src="practice_1.js"></script>\n    <script src="practice_2.js"></script>'
if 'practice_1.js' not in html_content:
    html_content = html_content.replace(script_str, new_script)

# Add section for practice 1
page_1_html = '''
        <section id="page-practice-1" class="page">
            <div class="page-header">
                <span class="chapter-label">Chapter 11</span>
                <h1>Practice Questions I</h1>
                <p class="lead">Advanced problems utilizing relative frames and vector resolution.</p>
            </div>

            <!-- Question 1: Shortest Distance Trap -->
            <div class="sim-section" style="margin-bottom: 2rem;">
                <h2>Question 1: The "Shortest Distance" Relative Velocity Trap</h2>
                <p><strong>Problem:</strong> Ship A is located at the origin (0,0) moving due East with velocity 10 km/h. Ship B is located 100 km due South of A (0, -100) moving North-West (135&deg;) with velocity \(10\sqrt{2}\) km/h. Find the shortest distance between them and the time taken.</p>
                
                <div class="sim-controls">
                    <h3>Controls</h3>
                    <button id="p1-q1-toggle" class="btn" style="width:100%; margin-bottom:1rem; padding:0.8rem; background:var(--blue); color:white; font-size:1rem; font-weight:bold;">Switch to Ship A Frame</button>
                    <label>Ship A Speed (East): <strong id="p1-va-val">10</strong></label>
                    <input type="range" id="p1-va" min="0" max="30" step="1" value="10">
                    <label>Ship B Speed (NW): <strong id="p1-vb-val">14.14</strong></label>
                    <input type="range" id="p1-vb" min="0" max="30" step="0.1" value="14.14">
                    <label>Ship B Angle (&deg;): <strong id="p1-theta-val">135</strong></label>
                    <input type="range" id="p1-theta" min="90" max="180" step="1" value="135">
                </div>
                
                <div class="sim-canvas-container" style="background:var(--bg-subtle); border-radius:var(--radius); border:1px solid var(--border);">
                    <canvas id="p1-q1-canvas" width="600" height="400" style="width:100%; height:auto;"></canvas>
                </div>
                
                <div class="math-section" style="margin-top: 1rem;">
                    <h3>Mathematical Solution</h3>
                    <p>In Ground Frame, both ships move. In Ship A's frame, Ship A is stationary. The relative velocity of Ship B with respect to A is \(\vec{v}_{BA} = \vec{v}_B - \vec{v}_A\).</p>
                    <p>\(\vec{v}_A = 10 \hat{i}\)</p>
                    <p>\(\vec{v}_B = -10 \hat{i} + 10 \hat{j}\) (since \(10\sqrt{2}\cos 135^\circ = -10\))</p>
                    <p>\(\vec{v}_{BA} = (-10 - 10)\hat{i} + 10\hat{j} = -20\hat{i} + 10\hat{j}\)</p>
                    <p>The shortest distance \(d\) is the perpendicular dropped from A (origin) to the relative path of B. The relative path starts at (0, -100).</p>
                    <p>The angle of \(\vec{v}_{BA}\) with the negative x-axis is \(\alpha = \arctan(10/20) \approx 26.56^\circ\).</p>
                    <p>Shortest distance \(d_{\min} = 100 \cos(26.56^\circ) = 100 \times \frac{2}{\sqrt{5}} = 40\sqrt{5} \approx 89.44 \text{ km}\).</p>
                    <p>Time \(t = \frac{\text{Distance along path}}{|\vec{v}_{BA}|} = \frac{100 \sin(26.56^\circ)}{\sqrt{20^2+10^2}} = \frac{100(1/\sqrt{5})}{10\sqrt{5}} = 2 \text{ hours}\).</p>
                </div>
            </div>

            <!-- Question 2: Mid-Air Collision -->
            <div class="sim-section" style="margin-bottom: 2rem;">
                <h2>Question 2: Mid-Air Collision of Two Projectiles</h2>
                <p><strong>Problem:</strong> Particle 1 is projected from height H horizontally with speed u. Particle 2 is projected from the ground at horizontal distance D, aimed towards the tower with speed v at angle \(\theta\). If they collide, find the relation between H, D, v, \(\theta\).</p>
                
                <div class="sim-controls">
                    <h3>Controls</h3>
                    <button id="p1-q2-toggle" class="btn" style="width:100%; margin-bottom:1rem; padding:0.8rem; background:var(--green); color:white; font-size:1rem; font-weight:bold;">Turn Off Gravity (Relative Frame)</button>
                    <button id="p1-q2-play" class="btn" style="margin-bottom:1rem;">Play Animation</button>
                    <label>u (Particle 1): <strong id="p1-u-val">10</strong></label>
                    <input type="range" id="p1-u" min="0" max="30" step="1" value="10">
                    <label>v (Particle 2): <strong id="p1-v-val">25</strong></label>
                    <input type="range" id="p1-v" min="0" max="50" step="1" value="25">
                    <label>Angle &theta; (&deg;): <strong id="p1-q2-theta-val">60</strong></label>
                    <input type="range" id="p1-q2-theta" min="10" max="80" step="1" value="60">
                </div>
                
                <div class="sim-canvas-container" style="background:var(--bg-subtle); border-radius:var(--radius); border:1px solid var(--border);">
                    <canvas id="p1-q2-canvas" width="600" height="400" style="width:100%; height:auto;"></canvas>
                </div>
                
                <div class="math-section" style="margin-top: 1rem;">
                    <h3>Mathematical Solution</h3>
                    <p>In a gravity-free relative frame, Particle 1 moves with constant velocity \(u \hat{i}\) and Particle 2 moves with \(-v\cos\theta \hat{i} + v\sin\theta \hat{j}\).</p>
                    <p>Relative displacement must exactly align with relative velocity for them to collide. The relative velocity of 2 w.r.t 1 is \(-(u + v\cos\theta)\hat{i} + v\sin\theta \hat{j}\).</p>
                    <p>Since Particle 2 starts at (D, 0) and Particle 1 is at (0, H), the time taken to cover the horizontal distance is \(t = \frac{D}{u + v\cos\theta}\).</p>
                    <p>The time to cover the vertical distance is \(t = \frac{H}{v\sin\theta}\).</p>
                    <p>For a collision, these times must be equal:</p>
                    <div class="eq-block result">$$\boxed{\frac{D}{u + v\cos\theta} = \frac{H}{v\sin\theta}}$$</div>
                </div>
            </div>

            <!-- Question 3: Radius of Curvature -->
            <div class="sim-section" style="margin-bottom: 2rem;">
                <h2>Question 3: Radius of Curvature via Vector Resolution</h2>
                <p><strong>Problem:</strong> A ball is thrown with speed u at angle \(\theta\). Find the radius of curvature when its velocity makes angle \(\theta/2\) with the horizontal.</p>
                
                <div class="sim-controls">
                    <h3>Controls</h3>
                    <label>Initial Angle &theta; (&deg;): <strong id="p1-q3-theta-val">60</strong></label>
                    <input type="range" id="p1-q3-theta" min="20" max="85" step="1" value="60">
                    <label>Time t: <strong id="p1-t-val">0</strong></label>
                    <input type="range" id="p1-t" min="0" max="100" step="1" value="0">
                </div>
                
                <div class="sim-canvas-container" style="background:var(--bg-subtle); border-radius:var(--radius); border:1px solid var(--border);">
                    <canvas id="p1-q3-canvas" width="600" height="400" style="width:100%; height:auto;"></canvas>
                </div>
                
                <div class="math-section" style="margin-top: 1rem;">
                    <h3>Mathematical Solution</h3>
                    <p>The formula for radius of curvature is \(R = \frac{v^2}{a_{\perp}}\), where \(a_{\perp}\) is the component of acceleration normal to the velocity vector.</p>
                    <p>Since the only acceleration is gravity \(g\) acting downwards, when the velocity vector is at an angle \(\phi\) to the horizontal, \(a_{\perp} = g \cos\phi\).</p>
                    <p>Horizontal velocity is constant: \(v \cos\phi = u \cos\theta \implies v = \frac{u \cos\theta}{\cos\phi}\).</p>
                    <p>Therefore, \(R = \frac{(u \cos\theta / \cos\phi)^2}{g \cos\phi} = \frac{u^2 \cos^2\theta}{g \cos^3\phi}\).</p>
                    <p>Substituting \(\phi = \theta/2\):</p>
                    <div class="eq-block result">$$\boxed{R = \frac{u^2 \cos^2\theta}{g \cos^3(\theta/2)}}$$</div>
                </div>
            </div>
        </section>
'''

if 'id="page-practice-1"' not in html_content:
    html_content = html_content.replace('</main>', page_1_html + '\n    </main>')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

# Update app.js routing
with open(app_js_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

route_str = "if (link.dataset.page === 'rainman') initRainMan();"
new_route = "if (link.dataset.page === 'rainman') initRainMan();\n        if (link.dataset.page === 'practice-1') { if(window.initPractice1) initPractice1(); }\n        if (link.dataset.page === 'practice-2') { if(window.initPractice2) initPractice2(); }"

if "dataset.page === 'practice-1'" not in app_js:
    app_js = app_js.replace(route_str, new_route)
    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(app_js)

print("Injected Practice 1 HTML and routing.")
