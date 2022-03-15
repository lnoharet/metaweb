var socket = io();
socket.emit("get_users");

window.current_user = null; // for plan_analytics sql (uuid)
window.current_player_name = null; // for heatmap (name)

window.last_x_days = 7 * 24 * 60 * 60 * 1000; // ms
window.current_stat = null;
//var filtered_data = [];

var users; // list of all users


// TODO: Add info about if the user is online or not and last seen online.
render_heatmap();
socket.on("get_users_response", function (arg) {
  console.log("get_users_response");
  users = arg;

  users.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);

  displayFriendsList(users);

  var players = [];
  for (let i = 0; i < users.length; i++) {
    players.push(users[i].name);
  }
  //console.log(players);
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    const filteredPlayers = players.filter(player => {
      return player.toLowerCase().includes(searchString);
    });

    const filtered_users = users.filter(user => { return user.name.toLowerCase().includes(searchString) })
    //console.log(filtered_users);

    if (filtered_users.length == 0 && searchString == "") {
      displayFriendsList(users);
    }
    else if (filtered_users.length == 0) {
      displayFriendsList(filtered_users);
    }
    else {
      displayFriendsList(filtered_users);
    }

  })
})

function displayFriendsList(users) {

  if (document.getElementsByClassName("player-container")) {
    const elements = document.getElementsByClassName("player-container");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }
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
        window.current_player_name = this.firstChild.innerHTML;
        console.log("new player", this.firstChild.innerHTML);
        this.className = "player-container-selected";
        dropdownPlayer();

        // TODO: Query current stat for current user. and render heatmap
        if(window.current_stat != null){
          socket.emit("get_stat", {
            user: window.current_user,
            stat: window.current_stat,
          });
        }

        chartText.textContent =
          document.getElementById(this.id).firstChild.innerHTML + " Stats";

        console.log("set current user to ".concat(window.current_user));
      } else {
        this.className = "player-container";
        window.current_user = null;
        window.current_player_name = null;
        dropdownServer();
        
        if(window.current_stat != null){
          socket.emit("get_stat", {
            user: window.current_user,
            stat: window.current_stat,
          });
        }

        chartText.textContent = "Server Stats";
        dropdownServer();
        //TODO: Query server stats
      }
      render_heatmap();
    });
  }
}

/*------------------------------------------------------------------------------------------------*/
// Socket communication

socket.on("get_stat_response", function (arg) {
  console.log(arg.result);
  var stat = arg.stat;
  var data = arg.result;
  var days = document.getElementById("daysRange").value;
  document.getElementById("slidecontainer").removeAttribute("hidden");
  if(window.current_user == null){
    // server stats 
    switch(stat){
      case "1":
        // Total mob kills
        renderChart(group_into_dates(data, days, "mob_kills"), "Total mobs killed", dateStamps(days));
        break;
      case "2":
        // Total player kills
        renderChart(group_into_dates(data, days, "kills"), "Total players killed", dateStamps(days));
        break;
      case "3":
        // total deaths
        renderChart(group_into_dates(data, days, "deaths"), "Total player deaths", dateStamps(days));
        break;
      case "4":
        // Unique players
        renderChart(get_unique_players(data, days), "Unique players online", dateStamps(days));
        break;
    }
  }
  else{
    switch (stat) {
      case "1":
        // Mob Kills
        renderChart(group_into_dates(data, days, "mob_kills"), "Mobs killed", dateStamps(days));

        break;
      case "2":
        // Player Kills
        renderChart(group_into_dates(data, days, "kills"), "Players killed", dateStamps(days));
        //console.log(stat);
        break;

      case "3":
        // Deaths
        renderChart(group_into_dates(data, days, "deaths"), "Player deaths", dateStamps(days));

        break;

      case "4":
        // Time played
        console.log(stat);
        renderChart(timePlayed(data, days), "Time played in hours", dateStamps(days));
        break;

      case "5":
        // Amount of sessions played
        renderChart(sessionsPlayed(data, days), "Amount of sessions", dateStamps(days));
        break;


      default:
          break;
    }
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

function dropdownServer(){
  document.getElementsByName("stats")[0].options[1].textContent = "Total Mob Kills";
  document.getElementsByName("stats")[0].options[2].textContent = "Total Player Kills";
  document.getElementsByName("stats")[0].options[3].textContent = "Total Deaths";
  document.getElementsByName("stats")[0].options[4].textContent = "Unique Players Online";
  let hidden = document.getElementById("final").getAttribute("hidden");
  document.getElementById("final").setAttribute("hidden", "hidden");
}

function dropdownPlayer(){
  document.getElementsByName("stats")[0].options[1].textContent = "Mob Kills";
  document.getElementsByName("stats")[0].options[2].textContent = "Player Kills";
  document.getElementsByName("stats")[0].options[3].textContent = "Deaths";
  document.getElementsByName("stats")[0].options[4].textContent = "Total Time Played";
  document.getElementById("final").removeAttribute("hidden");
}