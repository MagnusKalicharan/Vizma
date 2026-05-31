import re

def fix_file():
    with open('d:/math/kinematics/frontend/index.html', 'r', encoding='utf-8') as f:
        text = f.read()

    # Find the Q1 Math Solution block and replace it entirely
    q1_pattern = r'<h3 style="margin-top:0;">Mathematical Solution</h3>\s*<p>In Ground Frame, both ships move.*?<p>Time \\?\(t =.*?</p>'
    q1_replacement = '''<h3 style="margin-top:0;">Mathematical Solution</h3>
                    <p>In Ground Frame, both ships move. In Ship A's frame, Ship A is stationary. The relative velocity of Ship B with respect to A is \\( \\vec{v}_{BA} = \\vec{v}_B - \\vec{v}_A \\).</p>
                    <p>\\( \\vec{v}_A = 10 \\hat{i} \\)</p>
                    <p>\\( \\vec{v}_B = -10 \\hat{i} + 10 \\hat{j} \\) (since \\( 10\\sqrt{2}\\cos 135^\\circ = -10 \\))</p>
                    <p>\\( \\vec{v}_{BA} = (-10 - 10)\\hat{i} + 10\\hat{j} = -20\\hat{i} + 10\\hat{j} \\)</p>
                    <p>The shortest distance \\( d \\) is the perpendicular dropped from A (origin) to the relative path of B. The relative path starts at (0, -100).</p>
                    <p>The angle of \\( \\vec{v}_{BA} \\) with the negative x-axis is \\( \\alpha = \\arctan(10/20) \\approx 26.56^\\circ \\).</p>
                    <p>Shortest distance \\( d_{\\min} = 100 \\cos(26.56^\\circ) = 100 \\times \\frac{2}{\\sqrt{5}} = 40\\sqrt{5} \\approx 89.44 \\text{ km} \\).</p>
                    <p>Time \\( t = \\frac{\\text{Distance along path}}{|\\vec{v}_{BA}|} = \\frac{100 \\sin(26.56^\\circ)}{\\sqrt{20^2+10^2}} = \\frac{100(1/\\sqrt{5})}{10\\sqrt{5}} = 2 \\text{ hours} \\).</p>'''
    text = re.sub(q1_pattern, lambda m: q1_replacement, text, flags=re.DOTALL)

    q2_pattern = r'<p>In a gravity-free relative frame.*?</div>'
    q2_replacement = '''<p>In a gravity-free relative frame, Particle 1 moves with constant velocity \\(u \\hat{i}\\) and Particle 2 moves with \\(-v\\cos\\theta \\hat{i} + v\\sin\\theta \\hat{j}\\).</p>
                    <p>Relative displacement must exactly align with relative velocity for them to collide. The relative velocity of 2 w.r.t 1 is \\(-(u + v\\cos\\theta)\\hat{i} + v\\sin\\theta \\hat{j}\\).</p>
                    <p>Since Particle 2 starts at (D, 0) and Particle 1 is at (0, H), the time taken to cover the horizontal distance is \\(t = \\frac{D}{u + v\\cos\\theta}\\).</p>
                    <p>The time to cover the vertical distance is \\(t = \\frac{H}{v\\sin\\theta}\\).</p>
                    <p>For a collision, these times must be equal:</p>
                    <div class="eq-block result">$$ \\boxed{\\frac{D}{u + v\\cos\\theta} = \\frac{H}{v\\sin\\theta}} $$</div>'''
    text = re.sub(q2_pattern, lambda m: q2_replacement, text, flags=re.DOTALL)

    with open('d:/math/kinematics/frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == "__main__":
    fix_file()
