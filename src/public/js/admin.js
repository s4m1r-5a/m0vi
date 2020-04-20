/////////////////////////////////////////* ADMINISTRACIÓN *//////////////////////////////////////////////

//const moment = require("moment");

////////////////* Carga de Peliculas */////////////////////
if (window.location.pathname == `/admin/produccion`) {
    //Buscador
    $(document).ready(function () {
        var playerP = new Playerjs({ id: "playerProduction", player: 2 });
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

        $('form').submit(function (e) {
            e.preventDefault();
            alert('kjdkldjl')
            var fd = $('form').serialize();
            $.ajax({
                type: 'POST',
                url: '/admin/produccion',
                data: fd,
                //async: false,
                success: function (data) {
                    console.log(data)
                }
            })
        })
    });
}