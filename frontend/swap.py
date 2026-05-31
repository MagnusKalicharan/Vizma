import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Swap in navbar
nav_vectors = '<li><a href="#" class="nav-link active" data-page="vectors"><span class="nav-num">01</span> Vector Addition</a></li>\n            <li><a href="#" class="nav-link" data-page="products"><span class="nav-num">02</span> Dot & Cross Products</a></li>'
nav_products = '<li><a href="#" class="nav-link active" data-page="products"><span class="nav-num">01</span> Dot & Cross Products</a></li>\n            <li><a href="#" class="nav-link" data-page="vectors"><span class="nav-num">02</span> Vector Addition</a></li>'

if nav_vectors in content:
    content = content.replace(nav_vectors, nav_products)

# Extract sections
# Find start of vectors
vec_start = content.find('<section id="page-vectors"')
prod_start = content.find('<section id="page-products"')

if vec_start != -1 and prod_start != -1:
    # Find end of vectors section
    vec_end = content.find('</section>', vec_start) + len('</section>')
    # Find end of products section
    prod_end = content.find('</section>', prod_start) + len('</section>')
    
    vectors_html = content[vec_start:vec_end]
    products_html = content[prod_start:prod_end]
    
    # Change active classes
    vectors_html = vectors_html.replace('class="page active-page"', 'class="page"').replace('Chapter 01', 'Chapter 02')
    products_html = products_html.replace('class="page"', 'class="page active-page"').replace('Chapter 02', 'Chapter 01')
    
    # Swap them
    full_block = content[vec_start:prod_end]
    
    # Construct new block
    middle = content[vec_end:prod_start]
    
    new_block = products_html + middle + vectors_html
    
    content = content[:vec_start] + new_block + content[prod_end:]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Successfully swapped sections!')
else:
    print('Could not find sections.')
