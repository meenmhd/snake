const canvas = document.getElementById('snake');
const context = canvas.getContext('2d');

/* Define colors */

const colors = [
    null,
    '#444444',    /* background */
    '#FF0090',    /* snake */
    '#0DFF00',    /* food */
    '#CC0040',    /* food */
];

context.scale(20, 20);

const food = [];
function create_food(food){
  if (food.length>0){
    food = [];
  }
  for (i=0;i<9;i++) {
    let locationOK = 1;
    do {
      locationOK = 1;
      locx = canvas.width/20 * Math.random() | 0;
      locy = canvas.height/20 * Math.random() | 0;
      console.log('Gen ',i,' = ',locx,locy);

      for (k=0;k<food.length;k++){
        console.log('k = ',k,'(',food[k].pos.x,food[k].pos.y,')')
        if(locx==food[k].pos.x && locy==food[k].pos.y){
          console.log('Repeat -----',locx,locy);
          locationOK = 0;
          break
        }
      }
      if (locx==10 && locy==7){
        locationOK = 0;
      }
    } while (locationOK==0);

    food.push({
        pos: {x:locx, y:locy},
        value: Math.floor(i+1)
    });
  }
};

create_food(food);

player = {
    pos: {x: 10, y: 7},
    direction: 'Left',
    tail: [{dir:'Right', num:2}, {dir:'Up', num:3},{dir:'Left', num:2}],
    tails : [],
    score: 0,
};

target = Math.floor(Math.random() * (35-20) + 20);
console.log("Target= ", target);
document.getElementById('target').innerText = target;


//////// new function
function update(){
  let alltail = player.tail;
  for(i=0;i<food.length;i++){
    if (player.pos.x == food[i].pos.x && player.pos.y==food[i].pos.y){
      player.score += food[i].value;
      player.tail[player.tail.length-1].num += 1;
      food.splice(i,1)
      break
    }
  }

  context.fillStyle = '#000000';
  context.fillRect(0, 0, canvas.width/20, canvas.height/20);
  context.fillStyle = colors[3];
  context.fillRect(player.pos.x,  player.pos.y, 1, 1);

  let dir = 'Still';
  let currentx = player.pos.x;
  let currenty = player.pos.y;

  for (let x = 0; x < alltail.length; ++x) {
    dir = alltail.slice(x)[0].dir;
    for (let y = 0; y < alltail.slice(x)[0].num; ++y) {
      if (dir == 'Left') {
        currentx -= 1;
        if (currentx < 0) {
            currentx = canvas.width/20-1;
        }
        player.tails.push({x:currentx,y:currenty})
        context.fillStyle = colors[4];
        context.fillRect(currentx, currenty,1, 1);
      }
      if (dir == 'Right') {
        currentx += 1;
        if (currentx>=canvas.width/20) {
            currentx = 0;
        }
        player.tails.push({x:currentx,y:currenty})
        context.fillStyle = colors[4];
        context.fillRect(currentx, currenty,1, 1);
      }
      if (dir == 'Down') {
        currenty += 1;
        if (currenty>=canvas.height/20) {
            currenty = 0;
        }
        player.tails.push({x:currentx,y:currenty})
        context.fillStyle = colors[4];
        context.fillRect(currentx, currenty,1, 1);
      }
      if (dir == 'Up') {
        currenty -= 1;
        if (currenty < 0) {
            currenty = canvas.height/20 -1;
        }
        player.tails.push({x:currentx,y:currenty})
        context.fillStyle = colors[4];
        context.fillRect(currentx, currenty,1, 1);
      }
    }

    for (let x= 0 ;x<player.tails.length;++x){
      if (player.pos.x == player.tails[x].x && player.pos.y == player.tails[x].y){
        alert('GAME OVER');
        window.location.href = window.location.href;
      }
    }
  }

  for(i=0;i<food.length;i++){
    context.font = "1px Verdana";
    context.fillText(food[i].value.toString(), food[i].pos.x,food[i].pos.y+1);
  }
  if (player.score==target){
    alert('CONGRATULATIONS');
    window.location.href = window.location.href;
  } else if(player.score>target){
    alert('TRY AGAIN');
    window.location.href = window.location.href;
  }
  document.getElementById('score').innerText = player.score;
}

update();

/////////////////////////////////// Left
document.addEventListener('keydown', event => {
  let alltail = player.tail;
  if (event.keyCode === 37) {
    if (player.direction == 'Right') {
      return;
    }
    player.direction = 'Left';
    player.tails = []
    player.pos.x -= 1;
    if (player.pos.x<0 ){
      player.pos.x = canvas.width/20-1;
    }

    if (alltail.length > 0) {
      if (alltail[0].dir == 'Right') {
        alltail[0].num += 1;
      } else {
        alltail.unshift({dir:'Right', num:1});
      }

      alltail[alltail.length-1].num -= 1;
      if(alltail[alltail.length-1].num == 0){
        alltail.pop();
      }
    }
    update()

/////////////////////////////////// UP
  } else if (event.keyCode === 38) {
    if (player.direction == 'Down') {
      return;
    }
    player.direction = 'Up';
    player.tails = []
    player.pos.y -= 1
    if (player.pos.y < 0 ){
      player.pos.y = canvas.height/20-1;
    }

    if (alltail.length > 0) {
      if (alltail[0].dir == 'Down') {
        alltail[0].num += 1;
      } else {
        alltail.unshift({dir:'Down', num:1});
      }

      alltail[alltail.length-1].num -= 1;
      if(alltail[alltail.length-1].num == 0){
        alltail.pop();
      }
    }
    update()

/////////////////////////////////// Right
  } else if (event.keyCode === 39) {
    if (player.direction == 'Left') {
      return;
    }
    player.direction = 'Right';
    player.tails = []
    player.pos.x += 1
    if (player.pos.x >canvas.width/20 -1 ){
      player.pos.x = 0;
    }

    if (alltail.length > 0) {
      if (alltail[0].dir == 'Left') {
        alltail[0].num += 1;
      } else {
        alltail.unshift({dir:'Left', num:1});
      }

      alltail[alltail.length-1].num -= 1;
      if(alltail[alltail.length-1].num == 0){
        alltail.pop();
      }
    }
    update()

/////////////////////////////////// Down
  } else if (event.keyCode === 40) {
    if (player.direction == 'Up') {
      return;
    }
    player.direction = 'Down';
    player.tails = []
    player.pos.y += 1
    if (player.pos.y >canvas.height/20-1 ){
      player.pos.y = 0;
    }

    if (alltail.length > 0) {
      if (alltail[0].dir == 'Up') {
        alltail[0].num += 1;
      } else {
        alltail.unshift({dir:'Up', num:1});
      }

      alltail[alltail.length-1].num -= 1;
      if(alltail[alltail.length-1].num == 0){
        alltail.pop();
      }
    }
    update()
  }
});
