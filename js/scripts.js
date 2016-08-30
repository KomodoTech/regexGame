
var tierTwoLibraryStrings = ['dog', 'coffee', 'portmanteau'];
var tierOneLibrary = [new RegExp('0'), new RegExp('0|1'), new RegExp('[^01]'), new RegExp('^[01]')];


/*=GAME OBJECT================================================================*/
/*=BACKEND====================================================================*/
function Game(players, gameTitle) {
  this.attackingPlayer = players[0]; //NOTE: ASSUME TWO PLAYERS FOR NOW
  this.defendingPlayer = players[1];
  this.gameName = gameTitle; //"SnakeMan vs ManSnake: A Tale of Rejects"
}


//NOTE: game will take attackingPlayer's currentString and compare it to defendingPlayer's currentRegex
Game.prototype.testStrings = function(regex, testStrings) {
  var passed = [];
  for (var stringIndex = 0; stringIndex < testStrings.length; stringIndex++) {
    console.log("regex: " + regex + " userString: " + userString);

    //NOTE: Allows user to pass in a single string directly instead of an array
    if (testStrings.length > 1) {
      var passedTest = regex.test(testStrings[stringIndex]);
    }
    else {
      var passedTest = regex.test(testStrings);
    }
    if (passedTest) {
      alert("Well done ya diggity dawgington");
    }
    else {
      alert("We know regex is tough. Try again");
    }
    passed.push(passedTest);
  }
  return passed;
}

/*=UI=========================================================================*/




/*=PLAYER OBJECT==============================================================*/
/*======BACKEND===============================================================*/
function Player(name, regexlibrary, stringLibrary) {
  this.playerName = name;
  this.energy = 100;
  this.bodyParts = [];
  this.attackStrings = stringLibrary;
  this.defenseRegexs = regexLibrary;
  this.human = 1;

  //TODO: find a less error prone way of organizing this
  this.mode = 0; //DEFENSE=0 ATTACK=1

  this.currentRegex = this.regexLibrary[0];
  this.currentString = this.stringLibrary[0];
}



Player.prototype.addRegexToLibrary = function(regexInstance) {
  this.regexLibrary.push(regexInstance);
}

Player.prototype.removeRegexFromLibrary = function(regexInstanceIndex) {
  this.regexLibrary.splice(regexInstanceIndex, 1);
}

Player.prototype.setCurrentRegex = function(regexIndex) {
  this.currentRegex = this.regexLibrary[regexIndex];
}

Player.prototype.addStringToLibrary = function(attackString) {

}


Player.prototype.attack = function(attackTarget, attackString) {

}

Player.prototype.defend = function(defenseTarget, degenseRegex) {

}

Player.prototype.removeBodyPart = function(bodyPartIndex) {
  var removedPart = this.bodyParts.splice(bodyPartIndex, 1);
  return removedPart;
}

Player.prototype.modifyEnergy = function(energyChangeAmount) {
  this.energy += energyChangeAmount;
}

/*======UI/DISPLAY====================================================================*/
Player.prototype.drawPlayer = function() {

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
