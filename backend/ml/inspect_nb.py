import json, os

nb_path = os.path.join(os.path.dirname(__file__), 'colab_notebook.ipynb')
with open(nb_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

print(f"Total cells: {len(nb['cells'])}")
out_path = os.path.join(os.path.dirname(__file__), 'notebook_summary.txt')
with open(out_path, 'w', encoding='utf-8') as out:
    for i, cell in enumerate(nb['cells']):
        src = ''.join(cell.get('source', []))
        cell_type = cell.get('cell_type')
        out.write(f"\n================ CELL {i} ({cell_type}) ================\n")
        out.write(src)
        out.write("\n")

print("Wrote notebook_summary.txt")

