const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const Message = require("./models/Message");

const app = express();

app.use(cors());

// MongoDB Connect
mongoose.connect("mongodb+srv://thallaxtechnology_db_user:Zb3P1mV3v4HaFlTF@cluster0.7avlgnw.mongodb.net/websiteDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false
}));

// ✅ HOME PAGE (WITH DATA)
app.get("/", async (req, res) => {
    const messages = await Message.find().sort({ _id: -1 });
    res.render("home", { messages });
});

// ✅ SAVE MESSAGE
app.post("/send", async (req, res) => {
  await Message.create(req.body);
  res.redirect("/");
});
// ✅ API (optional)
app.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ _id: -1 });
    res.render("home", { messages });
  } catch (err) {
    res.send("Error loading page");
  }
});
// ✅ ADMIN LOGIN PAGE
app.get("/admin/login", (req, res) => {
    res.render("admin-login");
});

// ✅ ADMIN LOGIN CHECK
app.post("/admin/login", (req, res) => {
  if(req.body.username === "admin" && req.body.password === "123"){
    req.session.admin = true;
    res.redirect("/admin/dashboard");
  } else {
    res.send("Wrong Login");
  }
});

// ✅ ADMIN DASHBOARD
app.get("/admin/dashboard", async (req, res) => {
  if(!req.session.admin) return res.redirect("/admin/login");

  const messages = await Message.find().sort({ _id: -1 });
  res.render("admin-dashboard", { messages });
});

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started on ${PORT}`));
