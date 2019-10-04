const WhishListElement = require("./WhishListElement");


//=====================================================================================================================


class Villager{
    constructor(coins){
        this.coins = coins;
        this.wishList = {};
    }

    addItemToWishList(item, quantity){
        let itemfound = false;

        for(let id in this.wishList){
            if(item.id == id){
                this.wishList[id].add(quantity);
                itemfound = true;
            }
        }

        if(!itemfound)
            this.wishList[item.id] = new WhishListElement(item, quantity);
    }

    removeItemFromWishList(item, quantity){
        for(let id in this.wishList){
            if(item.id == id){
                this.wishList[id].remove(quantity);

                if(this.getQuantityInWishList(item) <= 0)
                    delete this.wishList[id];
            }
        }
    }

    getQuantityInWishList(item){
        let quantity = 0;

        for(let id in this.wishList)
            if(item.id == id)
                quantity = this.wishList[id].quantity;

        return quantity;
    }

    generateRandomWishList(itemList){
        //Get list of item IDs
        let itemListKey = Object.keys(itemList);

        //Generate random nb of item to add
        let nbItems = Math.round(Math.random()*((itemListKey.length*2)-1)+1);

        for(let i = 0; i < nbItems; i++){
            //Generate random item ID
            let rndKeyIndex = Math.round(Math.random()*((itemListKey.length-1)-1)+1);
            let rndKey = itemListKey[rndKeyIndex];
            //Get the associated item
            let rndItem = itemList[rndKey];

            //Add 1 or 2 times the item to the wishlist
            this.addItemToWishList(rndItem, Math.round(Math.random()*(2-1)+1));
        }
    }

    startShopping(players){
        let wishList = this.wishList

        setTimeout(function(){
            for(let elementId in wishList){
                let item = wishList[elementId].item;

                //Get all [player : prices]
                for(let playerId in players){
                    let player = players[playerId];
                    let itemPrice = player.inventory.getPrice(item);

                    //Sort from price min to max
                    if(itemPrice != -1){
                        let priceListEntry = {
                            playerId: playerId,
                            price: itemPrice
                        };

                        let priceListKeys = Object.keys(wishList[elementId].priceList);

                        let index = 0;
                        let placeFound = false;

                        while(!placeFound){
                            if(index >= priceListKeys.length || itemPrice < wishList[elementId].priceList[index].price){
                                wishList[elementId].priceList.splice(index, 0, priceListEntry);
                                placeFound = true;
                            }

                            index ++;
                        }
                    }
                }
            }

            //Buy
            

        }, 20000);
    }
}


//=====================================================================================================================


module.exports = Villager;