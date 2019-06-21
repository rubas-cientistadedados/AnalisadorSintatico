$(document).ready(function () {

    /**
     * Limpa os dados do analisador caso a sentença mude
     */
    $('#input-sentence').on('keyup', function() {
        cleanGlobals();
        updateView();
        
        resultado.removeClass('disabled');
        resultado.addClass('active');
    });

    /**
     * Limpa os dados do analisador e da view
     */
    $('#btn-clean').click(function() {
        $('#input-sentence').val('').focus();
        $('html, body').css('transition-delay', '0s, 5s');
        cleanGlobals();
        updateView();

        resultado.removeClass('disabled');
        resultado.addClass('active');        
    });

    /**
     * Análisa a sentença na entrada em um passo
     */

    $('#btn-verify-sentence').click(function() {
        var analisis = oneStepAnalisis($('#input-sentence').val());
        updateView(analisis);
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
            var analisis = stepByStepAnalisis($('#input-sentence').val());
            updateView(analisis);
            $("html, body").animate({
                scrollTop: $(document).height()
            }, 1000);
        }
    });

    $('#btn-generate').click(function() {
        $('#btn-clean').click();
        var sentence = randomSentence();
        $('#input-sentence').val(sentence);
    });
    resultado.removeClass('disabled');
    resultado.addClass('active');
});

function tog(v){

    return v ? 'addClass' : 'removeClass';
} 

$(document).on('input', '.clearable', function(){
    $(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function( e ){
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
}).on('touchstart click', '.onX', function( ev ){
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
});
