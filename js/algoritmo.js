
const EPSILON = 'ε';
const FIM_DE_PILHA = '$';
const TERMINAIS = ['a', 'b', 'c', 'd', 'e'];
const NAO_TERMINAIS = ['S', 'A', 'B', 'C', 'D'];

var entradadeDados = [];
var pilhadeAnalise = [FIM_DE_PILHA, 'S'];
var tabeladeDerivacao = [];

var ehAnalisar = true;
var ehGramativaAceita = null;
var linhasGeradas = 1;
var entrada = '';

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
        'd': [EPSILON]
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
    linhasGeradas = 1;
}

function estadodaAnalise() {
    return {
       
        entradadeDados: entradadeDados.join(''),
        pilhadeAnalise: pilhadeAnalise.join(''),
        ehGramativaAceita: ehGramativaAceita,
        tabela: tabeladeDerivacao
    };
}

function analiseDireta(dados) {

    reinicia();
    entradadeDados = (dados + '$').split('');
    while (ehAnalisar) {

        passo();
    }
    return estadodaAnalise();
}

function analisePassoaPasso(dados) {
    
    if (dados !== entrada || !ehAnalisar) {
     
        reinicia();
        entrada = dados;
        entradadeDados = (dados + '$').split('');
    }
    passo();
    return estadodaAnalise();
}

function passo() {

    let linha = {
        iter: linhasGeradas,
        pilhadeAnalise: pilhadeAnalise.join(''),
        entradadeDados: entradadeDados.join('')
    };

    let topoPilha = pilhadeAnalise[pilhadeAnalise.length - 1];

    // simbolo atual
    let simbolo = entradadeDados[0];

    if (topoPilha === FIM_DE_PILHA && simbolo === FIM_DE_PILHA) {
        ehAnalisar = false;
        ehGramativaAceita = true;
        linha.resultado = 'Aceito em ' + linhasGeradas + ' iterações';

        $('#passoapasso').removeClass('active');
        $('#passoapasso').addClass('disabled');
    } else {

        if (topoPilha === simbolo) {
            linha.resultado = 'Ler → ' + simbolo;
            pilhadeAnalise.pop();
            entradadeDados.shift(); // remove o primeiro

            // se existir o caminho,
        } else if (
            tabelaParser[topoPilha] !== undefined &&
            tabelaParser[topoPilha][simbolo] !== undefined
        ) {
            // ultima produção
            let pilha = tabelaParser[topoPilha][simbolo];
            let producao = pilha.join('');

            linha.resultado = topoPilha + ' → ' + producao;
            pilhadeAnalise.pop();

            // so empilha se não for epsilon
            if (producao !== EPSILON) {
                for (var j = pilha.length - 1; j >= 0; j--) {
                    pilhadeAnalise.push(pilha[j])
                }
            }

            //  erro
        } else {
            ehAnalisar = false;
            ehGramativaAceita = false;
            linha.resultado = 'Erro em ' + linhasGeradas + ' iterações';
            
            $('#passoapasso').removeClass('active');
            $('#passoapasso').addClass('disabled');
        }
    }
    linhasGeradas++;
    tabeladeDerivacao.push(linha);
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
        $row.append('<td>' + tabela[i].resultado + '</td>');
        $htmlTable.append($row);
    }
}

function exibeResultado(ehGramativaAceita) {

    $('#sentenca').removeClass('is-invalid is-valid');
    (ehGramativaAceita === true) ? $('#sentenca').addClass('is-valid') : 
    (ehGramativaAceita === false) ? $('#sentenca').addClass('is-invalid') : '';
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

function geraSentenca() {

    let inicial = 'S';
    let ehContinua = true;
    let sentence = '';
    while (ehContinua) {
        
        let producao = gramatica[inicial][Math.floor(Math.random() * gramatica[inicial].length)];
        if (sentence === '') {
            
            sentence = producao;
        } else {
            
            sentence = sentence.replace(inicial, producao);
        }

        let index = -1;
        for (var i = 0; i < sentence.length; i++) {
         
            index = NAO_TERMINAIS.indexOf(sentence[i]);
            if (index !== -1 || sentence[i] === EPSILON) {
         
                inicial = NAO_TERMINAIS[index];
                break;
            }
        }
        if (index === -1) {
            
            ehContinua = false;
        } 
    }
    if (sentence.indexOf(EPSILON) !== -1) {
   
        sentence = sentence.replace(EPSILON, '');
    }
    return sentence;
}