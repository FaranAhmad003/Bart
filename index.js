const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const speakeasy = require("speakeasy");
const session = require("express-session");
const app = express();
const port = 3000;
const { setUsername, getUsername } = require("./userdata");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const WebSocket = require("ws");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const nodemailer = require("nodemailer");

 const server = http.createServer(app);
 const io = new Server(server);
require("dotenv").config();
// Middleware to parse JSON in the request body
app.use(bodyParser.json());
app.use(
  session({
    secret: "your-secret-key", // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(__dirname));
app.use(express.static(".")); // Serve static files from the current directory
// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "Flywings",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Serve the HTML page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});
app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/graphs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Graphs.html"));
});
// Route to print the entire 'user' table
app.get("/printTable", (req, res) => {
  connection.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.error("Error fetching data from user table:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("User table data:", results);
      res.json(results);
    }
  });
});
app.get("/signupSuccess", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
// Handle signup POST request
app.post("/signup", (req, res) => {
  const formData = req.body;

  // Check if the email ends with '@gmail.com'
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "lhr.nu.edu.pk",
    "icloud.com",
  ];
  const emailDomain = formData.email.split("@")[1];
  if (!allowedDomains.includes(emailDomain)) {
    return res.status(400).json({
      error: "Invalid email address. Only Gmail addresses are allowed.",
    });
  }
  if (!isPasswordComplex(formData.password)) {
    return res.status(400).json({
      error:
        "Password must contain at least one capital letter, one numeric character, and one special character.",
    });
  }

  const secretKey = speakeasy.generateSecret({ length: 20 }).base32;
  connection.query(
    "INSERT INTO user (first_name, last_name, username, password, email, phone_no, secret_key) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      formData.firstName,
      formData.lastName,
      formData.username,
      formData.password,
      formData.email,
      formData.phoneNo,
      secretKey,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting data into user table:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("Inserted data into user table:", results);
        // Send both success message and secret key in the response
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "chatbotx092@gmail.com",
            pass: "vlep zify kiem sntq", // Replace with your actual App Password
          },
        });

        const mailOptions = {
          from: "chatbotx092@gmail.com",
          to: formData.email,
          subject: "Your Secret Key",
          html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        /* Your CSS styles here */
      </style>
    </head>
    <body>
      <h1>Welcome, ${formData.firstName}!</h1>
      <p>Your signup was successful.</p>
      <p>Here's your secret key: ${secretKey}</p>
      <p>Keep this key safe.</p>
    </body>
    </html>
  `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
        res.json({ message: "Signup successful!", secretKey: secretKey });
      }
    }
  );
});

function isPasswordComplex(password) {
  // Regular expressions to check for the required conditions
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumeric = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Check if all conditions are met
  return hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
}
app.get("/usernames", (req, res) => {
  connection.query(
    'SELECT username FROM user where user_type = "client"',
    (err, results) => {
      if (err) {
        console.error("Error fetching usernames:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        // Extract usernames from the results
        const usernames = results.map((row) => row.username);
        res.json(usernames);
      }
    }
  );
});


app.post("/login", (req, res) => {
  const formData = req.body;

  // Query the database for the username
  connection.query(
    "SELECT * FROM user WHERE username = ?",
    [formData.username],
    (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        // No user found with that username
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Define user from the results
      const user = results[0];

      // Authentication successful, proceed to send response and email
      res.json({
        success: true,
        message: "Login successful!",
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      });

      // Email setup and sending process
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "chatbotx092@gmail.com",
          pass: "vlep zify kiem sntq", // Ensure this is securely stored
        },
      });

      const mailOptions = {
        from: "chatbotx092@gmail.com",
        to: user.email,
        subject: "Welcome back",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              /* Your CSS styles here */
            </style>
          </head>
          <body>
            <h1>Welcome, ${user.first_name}!</h1>
            <p>Login Successful.</p>
            <p>Welcome to BART again</p>  
          </body>
          </html>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }
  );
});

// Approve or disapprove tickets
app.get("/forgotPassword", (req, res) => {
  res.sendFile(__dirname + "/public/forgotPasswordEmailEntry.html");
});
app.get("/otpVerification", (req, res) => {
  res.sendFile(__dirname + "/public/otpVerification.html");
});
app.post("/forgotPassword", (req, res) => {
  const usernameOrEmail = req.body.usernameOrEmail;

  // Query the 'user' table to check if the username or email exists
  connection.query(
    "SELECT * FROM user WHERE username = ? OR email = ?",
    [usernameOrEmail, usernameOrEmail],
    (err, results) => {
      if (err) {
        console.error("Error checking username or email:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length > 0) {
          // User found
          const user = results[0];

          // Store the user's Google Authenticator secret key in the session (you may use a more secure storage mechanism)
          req.session.userSecretKey = user.secret_key;
          req.session.userId = user.id;

          // Generate a one-time password (OTP) using speakeasy and user's secret key
          const otp = speakeasy.totp({
            secret: user.secret_key,
            encoding: "base32",
          });

          // You can send the OTP to the user via email or other means

          // Send a success response back to the HTML page
          res.json({ success: true });
        } else {
          // User not found
          console.log("User not found");
          res.status(404).json({ error: "User not found" });
        }
      }
    }
  );
});
app.post("/verifyOTP", (req, res) => {
  const enteredOTP = req.body.enteredOTP;

  // Retrieve the user's Google Authenticator secret key from the session (you may use a more secure storage mechanism)
  const userSecretKey = req.session.userSecretKey;

  // Verify the entered OTP against the user's secret key
  const verificationResult = speakeasy.totp.verify({
    secret: userSecretKey,
    encoding: "base32",
    token: enteredOTP,
  });

  if (verificationResult) {
    // OTP is valid
    console.log("OTP verification successful!");
    res.json({ success: true });
    // You can redirect the user to a password reset page or perform other actions
  } else {
    // OTP is invalid
    console.log("Invalid OTP");
    res.status(401).json({ error: "Invalid OTP" });
  }
});
app.get("/setNewPassword", (req, res) => {
  res.sendFile(__dirname + "/public/setNewPassword.html");
});
app.post("/setNewPassword", (req, res) => {
  const newPassword = req.body.newPassword;

  // You need to identify the user for whom the password is being set
  // For example, you can use the user's session or another form of identification

  // For demonstration purposes, let's assume you have stored the user's ID in the session
  const userId = req.session.userId;

  if (userId) {
    // Update the user's password in the database
    connection.query(
      "UPDATE user SET password = ? WHERE id = ?",
      [newPassword, userId],
      (err, results) => {
        if (err) {
          console.error("Error updating password:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Password updated successfully");
          res.json({ success: true });
        }
      }
    );
  } else {
    // User not authenticated (session expired, etc.)
    console.log("User not authenticated");
    res.status(401).json({ error: "User not authenticated" });
  }
});
app.post("/login", (req, res) => {
  const formData = req.body;
  connection.query(
    "SELECT * FROM user WHERE username = ? AND password = ?",
    [formData.username, formData.password],
    (err, results) => {
      if (err) {
        console.error("Error checking login credentials:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        const user = results[0];
        console.log("User logged in successfully:", user);

        // Store user information in the session (for any type of user)
        req.session.userInfo = {
          username: user.username,
          user_type: user.user_type,
        };

        return res.json({ success: true });
      } else {
        // Login failed
        console.log("Invalid username or password");
        return res.status(401).json({ error: "Invalid username or password" });
      }
    }
  );
});

const cryptoList = [
  { symbol: "ETH", url: "wss://stream.binance.com:9443/ws/ethusdt@trade" },
  { symbol: "BTC", url: "wss://stream.binance.com:9443/ws/btcusdt@trade" },
  { symbol: "DOGE", url: "wss://stream.binance.com:9443/ws/dogeusdt@trade" },
];
cryptoList.forEach(({ symbol, url }) => {
  const ws = new WebSocket(url);

  ws.on("message", (data) => {
    const { p: price } = JSON.parse(data);
    io.emit(symbol, { symbol, price });
  });
});


//gemini response generating here
app.post("/generate-text", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.send({ message: text });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).send({ error: "Error generating text" });
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for messages sent from the client
  socket.on("chatMessage", (msg) => {
    console.log("Message Received: " + msg);

    // You can process the message here or send a response back
    const responseMessage = `Received your message: ${msg}`;

    // Emit a response back to the client
    socket.emit("chatResponse", responseMessage);
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



