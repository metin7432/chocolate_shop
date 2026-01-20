import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Product from '../models/product.model.js';

const userSchema = mongoose.Schema(
    {
    name : {
        type:String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "password must be at least 6 charcters long"]
 },
 cartItems: [
    {
        quantity: {
        type: Number,
        default: 1
         },
         product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Product
         }
    }
 ],
 role: {
    type: String,
    enum: ["costumer","admin"], // ya costumer olacak ya da admin
    default: "costumer"
 },

},
//createdAt and updatedAt 
{
timestamps: true
}
);

// kayit oncesi hook ile passwordu hashliyoruz database kayydetmeden once
 
// şemaya metot ekeleniyor
 userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

 export default User;