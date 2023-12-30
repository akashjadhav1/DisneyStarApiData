const express = require("express");
const router = express.Router();
const connectToDatabase = require("./CreateDatabase");
const Users = require("./Schema");
const bcrypt = require("bcryptjs");





router.get("/", async (req, res) => {
  try {
    const client = await connectToDatabase();
    const dbo = client.db("bookMyShow");
    const result = await dbo
      .collection("bookings")
      .find(
        {},
        { projection: { MovieName: 1, MovieTime: 1, seats: 1, _id: 1 } }
      )
      .toArray();

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await Users.findOne({ username: username });

    if (existingUser) {
      return res.status(400).send({ message: "Username already exists" });
    }
    const hashPassword =await bcrypt.hash(password, 10)
    const newUser = new Users({
      username,
      password:hashPassword,
    });

    await newUser.save();

    res.status(200).send({ message: "Successfully registered",status:201 });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/login", async (req,res)=>{

  try {
  
   
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }

})

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExisting = await Users.findOne({ username: username });

    if (userExisting) {
      const validPassword = await bcrypt.compare(password , userExisting.password)
      // Generate a JWT token for the user
      const token =await userExisting.generateAuthtoken();
      
      if (validPassword) {
        


        //cookie generate
        res.cookie("jwtcookie",token,{
          expires: new Date(Date.now()+ 86400000),
          httpOnly: true
        });


        const result  = {
          userExisting,
          token
        }
        console.log(result);
        // Send the token along with user data
        res.status(200).send({
          status:200,
          result,
        });
      } else {
        res.status(401).send({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Helper function to generate JWT token

module.exports = router;
