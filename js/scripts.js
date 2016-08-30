
var tierTwoLibraryStrings = ['dog', 'coffee', 'portmanteau'];
var tierOneLibrary = [new RegExp('0'), new RegExp('0|1'), new RegExp('[^01]'), new RegExp('^[01]')];


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
  var attackingPlayerString = this.attackingPlayer.currentString;
  var defendingPlayerRegex = this.defendingPlayer.currentRegex;

  //TODO: ugly fix this hack
  var defendingPlayerRegexIndex = this.defendingPlayer.defenseRegexs.indexOf(defendingPlayerRegex);

  var attackSuccess = this.testStringWithRegex(attackingPlayerString, defendingPlayerRegex);

  if (attackSuccess) {
    this.defendingPlayer.removeRegexFromLibrary(defendingPlayerRegexIndex);

    //TODO: balance player energy attack and defense
    this.modifyEnergy(defendingPlayerRegex.energyCost);
  }
}


Game.prototype.testStringWithRegex = function(testString, testRegex) {
  var accepted = testRegex.test(testString);
  return accepted;
}

/*=UI=========================================================================*/




/*=PLAYER OBJECT==============================================================*/
/*======BACKEND===============================================================*/
function Player(name, regexlibrary, stringLibrary) {
  this.playerName = name;
  this.energy = 100;
  this.attackStrings = stringLibrary;
  this.defenseRegexs = regexLibrary;
  this.human = 1;

  //TODO: find a less error prone way of organizing this
  //NOTE: Is this necessary?
  this.mode = 0; //DEFENSE=0 ATTACK=1

  this.currentRegexIndex = 0;
  this.currentStringIndex = 0;
}



Player.prototype.addRegexToLibrary = function(regexInstance) {
  this.regexLibrary.push(regexInstance);
}

Player.prototype.removeRegexFromLibrary = function(regexInstanceIndex) {
  var removedRegex = this.defenseRegexs.splice(regexInstanceIndex, 1);
  return removedRegex;
}

Player.prototype.setCurrentRegexIndex = function(regexIndex) {
  this.currentRegexIndex = regexIndex;
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
function AttackString(literalValue) {
  this.stringValue = literalValue;
  this.stringColor;
  this.stringGraphic;
  this.energyCost;
  this.attackName;
}


AttackString.prototype.calculateAttackCost = function() {

}


AttackString.prototype.generateAttackAppearance = function() {

}

/*======UI/DISPLAY====================================================================*/
AttackString.prototype.drawAttack = function() {
  this.generateAttackAppearance();
}




/*=DefenseRegex Object================================================================*/
/*======BACKEND=======================================================================*/
function DefenseRegex(literalValue) {
  this.stringValue = literalValue;
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









function initializeGame() {
}


$(document).ready(function(){

  var currentGame = new Game(tierOneLibrary, 'stringInputMode');
  $('#regex1').val(currentGame.regexLibrary[0]);
  var regexIndex = 0;

  $('#test-regex').click(function(){
    $('#regex1').val(currentGame.regexLibrary[regexIndex]);
    var regexTest = currentGame.regexLibrary[regexIndex]
    var input = $('#user-string').val();

    if(currentGame.mode === 'stringInputMode'){
      var result = currentGame.testRegex(regexTest, input);
    } else {
      var result = currentGame.testRegex(input,currentGame.regexLibrary[regexIndex]);
    }

    if(result){
      console.log('correct');
      regexIndex++;
      $('#regex1').val(currentGame.regexLibrary[regexIndex]);
      if(regexIndex === currentGame.regexLibrary.length - 1){
        currentGame = new Game(tierTwoLibraryStrings, 'regexInputMode');
        regexIndex = 0;
      }
    } else {
      console.log('wrong');
    }
  });
});
