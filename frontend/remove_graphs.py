import re

html_path = 'd:/math/kinematics/frontend/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Instead of complex regex, let's find the specific markers and delete a chunk backwards to the <h3> and forwards to </svg>

def remove_graph(marker, content):
    idx = content.find(marker)
    if idx == -1:
        return content
    
    # Find the preceding <h3>Mathematical Representation</h3>
    h3_idx = content.rfind('<h3', 0, idx)
    
    # Find the closing </svg> after the marker
    svg_end = content.find('</svg>', idx)
    if svg_end != -1:
        svg_end += 6 # length of </svg>
    else:
        svg_end = idx + len(marker)
        
    if h3_idx != -1 and h3_idx > idx - 1000: # ensure it's close
        return content[:h3_idx] + content[svg_end:]
    else:
        # just remove from marker to </svg>
        return content[:idx] + content[svg_end:]

content = remove_graph('<!-- River Boat Vector Graph -->', content)
content = remove_graph('<!-- Position-Time Graph -->', content)
content = remove_graph('<!-- Vector Triangle Graph -->', content)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed graphs correctly.")
