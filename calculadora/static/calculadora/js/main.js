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
        // Expressão para cálculo (enviada ao backend)
        this.expressaoCalculo = '0';
        // Expressão para exibição (mostrada no visor)
        this.expressaoVisor = '0';
        this.updateDisplay();
    }

    delete() {
        if (this.expressaoVisor === '0') return;
        this.expressaoVisor = this.expressaoVisor.toString().slice(0, -1);
        this.expressaoCalculo = this.expressaoCalculo.toString().slice(0, -1);
        if (this.expressaoVisor === '') {
            this.expressaoVisor = '0';
            this.expressaoCalculo = '0';
        }
        this.operacaoAtual = this.expressaoVisor;
        this.updateDisplay();
    }

    appendNumber(number) {
        // Se o botão pressionado for o ponto decimal...
        if (number === '.') {
            // ...vamos verificar apenas o número atual.
            // Dividimos a expressão pelos espaços para pegar o último segmento.
            const partes = this.expressaoVisor.toString().split(' ');
            const ultimoSegmento = partes[partes.length - 1];
            // Se o último segmento (o número atual) já tiver um ponto, não fazemos nada.
            if (ultimoSegmento.includes('.')) return;
        }

        if (this.expressaoVisor === '0' && number !== '.') {
            this.expressaoVisor = number.toString();
            this.expressaoCalculo = number.toString();
        } else {
            this.expressaoVisor = this.expressaoVisor.toString() + number.toString();
            this.expressaoCalculo = this.expressaoCalculo.toString() + number.toString();
        }
        this.operacaoAtual = this.expressaoVisor;
        this.updateDisplay();
    }
    
    appendOperator(operator) {
        if (this.expressaoVisor === '0' && operator === '-') {
            this.expressaoVisor = '-';
            this.expressaoCalculo = '-';
            this.operacaoAtual = this.expressaoVisor;
            this.updateDisplay();
            return;
        }
        this.expressaoVisor += ` ${operator} `;
        this.expressaoCalculo += ` ${operator} `;
        this.operacaoAtual = this.expressaoVisor;
        this.updateDisplay();
    }

    // Função para lidar com porcentagem
    percentage() {
        // Divide a expressão atual pelos espaços para pegar as partes
        const partesVisor = this.expressaoVisor.toString().split(' ');
        const partesCalculo = this.expressaoCalculo.toString().split(' ');
        const ultimoSegmento = partesVisor[partesVisor.length - 1];
        
        // Verifica se o último segmento é um número válido
        if (ultimoSegmento && !isNaN(ultimoSegmento)) {
            // Se há uma operação anterior (ex: 100 - 10), calcula a porcentagem do primeiro número
            if (partesVisor.length >= 3) {
                const primeiroNumero = partesCalculo[0];
                const percentual = ultimoSegmento;
                
                // Para o visor: mostra como "100 - 10%"
                partesVisor[partesVisor.length - 1] = `${percentual}%`;
                this.expressaoVisor = partesVisor.join(' ');
                
                // Para o cálculo: converte para "(100 * 10 / 100)"
                const valorPercentual = `(${primeiroNumero} * ${percentual} / 100)`;
                partesCalculo[partesCalculo.length - 1] = valorPercentual;
                this.expressaoCalculo = partesCalculo.join(' ');
            } else {
                // Se é apenas um número (ex: 50), converte para porcentagem simples
                partesVisor[partesVisor.length - 1] = `${ultimoSegmento}%`;
                this.expressaoVisor = partesVisor.join(' ');
                
                partesCalculo[partesCalculo.length - 1] = `(${ultimoSegmento}/100)`;
                this.expressaoCalculo = partesCalculo.join(' ');
            }
            this.operacaoAtual = this.expressaoVisor;
            this.updateDisplay();
        }
    }

    // Função para trocar o sinal do número atual
    toggleSign() {
        // Divide a expressão atual pelos espaços para pegar o último número
        const partesVisor = this.expressaoVisor.toString().split(' ');
        const partesCalculo = this.expressaoCalculo.toString().split(' ');
        const ultimoSegmento = partesVisor[partesVisor.length - 1];
        
        // Verifica se o último segmento é um número válido
        if (ultimoSegmento && !isNaN(ultimoSegmento)) {
            const numero = parseFloat(ultimoSegmento);
            // Inverte o sinal do número
            partesVisor[partesVisor.length - 1] = (-numero).toString();
            partesCalculo[partesCalculo.length - 1] = (-numero).toString();
            this.expressaoVisor = partesVisor.join(' ');
            this.expressaoCalculo = partesCalculo.join(' ');
            this.operacaoAtual = this.expressaoVisor;
            this.updateDisplay();
        } else if (this.expressaoVisor === '0') {
            // Se estiver mostrando apenas 0, não faz nada
            return;
        }
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
    const expressaoParaCalculo = calculator.expressaoCalculo;
    const expressaoParaVisor = calculator.expressaoVisor;

    try {
        const response = await fetch('/api/calcular/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ 
                parametros: expressaoParaCalculo,
                parametros_exibicao: expressaoParaVisor 
            })
        });

        const data = await response.json();

        if (response.ok) {
            calculator.operacaoAnterior = `${expressaoParaVisor} =`;
            calculator.operacaoAtual = data.resultado;
            calculator.expressaoVisor = data.resultado;
            calculator.expressaoCalculo = data.resultado;
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
            // Usa parametros_exibicao se disponível, senão usa parametros
            parametrosSpan.innerText = op.parametros_exibicao || op.parametros;

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
const botaoSinal = document.querySelector('[data-sinal]');
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
        // Tratamento especial para porcentagem
        if (operador === '%') {
            calculator.percentage();
            return;
        }
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

// Event listener para o botão de trocar sinal (±)
botaoSinal.addEventListener('click', () => {
    calculator.toggleSign();
});

botaoLimparHistorico.addEventListener('click', clearHistory);

document.addEventListener('DOMContentLoaded', fetchHistory);