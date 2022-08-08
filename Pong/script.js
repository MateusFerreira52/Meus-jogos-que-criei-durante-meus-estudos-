const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const displayPlayer1 = document.querySelector('#displayPlayer1')
const displayPlayer2 = document.querySelector('#displayPlayer2')

const CANVAS_WIDTH = canvas.width
const CANVAS_HEIGHT = canvas.height

const drawBackground = () => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT )
}

let player1Scores = 0
let player2Scores = 0

const keys = {
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },

    arrowUp:{
        pressed: false
    },
    arrowDown: {
        pressed: false
    }
}


class Paddle {
    constructor({ position },){
        this.position = position
        this.velocity = 0
        this.speed = 5
        this.width = 10
        this.height = 120
    }

    drawPaddle(){
        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        this.position.y+= this.velocity
        
    }


    boundary(){
        if(this.position.y <= 0){
            this.position.y = 0
        }     
        
        if(this.position.y >= CANVAS_HEIGHT - this.height){
            this.position.y = CANVAS_HEIGHT - this.height
        }
    }

}

const paddle1 = new Paddle({
    position: {
        x:10,
        y: 250
    }, 


})
const paddle2 = new Paddle({
    position: {
        x: CANVAS_WIDTH - 20,
        y: 250
    }, 

})


const ball = {
    x: 600,
    y: 250,
    w: 20,
    h: 20,
    speed: 5,
    velocity: {
        x: Math.floor(Math.random() * 10) < 5 ? 5 : -5,
        y: Math.floor(Math.random() * 10) < 5 ? 5 : -5
    },

    drawBall: function(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.w, this.h)

        this.x+= this.velocity.x
        this.y+= this.velocity.y

    },

    collisionOnPaddle: function(){
        if(this.x <= paddle1.position.x + paddle1.width &&
            this.x + this.w >= paddle1.position.x && 
            this.y <= paddle1.position.y + paddle1.height &&
            this.y + this.h >= paddle1.position.y){
            this.velocity.x = this.speed
            this.speed+= 0.5
        }

        if(this.x <= paddle2.position.x + paddle2.width &&
            this.x + this.w >= paddle2.position.x && 
            this.y <= paddle2.position.y + paddle2.height &&
            this.y + this.h >= paddle2.position.y){
            this.velocity.x = -this.speed
            this.speed+= 0.5
        }


        const boundary = () => {
            if(this.y <= 0){
                this.velocity.y = this.speed
            }
            if(this.y >= CANVAS_HEIGHT - this.h){
                this.velocity.y = -this.speed
            }
        }

        boundary()


        const ballDirection = () => {
            if(this.y > paddle1.position.y + paddle1.height / 2 &&
                this.x <= paddle1.position.x + paddle1.width &&
                this.x + this.w >= paddle1.position.x || 

                this.y > paddle2.position.y + paddle2.height / 2 &&
                this.x <= paddle2.position.x + paddle2.width &&
                this.x + this.w >= paddle2.position.x){
                    
                this.velocity.y = this.speed
            }

            if(this.y < paddle1.position.y + paddle1.height / 2 &&
                this.x <= paddle1.position.x + paddle1.width &&
                this.x + this.w >= paddle1.position.x || 

                this.y > paddle2.position.y + paddle2.height / 2 &&
                this.x <= paddle2.position.x + paddle2.width &&
                this.x + this.w >= paddle2.position.x){
                    
                this.velocity.y = -this.speed
            }

            if(this.y === paddle1.position.y + paddle1.height / 2 &&
                this.x <= paddle1.position.x + paddle1.width &&
                this.x + this.w >= paddle1.position.x || 

                this.y === paddle2.position.y + paddle2.height / 2 &&
                this.x <= paddle2.position.x + paddle2.width &&
                this.x + this.w >= paddle2.position.x){
                    
                this.velocity.y = 0
            }

        }

        ballDirection()
    },

    whoWins(){
        if(this.x + this.w <= 0){
            player2Scores++
            this.x = 600
            this.y = 250

            this.velocity.x = Math.floor(Math.random() * 10) < 5 ? 5 : -5
            this.velocity.y = Math.floor(Math.random() * 10) < 5 ? 5 : -5

            this.speed = 5
        }

        if(this.x >= CANVAS_WIDTH){
            player1Scores++
            this.x = 600
            this.y = 250

            this.velocity.x = Math.floor(Math.random() * 10) < 5 ? 5 : -5
            this.velocity.y = Math.floor(Math.random() * 10) < 5 ? 5 : -5
        }

        displayPlayer1.textContent = `Scores: ${player1Scores}`
        displayPlayer2.textContent = `Scores: ${player2Scores}`
    }

    
}



const animate = () => {
    requestAnimationFrame(animate)
    drawBackground()

    paddle1.drawPaddle()
    paddle1.boundary()

    paddle2.drawPaddle()
    paddle2.boundary()

    ball.drawBall()
    ball.collisionOnPaddle()
    ball.whoWins()

    console.log(ball.speed)



}

animate()


window.addEventListener('keydown', (event) => {
    const speed = 5

    switch(event.key){
        case 's': paddle1.velocity = speed
            break
        case 'w': paddle1.velocity = -speed
            break

        case 'ArrowUp': paddle2.velocity = -speed
            break
        case 'ArrowDown': paddle2.velocity = speed
            break

    }
})
window.addEventListener('keyup', (event) => {
   

    switch(event.key){
        case 's': paddle1.velocity = 0
            break
        case 'w': paddle1.velocity = 0
            break

        case 'ArrowUp': paddle2.velocity = 0
            break
        case 'ArrowDown': paddle2.velocity = 0
            break

    }
})


