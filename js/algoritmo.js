
const EPSILON = 'ε';
const FIM_DE_PILHA = '$';

const TERMINAIS = ['a', 'b', 'c', 'd', 'e'];
const NAO_TERMINAIS = ['S', 'A', 'B', 'C', 'D'];


var entradadeDados = [];
var pilhadeAnalise = [FIM_DE_PILHA, 'S'];
var tabeladeDerivacao = [];

var ehAnalisar = true;
var ehGramativaAceita = null;
var iteration = 1;

var gramatica = {
    'S': ['Ae', 'aD'],
    'A': ['cC', 'dD', 'b'],
    'B': ['a', 'cCb', EPSILON],
    'C': ['De', 'aAe'],
    'D': ['ABd', 'eCc']
};

var tabelaParser = {
    'S': {
        'a': ['a', 'D'],
        'b': ['A', 'e'],
        'c': ['A', 'e'],
        'd': ['A', 'e'],
    },
    'A': {
        'b': ['b'],
        'c': ['c', 'C'],
        'd': ['d', 'D']
    },
    'B': {
        'a': ['a'],
        'c': ['c', 'C', 'b'],
        'd': [EPSILON],
        '$': [EPSILON]
    },
    'C': {
        'a': ['a', 'A', 'e'],
        'b': ['D', 'e'],
        'c': ['D', 'e'],
        'd': ['D', 'e'],
        'e': ['D', 'e']
    },
    'D': {
        'b': ['A', 'B', 'd'],
        'c': ['A', 'B', 'd'],
        'd': ['A', 'B', 'd'],
        'e': ['e', 'C', 'c']
    }
};

function reinicia() {
    pilhadeAnalise = [FIM_DE_PILHA, 'S'];
    entradadeDados = [];
    ehAnalisar = true;
    ehGramativaAceita = null;
    tabeladeDerivacao = [];
    iteration = 1;
}

function estadodaAnalise() {
    return {
        entradadeDados: entradadeDados.join(''),
        pilhadeAnalise: pilhadeAnalise.join(''),
        ehGramativaAceita: ehGramativaAceita,
        tabela: tabeladeDerivacao
    };
}

function geraSentenca() {
    var inicial = 'S';
    var generating = true;
    var sentence = '';
    while (generating) {
        var ruleLength = gramatica[inicial].length;
        var production = gramatica[inicial][Math.floor(Math.random() * ruleLength)];
        if (sentence === '') {
            sentence = production;
        } else {
            sentence = sentence.replace(inicial, production);
        }
        var ruleIndex = -1;
        for (var i = 0; i < sentence.length; i++) {
            ruleIndex = NAO_TERMINAIS.indexOf(sentence[i]);
            if (ruleIndex !== -1 || sentence[i] === EPSILON) {
                inicial = NAO_TERMINAIS[ruleIndex];
                break;
            }
            console.log(ruleIndex, sentence[i]);
        }
        if (ruleIndex === -1) {
            generating = false;
        } 
    }
    sentence = sentence.replace(EPSILON, '');
    if (sentence.indexOf(EPSILON) !== -1) {
        sentence = sentence.replace(EPSILON, '');
    }
    return sentence;
}

function passo() {

    // cria a linha da tabela de derivação
    var debugRow = {
        iter: iteration,
        pilhadeAnalise: pilhadeAnalise.join(''),
        entradadeDados: entradadeDados.join('')
    };

    // topo da pilha
    var topStack = pilhadeAnalise[pilhadeAnalise.length - 1];

    // simbolo atual na entrada
    var inSimbol = entradadeDados[0];

    // se o topo for o final da pilha e o simbolo de entrada também, foi aceito
    if (topStack === FIM_DE_PILHA && inSimbol === FIM_DE_PILHA) {
        ehAnalisar = false;
        ehGramativaAceita = true;
        debugRow.action = 'Aceito em ' + iteration + ' iterações';

        $('#btn-verify-step').removeClass('active');
        $('#btn-verify-step').addClass('disabled');
    } else {
        // se o topo da pilha for igual ao simbolo da entrada, lê a entrada
        if (topStack === inSimbol) {
            debugRow.action = 'Ler → ' + inSimbol;
            pilhadeAnalise.pop();
            entradadeDados.shift();

            // se existir uma entrada equivalente ao simbolo de entrada ao 
            // não-terminal no topo da pilha na tabela de Parsing
        } else if (
            tabelaParser[topStack] !== undefined &&
            tabelaParser[topStack][inSimbol] !== undefined
        ) {
            // produção em array da tabela de parsing para o simbolo terminal da entrada
            var toStack = tabelaParser[topStack][inSimbol];
            // produção em formato de string
            var production = toStack.join('');

            // adiciona a ação atual na tabela de derivação
            debugRow.action = topStack + ' → ' + production;

            // remove o topo da pilha
            pilhadeAnalise.pop();

            // se a produção não for vazia (epsilon), coloca seu conteúdo da pilha
            if (production !== EPSILON) {
                for (var j = toStack.length - 1; j >= 0; j--) {
                    pilhadeAnalise.push(toStack[j])
                }
            }

            // se a análise não for válida, finaliza a mesma com erro
        } else {
            ehAnalisar = false;
            ehGramativaAceita = false;
            debugRow.action = 'Erro em ' + iteration + ' iterações';
            
            $('#btn-verify-step').removeClass('active');
            $('#btn-verify-step').addClass('disabled');
        }
    }
    // incrementa a iteração e coloca a linha gerada na tabela de derivação
    iteration++;
    tabeladeDerivacao.push(debugRow);
}

function analiseDireta(inputString) {

    // limpa as variáveis globais
    reinicia();

    // transforma a entrada em array
    entradadeDados = (inputString + '$').split('');

    // executa todos os passos até o final
    while (ehAnalisar) {
        passo();
    }

    return estadodaAnalise();
}

var savedInput = '';

function analisePassoaPasso(inputString) {
    if (inputString !== savedInput || !ehAnalisar) {
        reinicia();
        savedInput = inputString;
        entradadeDados = (inputString + '$').split('');
    }

    passo();

    return estadodaAnalise();
}

function insereDadosnaTabela(tabela) {
    if (tabela === undefined) {
        tabela = tabeladeDerivacao;
    }

    $htmlTable = $('.debug-table > tbody');
    $htmlTable.html('');

    for (var i = 0; i < tabela.length; i++) {
        $row = $('<tr>');
        $row.append('<td>' + tabela[i].pilhadeAnalise + '</td>');
        $row.append('<td>' + tabela[i].entradadeDados + '</td>');
        $row.append('<td>' + tabela[i].action + '</td>');
        $htmlTable.append($row);
    }
}

function exibeResultado(ehGramativaAceita) {
    $('#input-sentence').removeClass('is-invalid is-valid');
    (ehGramativaAceita === true) ? $('#input-sentence').addClass('is-valid') : 
    (ehGramativaAceita === false) ? $('#input-sentence').addClass('is-invalid') : '';
 }

function exibeDados(exibe) {

    if (exibe === undefined) {
        exibeResultado(undefined);
        setTimeout(() => {

            exibeResultado(null);
            insereDadosnaTabela([]);
        }, 800);
    } else {

        insereDadosnaTabela(exibe.table);
        exibeResultado(exibe.ehGramativaAceita);
    }
}