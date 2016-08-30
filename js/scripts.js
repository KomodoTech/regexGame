
var testStringLibrary = ['dog', 'coffee', 'portmanteau'];
var testRegexLibrary = ['0', '0|1', '[^01]', '^[01]'];


function makeAttackLibrary(stringLibrary) {
  for (var stringIndex = 0; stringIndex < stringLibrary.length; stringIndex++) {
    var attack = new AttackString(stringLibrary[stringIndex]);
    stringLibrary[stringIndex] = attack;
  }
}

function makeDefenseLibrary(regexLibrary) {
  for (var regexIndex = 0; regexIndex < regexLibrary.length; regexIndex++) {
    var defense = new DefenseRegex(regexLibrary[regexIndex]);
    regexLibrary[regexIndex] = defense;
  }
}

/*=GAME OBJECT================================================================*/
/*=BACKEND====================================================================*/
function Game(players, gameTitle) {
  this.attackingPlayer = players[0]; //NOTE: ASSUME TWO PLAYERS FOR NOW
  this.defendingPlayer = players[1];
  this.gameName = gameTitle; //"SnakeMan vs ManSnake: A Tale of Rejects"
  this.gameOver = 0;
}


//NOTE: game will take attackingPlayer's currentString and compare it to defendingPlayer's currentRegex
Game.prototype.evaluateTurn = function() {
  while (this.defendingPlayer.currentRegexIndex < this.defendingPlayer.defenseRegexs.length) {
    this.evaluateAttack();
    this.defendingPlayer.currentRegexIndex++;
  }
}
Game.prototype.evaluateAttack = function() {
  var attackingPlayerString = this.attackingPlayer.getCurrentStringObject();
  var defendingPlayerRegex = this.defendingPlayer.getCurrentRegexObject();

  var attackSuccess = this.testStringWithRegex(attackingPlayerString.literalValue, defendingPlayerRegex.literalValue);

  if (attackSuccess) {
    this.defendingPlayer.removeRegexFromLibrary();
    console.log("success");
    //TODO: balance player energy attack and defense
    this.modifyEnergy(defendingPlayerRegex.energyCost);
  }
  else {
    console.log("miss");
  }
}


Game.prototype.testStringWithRegex = function(testString, testRegex) {
  console.log("attack: " + testString);
  console.log("defense: " + testRegex);
  var accepted = testRegex.test(testString);
  return accepted;
}

/*=UI=========================================================================*/




/*=PLAYER OBJECT==============================================================*/
/*======BACKEND===============================================================*/
function Player(name, regexLibrary, stringLibrary) {
  this.playerName = name;
  this.energy = 100;
  this.attackStrings = stringLibrary;
  this.defenseRegexs = regexLibrary;
  this.human = 1;

  this.currentRegexIndex = 0;
  this.currentStringIndex = 0;
}

Player.prototype.getCurrentRegexObject = function() {
  return this.defenseRegexs[this.currentRegexIndex];
}

Player.prototype.addRegexToLibrary = function(regexInstance) {
  this.regexLibrary.push(regexInstance);
}

Player.prototype.removeRegexFromLibrary = function() {
  var removedRegex = this.defenseRegexs.splice(currentRegexIndex, 1);
  return removedRegex;
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

Player.prototype.removeStringFromLibrary = function(stringInstanceIndex) {
  var removedString =  this.attackStrings.splice(stringInstanceIndex);
  return removedString;
}

Player.prototype.setCurrentStringIndex = function(stringIndex) {
  this.currentStringIndex = stringIndex;
}


Player.prototype.modifyEnergy = function(energyChangeAmount) {
  this.energy += energyChangeAmount;
}

/*======UI/DISPLAY====================================================================*/
Player.prototype.drawPlayer = function() {

}

Player.prototype.attack = function() {
  this.attackStrings[currentStringIndex].drawAttack();
}

Player.prototype.defend = function() {
  this.defenseRegexs[currentRegexIndex].drawDefense();
}

/*=AttackString Object================================================================*/
/*======BACKEND=======================================================================*/
function AttackString(stringValue) {
  this.literalValue = stringValue;
  this.energyCost;
  this.attackName;
  this.stringColor;
  this.stringGraphic;
}


AttackString.prototype.calculateAttackCost = function() {

}

//NOTE: generate color based on first char in string
AttackString.prototype.generateAttackAppearance = function() {
  debugger;
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
  this.literalValue = new RegExp(regexValue);
  this.stringColor;
  this.stringGraphic;
  this.energyCost;
  this.attackName;
}


DefenseRegex.prototype.calculateDefenseCost = function() {

}


DefenseRegex.prototype.generateDefenseAppearance = function() {

}

/*======UI/DISPLAY====================================================================*/
DefenseRegex.prototype.drawDefense = function() {
  this.generateDefenseAppearance();
}







function testGame() {
  // debugger;
  // var attackString = new AttackString("As jhk");
  // attackString.generateAttackAppearance();
  // var coloredString = attackString.stringValue.fontcolor(attackString.stringColor);
  // console.log('%c ' + coloredString, 'background: #fff; color: ' + attackString.stringColor);
  makeAttackLibrary(testStringLibrary);
  makeDefenseLibrary(testRegexLibrary);

  var player1 = new Player("SnakeMan", testRegexLibrary, testStringLibrary);
  var player2 = new Player("ManSnake", testRegexLibrary, testStringLibrary);

  var players = [player1, player2];

  var testGame = new Game(players, "SnakeMan vs ManSnake: A Tale of Two Rejects");
  console.log(testGame);
  testGame.evaluateTurn();
}

function initializeGame() {

}


$(document).ready(function(){
  // debugger;
  testGame();

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
