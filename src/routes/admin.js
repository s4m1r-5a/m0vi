const express = require('express');
//const {Builder, By, Key, until} = require('selenium-webdriver');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../database');
const { isLoggedIn, isLogged, Admins } = require('../lib/auth');
const sms = require('../sms.js');
const { registro, Contactos } = require('../keys');
const request = require('request');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const cron = require("node-cron");
const accountSid = 'AC0db7285fa004f3706457d39b73e8bb37';
const authToken = '28e8f6c7f5108bae9c8d834620a96986';
const client = require('twilio')(accountSid, authToken);
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const Transmission = require('transmission');

const transmission = new Transmission({
    port: 9091,			// DEFAULT : 9091
    host: 'localhost',			// DEAFULT : 127.0.0.1
    username: 'username',	// DEFAULT : BLANK
    password: 'password'	// DEFAULT : BLANK
});

//ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");
router.get('/prueba', async (req, res) => {
    console.log(req.params)
    var url = `magnet:?xt=urn:btih:56383d3d5909d199876430a1a4e2611d659c4d07&dn=Gretel.and.hansel.2020.1080p-dual-lat-cinecalidad.is.mp4&tr=udp%3a%2f%2ftracker.coppersurfer.tk%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.internetwarriors.net%3a1337%2fannounce&tr=udp%3a%2f%2ftracker.leechers-paradise.org%3a6969%2fannounce`
    transmission.addUrl(url, {
        //"download-dir": "~/transmission/torrents"
        //"download-dir": "C:\Users\Samir\Desktop\peli\src\public\torrents"
    }, function (err, result) {
        if (err) {
            return console.log(err);
        }
        var id = result.id;
        console.log('Acabo de agregar un nuevo torrent.');
        console.log('Torrent ID: ' + id);
        getTorrentDetails(id)
    });

    // Obtenga varias estadísticas sobre un torrente en la cola
    function getTorrentDetails(id) {
        transmission.get(id, function (err, result) {
            if (err) {
                throw err;
            }
            if (result.torrents.length > 0) {
                // console.log(result.torrents[0]);			// Obtiene todos los detalles
                console.log("Name = " + result.torrents[0].name);
                console.log("Download Rate = " + result.torrents[0].rateDownload / 1000);
                console.log("Upload Rate = " + result.torrents[0].rateUpload / 1000);
                console.log("Completed = " + result.torrents[0].percentDone * 100);
                console.log("ETA = " + result.torrents[0].eta / 3600);
                console.log("Status = " + getStatusType(result.torrents[0].status));
            }
        });
    }
    // Obtener estado de torrent
    function getStatusType(type) {
        return transmission.statusArray[type]
        if (type === 0) {
            return 'STOPPED';
        } else if (type === 1) {
            return 'CHECK_WAIT';
        } else if (type === 2) {
            return 'CHECK';
        } else if (type === 3) {
            return 'DOWNLOAD_WAIT';
        } else if (type === 4) {
            return 'DOWNLOAD';
        } else if (type === 5) {
            return 'SEED_WAIT';
        } else if (type === 6) {
            return 'SEED';
        } else if (type === 7) {
            return 'ISOLATED';
        }
    }
    res.render('admin/produccion');
});

//////////////////////* ADMINISTRACIÓN SUBIDA DE CONTENIDO */////////////////////////////////////
router.get('/busqueda', isLoggedIn, async (req, res) => {
    const { string, id, data } = req.query
    //console.log(req.query)
    let url;
    if (string) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=8d0c8b6f076656ea8f7f0ae1e22032e1&language=es-ES&query=${Normalize(string).toUpperCase()}`;
    } else if (id) {
        url = `https://api.themoviedb.org/3/movie/${id}?api_key=8d0c8b6f076656ea8f7f0ae1e22032e1&language=es-ES`;
    } else if (data) {
        url = `https://api.themoviedb.org/3/movie/${data}/credits?api_key=8d0c8b6f076656ea8f7f0ae1e22032e1`;
    }

    request({
        url,
        json: true
    }, (error, resp, body) => {
        if (error) {
            console.error(error)
            return
        }
        //console.log(body, resp.statusCode)
        res.send(body);
    })

});
router.get('/produccion', (req, res) => {
    res.render('admin/produccion');
});
router.post('/produccion', async (req, res) => {
    const { id, imagenes, titulo, slogan, fecha, genero, sinopsis, trailer } = req.body
    res.send('Trascodificando')

    var sesions = '';
    if (Array.isArray(genero)) {
        genero.map((s) => {
            sesions += s + '-';
        })
        sesions = sesions.slice(0, -1)
    } else {
        sesions = genero;
    }
    const video = {
        id, titulouno: titulo[0], titulodos: titulo[1], imagenes: `${imagenes[0]} - ${imagenes[1]}`,
        slogan, fecha, sesiones: sesions, sinopsis, trailer, ruta: `uploads/${id}/master.m3u8`, estado: 7
    }
    const vedeo = await pool.query('SELECT * FROM contenidos WHERE id = ?', id);
    if (!vedeo.length) {
        await pool.query('INSERT INTO contenidos SET ? ', video);
    };

    function createDirectory(directoryPath) {
        const directory = path.normalize(directoryPath);
        return new Promise((resolve, reject) => {
            fs.stat(directory, (error) => {
                if (error) {
                    if (error.code === 'ENOENT') {
                        fs.mkdir(directory, (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(directory);
                            }
                        });
                    } else {
                        reject(error);
                    }
                } else {
                    resolve(directory);
                }
            });
        });
    }
    //console.log(path.join(__dirname, '../public/uploads/sam'))
    const directoryPath = path.join(__dirname, `../public/uploads/${id}`);
    createDirectory(directoryPath).then((path) => {
        console.log(`Successfully created directory: '${path}'`);

    }).catch((error) => {
        console.log(`Problem creating directory: ${error.message}`)
    });

    // Create a command to convert source.avi to MP4
    var command = ffmpeg(path.join(__dirname, '../public/uploads/' + req.file.filename))
        .outputOptions([
            //'-map 0:v',
            //'-map 0:a:0',
            '-crf 21',
            '-sc_threshold 0',
            '-g 48',
            '-keyint_min 48',
            '-c:v h264',
            '-profile:v main',
            '-hls_time 10',
            '-hls_list_size 0',
            '-start_number 0',
            '-f hls',
            '-master_pl_name master.m3u8'
        ]);

    // Create a clone to save a small resized version
    command.clone()
        .size('720x?')
        .outputOptions('-master_pl_name master720x.m3u8')
        .save(path.join(__dirname, `../public/uploads/${id}/v${id}_720p.m3u8`))

    // Create a clone to save a medium resized version
    command.clone()
        .size('460x?')
        .outputOptions('-master_pl_name master460x.m3u8')
        .save(path.join(__dirname, `../public/uploads/${id}/v${id}_460p.m3u8`))

    command.clone()
        .size('320x?')
        .outputOptions('-master_pl_name master320x.m3u8')
        .save(path.join(__dirname, `../public/uploads/${id}/v${id}_320p.m3u8`))

    // Save a converted version with the original size
    command.save(path.join(__dirname, `../public/uploads/${id}/v${id}_1080.m3u8`))
        .on('start', function (commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('error', function (err, stdout, stderr) {
            console.log('An error occurred: ' + err.message, err, stderr);
        })
        .on('progress', function (progress) {
            console.log('Processing: ' + progress.percent + '% done')
        })
        .on('end', function (err, stdout, stderr) {
            console.log('Finished processing!', err, stdout, stderr)
            //res.json(req.body)
        })
        .run()

    /*var command = ffmpeg(path.join(__dirname, '../public/uploads/' + req.file.filename))
        .outputOptions([
            '-map 0:a:0',
            '-c:a aac',
            '-ar 48000',
            '-b:a 96k',
            '-master_pl_name master.m3u8',
            '-f hls',
            '-hls_time 10',
            '-hls_list_size 0',
            '-hls_segment_filename', '"v%v/fileSequence%d.aac"'
        ])
    // Save a converted version with the original size
    command.save(path.join(__dirname, `../public/uploads/${id}/esp.m3u8`))
        .on('start', function (commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('error', function (err, stdout, stderr) {
            console.log('An error occurred: ' + err.message, err, stderr);
        })
        .on('progress', function (progress) {
            console.log('Processing: ' + progress.percent + '% done')
        })
        .on('end', function (err, stdout, stderr) {
            console.log('Finished processing!', err, stdout, stderr)
        })
        .run()*/


    /*var infs = new ffmpeg
    infs.addInput(path.join(__dirname, '../public/uploads/' + req.file.filename)).outputOptions([
        '-map 0:v',
        '-map 0:a:0',
        //'-map 0:a:1',
        '-s:v:0 2160x3840',
        '-c:v:0 libx264',
        '-b:v:0 2000k',
        "-var_stream_map", 'v:0,a:0 v:1,a:1',
        '-master_pl_name master.m3u8',
        '-f hls',
        '-hls_time 1',
        '-hls_list_size 0',
        '-hls_segment_filename', '"v%v/fileSequence%d.ts"'
    ]).output(path.join(__dirname, `../public/uploads/${id}/v${id}.m3u8`))
        .on('start', function (commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('error', function (err, stdout, stderr) {
            console.log('An error occurred: ' + err.message, err, stderr);
        })
        .on('progress', function (progress) {
            console.log('Processing: ' + progress.percent + '% done')
        })
        .on('end', function (err, stdout, stderr) {
            console.log('Finished processing!', err, stdout, stderr)
        })
        .run()*/

});

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});
function Moneda(valor) {
    valor = valor.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    valor = valor.split('').reverse().join('').replace(/^[\.]/, '');
    return valor;
}
var Normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
        to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNnCc",
        mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
        mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
        var ret = [];
        for (var i = 0, j = str.length; i < j; i++) {
            var c = str.charAt(i);
            if (mapping.hasOwnProperty(str.charAt(i)))
                ret.push(mapping[c]);
            else
                ret.push(c);
        }
        return ret.join('');
    }

})();
function ID(lon) {
    let chars = "a0b1c2d3-e4f5g6h7i8j9k0z-1l2m3n4o-5p6q7r8s9-t0u1v2w3x4y",
        code = "";
    for (x = 0; x < lon; x++) {
        let rand = Math.floor(Math.random() * chars.length);
        code += chars.substr(rand, 1);
    };
    return code;
};
module.exports = router;