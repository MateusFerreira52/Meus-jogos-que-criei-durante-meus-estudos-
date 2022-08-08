import script from './script.js'

const attack1 = document.querySelector('#button1')
const attack2  = document.querySelector('#button2')
const attack3  = document.querySelector('#button3')
const attack4  = document.querySelector('#button4')

const playerBar = document.querySelector('#playerBar')
const playerHp = document.querySelector('#playerHp')

const cpuBar = document.querySelector('#cpuBar')
const cpuHp = document.querySelector('#cpuHp')

const attacksPlayer = document.querySelector('#attacksPlayer')
const attacksCpu = document.querySelector('#attacksCpu')

const enemy = document.querySelector('#enemy')
const jogador = document.querySelector('#player')

const levelPlayer = document.querySelector('#levelPlayer')
const levelCpu = document.querySelector('#levelCpu')

const choosePokemonDisplay = document.querySelector('#choose-pokemon')

const catchPokemon = document.querySelector('#catch')

const vicSong = document.querySelector('#vicSong')
const battleSong = document.querySelector('#battleSong')

let vitoria = false
let battling = false

let caught = 1
let playing = false
let currentPokemon = 20

let playerTurn = true
let cpuTurn = false


const playerStatus = {
    vida: 1,
    battle: true,
    image: new Image(),
    nextLevel: 200,
    resetLife: true,
    pokemons: [
        {
            name: 'Charmander',
            moves: [
                ['Ember', 2222],
                ['QuickAttack', 67],
                ['Fire', 58],
                ['Fire Tail', 38],
            ],
            life: 236,
            lifeMax: 236,
            level: 15,
            xp: 0,
            src: './Sprites/charmander.gif'
        },
        {
            name: 'Pidgey',
            moves: [
                ['SandAttack', 39],
                ['QuickAttack', 67],
                ['Fly', 48],
                ['Secret Power', 43],
            ],
            life: 226,
            lifeMax: 226,
            level: 15,
            xp: 0,
            src: './Sprites/pidgey.webp'
        },
    ],

    pokemonsPlayer: function(){
            if(this.battle){
                attacksPlayer.textContent = `Você mandou ${this.pokemons[currentPokemon].name}`
                this.battle = false
                playerBar.max = this.pokemons[currentPokemon].lifeMax
            }
 
            
            levelPlayer.textContent = `Level: ${this.pokemons[currentPokemon].level}`

            attack1.textContent = this.pokemons[currentPokemon].moves[0][0]
            attack2.textContent = this.pokemons[currentPokemon].moves[1][0]
            attack3.textContent = this.pokemons[currentPokemon].moves[2][0]
            attack4.textContent = this.pokemons[currentPokemon].moves[3][0]

            playerBar.value = this.vida
            playerStatus.vida = this.pokemons[currentPokemon].life
            playerHp.textContent = `HP: ${this.vida}`
            
                this.image.src = this.pokemons[currentPokemon].src
                this.image.style.width = '120px'
                jogador.insertBefore(this.image, jogador.children[2])
        }

}

class Enemies{
    static vida = 1
    static image = new Image()
    static display = true
    static battle = true
    static frames = 0
    static pokemons = [
        {
            name: 'Pikachu',
            moves: [
                ['Thunder', 49],
                ['QuickAttack', 37],
                ['Iron Tail', 38],
                ['ThunderBolt', 32],
            ],
            life: 326,
            level: 20,
            xp: 0,
            src: './Sprites/pikachu.jpg'  
        },
        {
            name: 'Squirtle',
            moves: [
                ['WaterGun', 39],
                ['QuickAttack', 27],
                ['Bubbles', 38],
                ['Punch', 32],
            ],
            life: 298,
            level: 15,
            xp: 0,
            src: './Sprites/squirtle.png'
        },
        {
            name: 'Geodude',
            moves: [
                ['Rock', 39],
                ['Punch', 32],
                ['HeadButt', 43],
                ['Earthquake', 48],
            ],
            life: 362,
            level: 15,
            xp: 0,
            src: './Sprites/Geodude.gif'
            
            
        },
        
    ]
    static randomPokemon = Math.floor(Math.random() * this.pokemons.length)

    constructor(){
    }
    
    static sortPokemon(){
        if(this.battle){
            this.battle = false
            Enemies.vida = this.pokemons[this.randomPokemon].life
            cpuBar.max = Enemies.vida
            cpuBar.value = Enemies.vida
        }

        Enemies.image.classList.add('size')
        Enemies.image.src = Enemies.pokemons[this.randomPokemon].src
        enemy.insertBefore(Enemies.image, enemy.children[2])
        cpuBar.value = Enemies.vida
        cpuHp.textContent = `HP: ${Enemies.vida}`
        levelCpu.textContent = 'Level: '+ Enemies.pokemons[this.randomPokemon].level

    

        if(this.display){
            attacksCpu.textContent = `a wild ${this.pokemons[this.randomPokemon].name} appeared`
            this.display = false
        }


        if(playing){
            if(cpuTurn){
                this.frames++
                let moveRamdom = Math.floor(Math.random() * 4) 
                
                if(this.frames % 50 === 0){
                    // playerStatus.vida -= this.pokemons[0].moves[moveRamdom][1]
                    playerStatus.pokemons[currentPokemon].life -= this.pokemons[0].moves[moveRamdom][1]
                    

                    attacksCpu.textContent = `${this.pokemons[this.randomPokemon].name} te atacou com ${this.pokemons[0].moves[moveRamdom][0]}`
                    cpuTurn = false
                    playerTurn = true
                }
        
            }
        }
    }
  

}


const battle = () => {

    gainExp()
    victory()
    
    defeat()

    

    if(!playing){
        
        playerTurn = true
        // jogador.style.display = 'none'
        choosePokemonDisplay.textContent = 'Escolha um pokémon'

        catchPokemon.classList.add('remove')
        catchPokemon.classList.remove('show')

        attack1.textContent = `${playerStatus.pokemons[0].name}`
        attack2.textContent = `${playerStatus.pokemons[1].name}`

        if(caught >= 2){
            attack3.textContent = `${playerStatus.pokemons[2].name}`
            attack3.addEventListener('click', changePokemon3)
        }else{
            attack3.textContent = 'Vazio'
        }
        
        if(caught >= 3){
            attack4.textContent = `${playerStatus.pokemons[3].name}`
            attack4.addEventListener('click', changePokemon4)
        }else{
            attack4.textContent = 'Vazio'
        }

     
        attack1.removeEventListener('click', () => attacks(0))
        attack2.removeEventListener('click', () => attacks(1))
        attack3.removeEventListener('click', () => attacks(2))
        attack4.removeEventListener('click', () => attacks(3))

        attack1.addEventListener('click', changePokemon1)
        attack2.addEventListener('click', changePokemon2)
        
    }else{
  
        jogador.style.display = 'block'
        playerStatus.pokemonsPlayer()   
        
        catchPokemon.classList.remove('remove')
        catchPokemon.classList.add('show')

        attack1.removeEventListener('click', changePokemon1)
        attack2.removeEventListener('click', changePokemon2)
        attack3.removeEventListener('click', changePokemon3)
        attack4.removeEventListener('click', changePokemon4)
        choosePokemonDisplay.textContent = 'Escolha um ataque'

        if(playerTurn){
            catchPokemon.addEventListener('click', catchPokemons)
            attack1.addEventListener('click', () => attacks(0))
            attack2.addEventListener('click', () => attacks(1))
            attack3.addEventListener('click', () => attacks(2))
            attack4.addEventListener('click', () => attacks(3))
        }
    }
    pokemonFainted()
    Enemies.sortPokemon()
 

}

let caughtPokemon = false

function catchPokemons(){
    if(playing){
        if(playerTurn){
            const newPokemon = Enemies.pokemons[Enemies.randomPokemon]
            let randomNumber = Math.floor(Math.random() * 1000)
            
            if(randomNumber <= 100){
                caughtPokemon = true
                caught++
                playerTurn = false
                playerStatus.pokemons.push(newPokemon)
                attacksPlayer.textContent = `Você capturou ${newPokemon.name}`
                enemy.style.display = 'none'
                
                setTimeout(() => {
                    script.player.battle = false
                    playing = false
                    
                }, 3000)
                
                return 
            }   
            
            else if(Enemies.vida <= 100){
                if(randomNumber <= 700){
                    caught++
                    caughtPokemon = true
                    playerTurn = false
                    playerStatus.pokemons.push(newPokemon)
                    attacksPlayer.textContent = `Você capturou ${newPokemon.name}`
                    enemy.style.display = 'none'
                    
                    setTimeout(() => {
                        script.player.battle = false
                        playing = false
                        
                    }, 3000)
                    
                    return 
                }
            }
            
            attacksPlayer.textContent = `Você falhou em capturar ${newPokemon.name}`
            
            playerTurn = false
            cpuTurn = true
        }
    }
    
}


function pokemonFainted(){
    if(defeat()){
        playerStatus.pokemons[currentPokemon].life = 0
        choosePokemonDisplay.textContent = `
            ${playerStatus.pokemons[currentPokemon].name} está desmaiado
        `
    }


}

function attacks(num){
    if(playing){
        if(playerTurn){
            Enemies.vida -= playerStatus.pokemons[currentPokemon].moves[num][1]

            attacksPlayer.textContent = `Você atacou com ${playerStatus.pokemons[currentPokemon].moves[num][0]}`
            playerTurn = false
            cpuTurn = true
        }
    }
        

    
}

function changePokemon1(){
    playerStatus.battle = true
    currentPokemon = 0
    playing = true
    playerStatus.vida = playerStatus.pokemons[currentPokemon].life
}

function changePokemon2(){
    playerStatus.battle = true
    currentPokemon = 1
    playing = true
    playerStatus.vida = playerStatus.pokemons[currentPokemon].life
}

function changePokemon3(){
    playerStatus.battle = true
    currentPokemon = 2
    playing = true
    playerStatus.vida = playerStatus.pokemons[currentPokemon].life
}

function changePokemon4(){
    playerStatus.battle = true
    currentPokemon = 3
    playing = true
    playerStatus.vida = playerStatus.pokemons[currentPokemon].life
}




function victory(){
    if(Enemies.vida <= 0 || caughtPokemon){
        vitoria = true
        playerTurn = false
        cpuTurn = false
        caughtPokemon = false
        Enemies.display = true
        Enemies.battle = true
        
        setTimeout(() => {
            script.player.battle = false
            jogador.style.display = 'none'
            playing = false
            vitoria = false
        }, 3000)
        
        Enemies.vida = 1000
        cpuBar.value = Enemies.vida
        cpuHp.textContent = Enemies.vida
        
        Enemies.randomPokemon = Math.floor(Math.random() * Enemies.pokemons.length)
        return vitoria
  
    }
    return false
}

function defeat(){
   const allPokemonsFainted = playerStatus.pokemons.every(pokemon => pokemon.life <= 0 )
 
   if(allPokemonsFainted){
        location.reload()
        return
   }
    
   if(playerStatus.vida <= 0){        
        playing = false

        return true
    }   
}


function gainExp(){
    if(victory()){
        script.battleSong.pause()
        // playerStatus.battle = true
        enemy.style.display = 'none'
        playerStatus.pokemons[currentPokemon].xp += 33
            attacksPlayer.textContent = `${playerStatus.pokemons[currentPokemon].name} ganhou 33 de xp`
            if(playerStatus.pokemons[currentPokemon].xp >= playerStatus.nextLevel){
                attacksPlayer.textContent = `${playerStatus.pokemons[currentPokemon].name} subiu de level`
                playerStatus.nextLevel+= 100
                playerStatus.pokemons[currentPokemon].level++
            }
        
    }

}

function playSongs(){
    if(battling){
        battleSong.play()
    }

    if(vitoria){
        battleSong.pause()
        vicSong.play()
    }

    if(!vitoria){
        vicSong.pause()
    }
}

const animate2 = () => {
    requestAnimationFrame(animate2)
    battle()
    playSongs()
    
    if(!playing){
        attacksPlayer.textContent = ''
    }

    if(vitoria){
        battling = false
        return
    }

    if(script.player.battle){
        battling = true
    }

}

animate2()


