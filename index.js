const express = require("express");
const axios = require("axios");
const web = require("./web.json");
const cors = require("cors");
const app = express();
const fs = require("fs-extra");
const session = require("express-session");
const bodyParser = require("body-parser");
const { AuthRoutes } = require("./routes/auth");
const path = require("path");
const cheerio = require("cheerio");

app.use(express.static(__dirname + "/views/login"));
app.use(express.static(__dirname + "/views/home"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "secret-key",
    saveUninitialized: false,
    resave: false,
  })
);
// ejs
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", AuthRoutes, (req, res) => {
  res.render(path.join(__dirname, "views", "home", "index.ejs"));
});

app.post("/crawl", async (req, res) => {
  try {
    const result = [];

    for (const url of web) {
      const { data } = await axios.get(url.url);
      const $ = cheerio.load(data);
      const codes = {};

      for (const groupName of url.array) {
        const data = $(`div[id="${groupName}"]`).html();
        const code = data.match(/Mật khẩu tài khoản là: \d+/g);
        codes[groupName] = code ? code[0] : null;
      }

      result.push({
        name: url.url,
        mail: url.mail,
        codes,
      });
    }

    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get("/login", (req, res) => {
  //     res.send(`
  //     <form action="/login" method="post">
  //     <script>
  //     alert('Bạn cần đăng nhập để tiếp tục')
  //     </script>
  //     <input type="text" name="username" placeholder="Username" />
  //     <input type="password" name="password" placeholder="Password" />
  //     <button type="submit">Login</button>
  //     </form>
  //   `);
  res.render(path.join(__dirname, "views", "login", "index.ejs"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const user = JSON.parse(fs.readFileSync("./user.json"));
  const users = user.find((user) => user.username === username && user.password === password);
  if (users) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.send(`<script>
        alert('Sai tài khoản hoặc mật khẩu')
        window.location.href = '/login'
        </script>`);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
