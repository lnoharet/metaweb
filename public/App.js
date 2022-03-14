var socket = io();
socket.emit("get_users");

window.current_user = null;
window.last_x_days = 7 * 24 * 60 * 60 * 1000; // ms
var current_stat;
//var filtered_data = [];

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
  var data = arg.result;

  switch (stat) {
    case "1":
      // Mob Kills
      renderChart(group_into_dates(data, 7, "mob_kills"), "Mobs killed", dateStamps(7));

      break;
    case "2":
      // Player Kills
      renderChart(group_into_dates(data, 7, "kills"), "Players killed", dateStamps(7));
      //console.log(stat);
      // Lisa
      break;

    case "3":
      // Deaths
      renderChart(group_into_dates(data, 7, "deaths"), "Player deaths", dateStamps(7));

      break;

    case "4":
      // Time played
      // Lisa
      console.log(stat);
      renderChart(timePlayed(data, 7), "Time played in hours", dateStamps(7));
      break;

    case "5":
      // Amount of sessions played
      renderChart(sessionsPlayed(data, 7), "Amount of sessions", dateStamps(7));
      //console.log(group_into_dates());
      break;

    case "6":
      // Session length
      break;

    default:
        break;
  }
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
