const express = require("express");
const SQL = require('sql-template-strings')
const mysql = require("mysql");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static('public'));


const db = mysql.createConnection({
  host: "venus.bloom.host",
  port: "3306",
  /*
  user:  "u11034_Ud000L22lA",//"u11034_FZqElbbcdW",
  password: "G=AmR.jw3OKwOeay9^FtSdSk",//"17RqL6+plrEBGp0t7djf==rL",
  database: "s11034_Dynmap"//"s11034_Analytics",*/
  user: "u11034_FZqElbbcdW",
  password: "17RqL6+plrEBGp0t7djf==rL",
  database: "s11034_Analytics"
});
db.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log("Connected to DB!");
});

function unix_to_s_m_h(time) {
  var diff = Math.floor(time / 1000), units = [
    { d: 60, l: "seconds" },
    { d: 60, l: "minutes" },
    { d: 24, l: "hours" }
  ];
  var s = [];
  for (var i = 0; i < units.length; ++i) {
    s[i] = (diff % units[i].d);
    diff = Math.floor(diff / units[i].d);
  }
  return s;
}


io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("get_users", function () {

    console.log("fetching user list");

    const sql_query = "select uuid, name from plan_users";
    db.query(sql_query, function (err, res) {
      if (err) throw err;
      socket.emit("get_users_response", res);
    });
    const sql_query2 = "select uuid, session_end from plan_sessions";
    db.query(sql_query2, function (err, res) {
      if (err) throw err;
      socket.emit("last_seen_online", res);
    });
  });

  socket.on("get_stat", function (arg) {
    var userid = arg.user;
    var stat = arg.stat;
    console.log("fetching stat for user ".concat(userid));
    console.log("fetching stat ".concat(stat));

    if(userid == null){
      // Server stat
      /*
        * Totala mob kills per dag  (1)
        * Totala deaths per dag  (2)
        * Totala player kills per dag (3)
        * Antal unika spelare per dag  (4)
      */
      switch (stat) {
        case "1":
          // Total mob kills 
          var sql_query = (SQL`select session_end, mob_kills from plan_sessions`);
          db.query(sql_query, function (err, res) {
            if (err) throw err;
            var result = res;
            socket.emit("get_stat_response", { result, stat });
          });
          break;
        case "2":
          // total deaths
          var sql_query = (SQL`select date from plan_kills`);
          db.query(sql_query, function (err, res) {
            if (err) throw err;
            var result = res;
            socket.emit("get_stat_response", { result, stat });
          });
          break;
        case "3":
          // total player kills
          var sql_query = (SQL`select session_end, deaths from plan_sessions`);
          db.query(sql_query, function (err, res) {
            if (err) throw err;
            var result = res;
            socket.emit("get_stat_response", { result, stat });
          });
          break;
        case "4":
          var sql_query = (SQL`select uuid, session_end from plan_sessions`);
          db.query(sql_query, function (err, res) {
            if (err) throw err;
            var result = res;
            socket.emit("get_stat_response", { result, stat });
          });
          break;
      }
    }
    else{
      // user specific stats
      switch (stat) {
        case "1":
          // Mob Kills
          //var sql_query = (SQL`select (sum(case uuid when ${userid} then mob_kills else 0 end)) from plan_sessions`);
          var sql_query = (SQL`select session_end, mob_kills from plan_sessions where uuid = ${userid}`);
          db.query(sql_query, function (err, res) {
            if (err) throw err;
            var result = res;
            socket.emit("get_stat_response", { result, stat });
          });
          break;
        case "2":
          // Player Kills
          var sql_query = (SQL`select date from plan_kills where killer_uuid = ${userid}`);
          db.query(sql_query, function (err, res) {
            if (err) throw err;
            var result = res;
            socket.emit("get_stat_response", { result, stat });
          });
  
          break;
        case "3":
          // Deaths
          var sql_query = (SQL`select session_end, deaths from plan_sessions where uuid = ${userid}`);
          db.query(sql_query, function (err, res) {
            if (err) throw err;
            var result = res;
            socket.emit("get_stat_response", { result, stat });
          });
          break;
        case "4":
          // Time played
          var sql_query = (SQL`select session_start, session_end from plan_sessions where uuid = ${userid}`);
          db.query(sql_query, function (err, res) {
            if (err) throw err;
  
            // Calculate total time played
            var result = res;
  
            socket.emit("get_stat_response", { result, stat });
          });
  
          break;
        case "5":
          // Amount of sessions played
          var sql_query = (SQL`select session_end from plan_sessions where uuid = ${userid}`);
          db.query(sql_query, function (err, res) {
            var result = res;
            if (err) throw err;
            socket.emit("get_stat_response", { result, stat });
          });
          break;
        case "6":
          // Average Session length
          var sql_query = (SQL`select session_start, session_end from plan_sessions where uuid = ${userid}`);
          db.query(sql_query, function (err, res) {
            if (err) throw err;
            var result = [];
            // Calculate total time played
            for (let i = 0; i < res.length; i++) {
              var tstart = res[i].session_start;
              var tend = res[i].session_end;
              var diff = tend - tstart;
  
              var session_length = unix_to_s_m_h(diff);
              // adds session_lengths to an array. each session_length is [seconds, minutes, hours] format.
              result[i] = session_length;
            }
            socket.emit("get_stat_response", { result, stat });
          });
          break;
  
          case "7":
          // Mob Kills
          //var sql_query = (SQL`select (sum(case uuid when ${userid} then mob_kills else 0 end)) from plan_sessions`);
          var sql_query = (SQL `select session_end, mob_kills from plan_sessions where uuid = ${userid}`);
          db.query(sql_query, function(err, res){
            if (err) throw err;
            var result = res;
            socket.emit("get_stat_response", {result, stat});
          });
          break;
        default:
      }

    }    
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on port: 3000");
});


