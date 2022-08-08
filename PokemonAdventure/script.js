

const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const song = document.querySelector('#song')
const battleSong = document.querySelector('#battleSong')
const vicSong = document.querySelector('#vicSong')
const div = document.querySelector('#div')

const containerBattle = document.querySelector('#container-battle')

const CANVAS_WIDTH = canvas.width
const CANVAS_HEIGHT = canvas.height

ctx.scale(3,3)
ctx.translate(-50, 0)

const keys = {
    arrowRight:{
        pressed: false,
    },
    arrowLeft:{
        pressed: false,
    },
    arrowUp:{
        pressed: false,
    },
    arrowDown:{
        pressed: false,
    },
    z:{
        pressed: false
    },
    f: {
        pressed: false
    }
}


class Player{
    constructor(position, scale, sprites){
        this.position = position
        this.scale = scale
        this.sprites = sprites
        this.veloX = 2
        this.veloY = 2
        this.collide = false
        this.readingSign = false
        this.battle = false
        this.frames = 0

        for(let prop in this.sprites){
            this.sprites[prop].image = new Image()
            this.sprites[prop].image.src = this.sprites[prop].imageSrc
        }
        this.imageWidth = this.sprites.normalSprite.image.width / this.sprites.normalSprite.frameMaxX
        this.imageHeight = this.sprites.normalSprite.image.height / this.sprites.normalSprite.frameMaxY
        this.randomPokemon = Math.floor(Math.random() * 2)
        this.spriteAtualX = 0

        this.down = 0
        this.left = 1
        this.right = 2 
        this.up = 3


        this.offset = {
            x: 0,
            y: 0,
        }
       

    

    }


    draw(){
        ctx.drawImage(this.sprites.normalSprite.image, this.offset.x, this.offset.y, 
            this.sprites.normalSprite.image.width/this.sprites.normalSprite.frameMaxX,
            this.sprites.normalSprite.image.height/this.sprites.normalSprite.frameMaxY,
            this.position.x, this.position.y,
            this.scale.width, this.scale.height
            
            )
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.position.x, this.position.y, this.scale.width, this.scale.height)
    }

    atualzaSprites(){
        if(keys.arrowDown.pressed){
            this.offset.y = this.down * this.imageHeight
            this.offset.x = this.spriteAtualX * this.imageWidth


            this.spriteAtualX++

            if(this.spriteAtualX >= this.sprites.normalSprite.frameMaxX){
                this.spriteAtualX = 0
            }

        }

        if(keys.arrowLeft.pressed){
            this.offset.y = this.left * this.imageHeight
            this.offset.x = this.spriteAtualX * this.imageWidth

           

            this.spriteAtualX++

            if(this.spriteAtualX >= this.sprites.normalSprite.frameMaxX){
                this.spriteAtualX = 0
            }
        }

        if(keys.arrowRight.pressed){
            this.offset.y = this.right * this.imageHeight
            this.offset.x = this.spriteAtualX * this.imageWidth

            this.spriteAtualX++

            if(this.spriteAtualX >= this.sprites.normalSprite.frameMaxX){
                this.spriteAtualX = 0
            }
        }

        if(keys.arrowUp.pressed){
            this.offset.y = this.up * this.imageHeight
            this.offset.x = this.spriteAtualX * this.imageWidth


            this.spriteAtualX++

            if(this.spriteAtualX >= this.sprites.normalSprite.frameMaxX){
                this.spriteAtualX = 0
            }
        }

    }
    
    movement(){
        if(keys.arrowRight.pressed){
            this.position.x+= this.veloX
            if(this.collision()){
                this.position.x-= this.veloX
                background.x = 0
                background.y = 0
            }
        }
        if(keys.arrowLeft.pressed){
            this.position.x-= this.veloX
            if(this.collision()){
                this.position.x += this.veloX
                background.x = 0
                background.y = 0
            }
  

        }
        if(keys.arrowUp.pressed){
            this.position.y-= this.veloY
            if(this.collision()){
                this.position.y+= this.veloY
                background.x = 0
                background.y = 0
            }
        }
        if(keys.arrowDown.pressed){
            this.position.y+= this.veloY
            if(this.collision()){
                this.position.y-= this.veloY
                background.x = 0
                background.y = 0
            }
        }

        if(keys.f.pressed){
            this.veloX = 5
            this.veloY = 5
            background.veloX = 5
            background.veloY = 5
        }else{
            this.veloX = 2
            this.veloY = 2
            background.veloX = 2
            background.veloY = 2
        }
    }

    collision(){
        let collide
        for(let i = 0; i < background.walls.length; i++){
            if(this.position.x + 10 <= background.walls[i].x + background.walls[i].w &&
                this.position.x - 10 + this.scale.width >= background.walls[i].x &&
                this.position.y + 10 <= background.walls[i].y + background.walls[i].h &&
                this.position.y + this.scale.height >= background.walls[i].y){
                    collide = true
                    break
                }else{
                    collide = false
                }
        }

        return collide
    }


    collisionPlaca(){
        if(this.readingSign){
            background.x = 0
            background.y = 0
        }

    if(keys.arrowUp.pressed){
        if(background.collisionPlaca(this.position.y)){
            this.position.y += this.veloY 
            background.x = 0
            background.y = 0
        }
    }


    if(keys.arrowDown.pressed){
        if(background.collisionPlaca(this.position.y)){
            this.position.y -= this.veloY
            background.x = 0
            background.y = 0
        }
    }

    if(keys.arrowRight.pressed){
        if(background.collisionPlaca(this.position.y)){
            this.position.x-= this.veloX
            background.x = 0
            background.y = 0
        }
    }

    if(keys.arrowLeft.pressed){
        if(background.collisionPlaca(this.position.y)){
            this.position.x+= this.veloX
            background.x = 0
            background.y = 0
        }
    }


    if(this.offset.y === this.up * this.imageHeight && keys.z.pressed){
        if(background.collisionPlaca(this.position.y - 1)){

            this.readingSign = true
            background.placas.forEach(placa => {
                // ctx.font = '30px'
                // ctx.fillText(placa.text, placa.x, placa.y)
                ctx.drawImage(placa.image, placa.positionX, placa.positionY, placa.imageWidth, placa.imageHeight)

            })
   
        }
    }

    if(!keys.z.pressed){
        this.readingSign = false
    }


}

collisionGrama(){
    if(background.collisionGrama()){
        this.frames++

        let random = Math.floor(Math.random() * 1000)

        const keysPressed = ['ArrowUP', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
            .some(item => {
                for(let prop in keys){  
                   return item === keys[prop].name
                }
            })


        if(this.frames % 5 === 0 && keysPressed){
            if(random >= 800){
                this.battle = true
            }
        }
    }
}

    


}


const background = {
    image: new Image(),
    x: 0,
    y:-130,
    veloX: 2,
    veloY: 2,
    state: false,
    walls: [
        {x: 70, y: 100, w:10, h: 340},
        {x: 100, y: 90, w:10, h: 100},
        {x: 70, y: 80, w:30, h: 10},


        {x: 70, y: 100, w:10, h: 340},
        {x: 70, y: 433, w:70, h: 20},
        {x: 195, y: 433, w:40, h: 20},
        {x: 135, y: 465, w:70, h: 70},

        {x: 230, y: 465, w:10, h: 50},
        {x: 236, y: 510, w:50, h: 10},
        {x: 276, y: 510, w:10, h: 50},
        {x: 286, y: 560, w:50, h: 10},
        {x: 330, y: 578, w:55, h: 10},
        {x: 390, y: 528, w:10, h: 50},
        {x: 325, y: 492, w:10, h: 26},

        {x: 460, y: 500, w:43, h: 30},

        {x: 510, y: 500, w:150, h: 10},
        {x: 660, y: 200, w:10, h: 300},
        {x: 610, y: 353, w:45, h: 10},

        {x: 495, y: 320, w:45, h: 10},
        {x: 500, y: 365, w:10, h: 15},

        {x: 497, y: 435, w:13, h: 60},
        {x: 497, y: 435, w:30, h: 10},

        {x: 130, y: 180, w:10, h: 200},
        // {x: 100, y: 180, w:40, h: 10},
        {x: 195, y: 370, w:70, h: 10},
        {x: 260, y: 370, w:10, h: 120},
        {x: 260, y: 480, w:80, h: 10},
        {x: 340, y: 470, w:120, h: 50},
        

        {x: 260, y: 268, w:155, h: 66},
        {x: 290, y: 180, w:90, h: 10},
        {x: 387, y: 185, w:80, h: 50},
        {x: 100, y: 180, w:40, h: 10},
        {x: 175, y: 170, w:65, h: 50},
        {x: 145, y: 210, w:30, h: 10},
        {x: 225, y: 210, w:30, h: 10},
        
        {x: 276, y: 180, w:10, h: 40},
        {x: 145, y: 80, w:10, h: 140},
        {x: 155, y: 80, w:230, h: 10},
        {x: 375, y: 90, w:10, h: 90},

        {x: 308, y: 200, w:55, h: 30},
        {x: 230, y: 280, w:25, h: 30},
        {x: 325, y: 370, w:135, h: 60},
        {x: 470, y: 220, w:20, h: 120},
        {x: 515, y: 330, w:75, h: 50},

        {x: 595, y: 330, w:10, h: 100},
        {x: 560, y: 430, w:40, h: 10},
    ],


    placas: [
        {x: 210, y: 305, w:10, h:10, 
            text: './Sprites/textoP.png', 
            positionX: 100, positionY: 360, imageWidth: 300, imageHeight:50},

        // {x: 205, y: 205, w:10, h:10, 
        //     text: './Sprites/pescada.png', 
        //     positionX: 100, positionY: 120, imageWidth: 300, imageHeight:50},
    ],
    
    gramas: [
        {x:210, y: 147, w: 45, h: 10},
        {x:245, y: 132, w: 10, h: 10},
        {x:163, y: 163, w: 10, h: 10},
        {x:180, y: 146, w: 10, h: 10},
        {x:275, y: 100, w: 10, h: 25},
        {x:260, y: 100, w: 10, h: 10},
    ],

    placasFunc: function(){

        this.placas.forEach(placa => {

            placa.image = new Image()
            placa.image.src = placa.text

            // ctx.fillStyle = 'blue'
            // ctx.fillRect(placa.x, placa.y, placa.w, placa.h)

        })
    },

    collisionPlaca: function(positionY){
        let collidePlaca
        for(let i = 0; i < this.placas.length; i++){
            if(player.position.x + 10 <= this.placas[i].x + this.placas[i].w &&
                player.position.x - 10 + player.scale.width >= this.placas[i].x &&
                positionY + 10 <= this.placas[i].y + this.placas[i].h &&
                player.position.y - 2 + player.scale.height >= this.placas[i].y){
                    collidePlaca = true
                    break
                }
                collidePlaca = false
        }

        return collidePlaca
    },

    gramasFunc: function(){
        this.gramas.forEach(grama => {
            ctx.fillStyle = 'red'
            ctx.fillRect(grama.x, grama.y, grama.w, grama.h)
        })
    },

    collisionGrama: function(){ 
        let collidePlaca
        for(let i = 0; i < this.gramas.length; i++){
            if(player.position.x + 10 <= this.gramas[i].x + this.gramas[i].w &&
                player.position.x - 10 + player.scale.width >= this.gramas[i].x &&
                player.position.y + 10 <= this.gramas[i].y + this.gramas[i].h &&
                player.position.y + player.scale.height >= this.gramas[i].y){
                    collidePlaca = true
                    break
                }
                collidePlaca = false
        }

        return collidePlaca
    },
    

    drawBackground: function(){
        this.image.src = './sprites/background.png'
        
        ctx.drawImage(this.image, 0, 0)
        ctx.translate(this.x, this.y)

    },

    collision: function(position){
        let collide
        for(let i = 0; i < this.walls.length; i++){
            if(player.position.x <= this.walls[i].x + this.walls[i].w &&
                player.position.x + player.scale.width >= this.walls[i].x &&
                position + 10 <= this.walls[i].y + this.walls[i].h &&
                player.position.y + player.scale.height >= this.walls[i].y){
                    collide = true
                    break
                }else{
                    collide = false
                }
        }
        return collide
    },

    drawWalls: function(){
        this.walls.forEach(wall => {
            // ctx.fillStyle = 'blue'
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h)
        })
    },

    stopMovement: function(){
        if(player.position.x <= 130){
            // console.log(player.position.y)
            this.state = true
            return true
        }
        else if(player.position.x >= this.image.width - 130){
            // player.position.x -= 3 
            this.state = true
            return true
        }

        else if(player.position.y >= this.image.height - 150 ){
            player.position.y -= this.veloY 
            return true
        }
        else if(player.position.y <= 105 ){
            player.position.y += this.veloY 
            return true
        }
   

        return false
    },

    moveBackground: function(){
        ctx.translate(this.x = 0, this.y = 0)
     

        if(keys.arrowRight.pressed){
            this.x = -this.veloX
    
        }
        
        if(keys.arrowLeft.pressed){
                this.x = this.veloX  
        }
   

        if(keys.arrowUp.pressed){
            this.y = this.veloY
        }

        if(keys.arrowDown.pressed){
            if(!player.collision()){
                this.y = -this.veloY 
            }else{
                player.position.y+= player.veloY
            }
           
        }


    },

   
}



const player = new Player(
    {
        x:260,
        y:230
    },
    {
        width: 25,
        height:25
    },
     {
        normalSprite: {
            frameMaxX: 4,
            frameMaxY: 4,
            imageSrc: './Sprites/jogador.png'
        }
    }
)

const spritePlayer = player.atualzaSprites.bind(player)

setInterval(spritePlayer, 130)


const enemy = document.querySelector('#enemy')

const animate = () => {
    // song.play()
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    requestAnimationFrame(animate)

    if(!player.battle){
        enemy.style.display = 'block'
        // battleSong.pause()
        song.play()
        containerBattle.classList.remove('show')
        containerBattle.classList.add('remove')

        background.drawBackground()
        if(!player.readingSign){
            background.moveBackground()
        }
        

        player.draw()
        player.movement()
        
        player.collision()
        // background.drawWalls()
        // background.gramasFunc()
        background.placasFunc()
        player.collisionPlaca()
        player.collisionGrama()
    }

    if(player.battle){
        song.pause()
        // battleSong.play()

        containerBattle.classList.remove('remove')
        containerBattle.classList.add('show')

    }

   
 
}
animate()



const keysFunc = tecla => keys[tecla].pressed = false

window.addEventListener('keydown', event => {
    if(event.key === 'ArrowRight' ){
        keys.arrowRight.pressed = true
        keys.arrowRight.name = 'ArrowRight'
        keys.z.pressed = false
        keysFunc('arrowDown')
        keysFunc('arrowLeft')
        keysFunc('arrowUp')
    }

    if(event.key === 'z'){
        keys.z.pressed = !keys.z.pressed
        // player.readingSign = keys.z.pressed
        // console.log(player.readingSign)
    }

    if(event.key === 'f'){
        keys.f.pressed = true
    }

    if(event.key === 'ArrowLeft'){
        keys.arrowLeft.pressed = true
        keys.arrowLeft.name = 'ArrowLeft'
        keys.z.pressed = false
        keysFunc('arrowDown')
        keysFunc('arrowRight')
        keysFunc('arrowUp')
    }
    if(event.key === 'ArrowUp'){
        keys.arrowUp.pressed = true
        keys.arrowUp.name = 'ArrowUp'
        keys.z.pressed = false
        keysFunc('arrowLeft')
        keysFunc('arrowRight')
        keysFunc('arrowDown')
    }
    if(event.key === 'ArrowDown'){
        keys.arrowDown.pressed = true
        keys.arrowDown.name = 'ArrowDown'
        keys.z.pressed = false
        keysFunc('arrowLeft')
        keysFunc('arrowRight')
        keysFunc('arrowUp')
        
    }
})

window.addEventListener('keyup', event => {
    if(event.key === 'ArrowRight'){
        keys.arrowRight.pressed = false
        keys.arrowRight.name = ''
    }
    if(event.key === 'ArrowLeft'){
        keys.arrowLeft.pressed = false
        keys.arrowLeft.name = ''
    }
    if(event.key === 'ArrowUp'){
        keys.arrowUp.pressed = false
        keys.arrowUp.name = ''
    }
    if(event.key === 'ArrowDown'){
        keys.arrowDown.pressed = false
        keys.arrowDown.name = ''
    }

    if(event.key === 'f'){
        keys.f.pressed = false
    }

    // if(event.key === 'z'){
    //     keys.z.pressed = false
    // }
})




export default {player, song, battleSong}

