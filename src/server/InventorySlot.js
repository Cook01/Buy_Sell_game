class InventorySlot{
    constructor(item, quantity, price){
        this.item = item;
        this.quantity = parseInt(quantity);
        this.price = parseInt(price);
    }

    add(quantity){
        this.quantity += parseInt(quantity);
    }
    remove(quantity){
        this.quantity -= parseInt(quantity);

        if(quantity < 0)
            quantity = 0;
    }
}


//=====================================================================================================================


module.exports = InventorySlot;