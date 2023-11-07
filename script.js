window.onload = main;
function main() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  
  var balls = [];
  var rank = [];
  let speed = getParameterByName('speed')?parseInt(getParameterByName('speed')):1;
  if(getParameterByName('members') && getParameterByName('members').includes(',')){
    getParameterByName('members').split(',').forEach(function(member) {
      balls.push({
        id: member,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() * 2 - 1) * 5,
        dy: (Math.random() * 2 - 1) * 5,
        
        radius: getParameterByName('radius')?parseInt(getParameterByName('radius')):12
      });
    });
  }else{
    for (var i = 0; i < parseInt(getParameterByName('members')); i++) {
      balls.push({
        id: i + 1,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() * 2 - 1) * 5,
        dy: (Math.random() * 2 - 1) * 5,
        radius: getParameterByName('radius')?parseInt(getParameterByName('radius')):12
      });
    }
  }
  
  function drawBall(ball) {
    ctx.beginPath();
    
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    
    // Add text to the center of the ball
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${ball.radius}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ball.id, ball.x, ball.y);
    
    ctx.closePath();
  }
  
  function drawRank() {
    var rankText = "Rank: ";
    for (var i = 0; i < rank.length; i++) {
      rankText += rank[i] + " ";
    }
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(rankText, 200, canvas.height - 10, 400);
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var i = 0; i < balls.length; i++) {
      var ball = balls[i];
      
      drawBall(ball);
      
      if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
      }
      if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
      }
      
      ball.x += ball.dx;
      ball.y += ball.dy;
      
      // Check for collisions with other balls
      for (var j = i + 1; j < balls.length; j++) {
        var otherBall = balls[j];
        var dx = ball.x - otherBall.x;
        var dy = ball.y - otherBall.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball.radius + otherBall.radius) {
          // Collision detected, reverse velocities
          var tempDx = ball.dx;
          var tempDy = ball.dy;
          ball.dx = otherBall.dx;
          ball.dy = otherBall.dy;
          otherBall.dx = tempDx;
          otherBall.dy = tempDy;
          
          // Increase/decrease radius
          if (Math.random() < 0.5) {
            ball.radius -= 2;
            otherBall.radius += 2;
            otherBall.dx = otherBall.dx + speed;
            otherBall.dy = otherBall.dy + speed;
          } else {
            ball.radius += 2;
            ball.dx = ball.dx + speed;
            ball.dy = ball.dy + speed;
            otherBall.radius -= 2;
          }
          if (ball.radius < 4) {
            rank.push(ball.id);
            balls.splice(i, 1);
          } 
          if (otherBall.radius < 4) {
            rank.push(otherBall.id);
            balls.splice(j, 1);
          }
        }
      }
    }
    drawRank()
  }
  setInterval(draw, 10);
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
