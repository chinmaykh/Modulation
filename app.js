// PROJECT SH 01 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Import Mongoose package
const mongoose = require('mongoose');
// Connect to Mongoose
var url = 'mongodb://localhost/' + 'test'
var uri = 'mongodb+srv://chinmaykh:chinmaykh@stud-port-wu9oe.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(uri, {
	useUnifiedTopology:true,
	useNewUrlParser:true
});

var conn = mongoose.connection;
const nodemailer = require('nodemailer');
// var fileupload = require("express-fileupload");
// var Grid = require('gridfs-stream');
// Grid.mongo = mongoose.mongo;

app.use(express.static(__dirname +'/Front_end'));		//static public directory to be used
app.use(bodyParser.json()); // Bddy Parser initilization
// app.use(fileupload());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


// ObjectName = require('./models/NameOfFile)
unit = require('./models/unit.js')


conn.once('open', function () {
	// var gfs = Grid(conn.db);

	//-----------------------------MAIL OPTIONS-------------------------------------------

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'storytrail.chinmaykh@gmail.com', // Username
			pass: 'story_trail' // pWord
		}
	});


	// FILE UPLOADS
	function cmon(req, res) {
		console.log(req.body.usrnam)
		var part = req.files.file;
		var writeStream = gfs.createWriteStream({
			filename: part.name,
			mode: 'w',
			content_type: part.mimetype,
			metadata: { // Optional use json format
			}
		});
		writeStream.on('close', function (response) {
			return res.status(200).send({
				message: 'Success',
				fileUploadId: response._id
			});
		});
		writeStream.write(part.data);
		writeStream.end();
	}

	// FILE DOWNLOAD GATEWAY
	function getFiles(req, res) {

		var readstream = gfs.createReadStream({
			_id: req
		});
		readstream.pipe(res);

	}

	// FILE QUERY PATHWAY

	function findFiles(req, res, pram) {

		gfs.files.find({ filename: pram }).toArray(function (err, files) {
			if (err) {
				return res.status(400).send(err);
			}
			else if (!files.length === 0) {
				return res.status(400).send({
					message: 'File not found'
				});
			}
			res.json(files);
		});


	}

	// FILE UPLOAD URL
	app.post('/upload', (req, res) => {
		console.log(req.files)
		cmon(req, res);
	});

	// FILE DOWNLOAD URL
	app.get('/files/:id', (req, res) => {
		getFiles(req.params.id, res);
	});

	// FILE QUERY URL
	app.post('/findMyFiles/', (req, res) => {
		var param = req.body.param;
		findFiles(req, res, param);
	});


	// App intro       

	app.get('/intro',(req,res)=>{
		res.sendFile(__dirname + '/Front_end/views/intro.html')
	})

	//----- Feedback -----

	// Enclose this in a proper route provider

	//  var mailOptions = {
	// 	from: 'svnpsrnr@gmail.com',
	// 	to: ['chinmayharitas@gmail.com'],
	// 	subject: 'Feedback !',
	// 	text: JSON.stringify(fbbbb)


	// transporter.sendMail(mailOptions, function (error, info) {

	// 	if (error) {
	// 		console.log(error);
	// 		console.log("Check for security permission from google");
	// 	} else {
	// 		console.log('Email sent: ' + info.response);
	// 	}
	// });


	//--------------------------------------------------Admin--------------------------------------------------------------------------------------

	// app.get('/list/Admins', (req, res) => {

	// 	Admin.getAdmins((err, creds) => {
	// 		if (err) {
	// 			throw err;
	// 		}
	// 		res.json(creds);
	// 	});
	// });

	app.get('/sc', (req, res) => {
		console.log('Server Success');
		res.send('SC');
	})

	// Units

	// Creating units
	app.post('/api/create/unit',(req,res)=>{
		logger(req.body,'Unit creation')
		unit.addUnit(req.body,(err,data)=>{
			if(err) throw{err}
			// What to do next ?
			// Update the parent module !
		})
		res.send('OKAY')
	})

	// Get unit by ID
	app.get('/api/get/unit',(req,res)=>{
		logger(req.query._id,'Get unit')
		unit.getUnitById(req.query._id,(err,data)=>{
			if(err) throw err;
			res.send(data)
			console.log(data)
		})
	})

	//Get unit by param
	app.get('/api/get/unit/param',(req,res)=>{
		logger(req.query,'Parametric search')
		try {
			unit.getUnitByParam(req.query,(err,data)=>{
				if(err) throw err;
				res.send(data)
			})
		} catch (error) {
			res.send(error)
		}
	})

	app.put('/api/update/unit',(req,res)=>{
		console.log(req.body)
		unit.updateUnit(req.body,(err,data)=>{
			if(err) throw err;
			res.send(data)
		})
	})

	app.get('/api/module/:name',(req,res)=>{
		console.log(req.url)
		res.sendFile(__dirname+'/Front_end/module.html')
	})

	function logger(body,endPointName) {
		console.log('--------------------------\n'+endPointName+' endpoint\n')
		console.log('Unit Preview')
		console.log(body)
		console.log('--------------------------')
	}

	app.listen(8080,(e)=>{
		console.log('Server is running on port '+8080)
	})
});


