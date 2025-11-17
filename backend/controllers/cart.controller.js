
import Product from './../models/product.model';


export const getCartProducts = async (req , res) => {
try {
    const products = await Product.find({_id: {$in: req.user.cartItems}})

    //add quantity for each product
    const cartItems = products.map((product) => {
        const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
        return {...product.toJSON(), quantity: quantity.item}
    })
    res.json(cartItems) // frontend tarafina gonderiyoruz react ile alacagiz
    
} catch (error) {
      console.log("Error in getCartProducts controller: ", error.message);
    
    res.status(500).json({message: "Server Eror", error: error.message})
}

}

export const addToCart = async (req , res) => {
try {

    const {productId} = req.body;
    const user = req.user; // as login open session  inject to request body user infos 

    //check the value
    const existingItem = user.cartItems.find(item => item.id === productId); // urunun aynisi var mı?
    if (existingItem) { // urun varsa 1 arttir
        item += 1;
    }else {
        user.cartItems.push(productId) // aksi taktirde  urun yoksa urunun product idsini cart itemsa ekle 
    }
    
    await user.save(); //DBye kayit et
    res.json(user.cartItems); // kullanicinin sepetini json olarak gonder (goruntule)
} catch (error) {
    console.log("Error in addToCat controller: ", error.message);
    
    res.status(500).json({message: "Server Eror", error: error.message})
}

}

export const removeAllFromCart = async (req, res) => {
try {
    const {productId} = req.body;
    const user = req.user;

    if (!productId) {
        user.cartItems =[]; // kullanicinin tum urun bilgilerini temizle
    }else {
        user.cartItems = user.cartItems.filter(item => item.id !== productId); // product id esit olmayani cikar digerlerini gonder
    }
    await user.save(); //kaydet
    res.json(user.cartItems) // kalan urun bilgilerini goster

} catch (error) {
    console.log("Error in removeAllFromCart controller: ", error.message);
    
    res.status(500).json({message: "Server Eror", error: error.message})
}

}

export const updateQuantity = async (req, res) => {
    try {
        const {id:productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId); 

if(existingItem) {
   if (quantity === 0) {
    user.cartItems = user.cartItems.filter(item => item.id !== productId) // productId ile esit olmayanlari user.cartItemsa aktar productId'li item ı sil
    await user.save(); // dbye productId cikarirak kaydedecek
    return res.json(user.cartItems)
}

existingItem.quantity = quantity; // existingItem quantity degerleri ata
await user.save();
res.json(user.cartItems);

}else {
res.status(404).json({message: "Product not found"});
}


} catch (error) {
    console.log("Error in updateQuantity controller: ", error.message);
    
    res.status(500).json({message: "Server Eror", error: error.message})
}

}