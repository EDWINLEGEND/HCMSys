import os
import glob
import re

files = glob.glob('Views/Master/*Index*.cshtml')
for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # 1. Inject the CSS if missing
    if '.action-btns .fa-edit' not in content:
        css = """    .action-btns a { margin: 0 3px; transition: opacity 0.15s; }
    .action-btns a:hover { opacity: 0.7; }
    .action-btns .fa-edit { color: #4e73df; }
    .action-btns .fa-trash-alt { color: #e74a3b; }
</style>"""
        content = content.replace('</style>', css)
    
    # 2. Add class action-btns to action column td elements
    content = content.replace('<td style="text-align: center;">', '<td class="action-btns" style="text-align: center;">')
    
    # 3. Clean up existing hardcoded grey classes
    content = content.replace('mr-2 text-gray-600', '')
    content = content.replace('mr-2 text-gray-600 ', '')
    
    with open(f, 'w') as file:
        file.write(content)

print("Fixed action buttons in all Index files.")
