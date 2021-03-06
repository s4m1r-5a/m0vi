/////////////////////* FUNCIONES GLOBALES *///////////////////////
function Moneda(valor) {
    valor = valor.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    valor = valor.split('').reverse().join('').replace(/^[\.]/, '');
    return valor;
}
//lenguaje
let languag = {
    "lengthMenu": "Ver",
    "sProcessing": "Procesando...",
    "sLengthMenu": "",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible",
    "sInfo": "",
    "sInfoEmpty": "",
    "sInfoFiltered": "",
    "sInfoPostFix": "",
    "sSearch": "",
    "sUrl": "",
    "sInfoThousands": ",",
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
};
/*let languag = {
    "lengthMenu": "Ver 10 filas",
    "sProcessing": "Procesando...",
    "sLengthMenu": "Ver _MENU_ filas",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible",
    "sInfo": "Mostrando del _START_ al _END_ | Total _TOTAL_ registros",
    "sInfoEmpty": "Reg. del 0 al 0 | Total 0 registros",
    "sInfoFiltered": "(filtro de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar : ",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};*/
//mensajes
function SMSj(tipo, mensaje) {
    var message = mensaje;
    var title = "RedFlix";
    var type = tipo;
    toastr[type](message, title, {
        positionClass: "toast-top-right",
        closeButton: true,
        progressBar: true,
        newestOnTop: true,
        rtl: $("body").attr("dir") === "rtl" || $("html").attr("dir") === "rtl",
        timeOut: 7500
    });
};
$(document).ready(function () {
    moment.locale('es');
    $('#disable').on('click', function () {
        SMSj('error', 'Aun no se encuentra habilitada esta opcion, trabajamos en ello. RedFlix...')
    })
    var saldoact = $('#saldoactual').text()
    $('#saldoactual').html(Moneda(saldoact))
    $('a.r').css("color", "#bfbfbf");
    $("a.r").hover(function () {
        $(this).next('div.reditarh').show();
        $(this).css("color", "#000000");
    }, function () {
        $('.reditarh').hide("slow");
        $(this).css("color", "#bfbfbf");
    });
    $(".edi").on({
        focus: function () {
            $(this).css("background-color", "#FFFFCC");
            $(this).next('div.reditarh').show("slow");
            this.select();
        },
        blur: function () {
            $(this).css({
                "background-color": "transparent"
            });
            $('.reditarh').hide("slow");
            $('.item').hide("slow");
        },
        change: function () {
            //$(this).val($(this).val().toLowerCase().trim().split(' ').map(v => v[0].toUpperCase() + v.substr(1)).join(' '))
        }
    });

});
//Leva a mayúsculas la primera letra de cada palabra
function titleCase(texto) {
    const re = /(^|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ])(?:([a-záéíóúüñ])|([A-ZÁÉÍÓÚÜÑ]))|([A-ZÁÉÍÓÚÜÑ]+)/gu;
    return texto.replace(re,
        (m, caracterPrevio, minuscInicial, mayuscInicial, mayuscIntermedias) => {
            const locale = ['es', 'gl', 'ca', 'pt', 'en'];
            //Son letras mayúsculas en el medio de la palabra
            // => llevar a minúsculas.
            if (mayuscIntermedias)
                return mayuscIntermedias.toLocaleLowerCase(locale);
            //Es la letra inicial de la palabra
            // => dejar el caracter previo como está.
            // => si la primera letra es minúscula, capitalizar
            //    sino, dejar como está.
            return caracterPrevio +
                (minuscInicial ? minuscInicial.toLocaleUpperCase(locale) : mayuscInicial);
        }
    );
}




//////////////////////////////////////////////////////////////////
var $validationForm = $("#smartwizard-arrows-primary");
$validationForm.smartWizard({
    theme: "arrows",
    showStepURLhash: false,
    lang: {// Variables del lenguaje
        next: 'Siguiente',
        previous: 'Atras'
    },
    toolbarSettings: {
        toolbarPosition: 'bottom', // none, top, bottom, both
        toolbarButtonPosition: 'right', // left, right
        showNextButton: true, // show/hide a Next button
        showPreviousButton: false // show/hide a Previous button
        //toolbarExtraButtons: [$("<button class=\"btn btn-submit btn-primary\" type=\"button\">Finish</button>")]
    },
    autoAdjustHeight: false,
    backButtonSupport: false,
    useURLhash: false
}).on("leaveStep", () => {
    var fd = $('form').serialize();
    let skdt;
    $.ajax({
        url: '/links/id',
        data: fd,
        type: 'POST',
        async: false,
        success: function (data) {
            //alert(data)
            if (data != 'Pin de registro invalido, comuniquese con su distribuidor!') {
                $('.h').attr("disabled", false);
                skdt = true;
            } else if ($('#ipin').val() != "") {
                $(".alert").show();
                $('.alert-message').html('<strong>Error!</strong> ' + data);
                setTimeout(function () {
                    $(".alert").fadeOut(3000);
                }, 2000);
                skdt = false;
            }
        }
    });
    return skdt;
});
function init_events(ele) {
    ele.each(function () {
        // crear un objeto de evento (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // no necesita tener un comienzo o un final
        var eventObject = {
            title: $.trim($(this).text()) // Usa el texto del elemento como título del evento.
        }
        // almacenar el objeto de evento en el elemento DOM para que podamos acceder a él más tarde
        $(this).data('eventObject', eventObject)
        // haz que el evento se pueda arrastrar usando jQuery UI
        $(this).draggable({
            zIndex: 1070,
            revert: true, // hará que el evento vuelva a su
            revertDuration: 0 //  Posición original después del arrastre
        })
    })
};

$('.pagarpayu').attr("disabled", true);
$('.ntfx').attr("disabled", true);
$('input[name="nombre"]').attr("disabled", true);

/*$('.pagar').change(function () {
    card = $(this).parents('div.card').attr("id")
    var fd = $(`#${card} form`).serialize();
    actualizardatos(card, fd)
});*/

function actualizardatos(card, fd, ot) {
    $.ajax({
        url: '/links/cliente',
        data: fd,
        type: 'POST',
        async: false,
        success: function (data) {
            if (data[0] !== 'smg') {
                $(`#${card} .pagarpayu`).attr("disabled", false);
                if (ot) {
                    $(`.pagarpayu`).attr("disabled", false);
                    $(`input[name="telephone"]`).val(data[2][0].id);
                    $(`input[name="buyerFullName"]`).val(data[2][0].name);
                    $(`input[name="buyerEmail"]`).val(data[2][0].email);
                }
                $('input[name="signature"]').val(data[0]);
                $('input[name="referenceCode"]').val(data[1]);
                $(`#${card} form`).submit();
                $('#ModalEventos').one('shown.bs.modal', function () {
                    $('#ModalEventos').modal('hide')
                }).modal('show');
            } else {
                $('#actualizardatos').html(`${data[1]}Si desea realizar alguna modificacion a tu cuenta presione editar, en caso contrario verifique bien los datos ingresados e intentelo nuevamente, para mayor informacion puede contactarnos al 3012673944 Wtspp`)
                //$('#actualizar').modal('toggle');
                $('#ModalEventos').one('shown.bs.modal', function () {
                    $('#ModalEventos').modal('hide')
                }).modal('show');
                $('#ModalEventos').one('hidden.bs.modal', function () {
                    $('#actualizar').modal('show');
                }).modal('hide');
                let cont = 0;
                let dat = data[2].map((r) => {
                    cont++
                    return `<li class="mb-4">
                            <input type="text" name="telephone" class="form-control pagar g${cont}" placeholder="Movil"
                            style="text-align:center" value="${r.id}">
                        </li>
                        <li class="mb-4">
							<input type="hidden" name="actualizar" class="g${cont}" value="${r.id}">
						</li>
                        <li class="mb-4">
                            <input type="text" name="buyerFullName" class="form-control pagar g${cont}"
                            placeholder="Nombre completo" style="text-align:center;" value="${r.name}">
                        </li>
                        <li class="mb-4">
                            <input type="email" name="buyerEmail" class="form-control pagar g${cont}" placeholder="Email"
                            style="text-align:center;" value="${r.email}">
                        </li>
                        <li class="mb-4">
                            <hr width=400>
                        </li>`
                });
                $('#datosactualiza').html(dat);
            }
        }
    });
}
$('.pagarp').click(function () {
    card = $(this).parents('div.card').attr("id")
    if ($(`#${card} input[name="telephone"]`).val() != "" && $(`#${card} input[name="buyerFullName"]`).val() != "" && $(`#${card} input[name="buyerEmail"]`).val() != "") {
        $('#ModalEventos').modal({
            backdrop: 'static',
            keyboard: true,
            toggle: true
        });
        var fd = $(`#${card} form`).serialize();
        actualizardatos(card, fd)
    } else {
        alert('Debes completar todos los campos');
    }
});

$(".pagar").keydown(function () {
    $(`.pagarpayu`).attr("disabled", true);
});
$('#meterdat').on('click', function () {
    card = $(this).parents('div.card').attr("id")
    var fd = $(`#${card} form`).serialize(), ot = 'ot';
    actualizardatos(card, fd, ot)
});
$('#eliminard').on('click', function () {
    $(".g2").remove('input');
    $(".g1").remove('input');
});
$('#datosactualiza').on('change', '.g1', function () {
    $(".g2").remove('input');
});
$('#datosactualiza').on('change', '.g2', function () {
    $(".g1").remove('input');
});
if ($('#iuxemail').html() == '' && $('#iuxemail').is(':visible')) {
    window.location.href = "https://iux.com.co/app/login";
};
if ($('#msg').html() == 'aprobada') {
    history.pushState(null, "", "planes?iux=ir");
};
$('#iriux').click(function () {
    window.location.href = "https://iux.com.co/app/login";
});
if ($('#pin').is(':visible') || $('.ver').is(':visible')) {
    $('.h').attr("disabled", true);
} else {
    $("nav.navbar").show();
};
$('#quien').change(function () {
    if ($(this).val() === 'Patrocinador') {
        var fd = { quien: $('#quien').val() };
        $.ajax({
            url: '/links/patro',
            data: fd,
            type: 'POST',
            success: function (data) {
                if (!data[0].usuario) {
                    SMSj('error', 'Esta cuenta es Administrativa y no puede recargarse asimisma, ponte en contacto con el encargado del sistema')
                } else {
                    $('#id').val(data[0].id);
                    $('input[name="id"]').val(data[0].usuario);
                }
            }
        });
    } else {
        $('#id').val('');
        $('#id').focus();
    }
});










$('#ventaiux').click(function () {
    var fd = $('#formulario').serialize();
    //alert($('input[name="movil"]').val());
    $.ajax({
        url: 'https://iux.com.co/x/venta.php',
        data: fd,
        type: 'POST',
        success: function (data) {
            alert(data);
        }
    });
});
$('#canjear').click(function () {
    var fd = { pin: $('#pin').val() };
    $.ajax({
        url: '/links/canjear',
        data: fd,
        type: 'POST',
        success: function (data) {
            if (data !== 'Pin invalido!' && data !== 'Este pin ya fue canjeado!') {
                $('#precio').html('$' + data[0].precio);
                $('#tiempo').html(data[0].dias + ' Dias');
                $('input[name="pin"]').val(data[0].pin);
                $('.z').show("slow");
                $('.y').hide("slow");
            } else {
                alert(data)
            }
        }
    });
});
$('#ediact').click(function () {
    $('.p').hide("slow");
    $('.q').show("slow");
});
$('.plancito').click(function () {
    card = $(this).parents('div.card').attr("id")
    let clase = $(this).attr('href');
    $(`#${card} ${clase}`).show("slow");
    $(`#${card} .z`).hide("slow");
});
$('.payu').click(function () {
    card = $(this).parents('div.card').attr("id")
    let clase = $(this).attr('name');
    $(`#${card} ${clase}`).show("slow");
});
$('.plancit').click(function () {
    let clase = $(this).attr('href');
    $(clase).hide("slow");
    $('.x').hide("slow");
    $('.z').show("slow");
});
//////////////////////////* VENTAS */////////////////////////////////////////
/* Ventas Contenido Digital */
/*var formu
$('form').click(function () {
    formu = $(this).attr('id')
})*/
$(`.movil`).change(function () {
    $('#Modalventa input[name="nombre"]').val("");
    $('#Modalventainput[name="user"]').val("");
    if ($(`#Modalventa .nom`).is(':visible')) {
        var fd = { movil: $(this).cleanVal() };
        $.ajax({
            url: '/links/movil',
            data: fd,
            type: 'POST',
            success: function (data) {
                $(`#Modalventa input[name="nombre"]`).val(data[0].nombre);
                $(`#Modalventa .user`).val(data[0].id);
                $(`#Modalventa .contacto`).val(data[0].email3);
            }
        });
        $(`#Modalventa input[name="nombre"]`).attr("disabled", true);
        //$(`form .ntfx`).attr("disabled", true);
        $(`#Modalventa input[name="nombre"]`).attr("disabled", false);
        //$(`#Modalventa .ntfx`).attr("disabled", false);
    }
});
$('#modaldventa').submit(function () {
    /*$('#ModalEventos').one('hidden.bs.modal', function () {
                $('#actualizar').modal('show');
    }).modal('hide');*/
    $('#Modalventa').modal('hide');
    $('#ModalEventos').modal({
        toggle: true,
        backdrop: 'static',
        keyboard: true,
    });
})
////////////////* transferencias a venezuela */////////////////////////
$(document).ready(function () {
    var docu = 0
    $('#cambio').attr("disabled", true);
    $('#banco').attr("disabled", true);
    $(".media-body").on("click", ".btn", function () {
        var fehc = new Date()
        var papa = $(this).attr('id')
        var product = $(`.${papa} .product`).val();
        var prod = $(`.${papa} .prod`).val();
        var nompro = $(`.${papa} .nompro`).val();
        var fechadecompra = moment(fehc).format('YYYY-MM-DD HH:mm');
        var img = $(`.${papa} .img`).attr('src');
        prod === 'IUX' ? $(`#Modalventa .nom`).hide() : 0;
        $("#Modalventa .product").val(product);
        $("#Modalventa .prod").val(prod);
        $("#Modalventa .nompro").val(nompro);
        $("#Modalventa .fechadecompra").val(fechadecompra);
        $("#Modalventa .img").attr('src', img);
        $('#Modalventa').modal({
            backdrop: 'static',
            keyboard: true,
            toggle: true
        });
    })
    $('#Modalventa').one('hidden.bs.modal', function () {
        $("#Modalventa input").val('');
    })

    $('#monto').change(function () {
        let re = Math.round($(this).cleanVal() / ($('#tasa').text() / 10));
        let utilidad = Math.round($(this).cleanVal() * 0.06);
        let neta = Math.round($(this).cleanVal() * 0.08);
        $('#cambio').val(Moneda(re));
        $('#utild1').val(utilidad);
        $('#utild2').val(neta);
    });
    $(`#docuremi`).change(function () {
        var fd = { cedula: $(this).val() };
        $.ajax({
            url: '/links/cedulav',
            data: fd,
            type: 'POST',
            success: function (data) {
                var dta = '', dto = '';
                $("input").not("#docuremi, #monto, #cambio, #tasa, #utild1, #utild2").val('');
                $('#nomdest').val('').trigger('change');
                if (Array.isArray(data)) {
                    $(`.nombrev`).val(data[0][0].nombre);
                    $('#movilremit').val(data[0][0].movil).mask('000-000-0000', { reverse: true });
                    $('#remitente').val(data[0][0].id)
                    data[1].map((r) => {
                        dta += `<option value="${r.destinatario}">${r.nombre}</option>`;
                        dto += `<input type="hidden" id="d${r.destinatario}" value="${r.documento}">
                                <input type="hidden" id="m${r.destinatario}" value="${r.movil}">`;
                    });
                    $('#nomdest').html(dta).trigger('change');
                    $('#datosocultos').html(dto);
                    var t = $('#nomdest').val();
                    var h = $('#d' + t).val();
                    var p = parseFloat($('#m' + t).val());
                    $('#docudest').val(h);
                    $('#movildest').val(p).mask('000-000-0000', { reverse: true });
                } else if (data.primer_nombre === undefined) {
                    alert('Persona no encontrada, digite su nombre manualmente...');
                    $(`.nombrev`).attr('disabled', false);
                    $(`.nombrev`).focus();
                } else {
                    $(`.nombrev`).attr('disabled', true);
                    $(`.nombrev`).val(data.primer_nombre + ' ' + data.segundo_nombre + ' ' + data.primer_apellido + ' ' + data.segundo_apellido);
                }
            }
        });
    });
    $(`#docudest`).change(function () {
        var fd = { cedula: $(this).val(), o: 1 };
        $.ajax({
            url: '/links/cedulav?o=1',
            data: fd,
            type: 'POST',
            success: function (data) {
                var dta = '';
                $(`#movildest`).val('');
                if (Array.isArray(data)) {
                    docu = 1
                    dta = `<option value="${data[1][0].destinatario}">${data[1][0].nombre}</option>`;
                    $('#nomdest').html(dta).trigger('change');
                    $('#movildest').val(data[1][0].movil).mask('000-000-0000', { reverse: true });
                    console.log(data)
                } else if (data.primer_nombre === undefined) {
                    alert('Persona no encontrada, digite su nombre manualmente...');
                    $(`#nomdest`).focus();
                } else {
                    var u = data.primer_nombre + ' ' + data.segundo_nombre + ' ' + data.primer_apellido + ' ' + data.segundo_apellido;
                    dta = `<option value="${u}">${u}</option>`;
                    $("input").filter("#banco, #cuenta").val('');
                    $('#nomdest').html(dta).trigger('change');
                }
            }
        });
    });
    $('#cuenta').on('change', function () {
        Banco($(this).val());
    })

    function Banco(dato) {
        d = { bank: dato.slice(0, 4) };
        $.ajax({
            url: '/links/cuenta',
            data: d,
            type: 'POST',
            success: function (data) {
                $('#idbanco').val(data[0].id_banco);
                $('#banco').val(data[0].banco);
                $('#tiempotranf').html(data[0].tiempodeposito);
                docu = 0;
            }
        });
    }

    $("#nomdest").on('change', function () {
        var t = $(this).val();
        if (!isNaN(t)) {
            var h = $('#d' + t).val();
            var p = parseFloat($('#m' + t).val());
            docu == 0 ? $('#docudest').val(h) : 0;
            $('#movildest').val(p).mask('000-000-0000', { reverse: true });
            var fd = { desti: t };
            $.ajax({
                url: '/links/cuenta',
                data: fd,
                type: 'POST',
                success: function (data) {
                    if (data.length <= 1) {
                        $('#cuenta').val(data[0].cuenta);
                        Banco(data[0].cuenta)
                    } else {
                        alert('hay que crear un select2')
                    }
                }
            });
        }
    })
    $(".select2").each(function () {
        $(this)
            .wrap("<div class=\"position-relative\"></div>")
            .select2({
                tags: true,
                placeholder: "Seleccione o Digite Nombre Completo",
                dropdownParent: $(this).parent()
            }).val(null);
    })
    $('#tranfer').submit(function () {
        $("input").prop('disabled', false);
    })
    //////* Evitar que se envie formulario con la tecla enter *//////
    $("input").keydown(function (e) {
        // Capturamos qué telca ha sido
        var keyCode = e.which;
        // Si la tecla es el Intro/Enter
        if (keyCode == 13) {
            // Evitamos que se ejecute eventos
            event.preventDefault();
            // Devolvemos falso
            return false;
        }
    });
});
//////////////////////////* INDEX */////////////////////////////////////////
/*if (window.location.pathname == `/`) {
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
        var player = new Playerjs({ id: "player" });
        var player2 = new Playerjs({ id: "player2" });
        var player3 = new Playerjs({ id: "player3" });
        var player4 = new Playerjs({ id: "player4" });
        var player5 = new Playerjs({ id: "player5" }); ///storage/new4tb/504562/aplay1080720.m3u8
        $(".tile").on({
            mouseenter: function () {
                play = $(this).children('.tile__media').attr("id");
                pley = play + '.api("play", "https://mdstrm.com/live-stream-playlist/57d01d6c28b263eb73b59a5a.m3u8");';
                sto = play + '.api("stop");';
                eval(pley);
            },
            mouseleave: function () {
                eval(sto);
            }
        });
        init();
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
    });

    prev.on("click", function () {
        var padre = $(this).parent();
        scollWidth = parseFloat(padre.children(".px").val());
        scollWidth = scollWidth + frameWidth;
        padre.children(".px").val(scollWidth)        
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
}*/
//////////////////////////* TABLERO *///////////////////////////////////////
if (window.location.pathname == `/tablero`) {
    new Chart(document.getElementById("chartjs-dashboard-pie"), {})
    //new Chart(document.getElementById("chartjs-line"), {})

    var canvas2 = document.getElementById("chartjs-line").getContext('2d');
    var canvas = document.getElementById("chartjs-dashboard-pie").getContext('2d');
    var reportes = new Array()
    var f = new Date();
    var m = f.getMonth() + 1;
    var fe = f.getMonth();
    var d = 90//parseFloat($('.p' + m).val())
    var datosTabla6

    $('#promedio').html($('.d' + m).val());
    $('#ventaprecio').html($('.v' + m).val());
    $('#utilidad').html($('.u' + m).val());
    $('#utilidadneta').html($('.c' + m).val());
    $('#ventames').html($('.m' + m).val());

    $('#utilidadneta').mask('000,000,000', { reverse: true });
    $('#utilidad').mask('000,000,000', { reverse: true });
    $('#ventaprecio').mask('000,000,000', { reverse: true });

    var reportes = [
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },

    ]
    var datos = {
        type: "pie",
        data: { labels: ["Utilidad Directa", "Utilidad Indirecta", "Comision Directa", "Comision Indirecta"] },
        options: {
            responsive: !window.MSInputMethodContext,
            maintainAspectRatio: false,
            legend: { display: false }
        }
    };
    var datos2 = {
        type: "line",
        data: {
            labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            datasets: [{
                label: "Ventas ($)",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.success,
                data: [$('.v1').val(), $('.v2').val(), $('.v3').val(), $('.v4').val(), $('.v5').val(), $('.v6').val(),
                $('.v7').val(), $('.v8').val(), $('.v9').val(), $('.v10').val(), $('.v11').val(), $('.v12').val()]
            },
            {
                label: "Ventas ($)",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.primary,
                data: [$('.u1').val(), $('.u2').val(), $('.u3').val(), $('.u4').val(), $('.u5').val(), $('.u6').val(),
                $('.u7').val(), $('.u8').val(), $('.u9').val(), $('.u10').val(), $('.u11').val(), $('.u12').val()]
            },
            {
                label: "Ventas ($)",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.secondary,
                data: [$('.c1').val(), $('.c2').val(), $('.c3').val(), $('.c4').val(), $('.c5').val(), $('.c6').val(),
                $('.c7').val(), $('.c8').val(), $('.c9').val(), $('.c10').val(), $('.c11').val(), $('.c12').val()]
            }]
        },
        options: {
            responsive: !window.MSInputMethodContext,
            maintainAspectRatio: false,
            legend: { display: false },
            tooltips: { intersect: false },
            hover: { intersect: true },
            plugins: { filler: { propagate: false } },
            scales: {
                xAxes: [{ reverse: true, gridLines: { color: "rgba(0,0,0,0.05)" } }],
                yAxes: [{ display: true, borderDash: [1, 1], gridLines: { color: "rgba(0,0,0,0)", fontColor: "#fff" } }]
            }
        }
    };

    window.pie = new Chart(canvas, datos);
    window.pie2 = new Chart(canvas2, datos2);

    function Calcula() {
        reportes.map((repor) => {
            if (repor.l1 < d) {
                repor.t1 = (repor.u1 * d / 100) - (repor.u1 * repor.l1 / 100)
                repor.total += repor.t1
                if (repor.l2 < d && repor.l2 <= repor.l1) {
                    repor.t2 = (repor.u2 * d / 100) - (repor.u2 * repor.l1 / 100)
                    repor.total += repor.t2
                } else if (repor.l2 < d && repor.l2 > repor.l1) {
                    repor.t2 = (repor.u2 * d / 100) - (repor.u2 * repor.l2 / 100)
                    repor.total += repor.t2
                };
                if (repor.l3 < d && repor.l3 <= repor.l2) {
                    repor.t3 = (repor.u3 * d / 100) - (repor.u3 * repor.l2 / 100)
                    repor.total += repor.t3
                } else if (repor.l3 < d && repor.l3 > repor.l2 && repor.l3 <= repor.l1) {
                    repor.t3 = (repor.u3 * d / 100) - (repor.u3 * repor.l1 / 100)
                    repor.total += repor.t3
                } else if (repor.l3 < d && repor.l3 > repor.l1) {
                    repor.t3 = (repor.u3 * d / 100) - (repor.u3 * repor.l3 / 100)
                    repor.total += repor.t3
                };
            };
            //df = Object.values(repor.linea)
            //repor.porcentage = Math.max(...df);
            //num = (((repor.utilidad * parseFloat(d)) / 100) - ((repor.utilidad * repor.porcentage) / 100));
            //repor.total = Math.sign(num) > 0 ? num : 0;
        });
    };

    function Desendente() {
        datos.data.datasets.splice(0);
        var newData = {
            data: [Moneda($('.u' + m).val()), Moneda(reportes[fe].utilidad), Moneda($('.c' + m).val()), Moneda(reportes[fe].total)],
            backgroundColor: [window.theme.primary, window.theme.error, window.theme.info, window.theme.success],
            borderColor: "transparent"
        };
        datos.data.datasets.push(newData);
        window.pie.update();
    };
    function Grafica() {
        var data2 = new Array();
        var data = reportes.filter((r) => {
            return r.año === f.getFullYear()
        }).map((r) => {
            data2.push(r.total)
            return r.utilidad
        })
        var g = {
            label: "nuevo ($)",
            fill: true,
            backgroundColor: "transparent",
            borderColor: window.theme.danger,
            data: data
        }
        var i = {
            label: "nuevo2 ($)",
            fill: true,
            backgroundColor: "transparent",
            borderColor: window.theme.info,
            data: data2
        }
        datos2.data.datasets.push(g, i);
        window.pie2.update();
    };

    $.ajax({
        url: '/tablero/1',
        type: 'POST',
        //async: false,
        success: function (data) {
            data.map((repor) => {
                reportes[repor.Mes - 1].cuentas += repor.CantMes
                reportes[repor.Mes - 1].comision += repor.Comision
                reportes[repor.Mes - 1].venta += repor.venta
                reportes[repor.Mes - 1].utilidad += repor.utilidad
                reportes[repor.Mes - 1].l1 = repor.Porcentag
                reportes[repor.Mes - 1].u1 = repor.utilidad
                reportes[repor.Mes - 1].año = repor.Año
                reportes[repor.Mes - 1].mes = repor.Mes
            });
        }
    });
    $.ajax({
        url: '/tablero/2',
        type: 'POST',
        //async: false,
        success: function (data) {
            data.map((repor) => {
                reportes[repor.Mes - 1].cuentas += repor.CantMes
                reportes[repor.Mes - 1].comision += repor.Comision
                reportes[repor.Mes - 1].venta += repor.venta
                reportes[repor.Mes - 1].utilidad += repor.utilidad
                reportes[repor.Mes - 1].l2 = repor.Porcentag
                reportes[repor.Mes - 1].u2 = repor.utilidad
                reportes[repor.Mes - 1].año = repor.Año
                reportes[repor.Mes - 1].mes = repor.Mes
            });
        }
    });
    $.ajax({
        url: '/tablero/3',
        type: 'POST',
        //async: false,
        success: function (data) {
            data.map((repor) => {
                reportes[repor.Mes - 1].cuentas += repor.CantMes
                reportes[repor.Mes - 1].comision += repor.Comision
                reportes[repor.Mes - 1].venta += repor.venta
                reportes[repor.Mes - 1].utilidad += repor.utilidad
                reportes[repor.Mes - 1].l3 = repor.Porcentag
                reportes[repor.Mes - 1].u3 = repor.utilidad
                reportes[repor.Mes - 1].año = repor.Año
                reportes[repor.Mes - 1].mes = repor.Mes
            });
            Calcula()
            Desendente()
            $('#cuerpo').append(`
            <tr>
                <td><i class="fas fa-square-full text-primary"></i> Tu</td>
                <td class="text-right">$ ${Moneda($('.c' + m).val())}</td>
                <td class="text-right text-success">${$('.p' + m).val()}%</td>
            </tr>
            <tr>
                <td><i class="fas fa-square-full text-warning"></i> Nivel 1</td>
                <td class="text-right">$ ${Moneda(reportes[fe].t1)}</td>
                <td class="text-right text-success">${reportes[fe].l1}%</td>
            </tr>
            <tr>
                <td><i class="fas fa-square-full text-danger"></i> Nivel 2</td>
                <td class="text-right">$ ${Moneda(reportes[fe].t2)}</td>
                <td class="text-right text-success">${reportes[fe].l2}%</td>
            </tr>
            <tr>
                <td><i class="fas fa-square-full text-dark"></i> Nivel 3</td>
                <td class="text-right">$ ${Moneda(reportes[fe].t3)}</td>
                <td class="text-right text-success">${reportes[fe].l3}%</td>
            </tr>`);
            Grafica()
            var datosTabla6 = reportes.map((p) => {
                return Object.values(p)
            })
            //table6.draw();
            var table6 = $('#datatables6').DataTable({
                pageLength: 6,
                lengthChange: false,
                bFilter: false,
                deferRender: true,
                paging: true,
                responsive: { details: { type: 'column' } },
                //columnDefs: [{ className: 'control', orderable: true, targets: 0 }],
                order: [[0, "desc"], [1, "asc"]],
                language: languag,
                data: datosTabla6,
                columns: [
                    { title: "Año" },
                    { title: "Mes" },
                    { title: "Cuentas" },
                    { title: "Total Ventas", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                    { title: "Utilida", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                    { title: "Nivel-1 %", render: function (data, method, row) { return data + '%' } },
                    { title: "Nivel-2 %", render: function (data, method, row) { return data + '%' } },
                    { title: "Nivel-3 %", render: function (data, method, row) { return data + '%' } },
                    { title: "Nivel-1 Utilida", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                    { title: "Nivel-2 Utilida", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } }, ,
                    { title: "Nivel-3 Utilida", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                    { title: "Nivel-1 Ganado", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                    { title: "Nivel-2 Ganado", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                    { title: "Nivel-3 Ganado", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                    { title: "Comision Niveles", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                    { title: "Total Ganado", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                ]
            });
        }
    });

    var date = new Date()
    // Bar chart
    new Chart(document.getElementById("chartjs-dashboard-bar"), {
        type: "bar",
        data: {
            labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            datasets: [{
                label: "Last year",
                backgroundColor: window.theme.primary,
                borderColor: window.theme.primary,
                hoverBackgroundColor: window.theme.primary,
                hoverBorderColor: window.theme.primary,
                data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79]
            }, {
                label: "This year",
                backgroundColor: "#E8EAED",
                borderColor: "#E8EAED",
                hoverBackgroundColor: "#E8EAED",
                hoverBorderColor: "#E8EAED",
                data: [69, 66, 24, 48, 52, 51, 44, 53, 62, 79, 51, 68]
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    stacked: false,
                    ticks: {
                        stepSize: 20
                    }
                }],
                xAxes: [{
                    barPercentage: .75,
                    categoryPercentage: .5,
                    stacked: false,
                    gridLines: {
                        color: "transparent"
                    }
                }]
            }
        }
    });

    $("#datetimepicker-dashboard").datetimepicker({
        inline: true,
        sideBySide: false,
        format: "L"
    });

    var table5 = $('#datatables5').DataTable({
        pageLength: 6,
        lengthChange: false,
        bFilter: false,
        deferRender: true,
        paging: true,
        responsive: { details: { type: 'column' } },
        columnDefs: [{ className: 'control', orderable: true, targets: 0 }],
        order: [[1, "desc"]/*, [2, "desc"]*/],
        language: languag,
        ajax: {
            method: "POST",
            url: "/tablero/table5",
            dataSrc: "data"
        },
        columns: [
            {
                defaultContent: `.`
            },
            { data: "Año" },
            { data: "Mes" },
            { data: "CantMes" },
            { data: "promediov" },
            {
                data: "venta",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "utilidad",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "Comision",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "Porcentag",
                render: function (data, method, row) {
                    var m
                    data > 39 && data < 61 ? m = 40 : data > 59 && data < 71 ? m = 60 : data > 69 && data < 71 ? m = 70 : data > 89 && data < 96 ? m = 90 : data > 95 ? m = 95 : 0;
                    switch (m) {
                        case 40:
                            return `<span class="badge badge-pill badge-warning">Vendedor ${data}%</span>`
                            break;
                        case 60:
                            return `<span class="badge badge-pill badge-success">Contratista ${data}%</span>`
                            break;
                        case 70:
                            return `<span class="badge badge-pill badge-info">Distribuidor ${data}%</span>`
                            break;
                        case 90:
                            return `<span class="badge badge-pill badge-secondary">Mayorista ${data}%</span>`
                            break;
                        case 95:
                            return `<span class="badge badge-pill badge-primary">Master ${data}%</span>`
                            break;
                    }
                }
            }
        ]
    });
};



//////////////////////////////////* REPORTES */////////////////////////////////////////////////////////////
if (window.location.pathname == `/links/reportes`) {
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
    });
    $('#datatable2').on('click', '.te', function () {
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
    });
    $('#seleccionaproveedor').on('change', function () {
        if ($(this).val()) {
            $('#ModalOrden').modal('toggle');
            $('#ModalEventos').modal({
                toggle: true,
                backdrop: 'static',
                keyboard: true,
            });
            var clave = $("#contraseña").val();
            $.ajax({
                type: 'POST',
                url: '/links/proveedores',
                data: {
                    evento: clave ? 'Recargar cuenta' : 'Nuevo cliente',
                    idv: $("#idsms").val(),
                    idp: $(this).val(),
                    plan: $("#plan").val(),
                    clave,
                    nombre: $("#nombrec").val(),
                    correo: $("#correo").val(),
                    hora: fechs.getHours() + ":" + fechs.getMinutes() + ":" + fechs.getSeconds() + "." + fechs.getMilliseconds()
                },
                async: true,
                success: function (data) {
                    $('#ModalEventos').modal('hide')
                    if (data.estado && data.min) {
                        tableOrden.ajax.reload(function (json) {
                            SMSj('Datos enviados al Proveedor exitosamente');
                        });
                    } else if (data.estado) {
                        SMSj('error', ' Ya envio una solicitud antes, debe esperar 5 minutos minimos para realizar nuevamente esta solicitud');
                    } else {
                        SMSj('error', 'Algo salio mal rectifica e intentalo nuevamente');
                    }
                }
            })
        } else {
            SMSj('info', 'Seleccione un Proveedor valido')
        }
    })
    $('#ModalOrden').on('hidden.bs.modal', function () {
        $('#datatable2 tr.selected').toggleClass('selected');
        $("#ModalOrden input").val('');
        $("#car").attr("src", '/img/car.jpg');
    });

    // Guardar o Actualizar Orden
    $('#guardarOrden').on('click', function () {
        $('#ModalOrden').modal('toggle');
        $('#ModalEventos').modal({
            toggle: true,
            backdrop: 'static',
            keyboard: true,
        });
        RecogerDatos()
        $.ajax({
            type: 'PUT',
            url: '/links/reportes',
            data: dts,
            async: false,
            success: function (data) {
                tableOrden.ajax.reload(function (json) {
                    $('#ModalEventos').modal('hide');
                    SMSj('success', 'Cuenta enviada exitosamente')
                });
            }
        })
    });
    //////////////////////* Table2 */////////////////////// 
    var tableOrden = $('#datatable2').DataTable({
        dom: 'Bfrtip',
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
            },
            {
                text: `<input id="min" type="text" class="edi text-center" style="width: 60px; padding: 1px;"
                placeholder="Desde">`,
                attr: {
                    title: 'Busqueda por ID',
                    id: ''
                },
                className: 'btn btn-secondary min'
            },
            {
                text: `<input id="max" type="text" class="edi text-center" style="width: 60px; padding: 1px;"
                placeholder="Hasta">`,
                attr: {
                    title: 'Busqueda por ID',
                    id: ''
                },
                className: 'btn btn-secondary max'
            },
            {
                text: `<div class="mb-0">
                    <i class="align-middle mr-2" data-feather="check-circle"></i> <span class="align-middle">Calc</span>
               </div>`,
                attr: {
                    title: 'calculo',
                    id: 'calcular'
                },
                className: 'btn btn-secondary calcular'
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
        },
        initComplete: function (settings, json) {
            //tableOrden.column(2).visible(true);
        },
        columnDefs: [
            /*{
                className: 'control',
                orderable: true,
                targets: 0
            },
            {
                targets: [2],
                visible: false,
                searchable: false
            },*/
            { responsivePriority: 1, targets: 4 },
            { responsivePriority: 4, targets: 2 },
            { responsivePriority: 4, targets: 6 },
            { responsivePriority: 3, targets: -1 }
        ],
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
            url: "/links/reportes/table2",
            dataSrc: "data"
        },
        columns: [
            {
                className: 'control',
                orderable: true,
                data: null,
                defaultContent: ''
            },
            { data: "id" },
            {
                data: "fechadecompra",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD hh:mm A') //pone la fecha en un formato entendible
                }
            },
            {
                data: "pin",
                className: 'te'
            },
            {
                data: "nombre",
                className: 'te'
            },
            {
                data: "cajero",
                className: 'te'
            },
            {
                data: "producto",
                className: 'te'
            },
            {
                data: "correo",
                className: 'te'
            },
            {
                data: "fechadeactivacion",
                className: 'te',
                render: function (data, method, row) {
                    if (data) {
                        return moment(data).format('YYYY-MM-DD') || '' //pone la fecha en un formato entendible
                    } else {
                        return ''
                    }
                }
            },
            {
                data: "fechadevencimiento",
                className: 'te',
                render: function (data, method, row) {
                    if (data) {
                        return moment(data).format('YYYY-MM-DD') || '' //pone la fecha en un formato entendible
                    } else {
                        return ''
                    }
                }
            },
            {
                data: "movildecompra",
                className: 'te'
            },
            {
                data: "anular",
                className: 'te'
            },
            {
                data: "descripcion",
                className: 'te'
            },
            {
                className: 'restablecer',
                orderable: false,
                data: null,
                defaultContent: '<button class="btn btn-sm btn-outline-danger restablecer">Clave</button>'
            }
        ]
    });
    //////////////////////* Table3 *///////////////////////    
    var table3 = $('#datatable3').DataTable({
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
        },
        order: [[1, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/reportes/table3",
            dataSrc: "data"
        },
        columns: [
            {
                className: 'control',
                orderable: true,
                data: null,
                defaultContent: ''
            },
            { data: "id" },
            {
                data: "fecha",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD hh:mm A') //pone la fecha en un formato entendible
                }
            },
            { data: "fullname" },
            { data: "venefactor" },
            {
                data: "monto",
                render: $.fn.dataTable.render.number(',', '.', 0, '$')
            },
            { data: "metodo" },
            { data: "idrecarga" },
            {
                data: "fechtrans",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD hh:mm A') //pone la fecha en un formato entendible
                }
            },
            {
                data: "saldoanterior",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "numeroventas" },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 'Aprobada':
                            return `<span class="badge badge-pill badge-success">${data}</span>`
                            break;
                        case 'Declinada':
                            return `<span class="badge badge-pill badge-danger">${data}</span>`
                            break;
                        case 'Procesando':
                            return `<span class="badge badge-pill badge-info">${data}</span>`
                            break;
                        case 'Pendiente':
                            return `<span class="badge badge-pill badge-warning">${data}</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">${data}</span>`
                    }
                }
            },
            { data: "recibo" },
        ]
    });
    //////////////////////* Table4 *///////////////////////    
    var table4 = $('#datatable4').DataTable({
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
        },
        columnDefs: [
            { responsivePriority: 4, targets: 2 },
            { responsivePriority: 3, targets: 1 },
            { responsivePriority: 3, targets: 9 },
            { responsivePriority: 1, targets: 7 },
            { responsivePriority: 2, targets: -1 },
            { responsivePriority: 3, targets: 8 }
        ],
        order: [[1, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/reportes/table4",
            dataSrc: "data"
        },
        columns: [
            {
                className: 'control',
                orderable: true,
                data: null,
                defaultContent: ''
            },
            { data: "id" },
            {
                data: "fechadecompra",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD hh:mm') //pone la fecha en un formato entendible
                }
            },
            {
                data: "nombre",
                className: 'te'
            },
            {
                data: "cajero",
                className: 'te'
            },
            {
                data: "producto",
                className: 'te'
            },
            {
                data: "rango",
                className: 'te',
                render: function (data, method, row) {
                    switch (data) {
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Cajero</span>`
                            break;
                        case 5:
                            return `<span class="badge badge-pill badge-warning">Vendedor</span>`
                            break;
                        case 4:
                            return `<span class="badge badge-pill badge-success">Contratista</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-info">Distribuidor</span>`
                            break;
                        case 2:
                            return `<span class="badge badge-pill badge-secondary">Mayorista</span>`
                            break;
                        case 1:
                            return `<span class="badge badge-pill badge-primary">Master</span>`
                            break;
                    }
                }
            },
            {
                data: "precio",
                className: 'te',
                render: $.fn.dataTable.render.number(',', '.', 0, '$')
            },
            {
                data: "utilidad",
                className: 'te',
                render: $.fn.dataTable.render.number(',', '.', 0, '$')
            },
            {
                data: "comision",
                className: 'te',
                render: function (data, method, row) {
                    switch (data) {
                        case '95':
                            return `<span class="badge badge-pill badge-warning">${data}%</span>`
                            break;
                        case '90':
                            return `<span class="badge badge-pill badge-success">${data}%</span>`
                            break;
                        case '70':
                            return `<span class="badge badge-pill badge-info">${data}%</span>`
                            break;
                        case '60':
                            return `<span class="badge badge-pill badge-secondary">${data}%</span>`
                            break;
                        case '40':
                            return `<span class="badge badge-pill badge-primary">${data}%</span>`
                            break;
                        case '5':
                            return `<span class="badge badge-pill badge-danger">${data}%</span>`
                            break;
                    }
                }
            },
            {
                data: "neta",
                className: 'te',
                render: $.fn.dataTable.render.number(',', '.', 0, '$')
            }
        ]
    });
    // Daterangepicker  
    var start = moment().subtract(29, "days").startOf("hour");
    var end = moment().startOf("hour").add(32, "hour");
    $(".fech").daterangepicker({
        locale: {
            'format': 'YYYY-MM-DD HH:mm',
            'separator': ' a ',
            'applyLabel': 'Aplicar',
            'cancelLabel': 'Cancelar',
            'fromLabel': 'De',
            'toLabel': 'A',
            'customRangeLabel': 'Personalizado',
            'weekLabel': 'S',
            'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            'firstDay': 1
        },
        opens: "center",
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        opens: "right",
        alwaysShowCalendars: false,
        startDate: start,
        endDate: end,
        ranges: {
            'Ayer': [moment().subtract(1, 'days').startOf("days"), moment().subtract(1, 'days').endOf("days")],
            'Ultimos 7 Días': [moment().subtract(6, 'days'), moment().endOf("days")],
            'Ultimos 30 Días': [moment().subtract(29, 'days'), moment().endOf("days")],
            'Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Hoy': [moment().startOf('days'), moment().endOf("days")],
            'Restablecer': [moment().subtract(1, 'year'), moment().endOf("days")]
        }
    }, function (start, end, label) {
        maxDateFilter = end;
        minDateFilter = start;
        tableOrden.draw();
        table3.draw();
        table4.draw();
    });
    var primera, ultima, precio = 0, utilidad = 0, neto = 0, vendedor, fechaun, fechado, total, movil;
    $('.calcular').on('click', function () {
        primera = '';
        ultima = '';
        precio = 0;
        utilidad = 0;
        neto = 0;
        fechaun = '';
        fechado = '';
        total = '';
        table4.page.len(-1).draw();
        var data = table4.rows(':visible').data();
        $('#datatable2_filter').hide('slow')
        $('#datatable2').hide('slow')
        $('#datatable2_paginate').hide('slow')
        $('#quitartodo').show('slow')
        $('#cuentadecobro').show('slow')
        $('#tablaprecio').removeClass()
        $('#tablaprecio').addClass("col-12")
        $('#tablaprecio').next().removeClass()
        $('#tablaprecio').next().addClass("col-12")
        primera = data[data.length - 1].id
        vendedor = data[0].vendedor
        ultima = data[0].id
        fechaun = data[data.length - 1].fechadecompra
        fechado = data[0].fechadecompra
        total = data.length
        data.map((t, i) => {
            precio += t.precio
            utilidad += t.utilidad
            neto += t.neta
        })
        $('#datatable4_length label').html(`<span id="precio" class="badge badge-pill badge-info">Total venta: $${Moneda(precio)}</span>
        <span id="neto" class="badge badge-pill badge-secondary">Total utilida: $${Moneda(neto)}</span>
        <br>
        <span id="utilidad" class="badge badge-pill badge-danger">Utilidad no generada: $${Moneda(utilidad - neto)}</span>
        <span id="totalingreso" class="badge badge-pill badge-primary">RedFlix: $${Moneda(precio - neto)}</span>`);
    });
    $('#quitartodo').on('click', function () {
        $('#datatable4_length label').html('');
        $('#min, #max').val('');
        table4.page.len(10).draw();
        maxDateFilter = moment().endOf("days");
        minDateFilter = moment().subtract(1, 'year');
        tableOrden.draw();
        table3.draw();
        table4.draw();
        $('#quitartodo').hide('slow')
        $('#cuentadecobro').hide('slow')
        $('#datatable2_filter').show('slow')
        $('#datatable2').show('slow')
        $('#datatable2_paginate').show('slow')
        $('#tablaprecio').removeClass()
        $('#tablaprecio').addClass("col-12 col-sm-12 col-md-6")
        $('#tablaprecio').next().removeClass()
        $('#tablaprecio').next().addClass("col-12 col-sm-12 col-md-6")
    })
    $('#cuentadecobro').on('click', () => {
        $('#ModalEventos').modal({
            toggle: true,
            backdrop: 'static',
            keyboard: true,
        })
        $.ajax({
            type: 'POST',
            url: '/links/cobro',
            data: { vendedor: vendedor },
            async: true,
            success: function (data) {
                $('#nomvend').html(data[0].fullname);
                $("#CuentaCobro .img").attr('src', data[0].imagen);
                $('#celular').val(data[0].movil);
                $('#idcontratista').val(data[0].id);
                switch (data[0].nrango) {
                    case 6:
                        $('#rango').html(`<span class="badge badge-pill badge-danger">Cajero</span>`);
                        break;
                    case 5:
                        $('#rango').html(`<span class="badge badge-pill badge-warning">Vendedor</span>`);
                        break;
                    case 4:
                        $('#rango').html(`<span class="badge badge-pill badge-success">Contratista</span>`);
                        break;
                    case 3:
                        $('#rango').html(`<span class="badge badge-pill badge-info">Distribuidor</span>`);
                        break;
                    case 2:
                        $('#rango').html(`<span class="badge badge-pill badge-secondary">Mayorista</span>`);
                        break;
                    case 1:
                        $('#rango').html(`<span class="badge badge-pill badge-primary">Master</span>`);
                        break;
                }
                $('#CuentaCobro').one('shown.bs.modal', function () {
                    $('#ModalEventos').modal('toggle');
                }).modal('show');
            }
        })
    })
    $('#enviarcuenta').on('click', () => {
        $('#CuentaCobro').modal('hide');
        $('#ModalEventos').modal({
            toggle: true,
            backdrop: 'static',
            keyboard: true,
        })
        $.ajax({
            type: 'PUT',
            url: '/links/cobro',
            data: {
                vendedor: $('#nomvend').html(),
                primera, ultima, utilidad,
                fechaun, fechado, total, rango: $('#rango').text(),
                precio, neto, movil: $('#celular').cleanVal(),
                id: $('#idcontratista').val(), fecha: moment().format('YYYY-MM-DD HH:mm')
            },
            async: true,
            success: function (data) {
                $('#ModalEventos').modal('hide');
                SMSj('success', 'Cuenta de cobro enviada con esxito')
            }
        })
    })
} ///ESTO ES PARA QUE APRENDAS PENDEJO QUE PRIMERO TIENES QUE ACTUALÑIZAR///////////////////////
//////////////////////////////////* PRODUCTOS */////////////////////////////////////////////////////////////
if (window.location == `${window.location.origin}/links/productos`) {
    minDateFilter = "";
    maxDateFilter = "";
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            if (typeof aData._date == 'undefined') {
                aData._date = new Date(aData[3]).getTime();
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
    $(document).ready(function () {
        $("#Date_search").html("");
        $('a.toggle-vis').on('click', function (e) {
            e.preventDefault();
            // Get the column API object
            var column = table.column($(this).attr('data-column'));
            // Toggle the visibility
            column.visible(!column.visible());
        });

    });
    /*cont = parseFloat($('.cont').html())
    $('.edi').keyup(function () {
        cont--
        console.log(cont)
        $('.cont').html(cont)
    });*/
    var Color = (val) => {
        var elemen = $(`#t-${val}`);
        if (elemen.hasClass('i')) {
            elemen.css('background-color', 'transparent');
            elemen.removeClass('.i');
        } else {
            elemen.css('background-color', '#FFFFCC');
            elemen.addClass('i');
        }
    }
    var table = $('#datatable').DataTable({
        dom: 'Bfrtip',
        lengthMenu: [
            [10, 25, 50, -1],
            ['10 filas', '25 filas', '50 filas', 'Ver todo']
        ],
        buttons: ['pageLength',
            {
                text: `Ocultar
                <div class="dropdown-menu" x-placement="bottom-start" >
                    <a class="toggle-vis dropdown-item" id="t-Pax" data-column="2" onclick='Color(this.innerText)'>Pax</a>
                    <a class="toggle-vis dropdown-item" id="t-Partida" data-column="4" onclick='Color(this.innerText)'>Partida</a>
                    <a class="toggle-vis dropdown-item" id="t-Destino" data-column="5" onclick='Color(this.innerText)'>Destino</a>
                    <a class="toggle-vis dropdown-item" id="t-Vuelo" data-column="6" onclick='Color(this.innerText)'>Vuelo</a>
                    <a class="toggle-vis dropdown-item" id="t-Retorno" data-column="7" onclick='Color(this.innerText)'>Retorno</a>
                    <a class="toggle-vis dropdown-item" id="t-Grupo" data-column="8" onclick='Color(this.innerText)'>Grupo</a>
                    <a class="toggle-vis dropdown-item" id="t-Observaciones" data-column="9" onclick='Color(this.innerText)'>Observaciones</a>
                    <a class="toggle-vis dropdown-item" id="t-Pasajeros" data-column="10" onclick='Color(this.innerText)'>Pasajeros</a>
                    <a class="toggle-vis dropdown-item" id="t-Valor" data-column="11" onclick='Color(this.innerText)'>Valor</a>
                    <a class="toggle-vis dropdown-item" id="t-Creador" data-column="12" onclick='Color(this.innerText)'>Creador</a>
                    <a class="toggle-vis dropdown-item" id="t-Factura" data-column="13" onclick='Color(this.innerText)'>Factura</a>                                      
                </div> `,
                attr: {
                    'data-toggle': 'dropdown',
                    'aria-haspopup': true,
                    'aria-expanded': false,
                    'text': 'ocultar'
                },
                className: 'btn dropdown-toggle'
            },
            {
                extend: 'print',
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                text: `<div class="mb-0">
                            <i class="align-middle mr-2" data-feather="calendar"></i> <span class="align-middle">Fecha</span>
                       </div>`,
                attr: {
                    title: 'Fecha',
                    id: 'Date'
                },
                className: 'btn btn-secondary fech'
            }
        ],
        deferRender: true,
        autoWidth: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: false,
        },
        responsive: true,
        order: [[0, 'desc']],
        language: {
            "lengthMenu": "Mostrar 10 filas",
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar : ",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            method: "POST",
            url: "/links/productos",
            dataSrc: "data"
        },
        columns: [
            { data: "id_producto" },
            { data: "categoria" },
            { data: "producto" },
            {
                data: "fecha",
                render: function (data, method, row) {
                    return moment.utc(data).format('lll') //pone la fecha en un formato entendible
                }
            },
            {
                data: "precio",
                render: function (data, method, row) {
                    return Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "dias" },
            {
                data: "utilidad",
                render: function (data, method, row) {
                    return Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "credito" },
            { data: "stock" },
            { data: "descripcion" },
            { data: "estado" },
        ]
    }); //table.buttons().container().appendTo("#datatable_wrapper .col-sm-12 .col-md-6");

    // Daterangepicker 
    /*var start = moment().subtract(29, "days").startOf("hour");
    var end = moment().startOf("hour").add(32, "hour");*/
    $(".fech").daterangepicker({
        locale: {
            'format': 'YYYY-MM-DD HH:mm',
            'separator': ' a ',
            'applyLabel': 'Aplicar',
            'cancelLabel': 'Cancelar',
            'fromLabel': 'De',
            'toLabel': 'A',
            'customRangeLabel': 'Personalizado',
            'weekLabel': 'S',
            'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            'firstDay': 1
        },
        opens: "center",
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        opens: "right",
        alwaysShowCalendars: false,
        //autoApply: false,
        startDate: moment().subtract(29, "days"),
        endDate: moment(),
        ranges: {
            'Ayer': [moment().subtract(1, 'days').startOf("days"), moment().subtract(1, 'days').endOf("days")],
            'Ultimos 7 Días': [moment().subtract(6, 'days'), moment().endOf("days")],
            'Ultimos 30 Días': [moment().subtract(29, 'days'), moment().endOf("days")],
            'Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Hoy': [moment().startOf('days'), moment().endOf("days")],
            'Mañana': [moment().add(1, 'days').startOf('days'), moment().add(1, 'days').endOf('days')],
            'Proximos 30 Días': [moment().startOf('days'), moment().add(29, 'days').endOf("days")],
            'Próximo Mes': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
        }
    }, function (start, end, label) {
        maxDateFilter = end;
        minDateFilter = start;
        table.draw();
        $("#Date_search").val(start.format('YYYY-MM-DD') + ' a ' + end.format('YYYY-MM-DD'));
    });
};
/////////////////////////////* SOLICITUDES *////////////////////////////////////////////////////////////
if (window.location == `${window.location.origin}/links/solicitudes`) {
    minDateFilter = "";
    maxDateFilter = "";
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            if (typeof aData._date == 'undefined') {
                aData._date = new Date(aData[3]).getTime();
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
    $(document).ready(function () {
        $("#Date_search").html("");
        $('a.toggle-vis').on('click', function (e) {
            e.preventDefault();
            // Get the column API object
            var column = table.column($(this).attr('data-column'));
            // Toggle the visibility
            column.visible(!column.visible());
        });

    });
    var Color = (val) => {
        var elemen = $(`#t-${val}`);
        if (elemen.hasClass('i')) {
            elemen.css('background-color', 'transparent');
            elemen.removeClass('.i');
        } else {
            elemen.css('background-color', '#FFFFCC');
            elemen.addClass('i');
        }
    }

    var table = $('#datatable').DataTable({
        dom: 'Bfrtip',
        lengthMenu: [
            [10, 25, 50, -1],
            ['10 filas', '25 filas', '50 filas', 'Ver todo']
        ],
        buttons: ['pageLength',
            {
                text: `<div class="mb-0">
                            <i class="align-middle mr-2" data-feather="calendar"></i> <span class="align-middle">Fecha</span>
                       </div>`,
                attr: {
                    title: 'Fecha',
                    id: 'Date'
                },
                className: 'btn btn-secondary fech'
            }
        ],
        deferRender: true,
        paging: true,
        autoWidth: true,
        search: {
            regex: true,
            caseInsensitive: false,
        },
        responsive: true,
        order: [[0, 'desc']],
        language: {
            "lengthMenu": "Mostrar 10 filas",
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar : ",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            method: "POST",
            url: "/links/solicitudes",
            dataSrc: "data"
        },
        /*initComplete: function (settings, json, row) {
            alert(row);
        },*/
        columns: [
            { data: "id" },
            { data: "fullname" },
            { data: "venefactor" },
            {
                data: "fecha",
                render: function (data, method, row) {
                    return moment.utc(data).format('YYYY-MM-DD HH:mm A') //pone la fecha en un formato entendible
                }
            },
            {
                data: "monto",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "metodo" },
            { data: "creador" },
            { data: "recibo" },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 'Aprobada':
                            return `<span class="badge badge-pill badge-success">${data}</span>`
                            break;
                        case 'Declinada':
                            return `<span class="badge badge-pill badge-danger">${data}</span>`
                            break;
                        case 'Procesando':
                            return `<span class="badge badge-pill badge-info">${data}</span>`
                            break;
                        case 'Pendiente':
                            return `<span class="badge badge-pill badge-warning">${data}</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">${data}</span>`
                    }
                }
            },
            {
                defaultContent: `<div class="btn-group btn-group-sm">
                                    <button type="button" class="btn btn-secondary dropdown-toggle btnaprobar" data-toggle="dropdown" 
                                     aria-haspopup="true" aria-expanded="false">Acción</button>
                                        <div class="dropdown-menu"></div>
                                </div>`
            }
        ]
    }); //table.buttons().container().appendTo("#datatable_wrapper .col-sm-12 .col-md-6");    
    table.on('click', '.btnaprobar', function () {
        var fila = $(this).parents('tr');
        var data = table.row(fila).data();
        if ($('#tu').val() !== data.tu) {
            switch (data.estado) {
                case 'Procesando':
                    $(this).attr('data-toggle', "dropdown")
                    $(this).next().html(`<a class="dropdown-item">Aprobar</a>
                    <a class="dropdown-item">Declinar</a>
                    <a class="dropdown-item">Procesando</a>`);
                    break;
                case 'Pendiente':
                    $(this).attr('data-toggle', "dropdown")
                    $(this).next().html(`<a class="dropdown-item">Aprobar</a>
                    <a class="dropdown-item">Declinar</a>
                    <a class="dropdown-item">Procesando</a>`);
                    break;
                default:
                    $(this).removeAttr('data-toggle')
                    SMSj('info', 'Despues de aprobada o declinada no se puede editar la solicitud.')
            }
        } else {
            if (data.estado === 'Pendiente') {
                $(this).attr('data-toggle', "dropdown")
                $(this).next().html(`<a class="dropdown-item">Declinar</a>`);
            } else {
                $(this).attr('disabled', true)
                SMSj('warning', 'No tienes permiso para realizar cambios en esta solicitud, solo el Benefactor podra realizar los cambios')
            }
        }
    })
    table.on('click', '.dropdown-item', function () {
        var fila = $(this).parents('tr');
        var data = table.row(fila).data();
        var dts = { id: data.id, mg: data.estado, monto: data.monto }
        switch ($(this).text()) {
            case 'Aprobar':
                dts.estado = 4;
                break;
            case 'Declinar':
                dts.estado = 6;
                break;
            case 'Procesando':
                dts.estado = 1;
                break;
        }
        $.ajax({
            type: 'PUT',
            url: '/links/solicitudes',
            data: dts,
            success: function (data) {
                table.ajax.reload(function (json) {
                    if (data) {
                        SMSj('success', `Solicitud procesada correctamente`);
                    } else {
                        SMSj('error', `Solicitud no pudo ser procesada correctamente, por fondos insuficientes`)
                    }
                });
            }
        })
    })
    // Daterangepicker 
    /*var start = moment().subtract(29, "days").startOf("hour");
    var end = moment().startOf("hour").add(32, "hour");*/
    $(".fech").daterangepicker({
        locale: {
            'format': 'YYYY-MM-DD HH:mm',
            'separator': ' a ',
            'applyLabel': 'Aplicar',
            'cancelLabel': 'Cancelar',
            'fromLabel': 'De',
            'toLabel': 'A',
            'customRangeLabel': 'Personalizado',
            'weekLabel': 'S',
            'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            'firstDay': 1
        },
        opens: "center",
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        opens: "right",
        alwaysShowCalendars: false,
        //autoApply: false,
        startDate: moment().subtract(29, "days"),
        endDate: moment(),
        ranges: {
            'Ayer': [moment().subtract(1, 'days').startOf("days"), moment().subtract(1, 'days').endOf("days")],
            'Ultimos 7 Días': [moment().subtract(6, 'days'), moment().endOf("days")],
            'Ultimos 30 Días': [moment().subtract(29, 'days'), moment().endOf("days")],
            'Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Hoy': [moment().startOf('days'), moment().endOf("days")],
            'Mañana': [moment().add(1, 'days').startOf('days'), moment().add(1, 'days').endOf('days')],
            'Proximos 30 Días': [moment().startOf('days'), moment().add(29, 'days').endOf("days")],
            'Próximo Mes': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
        }
    }, function (start, end, label) {
        maxDateFilter = end;
        minDateFilter = start;
        table.draw();
        $("#Date_search").val(start.format('YYYY-MM-DD') + ' a ' + end.format('YYYY-MM-DD'));
    });
};