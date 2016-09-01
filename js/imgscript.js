var suitImages = ['img/SnakeMan1.png','img/SnakeMan2.png','img/SnakeMan3.png']
var snakeImages = ['img/ManSnake1.png','img/ManSnake2.png','img/ManSnake3.png']
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
    $('.avatarLeft').attr('z-index', 20);
    leftIndex ++;
  }
}

function animateRightPNG() {
  if(rightIndex >= snakeImages.length){
    rightIndex = 0;
  }
  if (rightIndex < snakeImages.length){
    $('.avatarRight').attr('src', snakeImages[rightIndex]);
    $('.avatarRight').attr('z-index', 20);
    rightIndex ++;
  }
}

$(document).ready(function() {
    leftTimer = setInterval(animateLeftPNG, delay);
    //animateLeftPNG();

    rightTimer = setInterval(animateRightPNG, delay);
    animateRightPNG();
});
