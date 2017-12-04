var fs = require('fs')
var Edge = require('./Edge.js')
var n, m
var vt
var pv, pe

function addEdge(here, there, cost, cap){
    vt[here].push(Edge(there, cost, cap, vt[there].length))
    vt[there].push(Edge(here, -cost, 0, vt[here].length - 1))
}
function solve(src, sink) {
    var flow = 0, cost = 0
    while (spfa(src, sink)) {
        var minFlow = Infinity
        for (var i = sink; i != src; i = pv[i]) {
            var prev = pv[i]
            var idx = pe[i]
            minFlow = minFlow > vt[prev][idx].cap ?  vt[prev][idx].cap : minFlow
            
        }
        for (var i = sink; i != src; i = pv[i]) {
            var prev = pv[i]
            var idx = pe[i]
            vt[prev][idx].cap -= minFlow
            vt[i][vt[prev][idx].rev].cap += minFlow
            cost += vt[prev][idx].cost*minFlow
        }
        flow += minFlow;
    }
    return{ first: flow, second: cost };
}
function spfa(src, sink) {
    var v = new Array(n+m+2)
    v.fill(0)
    var dist = new Array(n+m+2)
    dist.fill(Infinity)
    var qu = []

    qu.push(src)
    dist[src] = 0;
    v[src] = 1;
    while (qu.length) {
        var here = qu.splice(0,1)
        v[here] = 0
        for (var i = 0; i < vt[here].length; i++) {
            var there = vt[here][i].v
            var cap = vt[here][i].cap
            if (cap && dist[there] > dist[here] + vt[here][i].cost) {
                dist[there] = dist[here] + vt[here][i].cost
                pv[there] = here
                pe[there] = i
                if (!v[there]) {
                    v[there] = 1
                    qu.push(there)
                }
            }
        }
    }
    return dist[sink] != Infinity;
}

function main(rawList){
    var stream = readStream("/Users/junghyun.park/Desktop/git/MCMF/input.txt")
    n = cin(stream)
    m = cin(stream)
    vt = new Array(n+m+2)
    vt.fill(0)
    vt = vt.map(x=>{return new Array(0)})
    pv = new Array(n+m+2)
    pv.fill(-1)
    pe = new Array(n+m+2)
    pe.fill(-1)
    
    var src = n + m
    var sink = n + m + 1
    for(var i = 0; i < n; i++){
        var j
        j = cin(stream)
        while(j--){
            var a, b
            a = cin(stream)
            b = cin(stream)
            addEdge(i, a - 1 + n, b, 1)
        }
    }
    for (var i = 0; i < n; i++) addEdge(src, i, 0, 1)
    for (var i = 0; i < m; i++) addEdge(i + n, sink, 0, 1)

    res = solve(src, sink);
    console.log(` ${res.first}, ${res.second}`)
}
function readStream(path){
    var list = []
    var stream = fs.readFileSync(path)
    stream.toString().split("\n").forEach(x=>{ x.split(" ").forEach(x=>{list.push(x)}) })
    return list
}
function cin(stream){
    if(stream.length != 0){
        return Number(stream.splice(0,1)[0])
    }else{
        return ""
    }
    
}


module.exports.main = main