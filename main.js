const numeroSenha = document.querySelector('.parametro-senha__texto');
let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;

const botoes = document.querySelectorAll('.parametro-senha__botao');
const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
const numeros = '0123456789';
const simbolos = '!@#$%*?§]£}&';
const forcaSenha = document.querySelector('.forca');
const alertaErro = document.getElementById('alerta-erro');
const botaoGerar = document.getElementById('botao-gerar');
const botaoCopiar = document.getElementById('copiar-senha');

botoes[0].onclick = diminuiTamanho;
botoes[1].onclick = aumentaTamanho;
botaoGerar.onclick = () => {
    adicionarAnimacao();
    geraSenha();
};

// Função para adicionar animação de pulso
function adicionarAnimacao() {
    campoSenha.classList.add('senha-gerada');
    setTimeout(() => {
        campoSenha.classList.remove('senha-gerada');
    }, 400);
}

function diminuiTamanho() {
    if (tamanhoSenha > 1) {
        tamanhoSenha--;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

function aumentaTamanho() {
    if (tamanhoSenha < 20) {
        tamanhoSenha++;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

for (i = 0; i < checkbox.length; i++) {
    checkbox[i].onclick = geraSenha;
}

// Função para verificar se pelo menos um checkbox está marcado
function verificarCheckboxes() {
    const algumMarcado = Array.from(checkbox).some(cb => cb.checked);
    
    if (!algumMarcado) {
        alertaErro.classList.add('mostrar');
        campoSenha.classList.add('shake');
        setTimeout(() => {
            campoSenha.classList.remove('shake');
        }, 500);
        return false;
    } else {
        alertaErro.classList.remove('mostrar');
        return true;
    }
}

geraSenha();

function geraSenha() {
    // Verificar se pelo menos um checkbox está marcado
    if (!verificarCheckboxes()) {
        campoSenha.value = '';
        return;
    }

    let alfabeto = '';
    if (checkbox[0].checked) {
        alfabeto = alfabeto + letrasMaiusculas;
    }
    if (checkbox[1].checked) {
        alfabeto = alfabeto + letrasMinusculas;
    }
    if (checkbox[2].checked) {
        alfabeto = alfabeto + numeros;
    }
    if (checkbox[3].checked) {
        alfabeto = alfabeto + simbolos;
    }

    let senha = '';
    for (let i = 0; i < tamanhoSenha; i++) {
        let numeroAleatorio = Math.random() * alfabeto.length;
        numeroAleatorio = Math.floor(numeroAleatorio);
        senha = senha + alfabeto[numeroAleatorio];
    }
    campoSenha.value = senha;
    classificaSenha(alfabeto.length);
}

function classificaSenha(tamanhoAlfabeto) {
    let entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    forcaSenha.classList.remove('fraca', 'media', 'forte');
    
    if (entropia > 57) {
        forcaSenha.classList.add('forte');
    } else if (entropia > 35 && entropia < 57) {
        forcaSenha.classList.add('media');
    } else if (entropia <= 35) {
        forcaSenha.classList.add('fraca');
    }
    
    const valorEntropia = document.querySelector('.entropia');
    valorEntropia.textContent = "Um computador pode levar até " + Math.floor(2**entropia/(100e6*60*60*24)) + " dias para descobrir essa senha";
    valorEntropia.style.fontSize = "24px";
}

// Funcionalidade de copiar senha
botaoCopiar.addEventListener('click', function() {
    if (campoSenha.value === '') {
        return;
    }

    // Copiar para área de transferência
    navigator.clipboard.writeText(campoSenha.value).then(function() {
        // Feedback visual desktop
        const feedback = document.getElementById('feedback-copiar');
        feedback.classList.add('mostrar');
        
        // Feedback visual mobile
        const mobileFeedback = document.getElementById('mobile-feedback');
        mobileFeedback.classList.add('mostrar');

        // Vibração no mobile (se disponível)
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }

        // Remover feedback após 2 segundos
        setTimeout(() => {
            feedback.classList.remove('mostrar');
            mobileFeedback.classList.remove('mostrar');
        }, 2000);
    }).catch(function(err) {
        console.error('Erro ao copiar: ', err);
    });
});

// Atalhos de teclado
document.addEventListener('keydown', function(event) {
    // Espaço = gerar nova senha
    if (event.code === 'Space' && event.target.tagName !== 'INPUT') {
        event.preventDefault();
        adicionarAnimacao();
        geraSenha();
    }
    
    // Ctrl+C = copiar senha
    if (event.ctrlKey && event.key === 'c' && event.target !== campoSenha) {
        event.preventDefault();
        botaoCopiar.click();
    }
    
    // Setas = ajustar tamanho
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        aumentaTamanho();
    }
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        diminuiTamanho();
    }
});

// Gestos para mobile (swipe para gerar nova senha)
let startY = 0;
let endY = 0;

document.addEventListener('touchstart', function(event) {
    startY = event.touches[0].clientY;
});

document.addEventListener('touchend', function(event) {
    endY = event.changedTouches[0].clientY;
    
    // Swipe para baixo (diferença maior que 50px)
    if (startY - endY > 50) {
        adicionarAnimacao();
        geraSenha();
    }
});

// Tap duplo para copiar no mobile
let lastTap = 0;
campoSenha.addEventListener('touchend', function(event) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 500 && tapLength > 0) {
        event.preventDefault();
        botaoCopiar.click();
    }
    lastTap = currentTime;
});