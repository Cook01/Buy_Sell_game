//Dependencies
let http = require("http");
let express = require("express");
let path = require("path");
let socketIO = require("socket.io");

//Game Engine Classes
const {
    //Inventory,
    MarketInventory,
    //InventorySlot,
    Item,
    //MarketPlace,
    Player,
    Villager
    //WhishListElement
} = require("./src/server");


//=====================================================================================================================


//Init
let app = express();
let server = http.Server(app);
let io = socketIO(server);

//Setup
app.set('port', 5000);
app.use("/client", express.static(__dirname + "/src/client"));

//Routing
app.get("/", function(request, response){
    response.sendFile(path.join(__dirname, "/src/client/html/index.html"));
});

//Server Start
server.listen(5000, function(){
    console.log("Starting server on port 5000");
});


//=====================================================================================================================


//Items
let itemList = {};

//Create Items
itemList[0] = new Item(0, "Apple");
itemList[1] = new Item(1, "Sword");
itemList[2] = new Item(2, "Shield");
itemList[3] = new Item(3, "Potion");

//Players
let players = {}

//Market
let market = new MarketInventory();

//Add Items in the Market
for(let id in itemList)
    market.addItem(itemList[id], 100, 1);

//Villagers List
let villagerList = [];

for(let i = 0; i < 1; i++){
    //New Villager (Random Starting Coins)
    let villager = new Villager(Math.round(Math.random()*(100-50)+50));
    villager.generateRandomWishList(itemList);
    villager.startShopping(players);

    villagerList.push(villager);
}


//=====================================================================================================================


//New Connection
io.on("connection", function(socket){

    //Handle New Player
    socket.on("New Player", function(pseudo){
        //Create new player
        players[socket.id] = new Player(pseudo, 100);
        //Send it's ID to the player
        socket.emit("id", socket.id);

        updateInventory(socket);
        updateLeaderBoard();
        updateMarket();
        updateVillagers();
    });

    //Handle Buy
    socket.on("Buy", function(itemId, quantity){
        let player = players[socket.id];
        let item = itemList[itemId];

        let result = player.buy(market, item, quantity);
        switch(result){
            case 1:
                updateInventory(socket);
                updateLeaderBoard();
                updateMarket();
                break;

            case 2:
                socket.emit("Failure", "Market doesn't have enought " + item.name);
                break;

            case 3:
                socket.emit("Failure", "You don't have enought coins");
                break;

            default:
                socket.emit("Failure", "An unknown error occured");
                break;
        }
    });
    
    //Handle Sell
    socket.on("Sell", function(itemId, quantity){
        let player = players[socket.id];
        let item = itemList[itemId];

        let result = player.sell(market, item, quantity);
        if(result){
            updateInventory(socket);
            updateLeaderBoard();
            updateMarket();
        } else {
            socket.emit("Failure", "You don't have enought " + item.name);
        }
    });

    socket.on("Player Change Item Price", function(itemId, offset){
        let player = players[socket.id];
        let item = itemList[itemId];
        let newPrice = player.inventory.slotList[itemId].price += offset;

        player.changePrice(item, newPrice);

        updateInventory(socket);
    });

    //Handle Player Quitting
    socket.on('disconnect', function() {
        if(players[socket.id]){
            let player = players[socket.id];

            for(let id in player.inventory.slotList){
                let slot = player.inventory.slotList[id]
                market.addItem(slot.item, player.inventory.getQuantity(slot.item), market.getPrice(slot.item));
            }
    
            delete players[socket.id];
        }
        updateLeaderBoard();
        updateMarket();
    });
});


//=====================================================================================================================

function updateLeaderBoard(){
    let LeaderBoard = {}

    for(let id in players){
        LeaderBoard[id] = {
            pseudo: players[id].pseudo,
            score: players[id].coins
        }
    }

    io.sockets.emit("Update LeaderBoard", LeaderBoard);
}

function updateMarket(){
    io.sockets.emit("Update Market", market);
}

function updateVillagers(){
    io.sockets.emit("Update Villagers", villagerList);
}

function updateInventory(socket){
    socket.emit("Update Player", players[socket.id]);
}