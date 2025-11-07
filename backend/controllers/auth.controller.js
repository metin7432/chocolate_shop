import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()
//token uretmek icin kurgulanan metod
const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

// cookie metodu ile gerekli ayarlamalar yapmak
const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

// signup metodu "kayit metodu"
export const signup = async (req, res) => {
    //1 http istek objesinden veri alma
	const { email, password, name } = req.body;
	try { //2 user varsa hata ver
		const userExists = await User.findOne({ email });

		if (userExists) { // eger varsa 
			return res.status(400).json({ message: "User already exists" }); //hata firlat
		}
        //3 var olan user yoksa olusturmak
		const user = await User.create({ name, email, password }); // req bodyden gelen degerleri dbye aktarmak

		//4 authenticate user objesinden id degeri ile token olusturmak
		const { accessToken, refreshToken } = generateTokens(user._id); // generateTokens metoduna id degeri gondererek donen degerleri ayiklamak
		await storeRefreshToken(user._id, refreshToken); // storeRefreshToken metoduna user._id ve  token degerleri vererek depolanmasi saglanir
        
        // 5 cookie degerlerine kaydetmek
		setCookies(res, accessToken, refreshToken);

        // db gonderilen degerlerin bir kopyasi json formatinda gosterilir
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message); // hata varsa firlat
		res.status(500).json({ message: error.message });
	}
};//signup end

// login metodu
export const login = async (req, res) => {
	try {
        //1 gelen http istekten email ve password almak
		const { email, password } = req.body;

        //2 databaseden kulaniciyi bulma
		const user = await User.findOne({ email });

        // 3 istekten gelen password ile dbden gelen paswordu karsilastirma
		if (user && (await user.comparePassword(password))) { // dogru ise

            // 4 token olusturma metodundan verı alma
			const { accessToken, refreshToken } = generateTokens(user._id);

            //5 usera ozel token tanımlama metodu
			await storeRefreshToken(user._id, refreshToken);

            //6 tokenları cookie aktarma metodu
			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else { //7 kullanıcı ve password hatası varsa
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) { //8 login controllerda hata varsa
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};
// login end


// logout metodu
export const logout = async (req, res) => {
	try {
        //1 istekten gelen cookiden refreshToken alma
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) { // eger varsa token

            //2 jwt dogrulamayla refreshToken ile secret degisgenini inject ederek karsilastirma
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            //3 decoded objesinden del metodunu alarak redis dbsinden tokenlari silme
			await redis.del(`refresh_token:${decoded.userId}`);
		}

        //4cookileri silem
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" }); // basarili ise logout edildigini bildir
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
//logout end
