import re

def fix_html():
    with open('d:/math/kinematics/frontend/index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # The previous script might have created \ttheta
    content = content.replace(r'\ttheta', r'\theta')
    
    # Fix tab + heta or tab + theta
    content = content.replace('\theta', r'\theta')
    content = content.replace('\ttheta', r'\theta')
    
    # Fix form feed + rac -> \frac
    content = content.replace('\frac', r'\frac')
    content = content.replace('\x0crac', r'\frac')
    
    # Fix bell + lpha -> \alpha
    content = content.replace('\x07lpha', r'\alpha')
    
    # Fix backspace + oxed -> \boxed
    content = content.replace('\x08oxed', r'\boxed')

    # Fix vertical tab + ec -> \vec
    content = content.replace('\x0bec', r'\vec')
    
    # Check if there are any remaining raw tabs before heta
    content = re.sub(r'\t(t?)heta', r'\\theta', content)

    with open('d:/math/kinematics/frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_html()
