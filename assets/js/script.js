
$(document).ready(function() {
  var $table = $("#train-table");
  var $form = $("#train-form");
  var $name = $("#train-name");
  var $dest = $("#destination");
  var $time = $("#train-time");
  var $freq = $("#frequency");
  var database = firebase.database();

  $form.submit(function(event) {
    event.preventDefault();
    database.ref().push({
      name: $name.val(),
      dest: $dest.val(),
      time: $time.val(),
      freq: $freq.val()
    })
  });

  database.ref().on("child_added", function(snapshot) {
    var current = snapshot.val();
    var now = moment();
    var tStart = moment(current.time, "HH:mm");
    // NA = ((CT-ST)/FR + 1) * FR + ST
    // MA = NA - CT
    var nextTrain = moment(tStart.add((Math.ceil((now.diff(tStart, "minutes")/current.freq)) * current.freq), "minutes"));

    var minAway = nextTrain.diff(now, "minutes");

    var timediff = moment().diff(moment(current.time, "HH:mm"), "minutes");
    $table.append(`<tr><td>${
      current.name
    }</td><td>${
      current.dest
    }</td><td>${
      current.freq
    }</td><td>${
      nextTrain.format("HH:mm")
    }</td><td>${
      minAway
    }</td></tr>`);
  });
});
