/*=VARIABLES==================================================================*/


var testStringLibrary = ['0', 'coffee', 'portmanteau','pop','boooooh'];
var testRegexLibrary = ['0', '0|1', '[^01]', '^[01]','^p[o]*p$','^b[o]+h$'];

/*=GENERAL FUNCTIONS==========================================================*/
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
function Game(players, gameTitle) {
  this.players = players;
  this.attackingPlayer = players[0]; //NOTE: ASSUME TWO PLAYERS FOR NOW
  this.defendingPlayer = players[1];
  this.gameName = gameTitle; //"SnakeMan vs ManSnake: A Tale of Rejects"
  this.gameOver = false;
}

Game.prototype.resetGame = function() {

}

//NOTE: game will take attackingPlayer's currentString and compare it to defendingPlayer's currentRegex
Game.prototype.evaluateTurn = function() {
  var stringAttack = this.attackingPlayer.attackString;
  logEvent(this.attackingPlayer.playerName + " attacks with " + stringAttack.attackValue + "!");
  var stringEnergy = this.attackingPlayer.attackString.energyCost;
  this.attackingPlayer.modifyEnergy(-stringEnergy);

  var initialLength = this.defendingPlayer.defenseRegexs.length;

  // NOTE: loops through the defenseRegex library, evaluating attack on each defense. setInterval calls the callback function every 600ms. The callback function calls the evaluateAttack method and then increments the regex index. If the regexIndex reaches past the last index of the defenseRegexs library, the setInterval callback is cancelled, the defeated regexs are removed from the library, and the players are switched.
  var regexIndex = 0;
  var attackLoop = setInterval(function(){
    if(regexIndex < this.defendingPlayer.defenseRegexs.length){
      var defenseRegex = this.defendingPlayer.defenseRegexs[regexIndex];
      this.evaluateAttack(stringAttack, defenseRegex, regexIndex);
      this.displayPlayerInfo();
      regexIndex++;
    }
    else if(regexIndex >= this.defendingPlayer.defenseRegexs.length){
      clearInterval(attackLoop);
      this.defendingPlayer.removeAllDefeatedRegexs();
      if(this.defendingPlayer.defenseRegexs.length === 0 || this.defendingPlayer.energy <= 0 || this.attackingPlayer.energy <= 0){
        this.gameOver = true;
      }
      this.switchPlayers();
      this.displayPlayerInfo();
    }
  }.bind(this), 600);

  console.log(this.defendingPlayer.playerName + ": " + this.defendingPlayer.energy);
  console.log(this.attackingPlayer.playerName + ": " + this.attackingPlayer.energy);
  //check if there are any more regex objects left in defender's library
}


Game.prototype.evaluateAttack = function(testString, testRegex, testRegexIndex) {
  // debugger;
  var attackingPlayerString = testString;
  var defendingPlayerRegex = testRegex;
  var color = attackingPlayerString.stringColor;
  logEvent(this.defendingPlayer.playerName + " defends against " + testString.attackValue + " with " + testRegex.defenseObject + "...", color);

  // check to see if regex (defense) accepts string (attacks)
  var attackSuccess = this.testStringWithRegex(attackingPlayerString.attackValue, defendingPlayerRegex.defenseObject);

  //TODO: print success and fail messages by inserting some html in the DOM
  if (attackSuccess) {
    console.log(defendingPlayerRegex.defenseObject + ' was hit!');
    defendingPlayerRegex.defeated = true;
    logEvent("critical hit!!");
    var defenseRegexCost = defendingPlayerRegex.calculateDefenseCost();
    this.defendingPlayer.modifyEnergy(-defenseRegexCost);
  }
  else {
    logEvent("attack deflected!");
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

/*======UI====================================================================*/

Game.prototype.displayPlayerInfo = function(){
  //TODO: move this check somewhere else so that alert doesn't get triggered twice
  if (this.gameOver) {
    alert('Game over');
  }
  for (var playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
    var player = this.players[playerIndex];

    //display health-bar
    $("#" + player.boardSide + "Box div .energy-bar").empty();
    var healthDisplayChunk = 0;
    //TODO Check for rounding errors
    while(healthDisplayChunk < player.energy){
      $("#" + player.boardSide + "Box div .energy-bar").append("|");
      healthDisplayChunk ++;
    }

    //display defense and attack options
    //TODO: update to reflect change in game tracking player side
    $("#" + player.boardSide + "-player-options").empty();
    //TODO: Look into object comparison
    if (this.attackingPlayer === player) {
      player.attackStrings.forEach(function(attackString){
        $("#" + player.boardSide + "-player-options").append("<div class='attackRadio'><input type='radio' class='radOpt' name='attacks' value='" + attackString.attackValue + "'> " + attackString.attackValue + "</div>");
      });
      $("#" + player.boardSide + "-player-action").text("Attack");
    }
    if (this.defendingPlayer === player) {
      $("#" + player.boardSide + "-player-options").append("Remaining Defenses: ");
      player.defenseRegexs.forEach(function(defenseRegex){
        var displayClass = '';
        if(defenseRegex.defeated){displayClass = 'strikethrough'; console.log('drawing defeated regex');}
        $("#" + player.boardSide + "-player-options").append("<li class='" + displayClass + "'>" + defenseRegex.defenseObject + "</li>");
      });
      $("#" + player.boardSide + "-player-action").text("Defend");
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
  this.human = true;
  this.attackString;

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
Player.prototype.drawPlayer = function() {
//TODO: make drawPlayer
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
  this.stringColor;
  this.stringGraphic;
}


AttackString.prototype.calculateAttackCost = function() {
  var attackCost = this.attackValue.length; //TODO: calculate energy cost with something more algorithmically
  return attackCost;
}

//NOTE: generate color based on first char in string
AttackString.prototype.generateAttackAppearance = function() {
  // debugger;
  var firstLetterAscii = this.stringValue.charCodeAt(0);
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
  this.stringColor;
  this.stringGraphic;
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
  var regexCost = specialCharCounter - 2; //subtract 2 for the / characters
  return regexCost;
}


DefenseRegex.prototype.generateDefenseAppearance = function() {

}

/*======UI/DISPLAY====================================================================*/
DefenseRegex.prototype.drawDefense = function() {
  this.generateDefenseAppearance();
}

function logEvent(string, inputColor){
  var color;
  if(inputColor){color = inputColor;}
  $('#event-log').append("<li style='color:" + color + "'>" + string + "</li>");
  $('#event-log').scrollTop($('#event-log li').last().position().top);
}

function testGame() {
  //TODO: Game object should take care of keeping track of boardSide
  var player1 = new Player("SnakeMan", makeDefenseLibrary(testRegexLibrary), makeAttackLibrary(testStringLibrary), 'left');
  var player2 = new Player("ManSnake", makeDefenseLibrary(testRegexLibrary), makeAttackLibrary(testStringLibrary), 'right');

  var players = [player1, player2];

  var testGame = new Game(players, "SnakeMan vs ManSnake: A Tale of Two Rejects");

  testGame.displayPlayerInfo();

  console.log(testGame);

  //Check that cost algorithm is working for regexs
  for (var playerIndex = 0; playerIndex < testGame.players.length; playerIndex++) {
    for (var regIndex = 0; regIndex < testGame.players[playerIndex].defenseRegexs.length; regIndex++) {
      console.log("Regex Energy Cost for " + testGame.players[playerIndex].playerName + "\'s Regex with Value of " + testGame.players[playerIndex].defenseRegexs[regIndex].defenseObject.toString() + ": " + testGame.players[playerIndex].defenseRegexs[regIndex].energyCost);
    }
  }

  return testGame;
}


function initializeGame() {

}


$(document).ready(function(){
  // debugger;
  var myGame = testGame();
  logEvent('Start!');

  //TODO: allow for 2 human players
  $("#left-player-action").click(function() {
    //TODO: refactor to allow for left right player action functionality to be combined
    var leftPlayer = myGame.getPlayerAtPosition("left");
    console.log(leftPlayer.playerName);
    var attackValue = $("input[name=attacks]:checked").val();
    console.log('checked ' + attackValue);
    leftPlayer.attackString = new AttackString(attackValue);
    if (myGame.attackingPlayer.boardSide === "left") {
      myGame.evaluateTurn();
    }
  });

  //TODO: See if we can get index out of jquery radio button selection
  $("#right-player-action").click(function() {
    var rightPlayer = myGame.getPlayerAtPosition("right");
    console.log(rightPlayer.playerName);
    var attackValue = $("input[name=attacks]:checked").val();
    console.log('checked ' + attackValue);
    rightPlayer.attackString = new AttackString(attackValue);;
    if (myGame.attackingPlayer.boardSide === "right") {
      myGame.evaluateTurn();
    }
  });

  // var currentGame = new Game(tierOneLibrary, 'stringInputMode');
  // $('#regex1').val(currentGame.regexLibrary[0]);
  // var regexIndex = 0;
  //
  // $('#test-regex').click(function(){
  //   $('#regex1').val(currentGame.regexLibrary[regexIndex]);
  //   var regexTest = currentGame.regexLibrary[regexIndex]
  //   var input = $('#user-string').val();
  //
  //   if(currentGame.mode === 'stringInputMode'){
  //     var result = currentGame.testRegex(regexTest, input);
  //   } else {
  //     var result = currentGame.testRegex(input,currentGame.regexLibrary[regexIndex]);
  //   }
  //
  //   if(result){
  //     console.log('correct');
  //     regexIndex++;
  //     $('#regex1').val(currentGame.regexLibrary[regexIndex]);
  //     if(regexIndex === currentGame.regexLibrary.length - 1){
  //       currentGame = new Game(tierTwoLibraryStrings, 'regexInputMode');
  //       regexIndex = 0;
  //     }
  //   } else {
  //     console.log('wrong');
  //   }
  // });
});
