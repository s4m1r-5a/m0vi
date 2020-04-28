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

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");


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
    console.log(req.body)
    res.send(true)
    /*const storage = multer.diskStorage({
        destination: path.join(__dirname, 'public/uploads'),
        filename: (req, file, cb) => {
            cb(null, ID(34) + path.extname(file.originalname));
        }
    });

    multer({
        storage,
        dest: path.join(__dirname, 'public/uploads'),
        fileFilter: function (req, file, cb) {

            var filetypes = /jpeg|jpg|png|gif|mkv|mp4|x-matroska|video/;
            var mimetype = filetypes.test(file.mimetype);
            var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

            if (mimetype && extname) {
                return cb(null, true);
            }
            cb("Error: File upload only supports the following filetypes - " + filetypes);
        },
        limits: { fileSize: 2062191114 },
    }).single('image');



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
            res.json(req.body)
        })
        .run()*/

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