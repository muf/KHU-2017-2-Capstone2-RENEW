window.addEventListener("keypress",function(e){
    if(e.key=='r' || e.key=='R'){
        run()
     }
     else if(e.key=='a' || e.key=='A'){
        mapHandler.apply()
     }
     else if(e.key=='t' || e.key=='T'){
        mapHandler.toggleNodes()
     }
     else if(e.key=='d' || e.key=='D'){
        mapHandler.toggleDrones()
     }
})