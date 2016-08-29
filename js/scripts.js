var tierTwoLibraryStrings = ['dog', 'coffee', 'portmanteau'];
var tierOneLibrary = [new RegExp('0'), new RegExp('0|1'), new RegExp('[^01]'), new RegExp('^[01]')];


/*=GAME OBJECT================================================================*/
/*=BACKEND====================================================================*/
function Game(library, inputMode) {
  this.regexLibrary = library;
  this.mode = inputMode;
  this.currentRegex = this.regexLibrary[0];
}

Game.prototype.testRegex = function(regex, userString) {
  console.log("regex: " + regex + " userString: " + userString);

  var passedTest = regex.test(userString);
  if (passedTest) {
    alert("Well done ya diggity dawgington");
  }
  else {
    alert("We know regex is tough. Try again");
  }
  return passedTest;
}


Game.prototype.addRegexToLibrary = function(regexInstance) {
  this.regexLibrary.push(regexInstance);
}

Game.prototype.removeRegexFromLibrary = function(regexInstanceIndex) {
  this.regexLibrary.splice(regexInstanceIndex, 1);
}

Game.prototype.setCurrentRegex = function(regexIndex) {
  this.currentRegex = this.regexLibrary[regexIndex];
}

Game.prototype.testMultipleStrings = function(regex, testStrings) {
  var passed = [];
  for (var stringIndex = 0; stringIndex < testStrings.length; stringIndex++) {
    passed.push(this.testRegex(regex, testStrings[stringIndex]));
  }
  return passed;
}

/*=UI=========================================================================*/



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
