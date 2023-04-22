let Dataset = [
    ["usd", "lamphat", "nctt", "slkt", "play "],
    ["TANG", "GIAM", "THAP", "TB", "THAP "],
    ["TANG", "TANG", "THAP", "TB", "CAO "],
    ["TANG", "ON DINH", "CAO", "TB", "CAO "],
    ["TANG", "TANG", "THAP", "THAP", "CAO "],
    ["TANG", "GIAM", "TB", "THAP", "CAO "],
    ["TANG", "GIAM", "CAO", "THAP", "THAP "],
    ["TB", "ON DINH", "TB", "CAO", "THAP "],
    ["TB", "GIAM", "THAP", "CAO", "THAP "],
    ["TB", "TANG", "TB", "THAP", "THAP "],
    ["TB", "ON DINH", "CAO", "TB", "CAO "],
    ["TB", "GIAM", "CAO", "CAO", "CAO "],
    ["GIAM", "ON DINH", "CAO", "THAP", "THAP "],
    ["GIAM", "GIAM", "CAO", "CAO", "CAO "],
    ["GIAM", "TANG", "CAO", "TB", "THAP "],
    ["GIAM", "TANG", "THAP", "THAP", "THAP "],
    ["GIAM", "ON DINH", "CAO", "TB", "CAO "]
];

class Node {
    constructor(name, data, predict, parent, result, child) {
        this.name = name;
        this.data = data;
        this.predict = predict;
        this.parent = parent;
        this.result = result;
        this.child = [];
    }
}

class Tree {
    constructor(Branch) {
        this.root = Branch;
    }
}

class ForEntropy {
    constructor(positive, negative, value, entropy, res) {
        this.positive = positive;
        this.negative = negative;
        this.value = value;
        this.entropy = entropy;
        this.res = res;
    }
}

const posstr = "THAP ";
const negstr = "CAO ";
let List = document.getElementById('root');
let attr = [];
let tree;

document.getElementById("BuildTree").addEventListener("click", function () {
    ClearTree();
    let Branch = getRoot();
    let ul = document.getElementById("root");
    getBranch(Branch);
    drawTree(tree.root, ul);
})

function getUniqueValues(index, dataset) {
    let values = dataset.map(data => data[index]);
    return [...new Set(values)];
}

function countUniqueValues(group, Branch) {
    let dataset = [];
    dataset = CreateAndCopyDataset(dataset, Branch.data);

    let temp = [];
    temp = getUniqueValues(group, dataset);

    for (let k = 0; k < temp.length; k++) {
        attr[k] = new ForEntropy(0, 0, temp[k], 0, 0);
    }

    for (let k = 1; k < temp.length; k++) {
        let pos = 1;
        let neg = 1;
        for (let i = 0; i < dataset.length; i++) {
            if (dataset[i][group] === attr[k].value) {
                if (dataset[i][dataset[0].length - 1] === posstr) {
                    attr[k].positive = pos++;
                }
                if (dataset[i][dataset[0].length - 1] === negstr) {
                    attr[k].negative = neg++;
                }
            }
        }
        attr[k].res = attr[k].negative + attr[k].positive;
    }
    let pos = 1;
    let neg = 1;
    for (let i = 0; i < dataset.length; i++) {
        if (dataset[i][dataset[0].length - 1] === posstr) {
            attr[0].positive = pos++;
        }
        if (dataset[i][dataset[0].length - 1] === negstr) {
            attr[0].negative = neg++;
        }
        attr[0].res = attr[0].negative + attr[0].positive;
    }
}

function Entropy(group, Branch) {
    countUniqueValues(group, Branch);
    let entropy = 0;
    let pp, pn;
    let positive;
    let negative;
    for (let i = 0; i < attr.length; i++) {
        pp = attr[i].positive / attr[i].res;
        positive = -pp * getLog(2, pp);

        pn = attr[i].negative / attr[i].res;
        negative = -pn * getLog(2, pn);
        entropy = positive + negative;
        attr[i].entropy = entropy;
        if (i !== 0) {
            attr[i].entropy = entropy * (attr[i].res / attr[0].res);
        }
    }

}

function getLog(x, y) {
    return Math.log(y) / Math.log(x);
}

function Gain(Branch) {
    let gains = [];
    let data = [];
    data = CreateAndCopyDataset(data, Branch.data);
    for (let i = 0; i < Branch.data[0].length - 1; i++) {
        Entropy(i, Branch);
        let summentr = 0;
        for (let k = 1; k < attr.length; k++) {
            if (!Number.isNaN(attr[k].entropy)) {
                summentr = summentr + attr[k].entropy;
            }
        }
        gains[i] = attr[0].entropy - summentr;
    }
    return gains;
}

function getMaxGain(Branch) {
    let gains = [];
    gains = Gain(Branch);
    let maxgain = -1;
    let maxgainattr = -1;
    for (let i = 0; i < gains.length; i++) {
        if (gains[i] > maxgain) {
            maxgainattr = i;
            maxgain = gains[i];
        }
    }
    return maxgainattr;
}

function CreateAndCopyDataset(data, dataset) {
    for (let i = 0; i < dataset.length; i++) {
        data[i] = new Array;
        for (let j = 0; j < dataset[0].length; j++) {
            data[i][j] = dataset[i][j];
        }
    }
    return data;
}

function changeData(attribut, group, dataset) {
    let data = [];
    let count = 0;
    for (let i = 0; i < dataset.length; i++) {
        data[count] = new Array();
        if (dataset[i][group] === attribut) {
            for (let c = 0; c < dataset[0].length; c++) {
                data[count][c] = dataset[i][c];
            }
            count++;
        }
        else if (i === 0) {
            for (let c = 0; c < dataset[0].length; c++) {
                data[count][c] = dataset[i][c];
            }
            count++;
        }
    }
    return data;
}

function getRoot() {
    let Branch = new Node('root', Dataset);
    tree = new Tree(Branch);
    return Branch;
}

function isLeaf(Branch) {
    let data = [];
    let county = 0;
    let countn = 0;
    data = CreateAndCopyDataset(data, Branch.data);
    for (let i = 1; i < data.length; i++) {
        if (data[i][data[0].length - 1] === posstr) {
            county++;
        }
        else if (data[i][data[0].length - 1] === negstr) {
            countn++;
        }
    }
    if (data[data.length - 1][1] === undefined) {
        if (countn === data.length - 2) {
            return true;
        }
        else if (county === data.length - 2) {
            return true;
        }
    }
    else {
        if (countn === data.length - 1) {
            return true;
        }
        else if (county === data.length - 1) {
            return true;
        }
    }

    return false;
}

function getBranch(Branch) {
    let attrIndex = getMaxGain(Branch);
    let attrib = [];
    attrib = getUniqueValues(attrIndex, Branch.data);
    console.log(Branch);

    for (let i = 1; i < attrib.length; i++) {
        let data = [];
        data = changeData(attrib[i], attrIndex, Branch.data);
        let buf = new Node(attrib[i], data, Branch, attrib[0]);

        Branch.child[Branch.child.length] = buf;
        getBranch(Branch.child[i - 1]);
    }
}

function DetourTree(node, data) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    let ul = document.createElement("ul");
    li.appendChild(ul);
    console.log(data);

    for (let j = 0; j < data.length; j++) {
        for (let i = node.child.length - 1; i >= 0; i--) {
            if (node.child[i].name !== undefined) {
                if (node.child[i].name === data[j]) {
                    if (j = data.length - 1 && node.child[i].name === data[j]) {
                        console.log(node.child[i].result);
                    }
                    DetourTree(node.child[i], ul);
                }
            }
        }
    }
}

function drawTree(node, treeEl) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    let data = [];
    data = CreateAndCopyDataset(data, node.data);

    if (isLeaf(node)) {
        node.result = data[1][data[0].length - 1];
    }

    if (node.result === undefined) {
        if (node.parent !== undefined) {
            a.textContent = node.name + "←" + node.parent;
        }
        else {
            a.textContent = node.name;
        }
    }
    else {
        a.textContent = node.name + "→" + node.result;
    }

    li.appendChild(a);
    treeEl.appendChild(li);

    if (node.child.length === 0) {
        return;
    }

    let ul = document.createElement("ul");
    li.appendChild(ul);

    for (let i = node.child.length - 1; i >= 0; i--) {
        if (node.child[i].name !== undefined) {
            drawTree(node.child[i], ul);
        }
    }
}

document.getElementById("ClearTree").addEventListener("click", function () {
    List.innerHTML = '';
});

function ClearTree() {
    List.innerHTML = '';
}
