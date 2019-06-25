$(document).ready( () => {
    
    $('#sentenca').on('keyup', () => {
        reinicia();
        exibeDados();
        
        resultado.removeClass('disabled');
        resultado.addClass('active');
    });

  $('#reinicia').click( () => {
        $('#sentenca').val('').focus();
        $('html, body').css('transition-delay', '0s, 5s');
        reinicia();
        exibeDados();

        resultado.removeClass('disabled');
        resultado.addClass('active');        
    });

    $('#verifica').click(() => {

        exibeDados(analiseDireta($('#sentenca').val()));
        $("html, body").animate({

            scrollTop: $(document).height()
        }, 7000);

        resultado.removeClass('active');
        resultado.addClass('disabled');
    });

    let resultado = $('#passoapasso'); 
    resultado.addClass('active');

    $('#passoapasso').click(() => {
        
        if(!resultado.hasClass('disabled')){
            exibeDados(analisePassoaPasso($('#sentenca').val()));
            $("html, body").animate({
                
                scrollTop: $(document).height()
            }, 1000);
        }
    });

    $('#gera').click( () => {
        $('#reinicia').click();
        var sentence = geraSentenca();
        $('#sentenca').val(sentence);
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
