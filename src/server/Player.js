const { Inventory } = require("./Inventory");


//=====================================================================================================================


class Player{
    constructor(pseudo, startingCoins){
        this.pseudo = pseudo;
        this.coins = startingCoins;
        this.inventory = new Inventory();
    }

    buy(market, item, quantity){
        let slot = market.slotList[item.id];
        let buyOrderPrice = slot.price * quantity;

        if(this.coins >= buyOrderPrice){
            if(market.hasItem(item) && market.getQuantity(item) >= quantity){
                this.coins -= parseInt(buyOrderPrice);

                this.inventory.addItem(slot.item, quantity, slot.price);
                market.removeItem(slot.item, quantity);

                return 1; //Success
            } else {
                return 2; //Not enought Item in market
            }
        } else {
            return 3; //Not enought money
        }
    }

    sell(market, item, quantity){
        let slot = this.inventory.slotList[item.id]

        if(this.inventory.hasItem(item) && this.inventory.getQuantity(item) >= quantity){
            this.coins += parseInt(slot.price * quantity);

            this.inventory.removeItem(slot.item, quantity);
            market.addItem(slot.item, quantity, slot.price);

            return true;
        } else {
            return false;
        }
    }

    changePrice(item, newPrice){
        if(this.inventory.hasItem(item)){
            if(newPrice < 0)
                newPrice = 0;

            this.inventory.slotList[item.id].price = newPrice;
        }
    }
}


//=====================================================================================================================


module.exports = Player;