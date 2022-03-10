const express = require("express");
const SQL = require('sql-template-strings')
const mysql = require("mysql");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static('public'));


/* app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
}); */


const db = mysql.createConnection({
  host: "venus.bloom.host",
  port: "3306",
  /*
  user:  "u11034_Ud000L22lA",//"u11034_FZqElbbcdW",
  password: "G=AmR.jw3OKwOeay9^FtSdSk",//"17RqL6+plrEBGp0t7djf==rL",
  database: "s11034_Dynmap"//"s11034_Analytics",*/
  user:  "u11034_FZqElbbcdW",
  password: "17RqL6+plrEBGp0t7djf==rL",
  database: "s11034_Analytics"
});
db.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log("Connected to DB!");
});

io.on("connection", (socket) => {
  console.log("a user connected");


  socket.on("get_users", function(){
    console.log("fetching user list");
    const sql_query = "select uuid, name from plan_users";
    db.query(sql_query, function(err, res){
      if (err) throw err;
      io.sockets.emit("get_users_response", res);
    });
  });

  socket.on("get_stat", function(arg){
    var userid = arg.user;
    var stat = arg.stat;
    console.log("fetching stat for user ".concat(userid));
    console.log("fetching stat ".concat(stat));

    switch(stat){
      case "1":
        // SQL query
        // Mob Kills
        const sql_query = (SQL`select (sum(case uuid when ${userid} then mob_kills else 0 end)) from plan_sessions`);
        console.log(sql_query);
        db.query(sql_query, function(err, res){
          if (err) throw err;
          console.log(res);
          io.sockets.emit("get_stat_response", res);
        });
        break;
      case "2":
        // Player Kills
        break;
      case "3":
        // Deaths
        break;
      case "4":
        // Total time played
        break;
      case "5":
        // Amount of sessions played
        break;
      case "6":
        // Session length
        break;
      default:
        console.log("def");
    }

  });
  
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on port: 3000");
});


