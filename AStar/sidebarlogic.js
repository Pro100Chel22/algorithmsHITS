function closeNav(){
    document.getElementById("mySidenav").style.width = "0";
}
function openNav(){
    document.getElementById("mySidenav").style.width = "25vw";
}
export function navigation(){
    let div = document.createElement("div");
    div.setAttribute("id", "mySidenav"); div.className = "sidenav";
    let hrefs = new Array("ASTAR", "ANTS", "CLUSTER", "GENERIC", "TREE", "NEURON", "&times;");
    let links = new Array("../AStar/ASTAR.html", "../AntSimulation/ANTS.html", "../Cluster/CLUSTER.html", "../Genetic/GENETIC.html", "../Trees/SOLUTIONSTREE.html", "../NeuralNetrwork/NEURON.html", "#");
    for(let i = 1; i <= hrefs.length; i++){
        let href = document.createElement("a"); href.setAttribute("href", links[i - 1]); href.innerHTML = hrefs[i - 1];
        href.className = "as";
        if(i === hrefs.length){
            href.className = "closebtn";
            href.onclick = closeNav;
        }
        div.appendChild(href);
    }
    let spanContainer = document.createElement("div");
    spanContainer.className = "sidespan";

    let span = document.createElement("span");
    span.innerHTML = "&#9776"; span.onclick = openNav;

    spanContainer.appendChild(span);
    document.body.append(div, spanContainer);
}