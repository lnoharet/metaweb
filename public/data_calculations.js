function filter_data_by_days(data){
    filtered_data = [];
    var today = Date.now();
    for (let i = 0; i < data.length; i++) {
        if (data[i].session_end > today - window.last_x_days) {
          filtered_data.push(data[i]);
        }
    }
    return filtered_data;
}
function group_into_dates(data, days, stat_type) {
    filtered = filter_data_by_days(data);
    var today = Date.now();
    var stats = [];
    for (let i = 0; i < days; i++) {
        stats[i] = 0;
    }
    for (let i = 0; i < filtered.length; i++) {
        var session = filtered[i].session_end;
        var index = Math.floor((today - session)/ (1000*60*60*24));
        stats[days-1-index] += filtered[i][stat_type];
        console.log("index: " + index); 
    }
    console.log("stats: " + stats);
    return stats.reverse();
}

function sessionsPlayed(data, days){
    filtered = filter_data_by_days(data);
    var today = Date.now();
    var numberOfSessions = [];
    for (let i = 0; i < days; i++) {
        stats[i] = 0;
    }
    for (let i = 0; i < filtered.length; i++) {
        
    }
}

function dateStamps(days){
  var oneDayInMilliSeconds = 1000*60*60*24;
  dateArray = [];
  var today = Date.now();
  for (let i=0; i<days; i++){
    var dateUnix = today - (oneDayInMilliSeconds * i);
  }
}

function timePlayed(data, days) {
    var filtered = filter_data_by_days(data);
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
    return stats.reverse();
}


