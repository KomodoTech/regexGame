/*=VARIABLES==================================================================*/
var logSpan = '';

//String arrays which wille be used to create object arrays when the game is initialized
var tutorialStringLibrary = ['log','bog','file','pen','mud'];
var tutorialRegexLibrary = ['o', 'i', 'e','l|g','d|u'];

var levelOneStringLibrary = ['log','bog','file','pen','mud'];
var levelOneRegexLibrary = ['o|b', 'i|e','p|m','mu|bo','ile|ud'];

var levelTwoStringLibrary = ['slither','slime','knife','stab','blood'];
var levelTwoRegexLibrary = ['^s','^k','e$','[^l]','^b[^a]'];

var levelThreeStringLibrary = ['coffee', 'frog', 'green', 'fog', 'portfolio'];
var levelThreeRegexLibrary = ['[^i]+ee', '^f(o)g$', 'o*o$', '^f(ro|o)g*', '[f*][o]'];

var levelFourStringLibrary = ['kick','punch','tie','hatch','slice'];
var levelFourRegexLibrary = ['[ch]$','^k.*k$','^h.*h$','^[^i]*$','^[^aln]*$'];

var levelFiveStringLibrary = ['cold blooded', 'foggy', 'roundhouse', 'sanguine', 'cattail'];
var levelFiveRegexLibrary = ['(d|o)*|[og]y$', '^s.*e$|c.*l$','^[^g|u]*$','gg|oo|tt^c.*$l',];


/*=GENERAL FUNCTIONS==========================================================*/

//these two functions take an array of strings as input and create arrays of AttackString and RegexObjects objects
function makeAttackLibrary(stringLibrary) {
  var newLibrary = [];
  for (var stringIndex = 0; stringIndex < stringLibrary.length; stringIndex++) {
    var attack = new AttackString(stringLibrary[stringIndex]);
    newLibrary.push(attack);
  }
  return newLibrary;
}

function makeDefenseLibrary(regexLibrary) {
  var newLibrary = [];
  for (var regexIndex = 0; regexIndex < regexLibrary.length; regexIndex++) {
    var defense = new DefenseRegex(regexLibrary[regexIndex]);
    newLibrary.push(defense);
  }
  return newLibrary;
}

/*=GAME OBJECT================================================================*/
/*=====BACKEND================================================================*/
function Game(players, gameTitle, level) {
  this.players = players;
  this.attackingPlayer = players[0]; //NOTE: ASSUME TWO PLAYERS FOR NOW
  this.defendingPlayer = players[1];
  this.gameName = gameTitle; //"SnakeMan vs ManSnake: A Tale of Rejects"
  this.gameOver = false;
  this.winner; //assigned to the attackingPlayer when the game is over
  this.level = level; //difficulty level of libraries used by player objects
}


//Not used, consider removal
Game.prototype.resetGame = function() {
  if(this.gameOver) {
    this.gameOver = false;
  }
  this.attackingPlayer.energy = 100;
  this.defendingPlayer.energy = 100;
  for (var playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
    this.players[playerIndex].defenseRegexs = makeDefenseLibrary(testRegexLibrary);
    this.players[playerIndex].attackStrings = makeAttackLibrary(testStringLibrary);
  }
}

//NOTE: game will take attackingPlayer's currentString and compare it to each of the defending player's remaining regex defenses
Game.prototype.evaluateTurn = function() {
  var stringAttack = this.attackingPlayer.attackString;
  addToLog(this.attackingPlayer.playerName + " attacks with ");
  addToLog(stringAttack.attackValue)
  logEvent();
  var stringEnergy = this.attackingPlayer.attackString.energyCost;
  this.attackingPlayer.modifyEnergy(-stringEnergy);

  //check if attack depletes the attacking player's energy
  if(this.attackingPlayer.energy <= 0){
    this.winner = this.defendingPlayer;
    this.endGame();
    return;
  }

  //var initialLength = this.defendingPlayer.defenseRegexs.length;

  // NOTE: loops through the defenseRegex library, evaluating attack on each defense. setInterval calls the callback function every 600ms. The callback function calls the evaluateAttack method and then increments the regex index. If the regexIndex reaches past the last index of the defenseRegexs library, the setInterval callback is cancelled, the defeated regexs are removed from the library, and the players are switched.
  var regexIndex = 0;
  var attackLoop = setInterval(function() {
    if(regexIndex < this.defendingPlayer.defenseRegexs.length){
      var defenseRegex = this.defendingPlayer.defenseRegexs[regexIndex];
      this.evaluateAttack(stringAttack, defenseRegex, regexIndex);
      this.displayPlayerInfo();
      regexIndex++;
    }
    else if(regexIndex >= this.defendingPlayer.defenseRegexs.length){
      clearInterval(attackLoop);
      this.defendingPlayer.removeAllDefeatedRegexs();

      //check if game is over
      if(this.defendingPlayer.defenseRegexs.length === 0 || this.defendingPlayer.energy <= 0 || this.attackingPlayer.energy <= 0){
        this.winner = this.attackingPlayer;
        this.endGame();
      }
      else {
        this.switchPlayers();
        this.displayPlayerInfo();
      }
    }
  }.bind(this), 600); //need to bind the game object as 'this' so that the setInterval callback function has access to it

}

//method for evaluating individual attack/defense combinations
Game.prototype.evaluateAttack = function(testString, testRegex, testRegexIndex) {
  // debugger;
  var attackingPlayerString = testString;
  var defendingPlayerRegex = testRegex;
  var attackColor = attackingPlayerString.stringColor;
  var defenseColor = defendingPlayerRegex.regexColor;
  addToLog(this.defendingPlayer.playerName + " defends against ")
  addToLog(testString.attackValue, attackColor);
  addToLog(" with ")
  addToLog(testRegex.defenseObject, defenseColor);
  addToLog("...");
  logEvent();

  // check to see if regex (defense) accepts string (attacks)
  var attackSuccess = this.testStringWithRegex(attackingPlayerString.attackValue, defendingPlayerRegex.defenseObject);

  if (attackSuccess) {
    defendingPlayerRegex.defeated = true;
    var defenseRegexCost = defendingPlayerRegex.calculateDefenseCost();
    this.defendingPlayer.modifyEnergy(-defenseRegexCost);
    addToLog("Critical hit!!", "#52B85E");
    logEvent();
  }
  else {
    addToLog("Deflected!", "#CF5551");
    logEvent();
  }
  return attackSuccess;
}

//NOTE: method calls on javascript internal RegExp object's prototype method regex.test(string)
Game.prototype.testStringWithRegex = function(testString, testRegex) {
  var accepted = testRegex.test(testString);
  return accepted;
}

//NOTE: Assume two players for now
Game.prototype.switchPlayers = function(){
  if(this.attackingPlayer === this.players[0]){
    this.attackingPlayer = this.players[1];
    this.defendingPlayer = this.players[0];
  }
  else {
    this.attackingPlayer = this.players[0];
    this.defendingPlayer = this.players[1];
  }
}

//TODO: refactor so that player object does not need to keep track of which side
// it is on. That seems like something the game should deal with.
Game.prototype.getPlayerAtPosition = function(side) {
  for (var playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
    var playerAtIndex = this.players[playerIndex];
    if (playerAtIndex.boardSide === side) {
      return playerAtIndex
    }
  }
}

//sets attacking player as winner, hides attack buttons, and logs the winner
Game.prototype.endGame = function () {

  this.gameOver = true;

  for (var player = 0; player < this.players.length; player++) {
    if (this.players[player].energy <= 0 || this.players[player].defenseRegexs.length === 0) {
        $("#" + this.players[player].boardSide + "Box div .energy-bar").empty();
        $("#" + this.players[player].boardSide + "Box div .energy-bar").append("YOU HAVE LOST");
    }
  }

  $("#left-player-action").hide();
  $("#right-player-action").hide();
  addToLog("Level " + this.level + " completed - " + this.winner.playerName + " won!");
  logEvent();
};

/*======UI====================================================================*/

//loops through the games object array and displays information for both of them
Game.prototype.displayPlayerInfo = function(){
  for (var playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
    var player = this.players[playerIndex];

    //display health-bar - adds one pipe for each unit of energy
    $("#" + player.boardSide + "Box div .energy-bar").empty();
    var healthDisplayChunk = 0;
    while(healthDisplayChunk < player.energy){
      $("#" + player.boardSide + "Box div .energy-bar").append("|");
      healthDisplayChunk ++;
    }

    //display defense and attack options
    //TODO: update to reflect change in game tracking player side
    $("#" + player.boardSide + "-player-options").empty();
    //TODO: Look into object comparison
    if (this.attackingPlayer === player) {
      $("#" + player.boardSide + "-player-options").append("Select a string and attack");
      //add radio button for each attack string. Value of radio button is the string.
      player.attackStrings.forEach(function(attackString){
        $("#" + player.boardSide + "-player-options").append("<div class='attackRadio'><input type='radio' class='radOpt' name='attacks' value='" + attackString.attackValue + "'> " + attackString.attackValue + "</div>");
      });
      $("#" + player.boardSide + "-player-action").text("Attack");
      $("#" + player.boardSide + "-player-action").show();
    }
    if (this.defendingPlayer === player) {
      $("#" + player.boardSide + "-player-options").append("Remaining Defenses: ");
      player.defenseRegexs.forEach(function(defenseRegex){
        var displayClass = '';
        if(defenseRegex.defeated){displayClass = 'strikethrough';}
        $("#" + player.boardSide + "-player-options").append("<li class='" + displayClass + "'>" + defenseRegex.defenseObject + "</li>");
      });
      $("#" + player.boardSide + "-player-action").text("Defend");
      $("#" + player.boardSide + "-player-action").hide();
    }
  }
}

/*=PLAYER OBJECT==============================================================*/
/*======BACKEND===============================================================*/
//NOTE: boardSide can have value of "left" or "right"
function Player(name, regexLibrary, stringLibrary, boardSide) {
  this.playerName = name;
  this.energy = 100;
  this.attackStrings = stringLibrary;
  this.defenseRegexs = regexLibrary;
  this.human = true; //not used
  this.attackString; //current attack string; changed on every round to the value of the checked radio button
  this.boardSide = boardSide;
}

//TODO: evaluate pros and cons of having this method instead of just calling
// somePlayer.defenseRegexs[somePlayer.currentRegexIndex];
// Player.prototype.getCurrentRegexObject = function() {
//   return this.defenseRegexs[this.currentRegexIndex];
// }

Player.prototype.addRegexToLibrary = function(regexInstance) {
  this.regexLibrary.push(regexInstance);
}

Player.prototype.removeRegexFromLibrary = function(regexIndex) {
  // debugger;
  var removedRegex = this.defenseRegexs.splice(regexIndex, 1);
  return removedRegex;
}

//called at the end of turn to clear defeated regexs from defending player's library
Player.prototype.removeAllDefeatedRegexs = function() {
  for(var regexIndex = this.defenseRegexs.length - 1; regexIndex >= 0; regexIndex--){
    if(this.defenseRegexs[regexIndex].defeated){
      var removedRegex = this.defenseRegexs.splice(regexIndex, 1);
    }
  }
}

Player.prototype.setCurrentRegexIndex = function(regexIndex) {
  this.currentRegexIndex = regexIndex;
}


Player.prototype.getCurrentStringObject = function() {
  return this.attackStrings[this.currentStringIndex];
}

Player.prototype.addStringToLibrary = function(attackString) {
  this.attackStrings.push(attackString);
}

Player.prototype.removeStringFromLibrary = function() {
  var removedString =  this.attackStrings.splice(this.currentStringIndex, 1);
  return removedString;
}

// Player.prototype.setCurrentStringIndex = function(stringIndex) {
//   this.currentStringIndex = stringIndex;
// }


Player.prototype.modifyEnergy = function(energyChangeAmount) {
  this.energy += energyChangeAmount;
}

/*======UI/DISPLAY====================================================================*/
//none of these are currently used
Player.prototype.drawPlayer = function() {
//TODO: make drawPlayer Talk to imgscript somehow
  console.log('drawing player');
}

Player.prototype.displayAttack = function() {
  this.attackStrings[currentStringIndex].drawAttack();
}

Player.prototype.displayDefense = function() {
  this.defenseRegexs[currentRegexIndex].drawDefense();
}

/*=AttackString Object================================================================*/
/*======BACKEND=======================================================================*/
function AttackString(stringValue) {
  this.attackValue = stringValue;
  this.energyCost = this.calculateAttackCost();
  this.attackName;
  this.stringColor = this.generateAttackAppearance();
  this.stringGraphic;
}


AttackString.prototype.calculateAttackCost = function() {
  var attackCost = (this.attackValue.length) * 5; //TODO: calculate energy cost more algorithmically
  console.log("attackCost: " + attackCost);
  return attackCost;
}

//NOTE: generate color based on first char in string
AttackString.prototype.generateAttackAppearance = function() {
  // debugger;
  var firstLetterAscii = this.attackValue.charCodeAt(0);
  var firstLetterAsciiLength = firstLetterAscii.toString().length;

  var stringColor = "#" + firstLetterAscii.toString();

  for (var digitIndex = firstLetterAsciiLength; digitIndex < 6; digitIndex++) {
    randomColorDigit = Math.floor(Math.random() * 9);
    stringColor = stringColor + randomColorDigit.toString();
  }

  this.stringColor = stringColor;

  return stringColor;
}

/*======UI/DISPLAY====================================================================*/
//not sure the point of this; all it does is call a different method
AttackString.prototype.drawAttack = function() {
  this.generateAttackAppearance();
}




/*=DefenseRegex Object================================================================*/
/*======BACKEND=======================================================================*/
function DefenseRegex(regexValue) {
  //NOTE: this is the Javascript object not just a string
  this.defenseObject = new RegExp(regexValue);
  this.energyCost = this.calculateDefenseCost();
  this.defendName;
  this.regexColor = this.generateDefenseAppearance();
  this.regexGraphic;
  this.defeated = false;
}

// cost of regex calculated by number of non alpha numeric characters in expression
DefenseRegex.prototype.calculateDefenseCost = function() {
  var regexString = this.defenseObject.toString();
  var specialCharCounter = 0;
  for (var charIndex = 0; charIndex < regexString.length; charIndex++) {
    if (!(/^[a-z0-9]$/.test(regexString.charAt(charIndex)))) {
      specialCharCounter++;
    }
  }
  var regexCost = (specialCharCounter - 2) * 5; //subtract 2 for the / characters
  return regexCost;
}


DefenseRegex.prototype.generateDefenseAppearance = function() {
  var firstLetterAscii = this.defenseObject.toString().charCodeAt(1);
  var firstLetterAsciiLength = firstLetterAscii.toString().length;

  var stringColor = "#" + firstLetterAscii.toString();

  for (var digitIndex = firstLetterAsciiLength; digitIndex < 6; digitIndex++) {
    randomColorDigit = Math.floor(Math.random() * 9);
    stringColor = stringColor + randomColorDigit.toString();
  }
  this.stringColor = stringColor;
  return stringColor;
}

/*======UI/DISPLAY====================================================================*/
DefenseRegex.prototype.drawDefense = function() {
  this.generateDefenseAppearance();
}

/*======jQuery and webpage logic======================================================*/

//this adds a span to the global logSpan variable. Must be called separately for strings of different colors.
function addToLog(string, inputColor){
  var color = 'black';
  if(inputColor){color = inputColor;}
  var newSpan = "<span style='color:" + color + "'>" + string + "</span>"
  logSpan += newSpan;
}

//appends global logSpan variable to the event log and then clears logSpan for the next line
function logEvent(){
  $('#event-log').append("<li>" + logSpan + "</li>");
  logSpan = '';
  $('#event-log').scrollTop($('#event-log li').last().position().top);
}

function initializeGame(){
  var level = $("#choose-level").val();
  var defenseLibrary, attackLibrary;

  switch (level) {
    case "tutorial":
      defenseLibrary = tutorialRegexLibrary;
      attackLibrary = tutorialStringLibrary;
      break;
    case "1":
      defenseLibrary = levelOneRegexLibrary;
      attackLibrary = levelOneStringLibrary;
      break;
    case "2":
      defenseLibrary = levelTwoRegexLibrary;
      attackLibrary = levelTwoStringLibrary;
      break;
    case "3":
      defenseLibrary = levelThreeRegexLibrary;
      attackLibrary = levelThreeStringLibrary;
      break;
    case "4":
      defenseLibrary = levelFourRegexLibrary;
      attackLibrary = levelFourStringLibrary;
      break;
    case "5":
      defenseLibrary = levelFiveRegexLibrary;
      attackLibrary = levelFiveStringLibrary;
      break;
    default:
      defenseLibrary = levelOneRegexLibrary;
      attackLibrary = levelOneStringLibrary;

  }

  var player1 = new Player("SnakeMan", makeDefenseLibrary(defenseLibrary), makeAttackLibrary(attackLibrary), 'left');
  var player2 = new Player("ManSnake", makeDefenseLibrary(defenseLibrary), makeAttackLibrary(attackLibrary), 'right');

  var players = [player1, player2];

  var newGame = new Game(players, "SnakeMan vs ManSnake: A Tale of Two Rejects", level);
  newGame.displayPlayerInfo();

  return newGame;
}


$(document).ready(function(){
  var myGame;
  $("#choose-level-button").click(function(){
    myGame = initializeGame();
    $("#choose-level-box").hide();
    $("#game-display").show();
    $("#reset").show();
    addToLog('Start!');
    logEvent();
  })

  //energy = 100, col-sm-2 is 1/6th of view port
  var sizeConstant = 200;
  //determine health-bar tick size
  var healthBarSize = parseInt($("#rightBox").width());
  var healthTickSize = (healthBarSize/sizeConstant).toString() + "vw"

  $(".energy-bar").css('font-size', healthTickSize);


  //TODO: allow for 2 human players.
  $("#left-player-action").click(function() {
    //TODO: refactor to allow for left right player action functionality to be combined
    var leftPlayer = myGame.getPlayerAtPosition("left");
    var attackValue = $("input[name=attacks]:checked").val();
    if(!attackValue){return;}
    leftPlayer.attackString = new AttackString(attackValue);
    if (myGame.attackingPlayer.boardSide === "left") {
      myGame.evaluateTurn();
    }
  });

  //TODO: See if we can get index out of jquery radio button selection
  $("#right-player-action").click(function() {
    var rightPlayer = myGame.getPlayerAtPosition("right");
    var attackValue = $("input[name=attacks]:checked").val();
    if(!attackValue){return;}
    rightPlayer.attackString = new AttackString(attackValue);;
    if (myGame.attackingPlayer.boardSide === "right") {
      myGame.evaluateTurn();
    }
  });

  //NOTE: TEST BUTTON
  $("#reset").click(function() {
    location.reload();
  });
});
