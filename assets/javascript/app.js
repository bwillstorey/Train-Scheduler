
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDWtFq7EvJx9Juytnj6DDJxZrQlle-4B1U",
    authDomain: "train-scheduler-4d32b.firebaseapp.com",
    databaseURL: "https://train-scheduler-4d32b.firebaseio.com",
    projectId: "train-scheduler-4d32b",
    storageBucket: "train-scheduler-4d32b.appspot.com",
    messagingSenderId: "997266460076"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// Button for adding train to schedule
$("#add-train").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = moment($("#start-time").val().trim(), "HH:mm").format("HH:mm");
  console.log(firstTrain);
  var frequency = $("#frequency").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("name-input").val("");
  $("#destination-input").val("");
  $("#start-time").val("");
  $("#frequency").val("");
});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(destination);
  console.log(firstTrain);
  console.log(frequency);

  var firstTimeConverted = moment(firstTrain, "HH:mm");
  console.log(firstTimeConverted);
  var currentTime = moment().format("HH:mm");
  console.log("CURRENT TIME: " + currentTime);


  // To calculate the next train arrival
  var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
  console.log(firstTrain);
  console.log("Difference in Time: " + timeDiff);
  var timeRemainder = timeDiff % frequency;
  console.log(timeRemainder)
  var minToTrain = frequency - timeRemainder;
  console.log(minToTrain)
  var nextTrain = moment().add(minToTrain, "minutes").format("HH:mm");
  console.log(nextTrain);

//   // Calculate the total billed rate
//   var minsAway = nextTrain - moment();
//   console.log(empBilled);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(minToTrain),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
