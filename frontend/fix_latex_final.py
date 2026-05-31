import re

def fix_html_final():
    with open('d:/math/kinematics/frontend/index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace(r'\( alpha\)', r'\(\alpha\)')
    content = content.replace(r'\( \alpha\)', r'\(\alpha\)')
    content = content.replace(r' alpha\)', r'\alpha\)')
    
    content = content.replace(r'&ttheta;', r'&theta;')
    
    # tab + ext -> \text
    content = content.replace(r'	ext', r'\text')
    
    # some cases of '\t' + ext
    content = content.replace(r'\text', r'\text')

    with open('d:/math/kinematics/frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_html_final()
