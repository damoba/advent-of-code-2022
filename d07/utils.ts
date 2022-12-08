export class TreeNode {
  #isFolder: boolean;
  #name: string;
  #size: number;
  #parent: TreeNode | null;
  #children: Map<string, TreeNode>;

  constructor(
    isFolder: boolean,
    name: string,
    size: number,
    parent: TreeNode | null
  ) {
    this.#isFolder = isFolder;
    this.#name = name;
    this.#size = size;
    this.#parent = parent;
    this.#children = new Map();
  }

  isFolder() {
    return this.#isFolder;
  }

  getName() {
    return this.#name;
  }

  setSize(size: number) {
    this.#size = size;
  }

  getSize() {
    return this.#size;
  }

  getParent() {
    return this.#parent;
  }

  pushChild(child: TreeNode) {
    this.#children.set(child.getName(), child);
  }

  getChild(name: string) {
    return this.#children.get(name);
  }

  getChildren() {
    return this.#children;
  }

  print() {
    console.log(
      "(",
      this.#isFolder,
      this.#name,
      this.#size,
      this.#parent?.getName(),
      ")"
    );
    if (this.#children.size > 0) {
      this.#children.forEach((child) => {
        child.print();
      });
    }
  }
}

export const parseFS = (data: string) => {
  const root = new TreeNode(true, "/", 0, null);
  const lines = data.split("\n");

  let currentFolder = root;
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(" ");
    if (parts[0] === "dir") {
      currentFolder.pushChild(new TreeNode(true, parts[1], 0, currentFolder));
    } else if (parts[0] === "$" && parts[1] === "cd" && parts[2] != "..") {
      currentFolder = currentFolder.getChild(parts[2])!;
    } else if (parts[0] === "$" && parts[1] === "cd" && parts[2] === "..") {
      currentFolder = currentFolder.getParent()!;
    } else if (parts[0] != "$") {
      currentFolder.pushChild(
        new TreeNode(false, parts[1], parseInt(parts[0], 10), currentFolder)
      );
    }
  }

  return root;
};
