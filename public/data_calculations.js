function filter_data_by_days(data, days){
    filtered_data = [];
    var today = Date.now();
    for (let i = 0; i < data.length; i++) {
        if (data[i].session_end > today - (days * 1000 * 60 * 60 * 24)) {
          filtered_data.push(data[i]);
        }
    }
    return filtered_data;
}
function group_into_dates(data, days, stat_type) {
    filtered = filter_data_by_days(data, days);
    var today = Date.now();
    var stats = [];
    for (let i = 0; i < days; i++) {
        stats[i] = 0;
    }
    for (let i = 0; i < filtered.length; i++) {
        var session = filtered[i].session_end;
        var index = Math.floor((today - session)/ (1000*60*60*24));
        stats[days-1-index] += filtered[i][stat_type];
    }
    console.log("stats: " + stats);
    return stats;
}

function sessionsPlayed(data, days){
    filtered = filter_data_by_days(data, days);
    var today = Date.now();
    var numberOfSessions = [];
    for (let i = 0; i < days; i++) {
        numberOfSessions[i] = 0;
    }
    for (let i = 0; i < filtered.length; i++) {
        var session = filtered[i].session_end;
        var index = Math.floor((today - session)/ (1000*60*60*24));
        numberOfSessions[days-1-index] += 1;
    }
    return numberOfSessions;
}

function dateStamps(days){  // date stamps for x-axis on chart
    var oneDayInMilliSeconds = 1000*60*60*24;
    dateArray = [];
    var today = Date.now();
    for (let i=0; i<days; i++){
      var dateUnix = new Date(today - (oneDayInMilliSeconds * i));
      var day = dateUnix.getDate();
      var month = dateUnix.getMonth()+1;
      dateArray.push(day + "/" + month);
    }
    return dateArray.reverse();
  }

function timePlayed(data, days) {
    var filtered = filter_data_by_days(data, days);
    console.log(filtered);
    var today = Date.now();
    var stats = [];
    for (let i = 0; i < days; i++) {
        stats[i] = 0;
    }
    for (let i = 0; i < filtered.length; i++) {
        var session = filtered[i].session_end;
        var index = Math.floor((today - session)/ (1000*60*60*24));
        var hoursPlayed = (filtered[i].session_end - filtered[i].session_start)/3600000;
        stats[days-1-index] += hoursPlayed;
        console.log("index: " + index); 
    }
   
    console.log(stats);
    return stats;
}

function get_unique_players(data, days){
    var filtered = filter_data_by_days(data, days);
    var today = Date.now();
    var unique = [];
    for (let i = 0; i < days; i++) {
        unique[i] = [];
    }
    for (let i = 0; i < filtered.length; i++) {
        var session = filtered[i].session_end;
        var index = Math.floor((today - session)/ (1000*60*60*24));

        if (!unique[days-1-index].includes(filtered[i].uuid )){
            unique[days-1-index].push(filtered[i].uuid);
        }
    }
    var res = [];
    for (let i = 0; i<unique.length; i++){
        res.push(unique[i].length);
    }
    return(res)
}

// returns an array of the last unix time stamp for each player
function get_last_seen_online(player_list, session_list){
    var last_seen = new Map();
    // init values
    for(let i = 0; i<player_list.length; i++){
        last_seen.set(player_list[i].uuid, -1);
    }
    for(let i = 0; i<session_list.length; i++){
        if(parseInt(session_list[i].session_end) > last_seen.get(session_list[i].uuid)){
            // greater value found -> overwrite current value
            last_seen.set(session_list[i].uuid, parseInt(session_list[i].session_end));
        }
    }    
    return last_seen;
}

function unix_to_days_or_hours(unix_timestamp){
    var today = Date.now();
    var days = Math.floor((today - unix_timestamp)/ (1000*60*60*24));
    if (days == 0){
        // return hours 
        return "online ".concat(Math.floor((today - unix_timestamp)/ (1000*60*60)).toString().concat("h ago"));
    }
    else{
        return "online ".concat(days.toString().concat("d ago"));
    }
}


