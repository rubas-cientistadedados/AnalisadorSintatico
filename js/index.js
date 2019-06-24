$(document).ready( () => {

    /**
     * Limpa os dados do analisador caso a sentença mude
     */
    $('#input-sentence').on('keyup', () => {
        reinicia();
        exibeDados();
        
        resultado.removeClass('disabled');
        resultado.addClass('active');
    });

    /**
     * Limpa os dados do analisador e da view
     */
    $('#btn-clean').click( () => {
        $('#input-sentence').val('').focus();
        $('html, body').css('transition-delay', '0s, 5s');
        reinicia();
        exibeDados();

        resultado.removeClass('disabled');
        resultado.addClass('active');        
    });

    /**
     * Análisa a sentença na entrada em um passo
     */

    $('#btn-verify-sentence').click(() => {

        exibeDados(analiseDireta($('#input-sentence').val()));
        $("html, body").animate({

            scrollTop: $(document).height()
        }, 7000);

        resultado.removeClass('active');
        resultado.addClass('disabled');
    });

    /**
     * Realiza a analise passo à passo
     */
    let resultado = $('#btn-verify-step'); 
    resultado.addClass('active');

    $('#btn-verify-step').click(() => {
        
        if(!resultado.hasClass('disabled')){
            exibeDados(analisePassoaPasso($('#input-sentence').val()));
            $("html, body").animate({
                
                scrollTop: $(document).height()
            }, 1000);
        }
    });

    $('#btn-generate').click( () => {
        $('#btn-clean').click();
        var sentence = geraSentenca();
        $('#input-sentence').val(sentence);
    });
    resultado.removeClass('disabled');
    resultado.addClass('active');
});

function tog(v){

    return v ? 'addClass' : 'removeClass';
} 

$(document).on('input', '.clearable', () => {
    $(this)[tog(this.value)]('x');
}).on('mousemove', '.x',  e => {
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
}).on('touchstart click', '.onX', ev => {
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
});
