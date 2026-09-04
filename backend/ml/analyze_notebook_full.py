import json, os

nb_path = os.path.join(os.path.dirname(__file__), 'colab_notebook.ipynb')
with open(nb_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

out_path = os.path.join(os.path.dirname(__file__), 'notebook_analysis_report.txt')
with open(out_path, 'w', encoding='utf-8') as out:
    out.write(f"TOTAL CELLS: {len(nb['cells'])}\n\n")
    for i, cell in enumerate(nb['cells']):
        src = ''.join(cell.get('source', []))
        ctype = cell.get('cell_type')
        out.write(f"--------------------------------------------------\n")
        out.write(f"CELL {i} [{ctype}]\n")
        out.write(f"--------------------------------------------------\n")
        out.write(src.strip() + "\n\n")

print("Wrote notebook_analysis_report.txt successfully!")

