import re
import os

html_path = 'd:/math/kinematics/frontend/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

page_2_html = '''
        <section id="page-practice-2" class="page">
            <div class="page-header">
                <span class="chapter-label">Chapter 12</span>
                <h1>Practice Questions II</h1>
                <p class="lead">Advanced kinematics involving pseudo-forces and continuous differential pursuit.</p>
            </div>

            <!-- Question 4: Relative Perpendicular Strike -->
            <div class="sim-section" style="margin-bottom: 2rem;">
                <h2>Question 4: The "Relative Perpendicular Strike"</h2>
                <p><strong>Problem:</strong> A wedge (angle \(\alpha\)) rests on the ground. A particle is projected towards it with velocity u at angle \(\theta\). The wedge accelerates horizontally towards the particle at \(a\). If the particle strikes the wedge exactly perpendicularly, find the time of collision.</p>
                
                <div class="sim-controls">
                    <h3>Controls</h3>
                    <button id="p2-q4-toggle" class="btn" style="width:100%; margin-bottom:1rem; padding:0.8rem; background:var(--orange); color:white; font-size:1rem; font-weight:bold;">Jump to Wedge Frame</button>
                    <button id="p2-q4-play" class="btn" style="margin-bottom:1rem;">Play Animation</button>
                    <label>Wedge Accel a: <strong id="p2-a-val">5</strong></label>
                    <input type="range" id="p2-a" min="0" max="20" step="1" value="5">
                    <label>Proj Angle &theta;: <strong id="p2-theta-val">60</strong></label>
                    <input type="range" id="p2-theta" min="30" max="85" step="1" value="60">
                    <p style="font-size:0.8rem; color:var(--text-muted);">(Wedge angle \(\alpha = 30^\circ\), u = 40)</p>
                </div>
                
                <div class="sim-canvas-container" style="background:var(--bg-subtle); border-radius:var(--radius); border:1px solid var(--border); overflow:hidden;">
                    <canvas id="p2-q4-canvas" width="600" height="400" style="width:100%; height:auto; transition: transform 1s ease-in-out;"></canvas>
                </div>
                
                <div class="math-section" style="margin-top: 1rem;">
                    <h3>Mathematical Solution</h3>
                    <p>In the wedge frame, the wedge is stationary. The particle experiences a "Pseudo-Gravity" due to the wedge's acceleration: \(\vec{g}_{\text{eff}} = \vec{g} - \vec{a}_{\text{wedge}}\).</p>
                    <p>Since the wedge accelerates towards the particle (leftwards, -x), the pseudo-force is rightwards (+x). Thus \(\vec{g}_{\text{eff}}\) has a downward component \(g\) and a rightward component \(a\).</p>
                    <p>We resolve the initial velocity and \(\vec{g}_{\text{eff}}\) along the wedge plane (x') and perpendicular to it (y'):</p>
                    <ul>
                        <li>\(u_{x'} = u \cos(\theta - \alpha)\)</li>
                        <li>\(u_{y'} = u \sin(\theta - \alpha)\)</li>
                        <li>\(g_{\text{eff}, x'} = g \sin\alpha - a \cos\alpha\) (acting down the plane)</li>
                        <li>\(g_{\text{eff}, y'} = g \cos\alpha + a \sin\alpha\) (acting into the plane)</li>
                    </ul>
                    <p>For a perpendicular strike, the velocity along the plane (\(v_{x'}\)) must be zero when it hits. The time of flight is determined by the y' motion: \(T = \frac{2 u_{y'}}{g_{\text{eff}, y'}}\).</p>
                    <div class="eq-block">$$v_{x'} = u_{x'} - g_{\text{eff}, x'} T = 0 \implies u_{x'} = g_{\text{eff}, x'} \left( \frac{2 u_{y'}}{g_{\text{eff}, y'}} \right)$$</div>
                    <p>Substituting the components gives the required relation between u, \(\theta\), a, and \(\alpha\).</p>
                </div>
            </div>

            <!-- Question 5: Symmetric Pursuit -->
            <div class="sim-section" style="margin-bottom: 2rem;">
                <h2>Question 5: The Symmetric Pursuit (Spiraling Polygons)</h2>
                <p><strong>Problem:</strong> N identical particles are at the corners of a regular polygon of side a. They move simultaneously with constant speed v, each heading directly towards the next particle. Find the time they meet and total distance traveled.</p>
                
                <div class="sim-controls">
                    <h3>Controls</h3>
                    <button id="p2-q5-play" class="btn" style="margin-bottom:1rem;">Restart Pursuit</button>
                    <label class="checkbox-label"><input type="checkbox" id="p2-q5-lines" checked> Show Polygon Connections</label>
                    <label>Number of Sides N: <strong id="p2-n-val">6</strong></label>
                    <input type="range" id="p2-n" min="3" max="12" step="1" value="6">
                    <label>Particle Speed v: <strong id="p2-v-val">2.0</strong></label>
                    <input type="range" id="p2-v" min="0.5" max="5.0" step="0.1" value="2.0">
                </div>
                
                <div class="sim-canvas-container" style="background:var(--bg-subtle); border-radius:var(--radius); border:1px solid var(--border);">
                    <canvas id="p2-q5-canvas" width="600" height="400" style="width:100%; height:auto;"></canvas>
                </div>
                
                <div class="math-section" style="margin-top: 1rem;">
                    <h3>Mathematical Solution</h3>
                    <p>At any instant, the particles form a regular polygon that rotates and shrinks. Consider Particle 1 and Particle 2. The relative velocity of approach is the component of their velocities directed towards each other.</p>
                    <p>Particle 1 moves directly towards Particle 2 with speed \(v\). Particle 2 moves towards Particle 3 with speed \(v\), at an exterior angle of \(\frac{2\pi}{N}\) to the line joining 1 and 2.</p>
                    <p>The component of Particle 2's velocity along the line 1-2 is \(v \cos(2\pi/N)\). Therefore, the rate at which the distance \(s\) between them decreases is:</p>
                    <div class="eq-block">$$-\frac{ds}{dt} = v - v \cos\left(\frac{2\pi}{N}\right) = v\left[1 - \cos\left(\frac{2\pi}{N}\right)\right]$$</div>
                    <p>Since the initial distance is \(a\) and the final distance is 0, the time \(T\) taken to meet is:</p>
                    <div class="eq-block result">$$\boxed{T = \frac{a}{v[1 - \cos(2\pi/N)]}}$$</div>
                    <p>Since each particle moves with constant speed \(v\) for time \(T\), the total distance traveled by each particle is \(D = vT = \frac{a}{1 - \cos(2\pi/N)}\).</p>
                </div>
            </div>
        </section>
'''

if 'id="page-practice-2"' not in html_content:
    html_content = html_content.replace('</main>', page_2_html + '\n    </main>')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Injected Practice 2 HTML.")
