const cors = require("cors");
app.use(cors());
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const Message = require("./models/Message");

const app = express();

// MongoDB Connect
mongoose.connect("mongodb+srv://thallaxtechnology_db_user:Zb3P1mV3v4HaFlTF@cluster0.7avlgnw.mongodb.net/websiteDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false
}));

// WEBSITE HOME
app.get("/", (req, res) => {
    res.render("home");
});

// SAVE MESSAGE
app.post("/send-message", async (req, res) => {
    await Message.create(req.body);
    res.redirect("/");
});
// GET ALL MESSAGES (for dashboard)
app.get("/api/get", async (req, res) => {
  try {
    const data = await Message.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ADMIN LOGIN PAGE
app.get("/admin/login", (req, res) => {
    res.render("admin-login");
});

// Admin Login Check
app.post("/admin/login", (req, res) => {
  if(req.body.username === "admin" && req.body.password === "123"){
    req.session.admin = true;
    res.redirect("/admin/dashboard");
  } else {
    res.send("Wrong Login");
  }
});

// Admin Dashboard
app.get("/admin/dashboard", async (req, res) => {
  if(!req.session.admin) return res.redirect("/admin/login");

  const messages = await Message.find().sort({ createdAt: -1 });
  res.render("admin-dashboard", { messages });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started on ${PORT}`));
