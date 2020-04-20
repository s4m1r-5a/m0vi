const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const val = require('../navegacion.js');
const sms = require('./sms.js');
const { database, Contactos } = require('./keys');
const crypto = require('crypto')
const nodemailer = require('nodemailer')
//const fileUpload = require('express-fileupload');
const multer = require('multer');
const uuid = require('uuid/v4');


const transpoter = nodemailer.createTransport({
  host: 'smtp.hostinger.co',
  port: 587,
  secure: false,
  auth: {
    user: 'suport@tqtravel.co',
    pass: '123456789'
  },
  tls: {
    rejectUnauthorized: false
  }
})

// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');
///////////////////////////////////////////////////////////////////////////////////////////////////////





// Multer Middlwares - Creates the folder if doesn't exists
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename: (req, file, cb) => {
    cb(null, ID(34) + path.extname(file.originalname));
  }
});

app.use(multer({
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
}).single('image'));





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Middlewares : significa cada ves que el usuario envia una peticion
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/temp/"
}));*/
app.use(session({
  secret: 'faztmysqlnodemysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.info = req.flash('info');
  app.locals.warning = req.flash('warning');
  app.locals.error = req.flash('error');
  app.locals.regis = req.regis;
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));
app.use('/admin', require('./routes/admin'));
app.use(require('../navegacion'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));

});

function ID(lon) {
  let chars = "a0b1c2d3-e4f5g6h7i8j9k0z-1l2m3n4o-5p6q7r8s9-t0u1v2w3x4y",
    code = "";
  for (x = 0; x < lon; x++) {
    let rand = Math.floor(Math.random() * chars.length);
    code += chars.substr(rand, 1);
  };
  return code;
};

/*try {
  var process = new ffmpeg('/path/to/your_movie.avi');
  process.then(function (video) {
    // Video metadata
    video
      .setVideoSize('640x?', true, true, '#fff')
      .setAudioCodec('libfaac')
      .setAudioChannels(2)
      .save('/path/to/save/your_movie.avi', function (error, file) {
        if (!error)
          console.log('Video file: ' + file);
      })
  }, function (err) {
    console.log('Error: ' + err);
  });
} catch (e) {
  console.log(e.code);
  console.log(e.msg);
}*/





/*
function listConnectionNames(auth) {
  const service = google.people({ version: 'v1', auth });
  service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 10,
    personFields: 'names,emailAddresses,events,addresses,residences,phoneNumbers,organizations,ageRanges',
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const connections = res.data.connections;
    if (connections) {
      connections.forEach((person) => {
        //console.log(person);
        if (person.names && person.organizations && person.organizations[0].name === 'RedFlix' && person.phoneNumbers && person.phoneNumbers.length > 0) {
          console.log(person.names[0].displayName, person.phoneNumbers[0].canonicalForm, person.organizations[0].name);
        } else {
          console.log('No display name found for connection.');
        }
      });
    } else {
      console.log('No connections found.');
    }
  });
}
function crearcontacto(auth) {
  const service = google.people({ version: 'v1', auth });
  service.people.createContact({
    "resource": {
      "names": [
        {
          "familyName": "euliecer gaitan"
        }
      ],
      "emailAddresses": [
        {
          "value": "euliecer@yopmail.com"
        }
      ],
      "phoneNumbers": [
        {
          "value": "3007753982",
          "type": "Personal"
        }
      ],
      "organizations": [
        {
          "name": "RedFlix",
          "title": "Cliente"
        }
      ]
    }
  }, (err, res) => {
    if (err) return console.error('La API devolvió un ' + err);
    console.log("Response", res);
  });
}
function consultar(auth) {
  const service = google.people({ version: 'v1', auth });
  service.people.get({
    resourceName: 'people/c4346095922586713777',
    personFields: 'names,emailAddresses,events,addresses,residences,phoneNumbers,organizations,ageRanges',
  }, (err, res) => {
    if (err) return console.error('La API devolvió un ' + err);
    console.log("Persona", res.data.resourceName);
  });
}*/