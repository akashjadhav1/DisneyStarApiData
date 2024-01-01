const express = require("express");
const router = express.Router();
const connectToDatabase = require("./CreateDatabase");
const User = require("./Schema");
const bcrypt = require("bcryptjs");
const { swaggerUi, swaggerSpec } = require('./swagger');



// Swagger UI endpoint
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec));




/**
 * @swagger
 * /:
 *   get:
 *     summary: Test endpoint
 *     description: Returns "My API"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/plain:
 *             example: "My API"
 */

router.get("/", async (req, res) => {
  try {
    res.send("My Api");
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with a unique username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Successfully registered
 *               status: 201
 */

router.post("/register", async (req, res) => {
  try {
   

    const { username, password } = req.body;
    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      console.log("Username already exists:", username);
      return res.status(400).send({ message: "Username already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hashPassword,
    });

    
    await newUser.save();

    
    res.status(201).send({ message: "Successfully registered", status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});




router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExisting = await User.findOne({ username: username });

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
