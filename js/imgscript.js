var suitImages = ['img/suit1.png','img/suit2.png','img/suit3.png','img/suit4.png']
var snakeImages = ['img/snake.png','img/snake1.png','img/snake2.png','img/snake3.png']
var leftIndex = 0;
var rightIndex = 0;
var delay = 200;
var leftTimer;
var rightTimer;

function animateLeftPNG() {
  if(leftIndex >= suitImages.length){
    leftIndex = 0;
  }
  if (leftIndex < suitImages.length){
    $('.avatarLeft').attr('src', suitImages[leftIndex]);
    leftIndex ++;
  }
}

function animateRightPNG() {
  if(rightIndex >= snakeImages.length){
    rightIndex = 0;
  }
  if (rightIndex < snakeImages.length){
    $('.avatarRight').attr('src', snakeImages[rightIndex]);
    rightIndex ++;
  }
}

$(document).ready(function() {
    leftTimer = setInterval(animateLeftPNG, delay);
    //animateLeftPNG();

    rightTimer = setInterval(animateRightPNG, delay);
    animateRightPNG();
});
