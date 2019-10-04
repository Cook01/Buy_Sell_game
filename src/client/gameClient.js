//Dependencies
let socket = io();

//For test purpose
socket.on("message", function(data){
    console.log(data);
});

//-----------------------------------------------------------*

let random = Math.round(Math.random() * (99 - 1) + 1); 
let pseudo = prompt("Choose a nickname", "dickHead" + random);
let myId = -1;

//-----------------------------------------------------------

//Get user inputs
function buy(itemId){
    let buyNb = document.getElementById("buy_" + itemId);
    socket.emit("Buy", itemId, buyNb.value);
}
function sell(itemId){
    let sellNb = document.getElementById("sell_" + itemId);
    socket.emit("Sell", itemId, sellNb.value);
}

function changePrice(itemId, offset){
    socket.emit("Player Change Item Price", itemId, offset);
}

//Handle Transactions Failures
socket.on("Failure", function(failureMsg){
    alert(failureMsg);
});

//-----------------------------------------------------------

//Send New Player notification to the server
socket.emit("New Player", pseudo);
//Save the player's id
socket.on("id", function(id){
    myId = id;
});

//-----------------------------------------------------------

socket.on("Update Player", function(player){
    //Get the current Inventory UI Element
    let oldInventoryUi = document.getElementById("inventory_ui");
    //Create the new UI Element
    let newInventoryUi = document.createElement('tbody');
    newInventoryUi.id = "inventory_ui";

    let coinsUi = document.getElementById("coins_ui");
    coinsUi.textContent = player.coins;

    for(let itemId in player.inventory.slotList){
        //Get the Item
        let slot = player.inventory.slotList[itemId];

        //Create a new row
        let inventoryItemRow = newInventoryUi.insertRow();

        //Create the cells
        let itemNameCell = inventoryItemRow.insertCell();
        let itemQuantityCell = inventoryItemRow.insertCell();
        let itemPriceCell = inventoryItemRow.insertCell();

        //Print the player infos
        itemNameCell.textContent = slot.item.name;
        itemQuantityCell.textContent = slot.quantity;

        itemPriceCell.innerHTML = slot.price + " <button onclick='changePrice(" + itemId + ", " + 1 + ")'>+</button><button onclick='changePrice(" + itemId + ", " + -1 + ")'>-</button>";
    }

    //switch the old UI with the new one
    oldInventoryUi.parentNode.replaceChild(newInventoryUi, oldInventoryUi);
});

socket.on("Update LeaderBoard", function(LeaderBoard){
    //Get the current Score UI Element
    let oldScoreUi = document.getElementById("score_ui");
    //Create the new UI Element
    let newScoreUi = document.createElement('tbody');
    newScoreUi.id = "score_ui";

    //For each players
    for(let id in LeaderBoard){
        //Get the Player
        let player = LeaderBoard[id];

        //Create a new row
        let playerScoreRow = newScoreUi.insertRow();

        //Create the cells
        let playerPseudoCell = playerScoreRow.insertCell();
        let playerScoreCell = playerScoreRow.insertCell();

        //Print the player infos
        playerPseudoCell.textContent = player.pseudo;
        playerScoreCell.textContent = player.score;

        //If the row is for current player
        if(id == myId)
            //Set CSS Style to bold blue in the Players tab
            playerScoreRow.setAttribute("style", "color:blue; font-weight: bold;");
    }

    //switch the old UI with the new one
    oldScoreUi.parentNode.replaceChild(newScoreUi, oldScoreUi);
});

//Update the Market
socket.on("Update Market", function(market){
    //Get the current Market UI Element
    let oldMarketUi = document.getElementById("market_ui");
    //Create the new Market UI Element
    let newMarketUi = document.createElement('tbody');
    newMarketUi.id = "market_ui";

    for(let itemId in market.slotList){
        //Get the Item
        let slot = market.slotList[itemId];

        //Create a new row
        let inventoryItemRow = newMarketUi.insertRow();

        //Create the cells
        let itemNameCell = inventoryItemRow.insertCell();
        let itemQuantityCell = inventoryItemRow.insertCell();
        let itemPriceCell = inventoryItemRow.insertCell();
        let itemBuyCell = inventoryItemRow.insertCell();
        let itemSellCell = inventoryItemRow.insertCell();

        //Print the market infos
        itemNameCell.textContent = slot.item.name;
        itemQuantityCell.textContent = slot.quantity;
        itemPriceCell.textContent = slot.price;

        itemBuyCell.innerHTML = "<input type='number', min='0', id='buy_" + itemId + "', value=0><button onclick='buy(" + itemId + ")'>Buy</button>";
        itemSellCell.innerHTML = "<input type='number', min='0', id='sell_" + itemId +"', value=0><button onclick='sell(" + itemId + ")'>Sell</button>";
    }

    //switch the old UI with the new one
    oldMarketUi.parentNode.replaceChild(newMarketUi, oldMarketUi);
});

//Update the Villagers
socket.on("Update Villagers", function(villagerList){

    console.log(villagerList);

    //Get the current Villagers UI Element
    let oldVillagersUi = document.getElementById("villagers_ui");
    //Create the new Villagers UI Element
    let newVillagersUi = document.createElement("div");
    newVillagersUi.id = "villagers_ui";

    for(let villager of villagerList){

        //New table
        let villagerTableHTML = "<table>";
        //Set caption
        villagerTableHTML += "<caption>Budget : <span style='font-weight: bold'>" + villager.coins + "</span></caption>";

        //Set the Header
        villagerTableHTML += "<thead></tr><tr><th>Item Name</th><th>Quantity</th></tr></thead>";
        //New tBody
        villagerTableHTML += "<tbody>"
        //Foreach item in wishlist
        for(let elementId in villager.wishList){
            const whishListElement = villager.wishList[elementId];

            //Create a new row
            villagerTableHTML += "<tr>";

            //Create the cells
            villagerTableHTML += "<td>" + whishListElement.item.name + "</td>";
            villagerTableHTML += "<td>" + whishListElement.quantity + "</td>";

            //Close the row
            villagerTableHTML += "</tr>";
        }
        //Close the tBody
        villagerTableHTML += "</tbody>";
        //Close the Table
        villagerTableHTML += "</table>";

        newVillagersUi.innerHTML += villagerTableHTML;
    }

    //switch the old UI with the new one
    oldVillagersUi.parentNode.replaceChild(newVillagersUi, oldVillagersUi);
});
