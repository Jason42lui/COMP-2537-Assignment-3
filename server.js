const express = require("express");
const bcrypt = require('bcryptjs');
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBsession = require("connect-mongodb-session")(session);
const app = express();
const https = require("https");
const bodyparser = require("body-parser");
require("dotenv").config();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));

app.listen(process.env.PORT || 5000, function (err) {
  if (err) console.log(err);
});

const Cart = require('./models/shoppingCart');
const oldCart = require('./models/oldOrder');
const UserModal = require('./models/User');
const mongoURI = process.env.DB_COLLECTION;

const eventSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String,
});
const eventModel = mongoose.model("timelineevents", eventSchema);

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("MongoDB connected");
  });

const store = new MongoDBsession({
  uri: mongoURI,
  collection: "mySessions",
});

app.use(
  session({
    secret: "Sheeesh",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const auth = (req, res, next) => {
    if(req.session.auth) {
        next()
    } else {
        res.redirect('/login')
    }
}

app.use(express.static("./public"));

app.use(
  bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true,
  })
);

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.session.user);
  console.log("Entire session object:");
  console.log(req.session);
  next();
});

// R
app.get("/timeline/getAllEvents", function (req, res) {
  eventModel.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send(data);
  });
});

// C
app.put("/timeline/input", function (req, res) {
  console.log(req.body);
  eventModel.create(
    {
      text: req.body.text,
      time: req.body.time,
      hits: req.body.hits,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send(data);
    }
  );
});

//U
app.get("/timeline/increaseHits/:id", function (req, res) {
  console.log(req.params);
  eventModel.updateOne(
    {
      _id: req.params.id,
    },
    {
      $inc: { hits: 1 },
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Update is good");
    }
  );
});

//D
app.get("/timeline/remove/:id", function (req, res) {
  console.log(req.params);
  eventModel.remove(
    {
      _id: req.params.id,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Delete is good");
    }
  );
});

app.get("/search_page", function (req, res, next) {
  res.render("search_page");
});

app.get("/timeline", function (req, res, next) {
  UserModal.find({}, function(err, users) {
    res.render('timeline', {
      userList: users
    })
  })
});

app.get("/login", function (req, res, next) {
  res.render("login");
});

app.get("/oldOrder", function (req, res, next) {
  res.render("oldOrder");
});

app.post("/login", async (req, res,) => {
    const {email, password} = req.body;

    const user = await UserModal.findOne({email});

    if(!user) {
        return res.redirect('/login');
    }

    const validate = await bcrypt.compare(password, user.password);

    if(!validate) {
        return res.redirect('/login');
    }

    req.session.auth = true
    req.session.user = user
    res.redirect("/index")
});

app.get("/register", function (req, res, next) {
    res.render("register");
  });

app.post("/register", async (req, res,) => {
    const {username, email, password} = req.body;

    let user = await UserModal.findOne({email});

    if (user) {
        return res.redirect('/index');
    }

    const hashedpass = await bcrypt.hash(password, 5);

    user = new UserModal({
        username,
        email,
        password: hashedpass
    }) 

    await user.save();

    res.redirect('/index')
});


app.get("/", function (req, res, next) {
  res.render("login");
});

app.get("/index", auth, function (req, res, next) {
    res.render("index");
  });

app.get("/personalCart", auth, function (req, res, next) {
    res.render("personalCart");
  });

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/')
    })
})

app.get("/profile/:id", function (req, res) {
  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;

  data = "";
  https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      data += chunk;
    });

    https_res.on("end", function () {
      data = JSON.parse(data);

      tmp = data.stats
        .filter((obj_) => {
          return obj_.stat.name == "hp";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      tmp_2 = data.stats
        .filter((obj_) => {
          return obj_.stat.name == "attack";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      tmp_3 = data.stats
        .filter((obj_) => {
          return obj_.stat.name == "defense";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      tmp_4 = data.stats
        .filter((obj_) => {
          return obj_.stat.name == "speed";
        })
        .map((obj2) => {
          return obj2.base_stat;
        });

      res.render("profile.ejs", {
        id: req.params.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        type: data.types[0].type.name,
        hp: tmp[0],
        attack: tmp_2[0],
        defense: tmp_3[0],
        speed: tmp_4[0],
      });
    });
  });
});

// R
app.get("/personalCart/allItems", function (req, res) {
  Cart.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send(data);
  });
});

app.put("/personalCart/insert", function (req, res) {
  console.log(req.body);
  Cart.create(
    {
      pokemonID: req.body.pokemonID,
      price: req.body.price,
      quantitiy: req.body.quantitiy,
      time: req.body.time
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send(data);
    }
  );
});

app.get("/personalCart/increaseQuantity/:id", function (req, res) {
  console.log(req.params);
  Cart.updateOne(
    {
      _id: req.params.id,
    },
    {
      $inc: { quantitiy: 1 },
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Update is good");
    }
  );
});

app.get("/personalCart/decreaseQuantity/:id", function (req, res) {
  console.log(req.params);
  Cart.updateOne(
    {
      _id: req.params.id,
    },
    {
      $inc: { quantitiy: -1 },
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Update is good");
    }
  );
});

app.get("/personalCart/remove/:id", function (req, res) {
  console.log(req.params);
  Cart.remove(
    {
      _id: req.params.id,
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Delete is good");
    }
  );
});

app.get("/personalCart/remove", function (req, res) {
  console.log(req.params);
  Cart.remove({},
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send("Delete is good");
    }
  );
});

app.get("/oldOrder/allItems", function (req, res) {
  oldCart.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send(data);
  });
});

app.put("/oldOrder/insert", function (req, res) {
  oldCart.create(
    {
      Items: req.body.Items,
      totalCost: req.body.totalCost,
      time: req.body.time
    },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + data);
      }
      res.send(data);
    }
  );
});