Array.prototype.unique = function (a) {
    return function () { return this.filter(a) }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
});
function PlayerReady(id) {
    console.log('Listo')
}
console.log('comienso')
$(document).ready(function () {
    $.ajax({
        type: 'POST',
        url: '/links/video',
        data: { id },
        async: true,
        success: function (data) {
            if (typeof (Storage) !== 'undefined') {
                // Código cuando Storage es compatible
                //localStorage.Apellido = 'Márquez Montoya'
                let cod = localStorage.Apellido
                //localStorage.removeItem(Apellido)
                //limpiar todo el storage
                //localStorage.clear()
                if (disp.includes(cod)) {
                    f
                } else if (dsp < plan) {
                    var dato
                    switch (dsp) {
                        case 0:
                            dato = 'uno'
                            break;
                        case 1:
                            dato = 'dos'
                            break;
                        case 2:
                            dato = 'tres'
                            break;
                        case 3:
                            dato = 'cuatro'
                            break;
                        case 4:
                            dato = 'cinco'
                            break;
                        case 5:
                            dato = 'seis'
                            break;
                    }
                    $.ajax({
                        type: 'POST',
                        url: '/links/video',
                        data: { dato, dsp, id },
                        async: true,
                        success: function (data) {
                            console.log(data)
                        }
                    })
                } else {
                    alert('Hay demaciados dispositivos en esta cuenta')
                }
            } else {
                // Código cuando Storage NO es compatible
            }
        }
    })



    $('a.r').css("color", "#bfbfbf");
    $("a.r").hover(function () {
        $(this).css("color", "#ffff");
    }, function () {
        $(this).css("color", "#bfbfbf");
    });
})
if (window.location.pathname == `/`) {
    var file = new Array();
    $('.lista').map(function () {
        file.push({ "title": $(this).find('.titulo').val(), "file": $(this).find('.trailer').val(), "id": $(this).find('.ids').val() })
    })
    console.log(file)
    var scaling = 1;
    //count
    var currentSliderCount = 0;
    var videoCount = $(".row").children().length;
    var showCount = 0;
    var sliderCount = 1;
    var controlsWidth = 40;
    var scollWidth = 0;
    var win = $(window);
    var prev = $(".prev");
    var next = $(".next");
    //sizes
    var windowWidth = 0;
    var frameWidth = 0;

    $(document).ready(function () {

        $('.cerrartrailer').click(function () {
            $('#ModalPelis').modal('hide')
            $('#ModalPelis').one('hidden.bs.modal', function () {
                players.api("stop");
            })
        })
        $('.cerrarsinopsis').click(function () {
            $(this).parents('.datos').hide('slow')
        })

        var players = new Playerjs({ id: "player", ready: "PlayerReady", file });

        $(".body").on({
            mouseenter: function () {
            },
            mouseleave: function () {
                if ($(this).find('.datos').is(':visible')) {
                    setTimeout(() => {
                        $(this).find('.datos').hide('slow')
                    }, 2000);
                }

            }
        });

        init();
        $(".tile").click(function () {
            $(this).parents('.contain').next().find('.titulouno2').text($(this).find('.titulouno').val())
            $(this).parents('.contain').next().find('.titulodos2').text($(this).find('.titulodos').val())
            $(this).parents('.contain').next().find('.fh2').text($(this).find('.fecha').val())
            $(this).parents('.contain').next().find('.sesiones2').text($(this).find('.sesiones').val())
            $(this).parents('.contain').next().find('.sinopsis2').text($(this).find('.sinopsis').val())
            $(this).parents('.contain').next().find('.slogan2').text($(this).find('.slogan').val())
            $(this).parents('.contain').next().find('.id2').val($(this).find('.id').val())
            $(this).parents('.contain').next().find('.trailer3').val($(this).find('.trailer4').val())
            $(this).parents('.contain').next().show('slow')
        })

        $('.btn-trailer').click(function () {
            players.api("find", $(this).prevAll('.id2').val())
            console.log(players.api("playlist_id"));
            players.api("play")
            $('#ModalPelis').modal({
                backdrop: 'static',
                keyboard: true,
                toggle: true
            })
            $('#ModalPelis').one('hidden.bs.modal', function () {
                players.api("stop");
            })
        })

        $('.btn-play').click(function () {
            location.href = `/links/video?video=${$(this).prevAll('.id2').val()}`
        })

    });
    $(window).resize(function () {
        init();
    });

    function init() {
        windowWidth = win.width();
        frameWidth = win.width() - 80;
    }

    next.on("click", function () {
        var padre = $(this).parent();
        scollWidth = parseFloat(padre.children(".px").val());
        scollWidth = scollWidth - frameWidth;
        padre.children(".px").val(scollWidth)
        padre.children("div.row").velocity({
            left: scollWidth
        }, {
            duration: 700,
            easing: "swing",
            queue: "",
            loop: false, // Si la animación debe ciclarse
            delay: false, // Demora
            mobileHA: true // Acelerado por hardware, activo por defecto
        });
        padre.children("div.row").css("left", scollWidth);
        currentSliderCount--;
        padre.children(".ctn").val(currentSliderCount);
        console.log(currentSliderCount)
    });

    prev.on("click", function () {
        var padre = $(this).parent();
        scollWidth = parseFloat(padre.children(".px").val());
        scollWidth = scollWidth + frameWidth;
        padre.children(".px").val(scollWidth)
        console.log(padre.children(".ctn").val() + ' ' + (sliderCount - 1))
        if (parseFloat(padre.children(".ctn").val()) >= sliderCount - 1) {
            padre.children("div.row").css("left", 0);
            currentSliderCount = 0;
            padre.children(".ctn").val(currentSliderCount);
            //scollWidth = 0;
            padre.children(".px").val(0)
        } else {
            currentSliderCount++;
            padre.children(".ctn").val(currentSliderCount);
            padre.children('div.row').velocity({
                left: scollWidth
            }, {
                duration: 700,
                easing: "swing",
                queue: "",
                //begin: function() {
                //console.log("iniciando animación")
                //},
                //progress: function() {
                //console.log("animación en proceso")
                //},
                //complete: function() {
                // console.log("animación completada")
                //},
                loop: false, // Si la animación debe ciclarse
                delay: false, // Demora
                mobileHA: true // Acelerado por hardware, activo por defecto
            });
        }
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
if (window.location.pathname == `/links/video`) {
    var file, video = window.location.search.split("=")[1]
    $.ajax({
        type: 'POST',
        url: '/links/video',
        async: false,
        success: function (data) {
            file = data.map((z) => {
                foto = z.imagenes.split(" - ")
                return {
                    "title": `<img src='${foto[0]}' class='playlist_poster'><div class='playlist_duration'>00:48</div>${z.titulodos}`,
                    "file": window.location.origin + '/' + z.ruta, "id": z.id
                }
            })
        }
    })
    $(document).ready(function () {
        $('footer').hide()
        $('nav').hide()
        var players = new Playerjs({ id: "player", ready: "PlayerReady", file, player: 2 });
        players.api("find", video)
        console.log(players.api("playlist_id"));
        players.api("play")
    })
}
