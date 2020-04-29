'use strict';
 
var Transmission = require('transmission');
var transmission = new Transmission({
    port: 9091,			// DEFAULT : 9091
    host: 'localhost',			// DEAFULT : 127.0.0.1
    username: 'username',	// DEFAULT : BLANK
    password: 'password'	// DEFAULT : BLANK
});
 
//Obtenga detalles de todos los torrents actualmente en cola en la aplicación de transmisión
function getTransmissionStats(){
    transmission.sessionStats(function(err, result){
        if(err){
            console.log(err);
        } else {
            console.log(result);
        }
    });
}
 
// Agregue un torrent pasando una URL al archivo .torrent o un enlace magnético
function addTorrent(url){
    transmission.addUrl(url, {
        "download-dir" : "~/transmission/torrents"
    }, function(err, result) {
        if (err) {
            return console.log(err);
        }
        var id = result.id;
        console.log('Acabo de agregar un nuevo torrent.');
        console.log('Torrent ID: ' + id);
    });
}
 
// Obtenga varias estadísticas sobre un torrente en la cola
function getTorrentDetails(id) {
    transmission.get(id, function(err, result) {
        if (err) {
            throw err;
        }
        if(result.torrents.length > 0){
        	// console.log(result.torrents[0]);			// Obtiene todos los detalles
        	console.log("Name = "+ result.torrents[0].name);
        	console.log("Download Rate = "+ result.torrents[0].rateDownload/1000);
        	console.log("Upload Rate = "+ result.torrents[0].rateUpload/1000);
        	console.log("Completed = "+ result.torrents[0].percentDone*100);
        	console.log("ETA = "+ result.torrents[0].eta/3600);
        	console.log("Status = "+ getStatusType(result.torrents[0].status));
        }
    });
}
 
function deleteTorrent(id){
    transmission.remove(id, true, function(err, result){
        if (err){
            console.log(err);
        } else {
            transmission.get(id, function(err, result) {
               //err no torrent found...
            });
        }
    });
}
 
// Para iniciar un torrente en pausa / detenido que todavía está en la cola
function startTorrent(id){
    transmission.start(id, function(err, result){});
}
 
// Para obtener una lista de todos los torrents actualmente en la cola (descargando + pausado)
// NOTA: Esto puede devolver nulo si todos los torrents están en estado de pausa
function getAllActiveTorrents(){
    transmission.active(function(err, result){
    if (err){
        console.log(err);
    }
    else {
        for (var i=0; i< result.torrents.length; i++){
            console.log(result.torrents[i].id);
            console.log(result.torrents[i].name);
        }
    }
    });
}
 
// Pausar / detener un torrent
function stopTorrent(id){
    transmission.stop(id, function(err, result){});
}
 
// Pausar / detener todos los torrents
function stopAllActiveTorrents(){
    transmission.active(function(err, result){
    if (err){
        console.log(err);
    }
    else {
        for (var i=0; i< result.torrents.length; i++){
            stopTorrents(result.torrents[i].id);
        }
    }
    });
}
 
// Eliminar un torrent de la cola de descarga
// NOTA: Esto no destruye los datos de torrent, es decir, no los elimina del disco
function removeTorrent(id) {
    transmission.remove(id, function(err) {
        if (err) {
            throw err;
        }
        console.log('torrent fue eliminado');
    });
}
 
// Obtener estado de torrent
function getStatusType(type){
    return transmission.statusArray[type]
    if(type === 0){
        return 'STOPPED';
    } else if(type === 1){
        return 'CHECK_WAIT';
    } else if(type === 2){
        return 'CHECK';
    } else if(type === 3){
        return 'DOWNLOAD_WAIT';
    } else if(type === 4){
        return 'DOWNLOAD';
    } else if(type === 5){
        return 'SEED_WAIT';
    } else if(type === 6){
        return 'SEED';
    } else if(type === 7){
        return 'ISOLATED';
    }
}
 