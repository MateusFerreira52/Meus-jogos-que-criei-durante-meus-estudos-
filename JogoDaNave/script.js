const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const life = document.querySelector('#life')
const lifeDisplay = document.querySelector('#lifeDisplay')
const scoreDisplay = document.querySelector('#scoreDisplay')
const powerDisplay = document.querySelector('.power')
const specialDisplay = document.querySelector('.special')
const objective = document.querySelector('.objectiveDisplay')
const difficultDisplay = document.querySelector('.difficult')
const span = document.querySelector('span')
const enemyLife = document.querySelector('#enemyLife')
const enemyLifeDisplay = document.querySelector('#enemyLifeDisplay')


// const nave = document.querySelector('img')

let special = true
let specialTimer = 10

let jogo = true
let defeatState = false
let victoryState = false

setInterval(() => {
    specialTimer--
}, 1000)


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
    f: {
        pressed: false
    },
    space: {
        pressed: false
    },
    shift: {
        pressed: false
    },

    click: {
        pressed: false
    }
}



const playerSprite = new Image()
playerSprite.src = './imgs/nave_jog.gif'

const bombSprite = new Image()
bombSprite.src = './imgs/bomba.gif'

const explosion = new Image()
explosion.src = './imgs/explosao_ar.gif'

const groundExplosion = new Image()
groundExplosion.src = './imgs/explosao_chao.gif'


let score = 0
let powerUpTime = false

let powerTimer = 10

setInterval(() => {
    powerTimer--
}, 1000)


const player = {
    x: canvas.width / 2,
    y: 600,
    w: 40,
    h: 40,
    vel: 8,
    delay: 0,
    bullets: [],
    missiles: [],
    powers: [],
    shootVelocity: 10,
    imgs: [],
    drawPlayer: function(){


        const img = document.createElement('img')
        img.src = './imgs/nave_jog.gif'
        
        ctx.drawImage(img, this.x, this.y, this.w, this.h)
    },



    movement: function(){
        if(keys.shift.pressed){
            this.vel = 20
        }else{
            this.vel = 8
        }

        if(keys.arrowLeft.pressed){
            this.x-= this.vel
        }
        if(keys.arrowUp.pressed){
            this.y-= this.vel
        }
        if(keys.arrowRight.pressed){
            this.x+= this.vel
        }
        if(keys.arrowDown.pressed){
            this.y+= this.vel
        }
    },

    boundary: function(){
        if(this.x <= 0){
            this.x = 0
        }
        if(this.x >= canvas.width - this.w){
            this.x = canvas.width - this.w
        }

        if(this.y <= 0){
            this.y = 0
        }
        if(this.y >= canvas.height - this.h){
            this.y = canvas.height - this.h
        }
    },

    shoot: function(){
        this.delay++

        if(keys.f.pressed || keys.click.pressed){
            if(this.delay % this.shootVelocity === 0){
                shootSound()
                this.bullets.push({
                    x: this.x + 15,
                    y: this.y,
                    w: 10,
                    h: 10
                })
            }
        }

        this.bullets.forEach(bullet => {
            ctx.fillStyle = 'red'
            ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h)

            bullet.y+= -13
            if(bullet.y <= 0){
                this.bullets.shift()
            }
        })

     
    },

    bulletCollision: function(){
        const bulletCollisionOnNave = (bullet) => {
            if(bullet.x + bullet.w >= enemy.x &&
                bullet.x <= enemy.x + enemy.w &&
                bullet.y + bullet.h >= enemy.y &&
                bullet.y <= enemy.y + enemy.h){

                    enemyLife.value-= 1
                    enemyLifeDisplay.textContent = `Vida do inimigo: ${enemyLife.value}`
                    this.bullets.shift()
                }
    }


        this.bullets.forEach((bullet, bulletIndex) => {
            bulletCollisionOnNave(bullet)

            enemy.bombs.forEach((bomb, bombIndex) => {
                if( 
                    bullet.x <= bomb.x + bomb.w &&
                    bullet.x + bullet.w >= bomb.x &&
                    bullet.y <= bomb.y + bomb.h &&
                    bullet.y + bullet.h >= bomb.y){ 
                        score++

                        explosionSound()
                        ctx.drawImage(explosion, bomb.x - 30, bomb.y - 25, 100, 100)

                        this.bullets.splice(bulletIndex, 1)
                        enemy.bombs.splice(bombIndex, 1)

                }
            })
        })

    

        // bulletCollisionOnNave()
    },

    playerCollision: function(){
        enemy.bombs.forEach((bomb) => {
            if(this.x + 25 <= bomb.x + bomb.w &&
                this.x + this.w - 25 >= bomb.x &&
                this.y <= bomb.y + bomb.h &&
                this.y + this.h >= bomb.y){

                    explosionSound()
                    defeatState = true
                    jogo = false
                }
        })

        if(player.x + player.w >= enemy.x &&
            player.x <= enemy.x + enemy.w &&
            player.y + player.h >= enemy.y &&
            player.y <= + enemy.y + enemy.h){
                defeatState = true
                jogo = false
            }


    },

    superMissile: function(){
        const missileSprite = new Image()
        missileSprite.src = './imgs/missil.png'
       
         const specialInfo = () => {
            if(special){
                specialDisplay.textContent = 'Special: On'
                specialTimer = 10
            }else{
                specialDisplay.textContent = `Special available in ${specialTimer}`
                if(specialTimer <= 0){
                    special = true
                }
            }
         }
         specialInfo()

        if(keys.space.pressed && special){
            special = false
                this.missiles.push({
                    x: this.x - 130,
                    y: this.y - 80,
                    w: 300,
                    h: 100
                })

        }

        const missileCollision = (missile, bomb) => {
            if(missile.x + missile.w - 130 >= bomb.x &&
                missile.x + 127 <= bomb.x + bomb.w &&
                missile.y + missile.h >= bomb.y &&
                missile.y <= bomb.y + bomb.h){

                    const totalBombs = enemy.bombs.length
                    score+= totalBombs
 
                    enemy.bombs.forEach(bomb => {
                        ctx.drawImage(explosion, bomb.x, bomb.y, 100, 100)
                    })    
                    
                    explosionSound()
                    this.missiles.shift()
                 
                    enemy.bombs.splice(0, totalBombs)

                }
        }

        const missileCollisionOnY = (missile) => {
            ctx.drawImage(missileSprite, missile.x, missile.y, missile.w, missile.h)

                if(missile.y <= 0){
                    const totalBombs = enemy.bombs.length
                    score+= totalBombs

                    enemyLife.value-= 30
                    enemyLifeDisplay.textContent = `Vida do inimigo: ${enemyLife.value}`

                    explosionSound()
                    this.missiles.shift()
                    
                    enemy.bombs.forEach(bomb => {
                        ctx.drawImage(explosion, bomb.x, bomb.y, 100, 100)
                    })    
                    
                    enemy.bombs.splice(0, totalBombs)
                }
        }

        const missileCollisionOnNave = (missile) => {
            if(missile.x + missile.w - 130 >= enemy.x &&
                missile.x + 127 <= enemy.x + enemy.w &&
                missile.y + missile.h >= enemy.y &&
                missile.y <= enemy.y + enemy.h){

                    enemyLife.value-= 30
                    enemyLifeDisplay.textContent = `Vida do inimigo: ${enemyLife.value}`
                    explosionSound()
                    this.missiles.shift()
        }
    }

            this.missiles.forEach(missile => {
                missile.y -= 5

                enemy.bombs.forEach(bomb => {
                    missileCollision(missile, bomb)  
                })

                missileCollisionOnY(missile)
                missileCollisionOnNave(missile)
            })
            
    },

    superPowers: function(){
        let randomNumber = Math.round(Math.random() * 1000)
        let randomPower = Math.round(Math.random() * 1000)
        let typeOfPower 
        const image = new Image()

        const powerTypes = [
            {id: 1, name: 'Increase Shoot Velocity', src: './imgs/powerUp.png'},
            {id: 2, name: 'Increase HP by 10', src: './imgs/life.png'}
        ]


        if(randomPower < 500){
            image.src = powerTypes[0].src
            typeOfPower = powerTypes[0].id
        }else{
            image.src = powerTypes[1].src
            typeOfPower = powerTypes[1].id
        }

        const powerInfo = () => {
            if(powerUpTime){
                powerDisplay.textContent = `Power Up ends in ${powerTimer}`
                if(powerTimer <= 0){
                    powerUpTime = false
                    this.shootVelocity = 10
                }
            }else{
                powerTimer = 10
                powerDisplay.textContent = 'Power Up: Off'
            }
        }

        powerInfo()

        const powerCollision = (power) => {
            if(this.x + this.w >= power.x &&
                this.x <= power.x + power.w &&
                this.y + this.h >= power.y &&
                this.y <= power.y + power.h){
                    
                    if(power.type === 1){
                        powerUpTime = true
                        this.shootVelocity = 4
                        this.powers.shift()
                    }

                    if(power.type === 2){
                       life.value+= 10
                       lifeDisplay.textContent = `Sua vida: ${life.value}`
                       this.powers.shift()
                    }
                    
            }   
        }

        const addPowersIntoArray = () => {
            if(this.delay % 40 === 0 && randomNumber <= 300 && !powerUpTime){
                this.powers.push({
                    x: Math.round(Math.random() * 1200),
                    y: -100,
                    w: 70,
                    h: 70,
                    image: image,
                    type: typeOfPower
                })
            }
        }
        addPowersIntoArray()
 
        this.powers.forEach(power =>{ 
            ctx.drawImage(power.image, power.x, power.y, power.w, power.h)
            power.y+= 6

            powerCollision(power)

        })
    },

    victory: function(){

            const victory = new Image()
            victory.src = './imgs/vitoria.jpg'
            ctx.drawImage(victory, 0, 0, canvas.width, canvas.height)
            lifeDisplay.textContent = ''
            scoreDisplay.textContent = ''
            specialDisplay.textContent = ''
            powerDisplay.textContent = ''
            objective.textContent = ''
            life.style.display = 'none'

            setTimeout(() => {
                location.reload()
            }, 3000)

    },
}



function shootSound(){
    const sounds = []
    
    const sound = document.createElement('audio')

    sounds.push(sound)
    
    sounds[0].src = './audio/tiro.wav'
    sounds[0].play()

} 

function explosionSound(){
    const sounds = []
    const sound = document.createElement('audio')

    sounds.push(sound)
    
    sounds[0].src = './audio/exp1.mp3'
    sounds[0].play()


}

let stopBombs = false

const enemy = {
    vel: 3,
    naveVel: 6,
    bombs: [],
    delay: 0,
    difficult: 50,
    shootVelocity: 10,
    bullets: [],
    x: 560,
    y: -160,
    w: 120,
    h: 120,
    createBomb: function(){

        this.delay++
        if(this.delay % this.difficult === 0){
            this.bombs.push({
                x: Math.round(Math.random() * 1200),
                y: -70,
                w: 30,
                h: 50
            })
    }

        this.bombs.forEach(bomb => {
                ctx.drawImage(bombSprite, bomb.x, bomb.y, bomb.w, bomb.h)
                bomb.y+= this.vel
            
        })

        
    },

    clearBombs: function(){
        this.bombs.forEach(bomb => {
            if(bomb.y >= canvas.height){
                explosionSound()
                life.value-= 10
                lifeDisplay.textContent = `Sua vida: ${life.value}`
                
                ctx.drawImage(groundExplosion, bomb.x - 40, bomb.y - 100, 100, 100)
                this.bombs.shift()
            }
        })
    },

    enemyNave: function(){
        const nave = new Image()
        nave.src = './imgs/naveInimigo.gif'

        enemyLifeDisplay.style.display = 'block'
        enemyLife.style.display = 'block'

        this.delay++

        ctx.drawImage(nave, this.x, this.y, this.w, this.h)
        this.y++

        const movement = () => {
            
            if(this.y >= 30){
                this.y = 30
            }
            
            if(player.x + player.w - 70 <= this.x){
                this.x-= this.naveVel

            }
            if(player.x >= this.x + this.w - 70){
                this.x+= this.naveVel
            }

            if(player.x + player.w >= this.x &&
                player.x <= this.x + this.w){
                return true
            }

            return false
        }

        const shoot = () => {
            if(this.delay % this.shootVelocity === 0 && movement()){
                this.bullets.push({
                    x: this.x + 55,
                    y: this.y + 110,
                    w: 10,
                    h: 10
                })
            }

            this.bullets.forEach((bullet, index) => {
                ctx.fillStyle = 'blue'
                ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h)

                bullet.y+= this.vel

                if(bullet.y + bullet.h >= canvas.height){
                    this.bullets.splice(index, 1)
                }

            })

        }

        const bulletCollision = () => {
            this.bullets.forEach(bullet => {
                if(player.x <= bullet.x + bullet.w &&
                    player.x + player.w >= bullet.x &&
                    player.y <= bullet.y + bullet.h &&
                    player.y + player.h >= bullet.y){
                    
                        life.value-= 5
                        lifeDisplay.textContent = `Sua vida: ${life.value}`
                        this.bullets.shift()
                }
            })
        }

        const level = () => {
            if(enemyLife.value <= 400){
                this.naveVel = 7
                this.shootVelocity = 8
            }

            if(enemyLife.value <= 200){
                this.naveVel = 10
                this.shootVelocity = 6
            }

            if(enemyLife.value <= 100){
                this.naveVel = 12
                this.shootVelocity = 4
            }
        }

        movement()
        shoot()
        bulletCollision()
        level()

    },

    level: function(){
        if(score >= 50){
            span.textContent = `Easy`
            span.style.color = 'green'
            this.difficult = 40
            this.vel = 4
        }

        if(score >= 100){
            span.textContent = `Normal`
            span.style.color = 'white'
            this.difficult = 35
            this.vel = 4.5
        }

        if(score >= 130){
            span.textContent = `Hard`
            span.style.color = 'lightcoral'
            this.difficult = 30
            this.vel = 5
        }

        if(score >= 170){
            span.textContent = `Very hard`
            span.style.color = 'red'
            this.difficult = 25
            this.vel = 6
        }

        if(score >= 240){
            span.textContent = `Expert`
            span.style.color = 'brown'
            this.difficult = 20
            this.vel = 8
        }

        if(score >= 300){
            this.enemyNave()
            stopBombs = true
        }
    }
}

function defeat(){
    const defeat = new Image()
    defeat.src = './imgs/derrota.jpg'

    ctx.drawImage(defeat, 0, 0, canvas.width, canvas.height)
    lifeDisplay.textContent = ''
    scoreDisplay.textContent = ''
    specialDisplay.textContent = ''
    powerDisplay.textContent = ''
    objective.textContent = ''
    life.style.display = 'none'

    setTimeout(() => {
        location.reload()
    }, 3000)

}


const animate = () => {
    requestAnimationFrame(animate)
    if(jogo){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        scoreDisplay.textContent = `Score: ${score}`
        player.drawPlayer(playerSprite)
        player.movement()
        player.boundary()
        player.shoot()
        player.bulletCollision()
        player.playerCollision()
        player.superMissile()
        player.superPowers()        
        
        enemy.clearBombs()

        if(!stopBombs){
            enemy.createBomb()
        }
        
        enemy.level()

        if(life.value <= 0){
            defeatState = true
            jogo = false
         }

         if(enemyLife.value <= 0){
            victoryState = true
            jogo = false
         }

    }else{
        if(victoryState){
            player.victory()
        }

        if(defeatState){
            defeat()
        }
    }
        
}

animate()


window.addEventListener('keydown', (event) => {
    if(event.key === 'ArrowLeft'){
        keys.arrowLeft.pressed = true
    }
    if(event.key === 'ArrowUp'){
        keys.arrowUp.pressed = true
    }
    if(event.key === 'ArrowRight'){
        keys.arrowRight.pressed = true
    }
    if(event.key === 'ArrowDown'){
        keys.arrowDown.pressed = true
    }
    if(event.key === 'f'){
        keys.f.pressed = true
    }
    if(event.code === 'Space'){
        keys.space.pressed = true
    }
    if(event.key === 'Shift'){
        keys.shift.pressed = true
    }



})

window.addEventListener('keyup', (event) => {
    if(event.key === 'ArrowLeft'){
        keys.arrowLeft.pressed = false
    }
    if(event.key === 'ArrowUp'){
        keys.arrowUp.pressed = false
    }
    if(event.key === 'ArrowRight'){
        keys.arrowRight.pressed = false
    }
    if(event.key === 'ArrowDown'){
        keys.arrowDown.pressed = false
    }
    if(event.key === 'f'){
        keys.f.pressed = false
    }
    if(event.code === 'Space'){
        keys.space.pressed = false
    }
    if(event.key === 'Shift'){
        keys.shift.pressed = false
    }
})

window.addEventListener('mousemove', (event) => {
    player.x = event.x - 25
    player.y = event.y - 20


})

window.addEventListener('mousedown', () => {
    keys.click.pressed = true
})

window.addEventListener('mouseup', () => {
    keys.click.pressed = false
})