let upload = document.getElementById("upload");
const textInput = document.getElementById('textInput');

let files = upload.files;
let test = document.getElementById('textdata');

document.getElementById("DetourButton").addEventListener("click", function() {
    let data = [];
    data = parseCSVtoArray(test.value);
    DetourTree(tree.root, data);
})


function parseCSVtoMatrix(strCSV) {
    let buff = parseCSV(strCSV);
    return transformToMatrix(buff);
}

function parseCSVtoArray(strCSV) {
    let data = []
    let regex = /("([^"]|"")*"|([^",\n]*))?(,|\n)?/
    let size = 0;
    let check = false;
    while (regex.test) {
        let buff = regex.exec(strCSV);
        if (buff[0] === "") {
            break;
        }
        let current = buff[1]
        if (buff[1][0] === '"') {
            current = "";
            for (let i = 1; i < buff[1].length - 1; i++) {
                current += buff[1][i];
            }
        }
        data[data.length] = current
        if ((!check) && (buff[4] === '\n')) {
            check = true;
            size++;
        }
        else {
            if (!check) {
                size++;
            }
        }
        strCSV = strCSV.replace(regex, "")
    }

    data[data.length] = size;
    return data;
}

function transformToMatrix(array) {
    let matrix = []
    let count = 0;
    for (let i = 0; i < (array.length - 1) / array[array.length - 1]; i++) {
        matrix[i] = []
        for (let j = 0; j < array[array.length - 1]; j++) {
            matrix[i][j] = array[count];
            count++;
        }
    }
    return matrix;
}