const canvas = document.querySelector('#canvas')

const displayMap = document.querySelector('#map')
const ctx = canvas.getContext('2d')
const gameover = document.querySelector('#gameover')
const scoreDisplay = document.querySelector('#scoreDisplay')

const eat = document.querySelector('#eat')

ctx.scale(35, 35)

let playAudio = true
let spawnGhosts = true

let jogando = true
let scores = 0

const sprites = new Image()
sprites.src = './imgs/sprites.png'


const keys = {
    arrowLeft: {
        pressed: false
    },
    arrowUp: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    },
    arrowDown: {
        pressed: false
    },

}

const ghostSprites = {
    redGhost: {
        src: './imgs/sprites.png',
        spritePosition: 0,
        spriteMax: 1,
    },

    orangeGhost: {
        src: './imgs/sprites.png',
        spritePosition: 2,
        spriteMax: 3
    }

}



for(let prop in ghostSprites){
    ghostSprites[prop].image = new Image()
    ghostSprites[prop].image = ghostSprites[prop].src
}


const scenario = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    delay: 0,
    arena: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1],
        [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
        [1, 0, 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, 0, 1],
        [1, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 1],
        [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
        [1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1],
        [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
        [4, 0, 2, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 1, 0, 2, 0, 4],
        [4, 0, 2, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 1, 0, 2, 0, 4],
        [1, 0, 2, 0, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 2, 0, 1],
        [1, 0, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0, 1],
        [1, 0, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0, 1],
        [1, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 1],
        [1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 1],
        [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
        [1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    ghosts: [],

    spriteWidth: sprites.width / 14,
    spriteHeight: sprites.height / 4,
    spriteAtual: 0,

    left: 2,
    up: 3,
    right: 0,
    down: 1,
    
    offset: {
        x: 0,
        y: 0
    },

    leftSide: false,
    rightSide: false,

    drawScenario: function(){
        this.delay++

        this.arena.forEach((row, y) => {
            row.forEach((col, x) => {
                if(col === 2){
                    ctx.fillStyle = 'yellow'
                    ctx.fillRect(x + 0.25, y + 0.25 , 0.5, 0.5)
                }
  
                if(col === 0){
                    ctx.fillStyle = 'black'
                    ctx.fillRect(x, y, 1, 1)
                }
                if(col === 1){
                    ctx.fillStyle = 'blue'
                    ctx.fillRect(x, y, 1, 1)
                }

                if(col === 4){
                    ctx.fillStyle = 'black'
                    ctx.fillRect(x, y, 1, 1)
                }

            })
        })
    },

    drawGhosts: function(){
    
        if(spawnGhosts){
            spawnGhosts = false

            this.ghosts.push(
                redGhost = {      
                    spritePosition: 0,
                    positionStart: 0,
                    spriteMax: 1,
                    image: sprites,
                    randomNumberX: Math.round(Math.random() * 1000),
                    randomNumberY: Math.round(Math.random() * 1000),
                    moving: true,
                    movingX: true,
                    movingY: false,
                    x: 9,
                    y: 10
                },
                orangeGhost = {
                    spritePosition: 2,
                    positionStart: 2,
                    spriteMax: 3,
                    image: sprites,
                    randomNumberX: Math.round(Math.random() * 1000),
                    randomNumberY: Math.round(Math.random() * 1000),
                    moving: true,
                    movingX: true,
                    movingY: false,
                    x: 10,
                    y: 10
                },
                blueGhost = {
                    spritePosition: 6,
                    positionStart: 6,
                    spriteMax: 7,
                    image: sprites,
                    randomNumberX: Math.round(Math.random() * 1000),
                    randomNumberY: Math.round(Math.random() * 1000),
                    movingX: true,
                    movingY: false,
                    moving: true,
                    x: 11,
                    y: 10
                },
                purpleGhost = {
                    spritePosition: 8,
                    positionStart: 8,
                    spriteMax: 9,
                    image: sprites,
                    randomNumberX: Math.round(Math.random() * 1000),
                    randomNumberY: Math.round(Math.random() * 1000),
                    moving: true,
                    movingX: true,
                    movingY: false,
                    x: 8,
                    y: 10
                })
            }
                
                this.ghosts.forEach(ghost => {
                    
                    ctx.drawImage(
                        ghost.image, 

                        ghost.spritePosition * this.spriteWidth, 
                        this.right * this.spriteHeight, 
                        this.spriteWidth, this.spriteHeight, 

                        ghost.x, ghost.y, 1, 1)
        })

    },

    atualizaSprite: function(){
        this.ghosts.forEach(ghost => {
            
            if(this.delay % 10 === 0){
                ghost.spritePosition++
            }

            if(ghost.spritePosition > ghost.spriteMax){
                ghost.spritePosition = ghost.positionStart
            }

        })
    },

    ghostMovement: function(){

        let random = Math.round(Math.random() * 10)
        let vel = 1
    
        this.ghosts.forEach(ghost => {
            if(ghost.randomNumberX < 500 ){
                //Ir para direita
                if(ghost.movingX && this.delay % 10 === 0){
                    ghost.x+= vel
                    if(random === 2){
                        ghost.movingY = true
                        ghost.movingX = false
                    }
                }

                if(!ghost.moving){
                    ghost.x-= 1
                }
            }else{//Ir para a esquerda
                if(ghost.movingX && this.delay % 10 === 0){
                    ghost.x-= vel
                    if(random === 4){
                        ghost.movingY = true
                        ghost.movingX = false
                    }
                }

                if(!ghost.moving){
                    ghost.x+= 1
                }
            }

            if(ghost.randomNumberY < 500 ){
                //Ir para cima
                if(ghost.movingY && this.delay % 10 === 0){
                    ghost.y-= vel
                    if(random === 6){
                        ghost.movingY = false
                        ghost.movingX = true
                    }
                }

                if(!ghost.moving){
                    ghost.y+= 1
                }
            }else{//Ir para baixo
                if(ghost.movingY && this.delay % 10 === 0){
                    ghost.y+= vel
                    if(random === 8){
                        ghost.movingY = false
                        ghost.movingX = true
                    }
                }

                if(!ghost.moving){
                    ghost.y-= 1
                }
            }
          

        })
    },

    ghostBoundary: function(){
        this.ghosts.forEach(ghost => {
            
            let tileX = Math.floor(ghost.x)
            let tileY = Math.floor(ghost.y)


            if(tileY === 0){
                ghost.y = 10
                ghost.x = 8
                return
            }
            if(tileY === 20){
                ghost.y = 10
                ghost.x = 9
                return
            }
            if(tileX === 0){
                ghost.y = 10
                ghost.x = 10
                return
            }
            if(tileX === 20){
                ghost.y = 10
                ghost.x = 11
                return
            }
            

            if(this.arena[tileY][tileX] === 1){    
                ghost.moving = false
            }else{    
                ghost.moving = true
            }


            const teleport = () => {

                if(Math.floor(ghost.x) === 0 && Math.floor(ghost.y) === 9 || 
                    Math.floor(ghost.x) === 0 && Math.floor(ghost.y) === 10){
                       ghost.x = 19
                }
                if(Math.floor(ghost.x) === 19 && Math.floor(ghost.y) === 9 || Math.floor(ghost.x) === 19 && Math.floor(ghost.y) === 10){
                    ghost.x = 0
                    console.log('asdsad')
                }
            }

            teleport()
            
        })
    },

}



const player = {
    x: 2,
    y: 2,
    w: 1,
    h: 1,
    vel: 0.2,
    tileX: 0,
    tileY: 0,
    delay: 0,
    currentPosition: 0,
    mapCols: scenario.arena.length,
    collidePlayerWOnMap: false,
    collidePlayerXOnMap: false,
    teleportVar: false,

    imageWidth: sprites.width / 14,
    imageheight: sprites.height / 4,

    pacmanSprite: 10,
    spriteAtual: 0,

    right: 0,
    down: 1,
    left: 2,
    up: 3,


    offset: {
        x: 0,
        y: 0
    },
    
    
    
    drawPlayer: function(){
        this.delay++
        

        ctx.drawImage(sprites, this.offset.x, this.offset.y, 
            this.imageWidth, this.imageheight, 
            this.x, this.y, this.w, this.h)


        this.tileX = Math.floor(this.x)
        this.tileY = Math.floor(this.y)

        this.currentPosition = this.tileY * this.mapCols + this.tileX

    },

    atualizaSprite: function(){
      
        this.offset.x = this.pacmanSprite * this.imageWidth
        

        
        if(keys.arrowRight.pressed && this.delay % 5 === 0 ){
            this.offset.y = this.right * this.imageheight
            if(this.delay % 5 === 0){
                this.pacmanSprite++
            }
            
        }
        
        
        if(keys.arrowDown.pressed && this.delay % 5 === 0){
            this.offset.y = this.down * this.imageheight
            if(this.delay % 5 === 0){
                this.pacmanSprite++
            }
        }
        
        
        if(keys.arrowLeft.pressed && this.delay % 5 === 0){
            this.offset.y = this.left * this.imageheight
            if(this.delay % 5 === 0){
                this.pacmanSprite++
            }
        }
        
        
        if(keys.arrowUp.pressed && this.delay % 5 === 0){
            this.offset.y = this.up * this.imageheight
            if(this.delay % 5 === 0){
                this.pacmanSprite++
            }
        }



        if(this.pacmanSprite >= 12){
            this.pacmanSprite = 10
        }
        
        
        
    },
    

    eat: function(){
        let randomFoodX 
        let randomFoodY 

        const spawnaFood = () => {
            do{
                randomFoodX = Math.floor(Math.random() * 19)
                randomFoodY = Math.floor(Math.random() * 19)
            }while(
                scenario.arena[randomFoodY][randomFoodX] !== 0
            )

                scenario.arena[randomFoodY][randomFoodX] = 2

        }

        if(scenario.arena[this.tileY][this.tileX] === 2){
            scenario.arena[this.tileY][this.tileX] = 0
            scores++
            scoreDisplay.textContent = `Scores: ${scores}`

            spawnaFood()

            if(this.delay % 2 === 0){

                soundEffects.eating()
            }
            
        }

        

        
    },

    boundary: function(posX, posY){

            if(scenario.arena[this.tileY + posY][this.tileX + posX] === 1){
                return true
            }else{
                return false
            }

       
    },

    teleport: function(){   
     
        if(this.x === -1 && this.y === 9 || 
            this.x === -1 && this.y === 10){
                this.x = 19
        }
        if(this.x === 20 && this.y === 9 || this.x === 20 && this.y === 10){
            this.x = 0
        }

    },

    collisionOnPacman: function(){
        scenario.ghosts.forEach(ghost => {
                if(this.tileX === Math.floor(ghost.x) &&
                    this.tileY === Math.floor(ghost.y)){
            
                    soundEffects.death()
                    jogando = false

                    setTimeout(() => {
                        location.reload()
                    }, 2000)
                }
        })
    }

}

const soundEffects = {
    eating: function(){
        const audio = document.createElement('audio')
        audio.src = './audios/pacman_chomp.wav'

        audio.play()
    },

    death: function(){
        const audio = document.createElement('audio')
        audio.src = './audios/pacman_death.wav'

        audio.play()
    }
}


const animate = () => {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(jogando){

        scenario.drawScenario()
        scenario.drawGhosts()
        scenario.atualizaSprite()
        scenario.ghostMovement()
        scenario.ghostBoundary()
        
        
        player.drawPlayer()
        player.atualizaSprite()
 
        player.eat()
        player.teleport();
        player.collisionOnPacman()
    }else{
        gameover.style.display = 'block'
    }
        
        
}
    
    
animate()



if(jogando){

        window.addEventListener('keydown', (event) => {
        
        const vel = 1
        
    if(event.code === 'ArrowLeft'){
   
        keys.arrowLeft.pressed = true

        player.x-= vel

        if(player.boundary(-1, 0)){
            player.x+= vel
        }
    }
    if(event.code === 'ArrowUp'){
        keys.arrowUp.pressed = true

        player.y-= vel
        if(player.boundary(0, -1)){
            player.y+= vel
        }
    }
    if(event.code === 'ArrowRight'){

        keys.arrowRight.pressed = true

    
        player.x+= vel

        if(player.boundary(1, 0)){
            player.x-= vel
        }
        
    }
    if(event.code === 'ArrowDown'){
        keys.arrowDown.pressed = true
        player.y+= vel
        if(player.boundary(0, 1)){
            player.y-= vel
        }
    }
    })

        window.addEventListener('keyup', (event) => {
        if(event.code === 'ArrowLeft'){
            keys.arrowLeft.pressed = false
        }
        if(event.code === 'ArrowUp'){
            keys.arrowUp.pressed = false
        }
        if(event.code === 'ArrowRight'){
            keys.arrowRight.pressed = false
            
            
        }
        if(event.code === 'ArrowDown'){
            keys.arrowDown.pressed = false
        }

        
    })

}