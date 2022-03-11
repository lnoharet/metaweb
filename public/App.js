var socket = io();
socket.emit("get_users");

window.current_user = null;
window.last_x_days = 7 * 24 * 60 * 60 * 1000; // ms
var current_stat;
var filtered_data = [];

// Create User buttons
/*
1. Get user names into an array
2. Create buttons with the value same as username
3. AddEventListener on "click" to set as a global variable the buttons value/username
*/
var users; // list of all users
// TODO: Add info about if the user is online or not and last seen online.
socket.on("get_users_response", function (arg) {
  console.log("get_users_response");
  users = arg;
  for (let i = 0; i < users.length; i++) {
    var playerContainer = document.createElement("li");
    var playerName = document.createElement("div");

    playerContainer.className = "player-container";
    playerContainer.id = users[i].uuid;
    playerContainer.value = users[i].name;
    playerName.innerHTML = users[i].name;
    playerName.className = "player-name";
    var parentDiv = document.getElementById("player-list");
    parentDiv.appendChild(playerContainer);
    playerContainer.appendChild(playerName);
    playerContainer.addEventListener("click", function () {
      var chartText = document.getElementById("adaptiveText");
      if (this.id != window.current_user) {
        if (window.current_user != null) {
          var last_player = document.getElementById(window.current_user);
          last_player.className = "player-container";
        }
        window.current_user = this.id;
        this.className = "player-container-selected";

        chartText.textContent =
          document.getElementById(this.id).firstChild.innerHTML + " Stats";

        console.log("set current user to ".concat(window.current_user));
      } else {
        this.className = "player-container";
        window.current_user = null;
        chartText.textContent = "Server Stats";
      }
    });
  }
});

/*------------------------------------------------------------------------------------------------*/
// Socket communication

socket.on("get_stat_response", function (arg) {
  console.log(arg.result);
  var stat = arg.stat;
  var data;
  var today = new Date().getTime();
  console.log(today);
  console.log(today - last_x_days);

  switch (stat) {
    case "1":
      // Mob Kills
      data = arg.result;
      for (let i = 0; i < data.length; i++) {
        if (data[i].session_end > today - last_x_days) {
          filtered_data[i] = data[i].mob_kills;
        }
      }
      console.log(filtered_data);
      window.chart_data = filtered_data;
      break;
    case "2":
      // Player Kills
      break;

    case "3":
      // Deaths
      break;

    case "4":
      // Time played
      break;

    case "5":
      // Amount of sessions played
      break;

    case "6":
      // Session length
      break;

    default:
  }
  renderChart(filtered_data);
});

/*------------------------------------------------------------------------------------------------*/
// Stat selection
// Get Stat selection and query based on choice.
function selectChange(stat_selection) {
  window.current_stat = stat_selection;
  console.log(window.current_stat);
  if (stat_selection != 0) {
    socket.emit("get_stat", {
      user: window.current_user,
      stat: window.current_stat,
    });
  }
}
