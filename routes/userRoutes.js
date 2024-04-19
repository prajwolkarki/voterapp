const express = require("express");
const router = express.Router();
const User = require("./../models/userModel");
const { jwtAuthMiddleware, generateToken } = require("./../middleware/jwt");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
    console.log("Data saved");
    const payload = {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is : ", token);
    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { citizenshipNumber, password } = req.body;
    const user = await User.findOne({ citizenshipNumber: citizenshipNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = {
      id: user.id,
   
    };
    const token = generateToken(payload);
    res.json(token);
  } catch (err) {
    console.log(err);
  }
});

router.get("/profile",jwtAuthMiddleware, async (req, res) => {
    try {
      const userData = req.user;
      console.log("UserData:", userData);
  
      const userId = userData.id;
      const user = await User.findById(userId);
      res.status(200).json({user});
    } catch (err) {
      console.log(err);
      res.status(404).json({ error: "Internal Server error" });
    }
  });



router.put("/profile/password", async (req, res) => {
  try {
    const userId = req.user;
    const {currentPassword,newPassword} = req.body;
    const user = await User.findById(userId);

    if (!(await user.comparePassword(currentPassword))) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
    user.password = newPassword;
    await user.save();
    console.log("Password Updated");
    res.status(200).json({message:"Password Updated"});
  

  }catch(err){
    console.log(err);
    res.status(404).json({error:"Internal Server error"});
  }
}
);

module.exports = router;