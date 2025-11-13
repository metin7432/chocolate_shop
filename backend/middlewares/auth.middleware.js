
import  jwt  from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protectRoute = async(req,res,next) => {

    try {
        
        const accessToken = req.cookies.accessToken; // istekten gelen cookie objeden accessTokeni degisgene aktar
        if (!accessToken) { // token yok ise hata firlat
            res.status(401).json({message: "Unauthorized - No access token provided."});
        }; 

     
         try {
           const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) { // user yoksa hata firlat
             res.status(401).json({message: "User not found."});
        }

        req.user = user // req objesine user bilgilerini ekle
        next() // routedaki bir sonraki middleware metoda gec
         }
       catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({message: "Unauthorized - No access token expired."});
            
        }
      }
        
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(401).json({message: "Unauthorized - No access token provided."});
    }

}

export const adminRoute = async(req,res,next) => {
if (req.user && req.user.role === "admin") {
    next()
}else {
    res.status(403).json({message: "Access denied - Admin Only"});
}


}