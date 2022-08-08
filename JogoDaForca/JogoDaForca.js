
const display = document.querySelectorAll('#pai > div')
const letraJogada = document.getElementById('letraJogada')
const letraJogada2 = document.getElementById('letraJogada2')
const vida = document.getElementById('vida')
const jogPala = document.getElementById('jogPala')
const boneco = document.querySelectorAll('div > img')

let vidas
let acertos
let palaSorteada


function sorteiaPalavra(){
    

const biblioteca = [
    'aleatorio','teste','cavalo','vermelho','coca','coxinha','programa','computador',
     'mouse','teclado', 'televisão','monitor','casa','mesa', 'chão','tabela','futebol',
     'caixa','videogame'           
]


 vidas = 0
 acertos = 0
 let ramdom = Math.floor(Math.random() * 18)
 palaSorteada = biblioteca[ramdom]


    
    const tam = [...palaSorteada].length

        for(let i = 0; i < tam; i++){
        display[i].style.display = 'inline'
        }
 
}


function jogar(){
    const jogPala = document.getElementById('jogPala')

  
        letraRepetida()
        verificarLetras()
       
        
  
        if(jogPala.value !== ''){
            const letters = [...palaSorteada]

            letters.forEach((letter, index) => {
                if(palaSorteada[index].includes(jogPala.value)){
                    display[index].innerHTML = letter
                }  
            })
            
            if(letters.includes(jogPala.value)){
                letraJogada.innerHTML+= jogPala.value.toUpperCase()  
                const regex = new RegExp(jogPala.value, 'ig')
                const qnt = palaSorteada.match(regex).length
                acertos+= qnt
            }else{
                letraJogada.innerHTML+= jogPala.value.toUpperCase()   
                vidas++
            }

            const verificaVida = (vida) =>
                     vidas === vida ? boneco[vida].style.display = 'block' : ''


            for(let i = 1; i <= 7; i++){
                verificaVida(i)
            }

        }
        

        jogPala.value = ''
        jogPala.focus()

       
        derrota()
        vitoria()
  

}

function letraRepetida(){
    if(jogPala.value !== ''){
        if(letraJogada.innerHTML.includes(jogPala.value.toUpperCase())){
            alert('Você já usou essa letra')
            jogPala.value =  ''
            jogPala.focus()
            return;
        }
    }

}

function derrota(){
    if(vidas >= 7){
        setTimeout(() => {
            alert('Voce perdeu!')
            alert(`A palavra era: ${palaSorteada.toUpperCase()}`)
            location.reload()
        }, 500)
        
    }

}

function vitoria(){
    const tam = [...palaSorteada].length
    if(acertos >= tam){
        setTimeout(() => {
            alert('Você ganhou!')
            location.reload()
        },200)
        
        
        
    }
}

function dica(){
    alert(
    `A palavra começa com a letra ${palaSorteada.charAt(0)}`
    )
}

function verificarLetras(){
    const regExChar = new RegExp(/([a-zA-Z])/, 'ig')
    if(jogPala.value !== ''){
        if(jogPala.value === 'ç'){
            return;
        }  
        if(!regExChar.test(jogPala.value)){
            alert('Insira uma letra!!!')
            jogPala.value = ''
            jogPala.focus()
            return;     
        }
        
    }   
}


