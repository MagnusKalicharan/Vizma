import re

html_path = 'd:/math/kinematics/frontend/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I need to cleanly replace the sections while preserving the end tags.
idx1 = content.find('<section id="page-practice-1"')
idx2 = content.find('</main>')

if idx1 != -1 and idx2 != -1:
    header = content[:idx1]
    footer = content[idx2:]
else:
    print("Error: Could not find sections.")
    exit(1)

new_content = '''
        <section id="page-practice-1" class="page">
            <div class="page-header">
                <span class="chapter-label">Chapter 11</span>
                <h1>Practice Questions I</h1>
                <p class="lead">Advanced problems utilizing relative frames and vector resolution.</p>
            </div>

            <!-- Question 1 -->
            <div style="margin-bottom: 3rem; background: var(--bg); padding: 2rem; border-radius: var(--radius); border: 1px solid var(--border);">
                <h2>Question 1: The "Shortest Distance" Relative Velocity Trap</h2>
                
                <!-- Description -->
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem;"><strong>Problem:</strong> Ship A is located at the origin (0,0) moving due East with velocity 10 km/h. Ship B is located 100 km due South of A (0, -100) moving North-West (135&deg;) with velocity \(10\sqrt{2}\) km/h. Find the shortest distance between them and the time taken.</p>
                
                <!-- Solution -->
                <div class="math-section" style="margin-bottom: 1.5rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius);">
                    <h3 style="margin-top:0;">Mathematical Solution</h3>
                    <p>In Ground Frame, both ships move. In Ship A's frame, Ship A is stationary. The relative velocity of Ship B with respect to A is \(\vec{v}_{BA} = \vec{v}_B - \vec{v}_A\).</p>
                    <p>\(\vec{v}_A = 10 \hat{i}\)</p>
                    <p>\(\vec{v}_B = -10 \hat{i} + 10 \hat{j}\) (since \(10\sqrt{2}\cos 135^\circ = -10\))</p>
                    <p>\(\vec{v}_{BA} = (-10 - 10)\hat{i} + 10\hat{j} = -20\hat{i} + 10\hat{j}\)</p>
                    <p>The shortest distance \(d\) is the perpendicular dropped from A (origin) to the relative path of B. The relative path starts at (0, -100).</p>
                    <p>The angle of \(\vec{v}_{BA}\) with the negative x-axis is \(\alpha = \arctan(10/20) \approx 26.56^\circ\).</p>
                    <p>Shortest distance \(d_{\min} = 100 \cos(26.56^\circ) = 100 \times \frac{2}{\sqrt{5}} = 40\sqrt{5} \approx 89.44 \text{ km}\).</p>
                    <p>Time \(t = \frac{\text{Distance along path}}{|\vec{v}_{BA}|} = \frac{100 \sin(26.56^\circ)}{\sqrt{20^2+10^2}} = \frac{100(1/\sqrt{5})}{10\sqrt{5}} = 2 \text{ hours}\).</p>
                </div>

                <!-- Animation and Controls -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius); border: 1px solid var(--border);">
                        <h3 style="margin-top:0;">Interactive Simulation</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; align-items: center;">
                            <button id="p1-q1-toggle" class="btn" style="padding:0.8rem; background:var(--blue); color:white; font-size:1rem; font-weight:bold;">Switch to Ship A Frame</button>
                            <label style="margin-left:auto;">Ship A Speed (East): <strong id="p1-va-val">10</strong></label>
                            <input type="range" id="p1-va" min="0" max="30" step="1" value="10">
                            <label>Ship B Speed (NW): <strong id="p1-vb-val">14.14</strong></label>
                            <input type="range" id="p1-vb" min="0" max="30" step="0.1" value="14.14">
                            <label>Ship B Angle (&deg;): <strong id="p1-theta-val">135</strong></label>
                            <input type="range" id="p1-theta" min="90" max="180" step="1" value="135">
                        </div>
                        <div style="border:1px solid var(--border); border-radius: var(--radius); overflow: hidden;">
                            <canvas id="p1-q1-canvas" width="800" height="400" style="width:100%; height:auto; display: block; background: #fff;"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Question 2 -->
            <div style="margin-bottom: 3rem; background: var(--bg); padding: 2rem; border-radius: var(--radius); border: 1px solid var(--border);">
                <h2>Question 2: Mid-Air Collision of Two Projectiles</h2>
                
                <!-- Description -->
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem;"><strong>Problem:</strong> Particle 1 is projected from height H horizontally with speed u. Particle 2 is projected from the ground at horizontal distance D, aimed towards the tower with speed v at angle \(\theta\). If they collide, find the relation between H, D, v, \(\theta\).</p>
                
                <!-- Solution -->
                <div class="math-section" style="margin-bottom: 1.5rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius);">
                    <h3 style="margin-top:0;">Mathematical Solution</h3>
                    <p>In a gravity-free relative frame, Particle 1 moves with constant velocity \(u \hat{i}\) and Particle 2 moves with \(-v\cos\theta \hat{i} + v\sin\theta \hat{j}\).</p>
                    <p>Relative displacement must exactly align with relative velocity for them to collide. The relative velocity of 2 w.r.t 1 is \(-(u + v\cos\theta)\hat{i} + v\sin\theta \hat{j}\).</p>
                    <p>Since Particle 2 starts at (D, 0) and Particle 1 is at (0, H), the time taken to cover the horizontal distance is \(t = \frac{D}{u + v\cos\theta}\).</p>
                    <p>The time to cover the vertical distance is \(t = \frac{H}{v\sin\theta}\).</p>
                    <p>For a collision, these times must be equal:</p>
                    <div class="eq-block result">$$\boxed{\frac{D}{u + v\cos\theta} = \frac{H}{v\sin\theta}}$$</div>
                </div>

                <!-- Animation and Controls -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius); border: 1px solid var(--border);">
                        <h3 style="margin-top:0;">Interactive Simulation</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; align-items: center;">
                            <button id="p1-q2-toggle" class="btn" style="padding:0.8rem; background:var(--green); color:white; font-size:1rem; font-weight:bold;">Turn Off Gravity (Relative Frame)</button>
                            <button id="p1-q2-play" class="btn">Play Animation</button>
                            <label style="margin-left:auto;">u (Particle 1): <strong id="p1-u-val">10</strong></label>
                            <input type="range" id="p1-u" min="0" max="30" step="1" value="10">
                            <label>v (Particle 2): <strong id="p1-v-val">25</strong></label>
                            <input type="range" id="p1-v" min="0" max="50" step="1" value="25">
                            <label>Angle &theta; (&deg;): <strong id="p1-q2-theta-val">60</strong></label>
                            <input type="range" id="p1-q2-theta" min="10" max="80" step="1" value="60">
                        </div>
                        <div style="border:1px solid var(--border); border-radius: var(--radius); overflow: hidden;">
                            <canvas id="p1-q2-canvas" width="800" height="400" style="width:100%; height:auto; display: block; background: #fff;"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Question 3 -->
            <div style="margin-bottom: 3rem; background: var(--bg); padding: 2rem; border-radius: var(--radius); border: 1px solid var(--border);">
                <h2>Question 3: Radius of Curvature via Vector Resolution</h2>
                
                <!-- Description -->
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem;"><strong>Problem:</strong> A ball is thrown with speed u at angle \(\theta\). Find the radius of curvature when its velocity makes angle \(\theta/2\) with the horizontal.</p>
                
                <!-- Solution -->
                <div class="math-section" style="margin-bottom: 1.5rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius);">
                    <h3 style="margin-top:0;">Mathematical Solution</h3>
                    <p>The formula for radius of curvature is \(R = \frac{v^2}{a_{\perp}}\), where \(a_{\perp}\) is the component of acceleration normal to the velocity vector.</p>
                    <p>Since the only acceleration is gravity \(g\) acting downwards, when the velocity vector is at an angle \(\phi\) to the horizontal, \(a_{\perp} = g \cos\phi\).</p>
                    <p>Horizontal velocity is constant: \(v \cos\phi = u \cos\theta \implies v = \frac{u \cos\theta}{\cos\phi}\).</p>
                    <p>Therefore, \(R = \frac{(u \cos\theta / \cos\phi)^2}{g \cos\phi} = \frac{u^2 \cos^2\theta}{g \cos^3\phi}\).</p>
                    <p>Substituting \(\phi = \theta/2\):</p>
                    <div class="eq-block result">$$\boxed{R = \frac{u^2 \cos^2\theta}{g \cos^3(\theta/2)}}$$</div>
                </div>

                <!-- Animation and Controls -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius); border: 1px solid var(--border);">
                        <h3 style="margin-top:0;">Interactive Simulation</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; align-items: center;">
                            <label>Initial Angle &theta; (&deg;): <strong id="p1-q3-theta-val">60</strong></label>
                            <input type="range" id="p1-q3-theta" min="20" max="85" step="1" value="60">
                            <label>Time t: <strong id="p1-t-val">0</strong></label>
                            <input type="range" id="p1-t" min="0" max="100" step="1" value="0">
                        </div>
                        <div style="border:1px solid var(--border); border-radius: var(--radius); overflow: hidden;">
                            <canvas id="p1-q3-canvas" width="800" height="400" style="width:100%; height:auto; display: block; background: #fff;"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="page-practice-2" class="page">
            <div class="page-header">
                <span class="chapter-label">Chapter 12</span>
                <h1>Practice Questions II</h1>
                <p class="lead">Advanced kinematics involving pseudo-forces and continuous differential pursuit.</p>
            </div>

            <!-- Question 4 -->
            <div style="margin-bottom: 3rem; background: var(--bg); padding: 2rem; border-radius: var(--radius); border: 1px solid var(--border);">
                <h2>Question 4: The "Relative Perpendicular Strike"</h2>
                
                <!-- Description -->
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem;"><strong>Problem:</strong> A wedge (angle \(\alpha\)) rests on the ground. A particle is projected towards it with velocity u at angle \(\theta\). The wedge accelerates horizontally towards the particle at \(a\). If the particle strikes the wedge exactly perpendicularly, find the time of collision.</p>
                
                <!-- Solution -->
                <div class="math-section" style="margin-bottom: 1.5rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius);">
                    <h3 style="margin-top:0;">Mathematical Solution</h3>
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
                </div>

                <!-- Animation and Controls -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius); border: 1px solid var(--border);">
                        <h3 style="margin-top:0;">Interactive Simulation</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; align-items: center;">
                            <button id="p2-q4-toggle" class="btn" style="padding:0.8rem; background:var(--orange); color:white; font-size:1rem; font-weight:bold;">Jump to Wedge Frame</button>
                            <button id="p2-q4-play" class="btn">Play Animation</button>
                            <label style="margin-left:auto;">Wedge Accel a: <strong id="p2-a-val">5</strong></label>
                            <input type="range" id="p2-a" min="0" max="20" step="1" value="5">
                            <label>Proj Angle &theta;: <strong id="p2-theta-val">60</strong></label>
                            <input type="range" id="p2-theta" min="30" max="85" step="1" value="60">
                        </div>
                        <div style="border:1px solid var(--border); border-radius: var(--radius); overflow: hidden;">
                            <canvas id="p2-q4-canvas" width="800" height="400" style="width:100%; height:auto; display: block; background: #fff; transition: transform 1s ease-in-out;"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Question 5 -->
            <div style="margin-bottom: 3rem; background: var(--bg); padding: 2rem; border-radius: var(--radius); border: 1px solid var(--border);">
                <h2>Question 5: The Symmetric Pursuit (Spiraling Polygons)</h2>
                
                <!-- Description -->
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem;"><strong>Problem:</strong> N identical particles are at the corners of a regular polygon of side a. They move simultaneously with constant speed v, each heading directly towards the next particle. Find the time they meet and total distance traveled.</p>
                
                <!-- Solution -->
                <div class="math-section" style="margin-bottom: 1.5rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius);">
                    <h3 style="margin-top:0;">Mathematical Solution</h3>
                    <p>At any instant, the particles form a regular polygon that rotates and shrinks. Consider Particle 1 and Particle 2. The relative velocity of approach is the component of their velocities directed towards each other.</p>
                    <p>Particle 1 moves directly towards Particle 2 with speed \(v\). Particle 2 moves towards Particle 3 with speed \(v\), at an exterior angle of \(\frac{2\pi}{N}\) to the line joining 1 and 2.</p>
                    <p>The component of Particle 2's velocity along the line 1-2 is \(v \cos(2\pi/N)\). Therefore, the rate at which the distance \(s\) between them decreases is:</p>
                    <div class="eq-block">$$-\frac{ds}{dt} = v - v \cos\left(\frac{2\pi}{N}\right) = v\left[1 - \cos\left(\frac{2\pi}{N}\right)\right]$$</div>
                    <p>Since the initial distance is \(a\) and the final distance is 0, the time \(T\) taken to meet is:</p>
                    <div class="eq-block result">$$\boxed{T = \frac{a}{v[1 - \cos(2\pi/N)]}}$$</div>
                </div>

                <!-- Animation and Controls -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius); border: 1px solid var(--border);">
                        <h3 style="margin-top:0;">Interactive Simulation</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; align-items: center;">
                            <button id="p2-q5-play" class="btn">Restart Pursuit</button>
                            <label class="checkbox-label"><input type="checkbox" id="p2-q5-lines" checked> Show Polygon Connections</label>
                            <label style="margin-left:auto;">Number of Sides N: <strong id="p2-n-val">6</strong></label>
                            <input type="range" id="p2-n" min="3" max="12" step="1" value="6">
                            <label>Particle Speed v: <strong id="p2-v-val">2.0</strong></label>
                            <input type="range" id="p2-v" min="0.5" max="5.0" step="0.1" value="2.0">
                        </div>
                        <div style="border:1px solid var(--border); border-radius: var(--radius); overflow: hidden;">
                            <canvas id="p2-q5-canvas" width="800" height="400" style="width:100%; height:auto; display: block; background: #fff;"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </section>
'''

content = header + new_content + footer

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed layout of practice chapters.")
