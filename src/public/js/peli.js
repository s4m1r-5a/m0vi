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









    $(document).ready(function () {
        $("#cuerpo .item").on('click', 'a', function () {
            $('#reserva').val($(this).text());
            $.ajax({
                type: 'GET',
                url: '/admin/busqueda?string=' + $(this).text(),
                async: false,
                success: function (data) {
                    if (data) {
                        $('#busqueda').show('slow');
                        $('#carteleras').html('');
                        data.results.map((a) => {
                            if (a.poster_path !== null) {
                                $('#carteleras').append(`
                    <div class="col-sm-4">
                        <div class="card border-primary mb-3" style="max-width: 540px;">
                            <div class="row no-gutters">
                                <div class="col-md-4">
                                    <img id="qrImg"
                                        src="https://image.tmdb.org/t/p/w600_and_h900_bestv2${a.poster_path}"
                                        class="card-img" alt="...">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title">${a.original_title}</h5>
                                        <div class="">
                                            <input type="hidden" value="${a.id}">
                                            <small class="text-primary">${a.title} </small><br>
                                            <small>${moment(a.release_date).format('LL')} </small><br>
                                            <small class="text-primary">Popularity ${a.popularity}</small><br>
                                            <small class="text-primary">Vote count ${a.vote_count}</small><br>
                                            <small class="text-primary">Vote average ${a.vote_average}</small><br>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`);
                                $("#carteleras .row").on({
                                    /*mousedown: function () {
                                        
                                    }, mouseup: function () {

                                    },*/ mouseenter: function () {
                                        $(this).css("cursor", "pointer");
                                        $(this).css("background-color", "#FFFFCC");
                                    }, mouseleave: function () {
                                        $(this).css("cursor", "hand");
                                        $(this).css("background-color", "transparent");
                                    }
                                });
                            }
                        });
                    } else {
                        $('#busqueda').hide('slow');
                        SMSj('error', 'no se encontraron resultados con este titulo');
                    }
                }
            })
        });
        $('#reserva').keyup(function (e) {
            if (e.which == 13) {
                $('.pelicula').hide('slow');
                var buscar = $(this).val();
                $.ajax({
                    type: 'GET',
                    url: '/admin/busqueda?string=' + buscar,
                    async: false,
                    success: function (data) {
                        $('.item').html('');
                        data.results.map((a) => {
                            $('.item').append(`<a class="nombr dropdown-item" id="${a.id}">${a.title}</a>`);
                        });
                        $('.item').show("slow");
                    }
                })
            }
        });
        //$('#reserva').val($(this).text());

        $("#carteleras").on('click', 'div.row', function () {
            id = $(this).find('input').val();
            $.ajax({
                type: 'GET',
                url: '/admin/busqueda?id=' + id,
                async: true,
                success: function (data) {
                    data.video ? playerP.api("play", data.video) : '';
                    $('.generos').html('')
                    $('#busqueda').hide('slow');
                    $('.pelicula').show('slow');
                    $('#idpelicula').val(data.id)
                    $('.titulo').val(data.original_title)
                    $('.sitio').attr('href', data.homepage ? data.homepage : "")
                    $('.sitio small').text(data.homepage ? data.homepage : "")
                    $('.titulo2').val(data.title)
                    $('#sinopsis').val(data.overview)
                    $('.fh').text(moment(data.release_date).format('LL'))
                    $('.fh').val(data.release_date)
                    $('.First').attr('src', `https://image.tmdb.org/t/p/w533_and_h300_bestv2${data.backdrop_path || data.poster_path}`)
                    $('input.First').val(`https://image.tmdb.org/t/p/w533_and_h300_bestv2${data.backdrop_path || data.poster_path}`)
                    $('.Second').attr('src', `https://image.tmdb.org/t/p/w533_and_h300_bestv2${data.poster_path || data.backdrop_path}`)
                    $('.img1').attr('src', `https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.backdrop_path || data.poster_path}`)
                    $('input.img1').val(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.poster_path || data.backdrop_path}`)
                    $('.img2').attr('src', `https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.poster_path || data.backdrop_path}`)
                    $('.no-gutters img').attr('src', `https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.poster_path || data.backdrop_path}`)
                    $('.slogan').val(data.tagline)
                    data.genres.map((a) => {
                        $('.generos').append(`
                            <input type="hidden" value="${a.name}" name="genero">
                            <small class="text-muted">${a.name}.</small>`);
                    });
                    $.ajax({
                        type: 'GET',
                        url: '/admin/busqueda?data=' + data.id,
                        async: true,
                        success: function (data) {
                            $('.elenco div.row').after('')
                            data.cast.map((a) => {
                                if (a.profile_path) {
                                    //$('.elenco div.row').after() despues del elemento seleccionado
                                    $('.elenco div.row').append(`
                                        <img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2${a.profile_path}" width="5%" height="30" class="rounded-circle mr-1 mb-2" alt="${a.name}"
                                            data-toggle="tooltip" data-placement="top" data-container="body" title="${a.name} - ${a.character}">`
                                    );
                                }
                            });
                        }
                    })
                }
            })
        })

        $('.trailer').change(function () {
            playerP.api("play", $(this).val());
        })

        $('form').on('submit', function (e) {
            e.preventDefault();
            var a = $('input[name="id"]').val();
            SMSj2('success', $('.titulo2').val(),
                `<div class="form-group">
                    <progress id="progressBar${a}" value="0" max="100" style="width: 100%;"></progress>
                    <small id="status${a}"></small><br>
                    <small id="loaded_n_total${a}"></small><br>
                    <small id="loaded_n${a}"></small>
                </div>`)
            var ajax = new XMLHttpRequest();
            ajax.upload.addEventListener("progress", (event) => {
                _(`loaded_n_total${a}`).innerHTML = "Cargando " + event.loaded + " bytes";
                _(`loaded_n${a}`).innerHTML = "Total bytes" + event.total;
                var percent = (event.loaded / event.total) * 100;
                _(`progressBar${a}`).value = Math.round(percent);
                _(`status${a}`).innerHTML = Math.round(percent) + "% arriba... por favor espere";
            }, false);
            ajax.addEventListener("load", (event) => {
                _(`status${a}`).innerHTML = event.target.responseText;
                _(`progressBar${a}`).value = 0;
            }, false);
            ajax.addEventListener("error", (event) => {
                _(`status${a}`).innerHTML = "Carga Fallida";
            }, false);
            ajax.addEventListener("abort", (event) => {
                _(`status${a}`).innerHTML = "Carga Abortada";
            }, false);
            ajax.open("POST", "/admin/produccion");
            ajax.send(new FormData(this));
            /*$.ajax({
                type: 'POST',
                url: '/admin/produccion',
                contentType: false,
                data: new FormData(this),
                processData: false,
                cache: false,
                //async: false,
                success: function (data) {
                    console.log(data)
                }
            })*/
        })

        function _(el) {
            return document.getElementById(el);
        }
    })
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
