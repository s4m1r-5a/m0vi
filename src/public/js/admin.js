/////////////////////////////////////////* ADMINISTRACIÓN *//////////////////////////////////////////////

//const moment = require("moment");

////////////////* Carga de Peliculas */////////////////////
function SMSj2(tipo, titulo, mensaje) {
    var message = mensaje;
    var title = titulo;
    var type = tipo;
    toastr[type](message, title, {
        closeButton: true,
        rtl: $("body").attr("dir") === "rtl" || $("html").attr("dir") === "rtl",
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: 0,
        extendedTimeOut: 0,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: false
    });
};
if (window.location.pathname == `/admin/produccion`) {
    //Buscador
    $(document).ready(function () {
        $('#hora').val(moment().format('YYYY-MM-DD hh:mm A'))
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
        /*function completeHandler(event) {
            _("status").innerHTML = event.target.responseText;
            _("progressBar").value = 0;
        }
        function errorHandler(event) {
            _("status").innerHTML = "Upload Failed";
        }
        function abortHandler(event) {
            _("status").innerHTML = "Upload Aborted";
        }*/
    });
}
if (window.location.pathname == `/admin/master`) {
    let p = '', fecha = new Date(), fechs = new Date();
    fecha.setDate(fecha.getDate() + 30)
    function RecogerDatos() {
        dts = {
            id_venta: $('#idsms').val(),
            correo: $('#correo').val(),
            clave: $('#contraseña').val(),
            clien: $('#cliente').val(),
            smss: $('#smsdescripcion').text(),
            movil: $("#cels").val(),
            fechadeactivacion: $("#fechadeactivacion").val() ? '' : moment(fechs).format('YYYY-MM-DD'),
            fechadevencimiento: $("#fechadevencimiento").val() ? '' : moment(fecha).format('YYYY-MM-DD')
        };
    };
    minDateFilter = "";
    maxDateFilter = "";
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            if (typeof aData._date == 'undefined') {
                aData._date = new Date(aData[2]).getTime();
            }
            if (minDateFilter && !isNaN(minDateFilter)) {
                if (aData._date < minDateFilter) {
                    return false;
                }
            }
            if (maxDateFilter && !isNaN(maxDateFilter)) {
                if (aData._date > maxDateFilter) {
                    return false;
                }
            }
            return true;
        }
    );
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var min = parseInt($('#min').val(), 10);
            var max = parseInt($('#max').val(), 10);
            var age = parseFloat(data[1]) || 0; // use data for the age column

            if ((isNaN(min) && isNaN(max)) ||
                (isNaN(min) && age <= max) ||
                (min <= age && isNaN(max)) ||
                (min <= age && age <= max)) {
                return true;
            }
            return false;
        }
    );
    $(document).ready(function () {
        $('#min, #max').keyup(function () {
            table4.draw();
        });
        $('#peli').click(function () {
            tablePelis.draw();
        })

    });
    /*$('#datatable2').on('click', '.te', function () {
        if ($('#usuarioadmin').val() == 1) {
            var fila = $(this).parents('tr');
            if ($(fila).hasClass('selected')) {
                $(fila).removeClass('selected');
            } else {
                $('#datatable2').DataTable().$('tr.selected').removeClass('selected');
                $(fila).addClass('selected');
            }
            var data = $('#datatable2').DataTable().row(fila).data();
            $("#idsms").val(data.id);
            $("#car").attr("src", data.imagenes);
            $("#cliente").val(data.cliente);
            $("#nombrec").val(data.nombre);
            $("#correo").val(data.correo);
            $("#cels").val(data.movildecompra);
            $("#plan").val(data.producto);
            $("#contraseña").val(data.descripcion ? data.descripcion.slice(3) : '');
            $("#fechadeactivacion").val(data.fechadeactivacion);
            $("#fechadevencimiento").val(data.fechadevencimiento);
            $('#ModalOrden').modal('toggle');
        }
    });
    $('#datatable2').on('click', '.restablecer', function () {
        if ($('#usuarioadmin').val() == 1) {
            $('#ModalEventos').modal({
                toggle: true,
                backdrop: 'static',
                keyboard: true,
            });
            var fila = $(this).parents('tr');
            var data = $('#datatable2').DataTable().row(fila).data();
            $.ajax({
                type: 'POST',
                url: '/links/proveedores',
                data: {
                    evento: 'Restablecer contraseña',
                    idv: data.id,
                    idp: data.proveedor,
                    correo: data.correo,
                    clave: data.descripcion ? data.descripcion.slice(3) : '',
                    nombre: data.nombre,
                    plan: data.producto,
                    hora: fechs.getHours() + ":" + fechs.getMinutes() + ":" + fechs.getSeconds() + "." + fechs.getMilliseconds()
                },
                async: true,
                success: function (data) {
                    $('#ModalEventos').one('shown.bs.modal', function () {
                        $('#ModalEventos').modal('hide')
                    }).modal('show');
                    if (data.estado && data.min) {
                        tableOrden.ajax.reload(function (json) {
                            SMSj('success', 'Solicitud de restablecimiento de contraseña enviado exitosamente')
                        });
                    } else if (data.estado) {
                        SMSj('error', ' Ya envio una solicitud antes, la cual esta en estado de restauracion debe esperar 5 minutos minimos para realizar nuevamente esta solicitud');
                    } else {
                        SMSj('error', 'Solicitud no enviada, aun no se le envian los datos a este cliente para que pueda hacer soilcitud de restablecimiento de contyraseña...');
                    }
                }
            })
        } else {
            SMSj('info', 'Aun no se encuentra disponible este boton')
        }
    });*/
    $('#table-pelis').on('click', 'tbody td:not(:first-child)', function (e) {
        editor.inline(this, {
            buttons: { label: '&gt;', fn: function () { this.submit(); } }
        });
    });
    //////////////////////* table-pelis *///////////////////////     
    var tablePelis = $('#table-pelis').DataTable({
        dom: 'Bfrtip',
        iDisplayLength: 10,
        stateSave: true,
        stateDuration: -1,
        buttons: [//'pageLength',
            {
                text: `<div class="mb-0">
                    <i class="align-middle mr-2" data-feather="calendar"></i> <span class="align-middle">Fecha</span>
               </div>`,
                attr: {
                    title: 'Fecha',
                    id: 'Date'
                },
                className: 'btn btn-secondary fech',
            }
        ],
        autoWidth: false,
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: false,
        },
        responsive: {
            details: {
                type: 'column'
            }
            /*details: {
                display: $.fn.dataTable.Responsive.display.childRowImmediate,
                type: 'none',
                target: ''
            }*/
        },
        initComplete: function (settings, json) {
            //tableOrden.column(2).visible(true);
        },
        columnDefs: [
            /*{
                "targets": [6],
                "visible": false,
                "searchable": false
            },*/
            { responsivePriority: 1, targets: -1 },
            { responsivePriority: 2, targets: 0 },
            { responsivePriority: 3, targets: 2 },
            { responsivePriority: 4, targets: -2 },
            { responsivePriority: 10001, targets: -3 }
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        order: [[1, "desc"]],
        language: {
            "lengthMenu": "Ver",
            "sProcessing": "Procesando...",
            "sLengthMenu": "Ver",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Pri",
                "sLast": "Últ",
                "sNext": "Sig",
                "sPrevious": "Ant"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            method: "POST",
            url: "/admin/master/pelis",
            dataSrc: "data"
        },
        columns: [
            /*{
                className: 'control',
                orderable: true,
                data: null,
                defaultContent: ''
            },*/
            {
                data: "imagenes",
                className: 'foto',
                render: function (data, method, row) {
                    return `<img src="${data.split(" - ")[1]}"
                            width="60" height="60" class="rounded-circle" alt="Ashley Briggs">`
                }
            },
            { data: "id" },
            {
                data: "titulodos",
                className: 'te'
            },
            {
                data: "slogan",
                className: 'te'
            },
            {
                data: "fecha",
                className: 'te',
                render: function (data, method, row) {
                    return `<small class="float-right text-navy">${moment(data).format('l')}</small>`
                }
            },
            {
                data: "sesiones",
                className: 'te'
            },
            {
                data: "sinopsis",
                className: 'te'
            },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 7:
                            return `<span class="badge badge-pill badge-success">Disp</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-danger">Pendt</span>`
                            break;
                        case 1:
                            return `<span class="badge badge-pill badge-info">Procd</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-warning">Dclind</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">info</span>`
                    }
                }
            },
            {
                className: 'restablecer',
                orderable: false,
                data: null,
                defaultContent: `<div class="dropdown">
                <button type="button" class="btn btn-sm btn-outline-danger dropdown-toggle" data-toggle="dropdown">Acción</button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">Disponible</a>
                        <a class="dropdown-item" href="#">Ocultar</a>
                        <a class="dropdown-item" href="#">Eliminar</a>
                    </div>
                </div>`
            }
        ]
    });
    //////////////////////* table-download *///////////////////////     
    var tableDownload = $('#table-download').DataTable({
        dom: 'Bfrtip',
        iDisplayLength: 10,
        stateSave: true,
        stateDuration: -1,
        buttons: [//'pageLength',
            {
                text: `<div class="mb-0">
                    <i class="align-middle mr-2" data-feather="calendar"></i> <span class="align-middle">Fecha</span>
               </div>`,
                attr: {
                    title: 'Fecha',
                    id: 'Date'
                },
                className: 'btn btn-secondary fech',
            }
        ],
        autoWidth: false,
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: false,
        },
        responsive: {
            details: {
                type: 'column'
            }
            /*details: {
                display: $.fn.dataTable.Responsive.display.childRowImmediate,
                type: 'none',
                target: ''
            }*/
        },
        initComplete: function (settings, json) {
            //tableOrden.column(2).visible(true);
        },
        columnDefs: [
            /*{
                "targets": [6],
                "visible": false,
                "searchable": false
            },*/
            { responsivePriority: 1, targets: -1 },
            { responsivePriority: 2, targets: 0 },
            { responsivePriority: 3, targets: 2 },
            { responsivePriority: 4, targets: -2 },
            { responsivePriority: 10001, targets: -3 }
        ],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        order: [[1, "desc"]],
        language: {
            "lengthMenu": "Ver",
            "sProcessing": "Procesando...",
            "sLengthMenu": "Ver",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Pri",
                "sLast": "Últ",
                "sNext": "Sig",
                "sPrevious": "Ant"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            method: "POST",
            url: "/admin/master/download",
            dataSrc: "data"
        },
        columns: [
            /*{
                className: 'control',
                orderable: true,
                data: null,
                defaultContent: ''
            },*/
            {
                data: "imagenes",
                className: 'foto',
                render: function (data, method, row) {
                    return `<img src="${data.split(" - ")[1]}"
                            width="60" height="60" class="rounded-circle" alt="Ashley Briggs">`
                }
            },
            { data: "id" },
            {
                data: "titulodos",
                className: 'te'
            },
            {
                data: "slogan",
                className: 'te'
            },
            {
                data: "fecha",
                className: 'te',
                render: function (data, method, row) {
                    return `<small class="float-right text-navy">${moment(data).format('l')}</small>`
                }
            },
            {
                data: "sesiones",
                className: 'te'
            },
            {
                data: "sinopsis",
                className: 'te'
            },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 7:
                            return `<span class="badge badge-pill badge-success">Disp</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-danger">Pendt</span>`
                            break;
                        case 1:
                            return `<span class="badge badge-pill badge-info">Procd</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-warning">Dclind</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">Aprbd</span>`
                    }
                }
            },
            {
                className: 'restablecer',
                orderable: false,
                data: null,
                defaultContent: `<div class="dropdown">
                <button type="button" class="btn btn-sm btn-outline-danger dropdown-toggle" data-toggle="dropdown">Acción</button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item trascodifica">Trascodificar</a>
                        <a class="dropdown-item">Estado</a>
                        <a class="dropdown-item">Eliminar</a>
                    </div>
                </div>`
            }
        ]
    });

    $('#dow').on('click', function () {
        $('#Descargas .row').show('slow');
        tableDownload.ajax.reload(function (json) {
            tableDownload.columns.adjust().draw();
        })
    })
    $('#table-download').on('click', '.trascodifica', function () {
        $('#ModalEventos').modal({
            toggle: true,
            backdrop: 'static',
            keyboard: true,
        });
        var fila = $(this).parents('tr');
        var data = $('#table-download').DataTable().row(fila).data();
        $.ajax({
            type: 'POST',
            url: '/admin/master/codifica',
            data: {
                ids: data.id,
                idt: data.idt,
                hora: moment().format('YYYY-MM-DD hh:mm A')
            },
            async: true,
            success: function (data) {
                $('#ModalEventos').one('shown.bs.modal', function () {
                    $('#ModalEventos').modal('hide')
                    tableDownload.draw()
                }).modal('show');
            }
        })
    });

}