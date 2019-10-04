class WhishListElement{
    constructor(item, quantity){
        this.item = item;
        this.quantity = quantity;

        this.priceList = [];
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


module.exports = WhishListElement;