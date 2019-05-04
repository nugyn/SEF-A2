export class Driver{
    constructor(thisPlayer, socket, touchInput) {
        // this.renderObject = renderObject;
        this.player = thisPlayer;
        this.socket = socket;
        this.touchInput = touchInput;
        this.moves = [];
    }

    keyListener(component) {
        var self = this;
        window.onkeyup = function(e) {
            console.log(self.socket);
            var key = e.keyCode ? e.keyCode : e.which;
            switch(key) {
                case 37:
                    /* left arrow */
                    component.moveLeft();
                    break;
                case 39:
                    /* right arrow */
                    component.moveRight();
                    break;
                case 38:
                    /* up arrow */
                    component.moveUp();
                    break;
                case 40:
                    /* down arrow */
                    component.moveDown();
                    break;
            }
            self.socket.emit("move", component.getPosition());

        }
    }

    controller(component) {
        let keyList = this.touchInput;
        let self = this;
        /* Same order as key Listener */
        keyList[0].onclick = function() {
            component.moveLeft();
            self.socket.emit("move", component.getPosition());
        }
        keyList[1].onclick = function() {
            component.moveRight();
            self.socket.emit("move", component.getPosition());
        }
        keyList[2].onclick = function() {
            component.moveUp();
            self.socket.emit("move", component.getPosition());
        }
        keyList[3].onclick = function() {
            component.moveDown();
            self.socket.emit("move", component.getPosition());
        }
    }

   
        
    AI(component){
       // socket.on("getPlayerList", playerList => {
      //      for(var i in playerList){
       //         console.log(component.name);
       //         console.log(playerList[i].name);
       //     }
    //    })
        /*console.log("Initiating AI");
        if(player.npc = true){
                let self = this;
                let smallest = 0;

            socket.on("update", playerList => 
                setInterval(function(){
                    for(var i in playerList){ 
                        if(playerList.npc == false){
                             moves = calculateDistance(playerList[i]);
                         }
                       }

                       for(var i in moves) {
                           if (moves[i] < smallest) 
                           {
                           smallest = move[i];
                           }
                       }
       
                       if(smallest.direction == 0){
                           component.moveUp();
                           self.socket.emit("move", component.getPosition());
                       }
                       else if(smallest.direction == 1){
                           component.moveDown();
                           self.socket.emit("move", component.getPosition());
                       }
                       else if(smallest.direction == 2){
                           component.moveLeft();
                           self.socket.emit("move", component.getPosition());
                       }
                       else if(smallest.direction == 3){
                           component.moveRight();
                           self.socket.emit("move", component.getPosition());
                       }
                    })     
            ) 
        } */
    }

    init() {
        this.keyListener(this.player);
        this.controller(this.player);
        this.AI(this.player);
        console.log(this.player.getPosition());
        return this.player.getPosition();
    }
}