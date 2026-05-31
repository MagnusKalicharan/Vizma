import re

def fix_html():
    with open('d:/math/kinematics/frontend/index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix the \theta and \alpha issues
    content = content.replace(r'\(	heta\)', r'\(\theta\)')
    content = content.replace(r'\( lpha\)', r'\(\alpha\)')
    
    # Also fix some other possible escapes if present
    content = content.replace('heta', 'theta') # just in case there's raw 'heta'
    content = content.replace('lpha', 'alpha')

    # 2. Fix the headings
    # We want to change:
    # <h2>Question 1: The "Shortest Distance" Relative Velocity Trap</h2>
    # <p style="..."><strong>Problem:</strong>
    # to:
    # <h2>Question 1</h2>
    # <p style="...">
    
    # Find all <h2>Question \d:.*?</h2> and replace with <h2>Question \d</h2>
    content = re.sub(r'<h2>(Question \d+):.*?</h2>', r'<h2>\1</h2>', content)
    
    # Remove <strong>Problem:</strong> 
    content = content.replace('<strong>Problem:</strong> ', '')

    with open('d:/math/kinematics/frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_html()
