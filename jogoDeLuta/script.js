const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
// canvas.style.display = 'none'

const lar = 1500
const alt = 780

let test = 0
let test2 = 2

const song = document.getElementById('song')
const hpCpu = document.getElementById('hp-player2')
const hpPlayer = document.getElementById('hp-player')
const tempo = document.querySelector('h3')
const btnStart = document.getElementById('iniciar')
const h1 = document.querySelector('h1')
const containerHp = document.getElementById('container-hp')
const menuWin = document.getElementById('menuWin')
const menuLose = document.getElementById('menuLose')
const deathSound = document.getElementById('deathSound')
const victorySound = document.getElementById('victorySound')

let jogo = false

const keysCpu = {
    arrowUp: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    },
    arrowDown: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    },

    g: {
        pressed: false
    },
    r: {
        pressed: false
    }
}

function time(){
    if(jogo){
    tempo.innerHTML--
    if(tempo.innerHTML <= 0){
        alert(`Time's up!`)
    }
}
}


setInterval(time, 1000)


class Sprites{
    constructor(x, y, largura, altura){
        this.x = x,
        this.y = y,
        this.largura = largura,
        this.altura = altura
    }
    desenhaTela(){
        ctx.fillStyle = 'lightblue'
        ctx.drawImage(bgImage, this.x, this.y, this.largura, this.altura)
        // ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }

    desenhaChao(){
        // ctx.fillStyle = 'green'
        ctx.fillRect(this.x, this.y, this.largura, this.altura)    

    }

}
const tela = new Sprites(0, 0, lar, alt)
const chao = new Sprites(0, 670, lar, alt)

// let spriteAtual = 0
let takenHitCpu = false
let takenHitPlayer = false
let cpuIdle = false
let cpuRun = false
let cpuAttack = false
let cpuJump = false

let numHitsCpu = 0 

let numHitsPlayer = 0



class Fighter {
    constructor(position, scale, todosSprites) 
    {
    this.position = position
    this.sprites = todosSprites
    this.velX = 5
    this.velY = 1
    this.velCpu = 5
    this.gravidade = 1
    this.scaleLarg = scale.larg
    this.scaleAlt = scale.alt
    this.offset = {
        x: this.spriteAtual * 200,
        y: 0
    }
    this.spriteAtual = 0
    this.puloAtual = 0
    this.puloMax = 1
    this.forcaPulo = 25
    this.puloIndice = 0 
    this.spriteAtualAttack = 0
    this.spriteAtualJump = 0
    this.spriteAtualHit = 0
    this.spriteAtualDeath = 0
    this.offsetJump = {
        x: this.spriteAtualJump,
        y: 0
    }
    this.death = false
    this.spriteAtualFall = 0
    this.spriteAtualCpu = 0
    this.fallCondition = false
    this.soundIndice = 0
    for(let prop in this.sprites){
        this.sprites[prop].image = new Image()
        this.sprites[prop].image.src = this.sprites[prop].imageSrc

    }
    this.imagemAtual = new Image()
    this.imagemAtual.src = this.sprites.idle.imageSrc
    this.imagemAtual.framesMax = 8
    this.moving = true
    this.platform = false
    this.jump = false



    }



    desenhaSprite(){
        ctx.drawImage(this.imagemAtual, this.offset.x, this.offset.y, 
            this.imagemAtual.width / this.imagemAtual.framesMax, this.imagemAtual.height,
            this.position.x, this.position.y, this.scaleLarg, this.scaleAlt )
    }
  


    // collision(position){
    //     if(position.x + 300 <= obst1.position.x + obst1.scale.larg &&
    //         position.x + 390 >= obst1.position.x &&
    //         position.y + 250 <= obst1.position.y + obst1.scale.alt &&
    //         position.y + 370 >= obst1.position.y 
    //         ){

    //             this.puloAtual = 0
    //             this.platform = true

    //             return true

    //         }else{
    //             this.platform = false
    //             return false
    //         }

    //     }
        


    atualizaSprites(){
        this.offset.x = this.spriteAtual * 200

         this.spriteAtual++
        if(this.spriteAtual >= this.imagemAtual.framesMax){
            this.spriteAtual = 0
            
        }    

        

        // if(keys.space.pressed){
            this.offset.x = this.spriteAtualJump * 200

            this.spriteAtualJump++
            if(this.spriteAtualJump >= this.imagemAtual.framesMax){
                this.spriteAtualJump = 0
            }
        // }

        if(this.fallCondition){
            this.offset.x = this.spriteAtualFall * 200

            this.spriteAtualFall++
            if(this.spriteAtualFall >= this.imagemAtual.framesMax){
                this.spriteAtualFall = 0
            }
        }

        if(keys.f.pressed){
            this.offset.x = this.spriteAtualAttack * 200

            this.spriteAtualAttack++
            if(this.spriteAtualAttack >= this.imagemAtual.framesMax){
                this.spriteAtualAttack = 0
            }
        }

        if(takenHitPlayer || takenHitCpu){
            this.offset.x = this.spriteAtualHit * 200

            this.spriteAtualHit++
            if(this.spriteAtualHit >= this.imagemAtual.framesMax){
                this.spriteAtualHit = 0
            }
       
        }

        if(this.death){
            this.offset.x = this.spriteAtualDeath * 200

            this.spriteAtualDeath++
            if(this.spriteAtualDeath >= this.imagemAtual.framesMax){
                this.spriteAtualDeath = 0
                clearInterval(stopInterval)
             
        }     
    }
}
    
    
   
    
    fisica(){
      
        this.velY+= this.gravidade
        this.position.y+= this.velY

        if(this.position.y >= 300){

            if(this.position.y >= 300){
                this.fallCondition = false
            }

            this.position.y = 300
        }
            
        // if(this.collision(this.position)){
        //     if(this.position.y + 371 >= obst1.position.y){
        //         this.fallCondition = false
   
        //         this.jump = true
        //         this.gravidade = 0
        //         this.position.y = obst1.position.y - 371
        //     }
        // }else{
        //     this.gravidade = 1
        // }

        
        // if(this.position.y <= obst1.position.y + 70){
        //     if(this.position.x + 300 <= obst1.position.x + obst1.scale.larg &&
        //         this.position.x + 390 >= obst1.position.x &&
        //         this.position.y + 220 <= obst1.position.y + obst1.scale.alt &&
        //         this.position.y + 370 >= obst1.position.y)
        //         {
        //             setTimeout(() => {
        //                 this.fallCondition = true
        //             }, 300)
                    
        //         this.position.y = obst1.position.y + obst1.scale.alt - 220
        //     }
        // }      

}
        
   move(){
    if(keys.a.pressed){
        this.position.x-= this.velX
        // if(this.collision(this.position)){
        //     this.position.x+= this.velX
        // }
        if(this.position.x <= tela.x - 250){
            this.position.x = tela.x - 250
        }
    }


    if(keys.d.pressed){
        this.position.x+= this.velX
        // if(this.collision(this.position)){       
        //     this.position.x-= this.velX
        // }
        if(this.position.x >= tela.largura - 400  ){
            this.position.x = tela.largura - 400
        }
    }
}

    pular(){
        if(keys.space.pressed){
            if(this.puloAtual < this.puloMax){
                this.velY = -this.forcaPulo
                this.puloAtual++
                
            }         
         
        }

        if(this.position.y >= chao.y - 380){
            this.puloAtual = 0
        }

        if(this.position.y <= 0){
            this.fallCondition = true
        }
     
    }
    
  

    attackPlayer(){
 
        // ctx.fillStyle = 'blue'
        // ctx.fillRect(jogador.position.x + 370, jogador.position.y + 250, 265, 20)
       

            if((jogador.position.x + 370) + 265 >= cpu.position.x + 400 &&
                (jogador.position.x + 370) <= cpu.position.x + cpu.scaleLarg - 410 &&

                (jogador.position.y + 250) + 20 >= cpu.position.y + 100 && 
                (jogador.position.y + 250) <= cpu.position.y + 400 
                ){
                    
                     takenHitCpu = true

                    
                     this.damageSound()
                        
                        gerenciaVidaCpu()
                                              
                        setTimeout(() => {
                            takenHitCpu = false
    
                        }, 400)                  
                }

    }

    attackCpu(){
        // ctx.fillStyle = 'green'
        ctx.fillRect(cpu.position.x + 100, cpu.position.y + 250, 265, 20)


        if((cpu.position.x + 100) <= jogador.position.x + (jogador.scaleLarg / 2) + 40 &&
                (cpu.position.x + 100) + (cpu.scaleLarg / 2) >= jogador.position.x + 460 &&

                (cpu.position.y + 250) + 20 >= jogador.position.y + 100 &&
                (cpu.position.y + 250) <= jogador.position.y + (jogador.scaleAlt) - 100
                ){
                        takenHitPlayer = true

                        this.damageSound()
                        // ctx.drawImage(jogador.sprites.takeHit.image, jogador.offset.x, jogador.offset.y,
                        //      jogador.sprites.takeHit.image.width / jogador.sprites.takeHit.framesMax,
                        //      jogador.sprites.takeHit.image.height,
                        //      jogador.position.x, jogador.position.y, jogador.scaleLarg, jogador.scaleAlt
                        //      )

                        gerenciaVidaPlayer()
                    
                        setTimeout(() => {
                            takenHitPlayer = false
                        }, 400)
                        
                }
    }

    desenhaHit(){
        ctx.drawImage(this.sprites.takeHit.image, this.offset.x, this.offset.y,
            this.sprites.takeHit.image.width / this.sprites.takeHit.framesMax,
            this.sprites.takeHit.image.height,
            this.position.x, this.position.y, this.scaleLarg, this.scaleAlt
            )
    }

    soundAttack(){
        if(jogo){
        const soundSlash = document.createElement('audio')
        let att1 = document.createAttribute('src')
        let att2 = document.createAttribute('id')
        att1.value = './Audios/slash sound improved.mp3'
        att2.value = 'slashSound'+ this.soundIndice
        soundSlash.setAttributeNode(att1)
        soundSlash.setAttributeNode(att2)
        document.body.append(soundSlash)
        document.getElementById('slashSound'+this.soundIndice).play()
        let audio = document.querySelectorAll('audio')
        this.soundIndice++
        if(audio.length >= 4){
            audio[0].remove()
            }
        }
    }

    damageSound(){
        const damageSound = document.createElement('audio')
        let att1 = document.createAttribute('src')
        let att2 = document.createAttribute('id')
        att1.value = './Audios/damageSound.mp3'
        att2.value = 'damageSound'+this.soundIndice
        damageSound.setAttributeNode(att1)
        damageSound.setAttributeNode(att2)
        document.body.append(damageSound)
        let audio = document.querySelectorAll('audio')
        // audio[1].play()
        document.getElementById('damageSound'+this.soundIndice).play()
        this.soundIndice++
        if(audio.length >= 3){
            audio[0].remove()
        }
    }



}


class obstaculo {
    constructor(position, scale){
        this.position = position
        this.scale = scale
        this.oi = 5
    }

    desenhaObstaculo(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.scale.larg, this.scale.alt)
        // console.log(jogador.position.x)
    }


}


const obst1 = new obstaculo(
    {
        x:500,
        y:350
        
    },
    {
        larg:400,
        alt:70
        
    }
    
    
    )
    

    
    function animateColisao(){
        obst1.desenhaObstaculo()
        
        
    }
    
    
    const jogador = new Fighter(

    {
        x: -250,
        y: 0
    },
//
    {
        larg: 680,
        alt: 600
    },
     
    
    todosSprites = {

        idle: {
            imageSrc: './Sprites/Idle.png',
            framesMax: 8
        },
        
        run: {
            imageSrc: './Sprites/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './Sprites/Jump.png',
            framesMax: 2,
        },
        
        fall: {
            imageSrc: './Sprites/Fall.png',
            framesMax: 2
        },

        attack: {
            imageSrc: './Sprites/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './Sprites/Take hitplayer.png',
            framesMax: 4
        },
        death: {
            imageSrc: './Sprites/Death.png',
            framesMax: 6
        }

    }, 

)

const cpu = new Fighter(
    {
        x: 680,
        y: 0
    },

    {
        larg: 860,
        alt: 600
    },

    todosSprites = {

        idle: {
            imageSrc: './Sprites/Idlecpu.png',
            framesMax: 4
        },
        
        run: {
            imageSrc: './Sprites/Runcpu.png',
            framesMax: 8
        },

        jump: {
            imageSrc: './Sprites/Jumpcpu.png',
            framesMax: 2,
        },

        fall: {
            imageSrc: './Sprites/Fallcpu.png',
            framesMax: 2
        },
        
        attack: {
            imageSrc: './Sprites/Attack1cpu.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './Sprites/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './Sprites/Deathcpu.png',
            framesMax: 7
        }
    }, 
)

const atualizaSpritesJog = jogador.atualizaSprites.bind(jogador)
const atualizaSpritesCpu = cpu.atualizaSprites.bind(cpu)


let stopInterval = setInterval(atualizaSpritesJog, 90)
let stopInterval2 = setInterval(atualizaSpritesCpu, 90)


const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    f: {
        pressed: false
    },
    space: {
        pressed: false
    },
    noKey: {
        pressed: true
    }
}


function gerenciaVidaCpu(){
    let dano = 15
    hpCpu.value -= dano
    

}

function gerenciaVidaPlayer(){
    let dano = 16
    hpPlayer.value -= dano
}

function animate(){
    
    requestAnimationFrame(animate)
    fisica()
    desenharPlayer()
    desenharCpu()
    animateColisao()

  
    if(jogo){    
        song.play()
        move()
        inteligenciaCpu()
    }

    if(cpu.death){
        move()
    }

    gerenciaGame()
   

}


function desenharPlayer(){
    ctx.clearRect(0, 0, canvas.width, canvas.height )

    if(!keys.d.pressed && !keys.a.pressed && !keys.f.pressed && !keys.space.pressed
        && !jogador.fallCondition && !jogador.death && !takenHitPlayer){
        jogador.imagemAtual.src = jogador.sprites.idle.imageSrc
        jogador.imagemAtual.framesMax = jogador.sprites.idle.framesMax
        jogador.desenhaSprite()
    }

    if(takenHitPlayer){
        jogador.imagemAtual.src = jogador.sprites.takeHit.imageSrc
        jogador.imagemAtual.framesMax = jogador.sprites.takeHit.framesMax
        jogador.desenhaSprite()
    }

    if(keys.d.pressed && !jogador.fallCondition && !keys.space.pressed &&
         !keys.f.pressed && !jogador.death && !takenHitPlayer){
        jogador.imagemAtual.src = jogador.sprites.run.imageSrc
        jogador.imagemAtual.framesMax = jogador.sprites.run.framesMax
        jogador.desenhaSprite()
    }

    if(keys.a.pressed && !jogador.fallCondition && !keys.space.pressed &&
         !keys.f.pressed && !jogador.death && !takenHitPlayer){
        jogador.imagemAtual.src = jogador.sprites.run.imageSrc
        jogador.imagemAtual.framesMax = jogador.sprites.run.framesMax
        jogador.desenhaSprite()
    }

    if(keys.f.pressed && !jogador.death && !takenHitPlayer){
        jogador.imagemAtual.src = jogador.sprites.attack.imageSrc
        jogador.imagemAtual.framesMax = jogador.sprites.attack.framesMax
        jogador.desenhaSprite()
            numHitsPlayer++
            if(numHitsPlayer % 20 === 0){
                jogador.attackPlayer()
            }
    }

    if(keys.space.pressed && !jogador.fallCondition && !jogador.death && !keys.f.pressed
        && !takenHitPlayer){
        jogador.imagemAtual.src = jogador.sprites.jump.imageSrc
        jogador.imagemAtual.framesMax = jogador.sprites.jump.framesMax
        jogador.pular()
        jogador.desenhaSprite()
    }

    if(jogador.fallCondition && !takenHitPlayer){
        jogador.imagemAtual.src = jogador.sprites.fall.imageSrc
        jogador.imagemAtual.framesMax = jogador.sprites.fall.framesMax
        jogador.desenhaSprite()
    
    }
    
    // if(keys.f.pressed && !takenHitPlayer && !jogador.death){
    //     jogador.desenhaAttack()

    //     numHitsPlayer++
    //     if(numHitsPlayer % 20 === 0){
    //     jogador.attackPlayer()
    //     }
  
    // }
   

    // if(keys.space.pressed & !keys.f.pressed &&
    //      !jogador.fallCondition && !takenHitPlayer && !jogador.death){
    //     jogador.pular()
    //     jogador.desenhaPulo()
    // }
    


    // if(jogador.fallCondition && !keys.f.pressed && !takenHitPlayer && !jogador.death){
    //     jogador.desenhaFall()
    // }
    
    if(hpPlayer.value <= 0){
        
        jogador.death = true
        menuLose.style.display = 'inline'

        jogador.imagemAtual.src = jogador.sprites.death.imageSrc
        jogador.imagemAtual.framesMax = jogador.sprites.death.framesMax
        jogador.desenhaSprite()

        song.pause()
        
        setTimeout(() => {
            jogo = false
        }, 400)
    }

}


function desenharCpu(){
 
    if(!takenHitCpu && cpuIdle && !cpu.death && !cpuAttack){
        cpu.imagemAtual.src = cpu.sprites.idle.imageSrc
        cpu.imagemAtual.framesMax = cpu.sprites.idle.framesMax
        cpu.desenhaSprite()
    }
   
    if(takenHitCpu && !cpu.death){
        cpu.imagemAtual.src = cpu.sprites.takeHit.imageSrc
        cpu.imagemAtual.framesMax = cpu.sprites.takeHit.framesMax
        cpu.desenhaSprite()
        // cpu.desenhaHit()
    }

    if(hpCpu.value <= 0){
        cpu.death = true
        menuWin.style.display = 'inline'
        // cpu.deathfunc()

        cpu.imagemAtual.src = cpu.sprites.death.imageSrc
        cpu.imagemAtual.framesMax = cpu.sprites.death.framesMax
        cpu.desenhaSprite()

        setTimeout(() => {
            jogo = false
        }, 400)
    }

    if(!jogo){
        cpu.imagemAtual.src = cpu.sprites.idle.imageSrc
        cpu.imagemAtual.framesMax = cpu.sprites.idle.framesMax
        cpu.desenhaSprite()

    }

}


function move(){
    jogador.move()

}

function fisica(){
    jogador.fisica()
    cpu.fisica()

}

// animate()

function inteligenciaCpu(){
 

    if(!takenHitCpu && cpuRun && !cpu.death){
        cpuAttack = false
        cpu.position.x -= cpu.velCpu // correndo pra esquerda
        // if(!cpuAttack){
        // cpu.desenhaSpriteRun()
            cpu.imagemAtual.src = cpu.sprites.run.imageSrc
            cpu.imagemAtual.framesMax = cpu.sprites.run.framesMax
            cpu.desenhaSprite()

        // }

    } 

    if(cpu.position.x < -100){// correndo pra direita
        cpuRun = true
        cpu.velCpu -= 5
    }

     if(cpu.position.x >= 800){ // correndo pra esquerda
        cpuRun = true
        cpu.velCpu += 5
    }

    if( cpu.position.x <= jogador.position.x + 230 && 
        cpu.position.x + 230 >= jogador.position.x + 170 
      
        ){

        cpuRun = false
        cpuAttack = true  
        

        numHitsCpu++

        if(!takenHitCpu){
            cpu.imagemAtual.src = cpu.sprites.attack.imageSrc
            cpu.imagemAtual.framesMax = cpu.sprites.attack.framesMax
            cpu.desenhaSprite()
            // cpu.desenhaAttack()
        }

        if(numHitsCpu % 30 === 0 && !takenHitCpu){
            cpu.attackCpu()
            cpu.soundAttack()
        }
  

    }

    let ramdomJump = Math.round(Math.random() * 5100 + 0)
    
        if(ramdomJump < 50){
            cpu.pular()

        }



 
         let ramdomIdle = Math.round(Math.random() * 5100 + 0)

            if(ramdomIdle < 100){ // cpu parado
                cpuRun = false
                cpuIdle = true
                cpu.velCpu = 0
                
            }

            let ramdomRun = Math.round(Math.random() * 10200 + 0)
                if(ramdomRun < 320){ // volta a correr
                    cpuIdle = false
                    cpuRun = true
                    
                    cpu.velCpu = 5
                }
          
            if(cpu.position.x <= jogador.position.x){
                    cpu.velCpu = -3

            }

}

function gerenciaGame(){
    
    if(jogador.death && jogo){
        deathSound.play()
    }
    
    else if(cpu.death && jogo){
        victorySound.play()
    }

}

const lastKey = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}


window.addEventListener('keydown', (event) => {
    let tecla = event.key
    if(tecla === 'w'){
        keys.w.pressed = true
     
    }
    if(tecla === 'a'){
        keys.a.pressed = true

    }
    if(tecla === 's'){
        keys.s.pressed = true

    }
    if(tecla === 'd'){
        keys.d.pressed = true

    }
    if(tecla === 'f'){
        // if(numHitsPlayer % 2 === 0 && jogo){
        jogador.soundAttack()
        // }
        keys.f.pressed = true
    }

    if(lastKey.a.pressed){
        lastKey.a.pressed = false
    }

    if(lastKey.d.pressed){
        lastKey.d.pressed = false
    }

})

window.addEventListener('keyup', (event) => {
    let tecla = event.key
    if(tecla === 'w'){
        keys.w.pressed = false

    }
    if(tecla === 'a'){
        keys.a.pressed = false

    }
    if(tecla === 's'){
        keys.s.pressed = false

    }
    if(tecla === 'd'){
        keys.d.pressed = false

    }
    if(tecla === 'f'){
        setTimeout(() => {
            keys.f.pressed = false  
        }, 340)
       
    }
    
    if(lastKey.a.pressed){
        lastKey.a.pressed = true
    }

    if(lastKey.d.pressed){
        lastKey.d.pressed = true
    }
})

window.addEventListener('keydown', (event) => {
        let tecla = event.code
        if(tecla === 'Space'){
            keys.space.pressed = true
            jogador.jump = true
     
                // jogador.pular()
            
            // jogador.dx = false
            // jogador.efeitoSonoro()
        }
        
})

window.addEventListener('keyup', (event) => {
    let tecla = event.code
    if(tecla === 'Space'){
        setTimeout(() => {
            keys.space.pressed = false
        }, 500)
        jogador.jump = false
       
    }

})


btnStart.addEventListener('click', () => {

            animate()
            jogo = true
            h1.style.display = 'none'
            containerHp.style.display = 'flex'
    
                  
})
