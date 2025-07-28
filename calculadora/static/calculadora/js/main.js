// Organiza toda a lógica e estado da calculadora em um único objeto.
class Calculator {
    constructor(operacaoAnteriorTextElement, operacaoAtualTextElement) {
        this.operacaoAnteriorTextElement = operacaoAnteriorTextElement;
        this.operacaoAtualTextElement = operacaoAtualTextElement;
        this.clear();
    }

    clear() {
        this.operacaoAtual = '0';
        this.operacaoAnterior = '';
        this.operador = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.operacaoAtual === '0') return;
        this.operacaoAtual = this.operacaoAtual.toString().slice(0, -1);
        if (this.operacaoAtual === '') {
            this.operacaoAtual = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        // Se o botão pressionado for o ponto decimal...
        if (number === '.') {
            // ...vamos verificar apenas o número atual.
            // Dividimos a expressão pelos espaços para pegar o último segmento.
            const partes = this.operacaoAtual.toString().split(' ');
            const ultimoSegmento = partes[partes.length - 1];
            // Se o último segmento (o número atual) já tiver um ponto, não fazemos nada.
            if (ultimoSegmento.includes('.')) return;
        }

        if (this.operacaoAtual === '0' && number !== '.') {
            this.operacaoAtual = number.toString();
        } else {
            this.operacaoAtual = this.operacaoAtual.toString() + number.toString();
        }
        this.updateDisplay();
    }
    
    appendOperator(operator) {
        if (this.operacaoAtual === '0' && operator === '-') {
            this.operacaoAtual = '-';
            this.updateDisplay();
            return;
        }
        this.operacaoAtual += ` ${operator} `;
        this.updateDisplay();
    }

    updateDisplay() {
        this.operacaoAtualTextElement.innerText = this.operacaoAtual;
        this.operacaoAnteriorTextElement.innerText = this.operacaoAnterior;
    }
}


// --- LÓGICA DE CONEXÃO COM A API ---

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


async function handleEquals() {
    const expressao = calculator.operacaoAtual;

    try {
        const response = await fetch('/api/calcular/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ parametros: expressao })
        });

        const data = await response.json();

        if (response.ok) {
            calculator.operacaoAnterior = `${expressao} =`;
            calculator.operacaoAtual = data.resultado;
            calculator.updateDisplay();
            fetchHistory();
        } else {
            alert(`Erro: ${data.message || 'Ocorreu um problema.'}`);
        }
    } catch (error) {
        console.error('Erro de rede ou ao processar a requisição:', error);
        alert('Não foi possível conectar ao servidor.');
    }
}


async function fetchHistory() {
    try {
        const response = await fetch('/api/calcular/', { method: 'GET' });
        if (!response.ok) return;

        const historico = await response.json();
        const historicoListaDiv = document.getElementById('historico-lista');
        
        historicoListaDiv.innerHTML = '';

        historico.slice(0, 5).forEach(op => {
            const div = document.createElement('div');
            
            const parametrosSpan = document.createElement('span');
            parametrosSpan.className = 'historico-parametros';
            parametrosSpan.innerText = op.parametros;

            const resultadoSpan = document.createElement('span');
            resultadoSpan.className = 'historico-resultado';
            
            // Usar o horário real da operação que vem do backend
            const dataOperacao = new Date(op.data_inclusao);
            const horario = dataOperacao.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
            
            // Criar elementos separados para resultado e horário
            const resultadoTexto = document.createElement('span');
            resultadoTexto.innerText = `= ${op.resultado}`;
            
            const horarioTexto = document.createElement('span');
            horarioTexto.className = 'historico-horario';
            horarioTexto.innerText = horario;
            
            resultadoSpan.appendChild(resultadoTexto);
            resultadoSpan.appendChild(horarioTexto);
            
            div.appendChild(parametrosSpan);
            div.appendChild(resultadoSpan);
            historicoListaDiv.appendChild(div);
        });

    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
    }
}

async function clearHistory() {
    try {
        console.log('Tentando limpar histórico...');
        const response = await fetch('/api/calcular/', {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            }
        });

        console.log('Resposta recebida:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Histórico limpo:', data.message);
            const historicoListaDiv = document.getElementById('historico-lista');
            historicoListaDiv.innerHTML = '';
            
            // Feedback visual opcional
            const botaoLixeira = document.getElementById('limpar-historico');
            const textoOriginal = botaoLixeira.innerHTML;
            botaoLixeira.innerHTML = '✓';
            setTimeout(() => {
                botaoLixeira.innerHTML = textoOriginal;
            }, 1000);
        } else {
            const errorData = await response.json();
            console.error('Erro na resposta:', errorData);
            alert(`Erro ao limpar histórico: ${errorData.message || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro ao limpar histórico:', error);
        alert('Não foi possível conectar ao servidor.');
    }
}


// --- INICIALIZAÇÃO E EVENTOS ---

const botoesNumeros = document.querySelectorAll('[data-numero]');
const botoesOperadores = document.querySelectorAll('[data-operador]');
const botaoIgual = document.querySelector('[data-igual]');
const botaoAllClear = document.querySelector('[data-all-clear]');
const botaoLimparHistorico = document.getElementById('limpar-historico');
const operacaoAnteriorTextElement = document.querySelector('[data-operacao-anterior]');
const operacaoAtualTextElement = document.querySelector('[data-operacao-atual]');

const calculator = new Calculator(operacaoAnteriorTextElement, operacaoAtualTextElement);


botoesNumeros.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
    });
});

// ############# MUDANÇA AQUI #############
botoesOperadores.forEach(button => {
    button.addEventListener('click', () => {
        let operador = button.innerText;
        // Traduz os símbolos visuais para os operadores que o backend entende
        if (operador === '×') {
            operador = '*';
        } else if (operador === '÷') {
            operador = '/';
        }
        calculator.appendOperator(operador);
    });
});
// ##########################################

botaoIgual.addEventListener('click', handleEquals);

botaoAllClear.addEventListener('click', () => {
    calculator.clear();
});

botaoLimparHistorico.addEventListener('click', clearHistory);

document.addEventListener('DOMContentLoaded', fetchHistory);