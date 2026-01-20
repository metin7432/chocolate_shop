import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
	try {
		const productIds = req.user.cartItems.map(item => item.product);
		const products = await Product.find({ _id: { $in: productIds } });

		// add quantity for each product
		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => 
				cartItem._id === product._id.toString()
			);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};



export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find((item) => item._id === productId);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({ product: productId, quantity: 1 });
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item._id !== productId);
		}
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	console.log("myrebo", req.body);
	
	try {
		const { id} = req.params;
		const { quantity } = req.body;
		const user = req.user;
		let existingItem = user.cartItems.find((item) => item._id === id);
       
	  
	   
		if (quantity) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item._id !== id);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
