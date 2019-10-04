const InventorySlot = require("./InventorySlot");


//=====================================================================================================================


class Inventory{
    constructor(){
        this.slotList = {};
    }

    hasItem(item){
        let itemfound = false;

        for(let id in this.slotList){
            if(item.id == id){
                itemfound = true;
            }
        }

        return itemfound;
    }

    addItem(item, quantity, price){
        if(this.hasItem(item))
            this.slotList[item.id].add(quantity);
        else
            this.slotList[item.id] = new InventorySlot(item, quantity, price);

        if(this.getQuantity(item) <= 0)
            delete this.slotList[item.id];
    }

    removeItem(item, quantity){
        if(this.hasItem(item))
            this.slotList[item.id].remove(quantity);

        if(this.getQuantity(item) <= 0)
            delete this.slotList[item.id];
    }

    getPrice(item){
        if(this.hasItem(item))
            return this.slotList[item.id].price;
        else
            return -1;
    }

    getQuantity(item){
        if(this.hasItem(item))
            return this.slotList[item.id].quantity;
        else
            return 0;
    }
}


//=====================================================================================================================


class MarketInventory extends Inventory{
    constructor(){
        super();
    }

    removeItem(item, quantity){
        if(this.hasItem(item))
            this.slotList[item.id].remove(quantity);
    }
}


//=====================================================================================================================


module.exports = {
    Inventory,
    MarketInventory
}