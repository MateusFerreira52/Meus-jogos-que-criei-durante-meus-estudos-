//....

let mewtwo = {
    vida: 1000,
    golpes : [
        ['Psychic', Psychic = 79],
        ['Soco', Soco = 80],
        ['Blizard', Blizzard = 102],
        ['Rock', Rock = 123]
    ]
    
}

let Zapdos = {
    vida: 1000,
    golpes: [
        ['ThunderBolt', thunderBolt = 106],
        ['Charge', charge = 82],
        ['Discharge', discharge = 74],
        ['Drill Peck', drillPeck = 60]
    ],
    reseta: function(){
        this.vida = 1000
        zapdosSprite.style.display = 'inline'
        displayCPUVida.style = 'black'
    }
}


let player = {
    vida: 1000,
    golpes: {
        quickAttack: 24,
        fire: 54,
        iceBeam: 46,
        thunder: 50,
        poison: 15
    },
    potion: 3,
    reseta: function(){
        this.vida = 1000
        this.potion = 3
        displayPlayerVida.style.color = 'black'
    }

}


const display = document.getElementById('display')
const display2 = document.getElementById('display2')
const audio = document.getElementById('audio')
const audio2 = document.getElementById('audio2')
const audioVitoria = document.getElementById('audioVitoria')
const btnInicio = document.getElementById('inicio')
const poderes = document.getElementsByClassName('mostra')
const mewtwoSprite = document.getElementById('mewtwo')
const redSprite = document.getElementById('red')
const zapdosSprite = document.getElementById('zapdos')


const botaoQ = document.getElementById('botaoQ')
const botaoF = document.getElementById('botaoF')
const botaoB = document.getElementById('botaoB')
const botaoT = document.getElementById('botaoT')
const botaoVeneno = document.getElementById('botaoVeneno')
const BotaoCura = document.getElementById('BotaoCura')
const critico = document.getElementById('critico')
const displayAtaquesPlayer = document.getElementById('displayAtaquesPlayer')
const displayAtaquesCPU = document.getElementById('displayAtaquesCPU')
const displayCPUVida = document.getElementById('displayCPUVida')
const displayPlayerVida = document.getElementById('displayPlayerVida')



let jogando = true
let vezplayer = true
let vezCPU = false
let oponenteAtual = 1
let trocaOponente = false


 function jogo(){

    if(jogando){
        if(oponenteAtual === 1){
            mewtwoSprite.style.display = 'block'
            displayCPUVida.innerHTML = `Vida do mewtwo atual: ${mewtwo.vida}`
        }

        if(oponenteAtual === 2){
            displayCPUVida.color = 'black'
            displayCPUVida.innerHTML = `Vida do Zapdos ${Zapdos.vida}`
        }

        redSprite.style.display = 'block'
        let number1 = Math.floor(Math.random() * 255 + 100)

        displayPlayerVida.innerHTML = `Sua vida atual: ${player.vida}`

       

     
    // console.log(tempo)
    console.log(vezCPU)
       
        if(player.vida < 300){
                displayPlayerVida.style.color = 'red'
            }
      


        if(player.vida < 100){
                displayPlayerVida.style.color = `rgb(${number1}, ${number1}, ${number1}, 4)`              
            }
    

        if(mewtwo.vida < 200 && oponenteAtual === 1){
                displayCPUVida.style.color = 'red'
            }

        if(vezplayer){
            botaoQ.addEventListener('click', quickAttack)
            botaoF.addEventListener('click', fire)
            botaoB.addEventListener('click', iceBeam)
            botaoT.addEventListener('click', thunder)
            BotaoCura.addEventListener('click', cura)
            botaoVeneno.addEventListener('click', veneno)
        }

        if(vezCPU && oponenteAtual === 1){
            //Mewtwo
            
            moverCPUMewtwo()
            let random = Math.floor(Math.random() * 4)
            player.vida -= mewtwo.golpes[random][1]

                vezCPU = false
                vezplayer = true
                displayAtaquesCPU.innerHTML = `Mewtwo te atacou com ${mewtwo.golpes[random][0]} <br>`   
        }

            //Zapdos
        if(oponenteAtual === 2 && vezCPU){
            moverCPUZapdos()
            let random = Math.floor(Math.random() * 4)
            player.vida -= Zapdos.golpes[random][1]
            
            vezCPU = false
            vezplayer = true
            displayAtaquesCPU.innerHTML = `Zapdos te atacou com ${Zapdos.golpes[random][0]}<br>`

        }

        if(envenenado && vezVeneno){
            vezVeneno = false
            mewtwo.vida -= 62
            critico.style.color = 'purple'
            critico.innerHTML += `Mewtwo tomou 62 de dano a mais por veneno<br>`
            rodadaVeneno--
            if(rodadaVeneno <= 0){
                critico.innerHTML = `Mewtwo não está mais envenenado!!!<br>`
                envenenado = false
            }
            
            
        }
     

          derrota()
          vitoria() 
           
    }
}

    
function rodar(){

requestAnimationFrame(rodar)
jogo()
}

function iniciar(){
    rodar()
    btnInicio.style.display = 'none'
    audio2.play()
}

function derrota(){
    if(player.vida <= 0){
                        
        displayAtaquesPlayer.innerHTML = ''
        displayAtaquesCPU.innerHTML = ''
        displayCPUVida.innerHTML = ''
        displayPlayerVida.innerHTML = ''
        setTimeout(() => {
           alert('voce perdeu')
        }, 200)
        audio2.pause()
        
       jogando = false
       vezCPU = false
       vezplayer = false

    }
}

function vitoria(){
    if(mewtwo.vida <= 0 && oponenteAtual === 1){
      
        displayAtaquesCPU.innerHTML = ''
        displayAtaquesPlayer.innerHTML = ''
        displayCPUVida.innerHTML = ''
        displayPlayerVida.innerHTML = ''
        player.reseta()
        setTimeout(() => {
           critico.innerHTML = 'Você ganhou!!!<br>'
        }, 200)
        audio2.pause()
        audioVitoria.play()
                
        vezCPU = false
        vezplayer = false
        trocaOponente = true
        nextPokemon()
    }
    

    if(Zapdos.vida <= 0 && oponenteAtual === 2){
        setTimeout(() => {
            critico.innerHTML = 'Voce venceu Zapdos!!!'
        },200)
        audio2.pause()
        audioVitoria.play()
        vezCPU = false
        vezplayer = false
        jogando = false
    }
}

function quickAttack(){
    if(this && vezplayer){
    
        
        moverPlayer()
        let ataqueCritico = Math.floor(Math.random() * 20)
            if(ataqueCritico < 9){
    
               player.golpes.quickAttack = 46

               mewtwo.vida = mewtwo.vida - player.golpes.quickAttack
               Zapdos.vida -= player.golpes.quickAttack

              critico.style.color = 'red'
              critico.innerHTML += 'Ataque critico<br>'
              critico.innerHTML = `ATAQUE CRÍTICO!<br>Causou ${player.golpes.quickAttack} de dano a mais<br>`
              critico.innerHTML += `Dano total: ${player.golpes.quickAttack + 24}<br>`
              audio.play()
              
            }
             
     player.golpes.quickAttack = 24

     mewtwo.vida = mewtwo.vida - player.golpes.quickAttack
     Zapdos.vida -= player.golpes.quickAttack
        
     vezplayer = false
     vezVeneno = true
     setTimeout(() => {
        vezCPU = true

    }, 2000)

     displayAtaquesPlayer.innerHTML = `Voce atacou o mewtwo com Quickattack<br>`
     

    //  console.log(ataqueCritico)
    }
}

function fire(){
    if(this && vezplayer){
        moverPlayer()
        let ataqueCritico = Math.floor(Math.random() * 400)
                if(ataqueCritico > 203){
        
                  player.golpes.fire = 60
                  mewtwo.vida -= player.golpes.fire
                  Zapdos.vida -= player.golpes.fire
                  critico.style.color = 'red'
                  critico.innerHTML += 'Ataque critico<br>'
                  critico.innerHTML = `ATAQUE CRÍTICO!<br>Causou ${player.golpes.fire} de dano a mais<br>`
                  critico.innerHTML += `Dano total: ${player.golpes.fire + 54}<br>`
                  audio.play()
                }

        player.golpes.fire = 54
        mewtwo.vida -= player.golpes.fire
        Zapdos.vida -= player.golpes.fire
        vezplayer = false
        vezVeneno = true
        setTimeout(() => {
            vezCPU = true

        }, 2000)

        displayAtaquesPlayer.innerHTML = `Voce atacou o mewtwo com Fire<br>`

        
    }

}

function iceBeam(){
    if(this && vezplayer){
        moverPlayer()
        let ataqueCritico = Math.floor(Math.random() * 500)
                if(ataqueCritico > 349){
        
                  player.golpes.iceBeam = 65
                  mewtwo.vida -= player.golpes.iceBeam
                  Zapdos.vida -= player.golpes.iceBeam
                  critico.style.color = 'red'
                  critico.innerHTML += 'Ataque critico<br>'
                  critico.innerHTML = `ATAQUE CRÍTICO!<br>Causou ${player.golpes.iceBeam} de dano a mais<br>`
                  critico.innerHTML += `Dano total: ${player.golpes.iceBeam + 46}<br>`
                  audio.play()
                }

                player.golpes.iceBeam = 46
        mewtwo.vida -= player.golpes.iceBeam
        Zapdos.vida -= player.golpes.iceBeam
        vezplayer = false
        vezVeneno = true
        setTimeout(() => {
            vezCPU = true

        }, 2000)

        displayAtaquesPlayer.innerHTML = `Voce atacou o mewtwo com Icebeam<br>`
       
    }
}

function thunder(){
    if(this && vezplayer){
        moverPlayer()
        let ataqueCritico = Math.floor(Math.random() * 500)
                    if(ataqueCritico > 390){
            
                      player.golpes.thunder = 70
                      mewtwo.vida -= player.golpes.thunder
                      Zapdos.vida -= player.golpes.thunder
                      critico.style.color = 'red'
                      critico.innerHTML += 'Ataque critico<br>'
                      critico.innerHTML = `ATAQUE CRÍTICO!<br>Causou ${player.golpes.thunder} de dano a mais<br>`
                      critico.innerHTML += `Dano total: ${player.golpes.thunder + 50}<br>`
                      audio.play()
                    }

                    player.golpes.thunder = 50
        mewtwo.vida-= player.golpes.thunder
        Zapdos.vida -= player.golpes.thunder
        vezplayer = false
        vezVeneno = true
        setTimeout(() => {
            vezCPU = true

        }, 2000)

        displayAtaquesPlayer.innerHTML = `Voce atacou o mewtwo com Thunder<br>`
    }
}

function cura(){
    if(player.potion >= 1 && vezplayer){
        player.vida += 300
        if(player.vida >= 200){
            displayPlayerVida.style.color = 'black'
        }
        displayAtaquesPlayer.innerHTML = `<br>Você acabou de usar uma potion!<br>`
        player.potion--
        // critico.style.backgroundColor = 'yellow'
        critico.style.color = 'green'
        critico.innerHTML += `Potion restantes: ${player.potion}<br>`
       
        vezplayer = false
        vezVeneno = true
        setTimeout(() => {
            vezCPU = true

        }, 2000)     
    }
    if(player.potion <= 0){
        critico.innerHTML = `Seus potions acabaram!!!`
    }
}

let envenenado = false
let rodadaVeneno
let vezVeneno = false

function veneno(){
    if(this && vezplayer){
        moverPlayer()
        let random = Math.floor(Math.random() * 1000)
        console.log(random)
        if(random > 673){
           
            critico.style.color = 'purple'
            if(oponenteAtual === 1){
            critico.innerHTML = `Mewtwo foi envenenado!!!<br>`
            }
            if(oponenteAtual === 2){
                critico.innerHTML = `Zapdos foi envenenado!!!<br>`
            }
            envenenado = true
            rodadaVeneno = 5
            
        }
            

        

        displayAtaquesPlayer.innerHTML = `Voce atacou com poison`
        mewtwo.vida-= player.golpes.poison
        Zapdos.vida -= player.golpes.poison
        vezplayer = false
        vezVeneno = true
        setTimeout(() => {
            vezCPU = true
        }, 2000)
        

    }

}

function moverCPUMewtwo(){
    mewtwoSprite.style.transform = `translate(-100px)`
            setTimeout(() => {
                mewtwoSprite.style.transform = `translate(0px)`
            }, 100)
}

function moverCPUZapdos(){
    zapdosSprite.style.transform = `translate(-100px)`
        setTimeout(() => {
            zapdosSprite.style.transform = `translate(0px)`
        }, 100)
}

function moverPlayer(){
    redSprite.style.transform = `translate(100px)`
        setTimeout(() => {
            redSprite.style.transform = `translate(0px)`
        }, 100)
}
// console.log(jogo)

function nextPokemon(){
    if(trocaOponente){
        oponenteAtual = 2
        trocaOponente = false
        mewtwoSprite.style.display = 'none'
        Zapdos.reseta()
        setTimeout(() => {
        let confirmar = confirm('Enfrentar próximo pokemon ?') 
        if(confirmar){
            
            audioVitoria.pause()
            audio2.play()
        }},500)
    }


}

