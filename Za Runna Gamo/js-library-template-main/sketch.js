//VARIABLES
var coin,coinimg,coingroup
var rock,rockimg,rockgroup
var bg,bgimg
var laser,laserimg,lasergroup
var runner,runner_jumping,runner_running_right,runner_running_left
var gameover
var gameend
var restart
var platform,platformimg,platformgroup
var gem,gemimg,gemgroup
var invisgroundbottom,invisgroundup
var gameState="play"
var score=0
var lives=3
//FUNCTIONS
function preload() {
    bgimg=loadImage("assets/bg.jpg")
    runner_running_right=loadAnimation("assets/alien_runner.png")
    runner_running_left=loadAnimation("assets/alien_runner.png")
    runner_jumping=loadImage("assets/alien_runner.png")
    platformimg=loadImage("assets/space_platform.png")
    coinimg=loadAnimation("assets/star_coin.png")
    laserimg=loadImage("assets/blue_laser.png")
    gemimg=loadImage("assets/red_gem.png")
    rockimg=loadImage("assets/meteorite.jpeg")
}
function setup() {
    createCanvas(1542,700)
    bg=createSprite(500,250,1542,700)
    bg.addImage("bg",bgimg)
    runner=createSprite(80,470,60,60)
    runner.addAnimation("running_right",runner_running_right)
    runner.addAnimation("running_left",runner_running_left)
    runner.addImage("runner_jump",runner_jumping)
    runner.debug=false
    runner.scale=0.4
    invisgroundbottom=createSprite(20,580,30000,20)
    invisgroundbottom.visible=false
    coingroup=new Group()
    rockgroup=new Group()
    lasergroup=new Group()
    gemgroup=new Group()
    platformgroup=new Group()
}
function draw() {
    background(0)
    drawSprites()
    textSize(20)
    strokeWeight(2)
    stroke("black")
    fill("white")
    text("Score: "+score,runner.x-120,runner.y-120)
    text("Lives: "+lives,runner.x-100,runner.y-100)
    if(gameState==="play") {
        bg.velocityX=-2
        camera.position.x=runner.x
        camera.position.y=runner.y
        if(runner.position.x<=0) {
            runner.position.x=0
        }

        if(keyDown("up")) {
            runner.velocityY=-10
            runner.changeImage("runner_jump")
        }
        runner.velocityY+=0.8
        if(keyDown("down")) {
            runner.y+=10
            runner.changeAnimation("running_right")
        }
        if(keyDown("right")) {
            runner.x+=5
            runner.changeAnimation("running_right")
        }
        if(keyDown("left")) {
            runner.x-=5
            runner.changeAnimation("running_left")
        }
        runner.collide(invisgroundbottom)
        if(bg.x<0) {
            bg.x=1000
        }
        if(platformgroup.isTouching(runner)) {
            runner.velocityY=0
            runner.collide(platformgroup)

        }
        coingroup.isTouching(runner,destroycoin) 
        gemgroup.isTouching(runner,destroygem)
        rockgroup.isTouching(runner,destroyrock)

        if(lasergroup.isTouching(runner)    ||  score<0   ||    lives<0) {
            gameState="end"
    }   
    spawnPlatforms()
    spawnGems()
    spawnRocks()
    spawnLasers()
}
        
        
    if(gameState==="end") { 
        runner.destroy()
        platformgroup.setVelocityXEach(0)
        platformgroup.destroyEach()
        coingroup.destroyEach()
        rockgroup.setVelocityXEach(0)
        rockgroup.destroyEach()
        lasergroup.setVelocityXEach(0)
        lasergroup.destroyEach()
        gemgroup.setVelocityXEach(0)
        gemgroup.destroyEach()
        bg.velocityX=0
        gameOver()
    }}

function destroycoin(coin) {
    coin.destroy()
    score+=3
}
function destroygem(gem) {
    gem.destroy()
    score+=5
}
function destroyrock(rock) {
    rock.destroy()
    score-=3
    life-=1
}

function spawnPlatforms() {
    if(frameCount%100===0) {
        platform=createSprite(runner.x+300,250,60,60)
        platform.y=Math.round(random(100,450))
        platform.addImage("platform",platformimg)
        platform.scale=0.6
        platform.velocityX=-2
        platform.lifetime=400
        runner.depth=platform.depth
        runner.depth+=1
        coin=createSprite(platform.x,platform.y-50,40,40)
        coin.addAnimation("coin",coinimg)
        coin.scale=0.15
        coin.x=platform.x
        coin.lifetime=400
        coin.velocityX=-2
        coingroup.add(coin)
        platformgroup.add(platform)
        platform.debug=false
        platform.setCollider('rectangle',0,0,80,40)
    }
}
function spawnGems() {
    if(frameCount%500===0) {
        gem=createSprite(runner.x+600,Math.round(random(100,400)),60,60)
        gem.addImage("gem",gemimg)
        gem.scale=0.1
        gem.velocityX=-2
        gem.lifetime=400
        gemgroup.collide(platformgroup)
        gemgroup.add(gem)
    }
}
function spawnRocks() {
    if(frameCount%300===0) {
        rock=createSprite(runner.x+600,Math.round(random(100,400)),60,60)
        rock.addImage("rock",rockimg)
        rock.scale=0.1  
        rock.velocityX=-4
        rock.lifetime=400
        rockgroup.add(rock)
    }
}
function spawnLasers() {
    if(frameCount%200===0) {
        laser=createSprite(runner.x+600,Math.round(random(100,400)),60,60)
        laser.addImage("laser",laserimg)
        laser.scale=0.1
        laser.velocityX=-6
        laser.lifetime=400
        lasergroup.add(laser)
    }
}
function gameOver() {
    gameState = "end"
    swal({
        title:'Game Over!!',
        text:'Thanks For Playing!',
        imageUrl:'assets/gameEnd.png',
        imageSize:'150x150',
        confirmButtonText:'Play Again?!'
    },
    function(isConfirm) {
        if(isConfirm) {
            location.reload()
        }
    })
}