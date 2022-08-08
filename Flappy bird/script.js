const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const scoreDisplay = document.querySelector('h2')

let score = 0


const pipe = new Image()
pipe.src = './imgs/pipe-green.png'

const pipeReverse = new Image()
pipeReverse.src = './imgs/pipe-green-reverse.jpg'

const redPipe = new Image()
redPipe.src = './imgs/pipe-red.png'

const redPipeReverse = new Image()
redPipeReverse.src = './imgs/pipe-red-reverse.jpg'

const background = new Image()
background.src = './imgs/background-day.png'

const bluebirdDown = new Image()
bluebirdDown.src = './imgs/bluebird-downflap.png'

const gameover = new Image()
gameover.src = './imgs/gameover.png'

let jogando = false

let start = true

let die = false



const keys = {
    space: {
        pressed: false
    }
}


const obstaculos = {
    x: 0,
    y: 0,
    w: 30,
    h: 200,
    vel: 5,
    delay: 0,
    pipes: [],
    difficult: 180, 
    

    drawImage: function(){

        this.delay++

        let h = Math.round(Math.random() * 200 + 70)

        if(this.delay % 50 === 0){

            this.pipes.push(pipesDown = {
                x: 1250,
                y: canvas.height - h,
                w: 50,
                h: h,
                image: pipe,
                

            },
            pipesUp = { 
                x: 1250,
                y: 0,
                w: 50,
                h: pipesDown.y - this.difficult,
                image: pipeReverse
            })
        }

        const removePipes = (pipe) => {
            if(pipe.x + pipe.w <= 0){
                player.scores()
                audios.point()
                this.pipes.shift()
         
            }
       }

       this.pipes.forEach(pipe => {
            ctx.drawImage(pipe.image, pipe.x, pipe.y, pipe.w, pipe.h)
                pipe.x-= this.vel
                removePipes(pipe)
       })


    },

    drawBackground: function(){
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    },

    levels: function(){
        if(score >= 30){
            this.difficult = 170
        }

        if(score >= 60){
            this.difficult = 160
        }

        if(score >= 90){
            this.difficult = 140
        }

        if(score >= 120){
            this.difficult = 120
            pipesDown.image = redPipe
            pipesUp.image = redPipeReverse
        }
    },

    getReady: function(){
        const message = new Image()
        message.src = './imgs/message.png'

        ctx.drawImage(message, canvas.width/2 - 100, canvas.height/2 - 100)
    },
}




const player = {
    x: 30,
    y: 0,
    w: 50,
    h: 30,
    gravidade: 0.5,
    vel: 2,
    forçaPulo: 10,
    image: new Image(),
    sprites: {
        down: './imgs/bluebird-downflap.png',
        mid: './imgs/bluebird-midflap.png',
        up: './imgs/bluebird-upflap.png'
    },

    drawPlayer: function(){
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h)
    },

    atualizaSprite: function(){
        if(!keys.space.pressed){
            this.image.src = this.sprites.down
        }

        if(keys.space.pressed){
            this.image.src = this.sprites.up
        }
    },

    fisica: function(){
            this.vel+= this.gravidade
            this.y+= this.vel

        if(this.y + this.h >= canvas.height){
            audios.die()
           
            die = true
        }

        if(this.y <= 0){
            this.y = 0
        }
    },

    jump: function(){
        this.vel = -this.forçaPulo
    },

    collision: function(){

        const pipeCollision = (pipe) => {
            if(this.x + this.w >= pipe.x &&
                this.x <= pipe.x + pipe.w &&
                this.y + this.h >= pipe.y &&
                this.y <= pipe.y + pipe.h ){
                    audios.die()
                  
                    die = true
 
                }
        }

        obstaculos.pipes.forEach(pipeCollision)
    },

    defeat: function(){
        ctx.drawImage(gameover, canvas.width/2 - 100, canvas.height/2 - 50)

        setTimeout(() => {
            location.reload()
        }, 1000)
    },

    scores: function(){
        // audios.point()
        score++
        scoreDisplay.textContent = `Score: ${score}`
    }



}

const audios = {
    wing: function(){
        const audio = document.createElement('audio')

        audio.src = './audios/audio_wing.ogg'

        audio.play()
    },

    die: function(){
        const audio = document.createElement('audio')
        audio.src = './audios/audio_hit.ogg'
        audio.play()
    },

    point: function(){
        const audio = document.createElement('audio')
        audio.src = './audios/audio_point.ogg'
        audio.play()
    },
}

const animate = () => {
    requestAnimationFrame(animate)
    if(jogando && !die){
        obstaculos.drawBackground()
        obstaculos.drawImage()
        obstaculos.levels()
        
        player.atualizaSprite()
        player.drawPlayer()
        player.fisica()
        player.collision()
   
    }

    else if(!jogando){
        obstaculos.getReady()
    }

    if(die){
        player.defeat()
    }



    
    

}

animate()


window.addEventListener('keydown', (event) => {
    if(event.code === 'Space' && jogando && !die){
        audios.wing()
        player.jump()
        keys.space.pressed = true
    }

    jogando = true
})

window.addEventListener('keyup', (event) => {
    if(event.code === 'Space'){
        keys.space.pressed = false
    }
})

window.addEventListener('click', () => {
    jogando = true
})