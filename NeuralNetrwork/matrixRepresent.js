export function createMatrix(){
    let letters = new Array(256).join(1).split("");

    let canvas = document.getElementById("matrix");

    let height = canvas.height = 2500;
    let width = canvas.width = 5000;
    function draw(){
        canvas.getContext("2d").fillStyle = 'rgba(0,0,0,.05)';
        canvas.getContext("2d").fillRect(0, 0, width, height);
        canvas.getContext('2d').fillStyle = 'rgba(0,327,217,' + (Math.random() * 5 + 0.80) + ')';
        letters.map(function(y, index){
            let text = String.fromCharCode(65 + Math.random() * 33);
            let x = index * 10;
            canvas.getContext("2d").fillText(text, x, y);
            letters[index] = (y > 758 + Math.random()*1e4) ? 0 : y + 10;
        });
    }

    setInterval(draw, 75);
}
