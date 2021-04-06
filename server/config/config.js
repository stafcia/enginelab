///========================
//Puerto
//=========================
process.env.PORT = process.env.PORT || 3005;

///========================
//Entorno
//=========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/* ///========================
//DB
//=========================
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/bibliotecaCFDI';
    //urlDB = 'ds037407.mlab.com:37407';
} else {
    urlDB = process.env.MONGO_URI;
} */

///========================
//Vencimiento de TOKEN
//=========================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 60 * 24 * 30;


///========================
//Vencimiento de SEED
//=========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/* process.env.URLDB = urlDB; */