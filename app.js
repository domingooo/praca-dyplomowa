var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var dateFormat = require('dateformat');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ip = require("ip");

//====================================================================================
// CONFIG:
//====================================================================================

var db_config = {
	host     : '',
	user     : '',
	password : '',
	database : ''
};

var connection;
var activeSockets=[];

// Konfiguracja SOCKET UDP:
var PORT = 6000;
var HOST = '136.243.156.120';//ip.address();	//'192.168.0.101';

// Konfiguracja SOCKET.IO:
var address = HOST;
var port2 = process.env.PORT || 80;

//====================================================================================
// STARTUP:
//====================================================================================

var schedule = require('node-schedule');
var j = schedule.scheduleJob('* 1 * * * *', function(){ 
	createDailyLog();
	console.log('Tworzę dzienny log - wywołanie node-schendule!');
})

handleDisconnect();

app.use(express.static('public'))
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//====================================================================================
// INDEX
//====================================================================================

app.get('/index.html', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/index.html',request.session.username);
	} else {
		response.redirect("/forbiden.html");
	}
	//response.end();
});

app.get('/', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/index.html');
	} else {
		response.redirect("/forbiden.html");
	}
	//response.end();
});

app.get('/logout',function(req,res){    
    req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            res.redirect('/login.html');  
        }  
    });  
}); 

app.get('/forbiden.html', function (req, res) {
  res.sendFile(__dirname + '/forbiden.html');
});

app.get('/login.html', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.get('/dashboard', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/dash.html');
	} else {
		response.redirect("/forbiden.html");
	}
  
});

app.get('/tables.html', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/tables.html');

	} else {
		response.redirect("/forbiden.html");
	}
  
});

app.get('/fft.html', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/fft.html');

	} else {
		response.redirect("/forbiden.html");
	}
  
});

app.post('/tables.html', function (request, response) {

		if (request.session.loggedin) {
			
			if(request.body.file=='list'){

				var files = fs.readdirSync(__dirname);
				var path = require('path');
				var filesOutput=[];
				for(var i in files) {
					if(path.extname(files[i]) === ".txt" && files[i].indexOf('arduino') !== -1 ) {

						filesOutput.push({filename:files[i],size:getFilesizeInBytes(files[i])});
					}
				}
				
				response.json(JSON.stringify(filesOutput));
			}
			else if(request.body.getFile!=null){
				
				var filename = request.body.getFile;

				var data = fs.readFileSync(filename);
				data=data.toString('utf8');
				response.json({txt:data});
			
			
			}
			
		}
		
  
});

app.get('/charts.html', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/charts.html');
	} else {
		response.redirect("/forbiden.html");
	}
  
});

app.get('/dailyStats.html', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/dailyStats.html');
	} else {
		response.redirect("/forbiden.html");
	}
  
});

app.get('/help.html', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/help.html');
	} else {
		response.redirect("/forbiden.html");
	}
  
});

app.get('/vibra.html', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/vibra.html');
	} else {
		response.redirect("/forbiden.html");
	}
  
});

app.post('/login.html', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				logToFile(0,username);
				request.session.loggedin = true;
				request.session.username = username;
				response.cookie('user', username)
				response.status(200).send("/index.html");
			} else {
				logToFile(1,username);
				response.status(403);
			}			
			response.end();
		});
	} else {
		  response.status(403);
		response.end();
	}
});

app.get('/alerts.html', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/alerts.html');
	} else {
		response.redirect("/forbiden.html");
	}
  
});

app.get('/export.html', function (request, response) {
	if (request.session.loggedin) {
		response.sendFile(__dirname + '/export.html');
	} else {
		response.redirect("/forbiden.html");
	}
  
});

app.get('/download', function(request, response){
	if (request.session.loggedin) {

		var file = request.query.file;
			
		if(file.indexOf(".txt")!=-1){
			

			fs.access(file, fs.F_OK, (err) => {
				  if (err) {
					response.send(200, '');
					return
				  }

				response.download(file);
			});
		}else{
			response.send(200, '');
		}
	}
});

//====================================================================================
// SOCKET.IO:
//====================================================================================

server.listen(port2);

io.on('connection', function (socket) {
	var tempTab=[];
	console.log("Dołączył nowy dashboard");
	
	activeSockets.forEach(function(item, index) {
		tempTab.push(activeSockets[index].getExported());
	});
	
	socket.emit('oldData', JSON.stringify(tempTab));
	  
  

	socket.on('disconnect', (reason) => {
	  ;//console.log("Dashboard rozłączony: "+reason);
	});

});

//====================================================================================
//SERWER UDP - DO ARDUINO
//====================================================================================

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var md5 = require('md5');

server.on('listening', function() {
  var address = server.address();
  console.log('UDP Server - nasłuchuje: ' + address.address + ':' + address.port);
});

server.on('message', function(message, remote) {	//przyszła paczka danych od arduino
	
   var timestamp = Date.now();
   message=ab2str(message);
   message=timestamp+message;
   var splited= message.split("#");
   var arduinoIdtxt=splited[1];

    for(i=0;i<splited.length;i++)
		splited[i]=parseFloat(splited[i]);
	var arduinoId=splited[1];
	
	
  var isFFT = arduinoIdtxt.indexOf('fft');
  
  
   
   
   if(isFFT!=-1){
	   console.log("fftconsole");
	   console.log(message);
		fs.appendFileSync('fftLogs.txt', message + "\n"); // zapis do pliku 
	   
   }
   
   
   if(Number.isInteger(arduinoId)){
	   
	   //tablica urządzeń
	   var id = md5(remote.address+"-"+arduinoId)
	   var i = activeSockets.getIndex(id);
	   
	   if(i!=-1){											//już było widziane -> odśwież
			activeSockets[i].refresh();
			activeSockets[i].addNewData(message);
	   }else{														//nowe urządzenie -> dodaj do tablicy
		   var dev = new Device(remote.address, remote.port, arduinoId);
		   dev.addNewData(message);
		   activeSockets.push(dev);
		   console.log("Nowe arduino dodane do tablicy");
		   
		   io.emit('ArduinoConnect', JSON.stringify(dev.getExported()));
	   }


		fs.appendFileSync('arduino-'+arduinoId+'_log_'+dateFormat(new Date(), "dd-mm-yyyy")+'.txt', message + "\n"); // zapis do pliku ~2ms

		io.emit('newData', JSON.stringify({mdid:id,mes:message}));
		
		// SPRAWDZANIE CZY NIE PRZEKRACZA DOPUSZCZALNYCH WARTOŚCI
		var maxValues = {current:25,voltage:250,temp:110};
		for(i=0;i<3;i++){
			
			
			//sprawdzanie prądów
			if(splited[2+i]>maxValues.current){
				
				ph=i+1;
				logToFile(2,{phase:ph,id:arduinoId,val:splited[2+i]});
				io.emit('danger', JSON.stringify({alertType:2,phase:ph,id:arduinoId,val:splited[2+i]}));	
			}
			//sprawdzanie napięć
			if(splited[6+i]>maxValues.voltage){
				
				ph=i+1;
				logToFile(3,{phase:ph,id:arduinoId,val:splited[6+i]});
				io.emit('danger', JSON.stringify({alertType:3,phase:ph,id:arduinoId,val:splited[6+i]}));	
			}
		}
		//sprawdzanie temperatury
		if(splited[5]>maxValues.temp){
			
			logToFile(4,{id:arduinoId,val:splited[5]});
			io.emit('danger', JSON.stringify({alertType:4,id:arduinoId,val:splited[5]}));	
		}
	
   }

});

server.bind(PORT, HOST);

//====================================================================================
// Klasy i funkcje dodatkowe
//====================================================================================
class Device {
	
  constructor(ip, port, aid) {
	this.id = md5(ip+"-"+aid);
	this.ip = ip;
	this.active = true;
	this.port = port;
	this.joinTimestamp = Date.now();
	this.lastBroadcast = Date.now();
	this.lastData = [];
	this.timeout = this.setNewTimeout();
	this.ardId = aid;
	
  }
  
  addNewData(newData){
	  
	  if(this.lastData.length>=30) 
		this.lastData.splice(0,1);
	
	  this.lastData.push(newData);
	  
  }
  
  refresh(){
	  
	if(this.active==false){
		this.active=true;
		var tmp=this;
		console.log("Nadajnik zmienia status: online");
		//console.log(JSON.stringify(tmp.getExported()));
		io.emit('ArduinoChangeStatus', JSON.stringify(this.getExported()));
	}
	  
	
	this.lastBroadcast = Date.now();
	
	clearTimeout(this.timeout);
	this.timeout = this.setNewTimeout();
	
  }
  
    setNewTimeout(){
	var tmp=this;
	return setTimeout(function(){ 
		tmp.active=false; 
		console.log("Nadajnik zmienia status: offline");
		io.emit('ArduinoChangeStatus', JSON.stringify(tmp.getExported()));
	}, 3000);
  }


  getExported(){
	return {
		id:this.id,
		ip:this.ip,
		active:this.active,
		port:this.port,
		joinTimestamp:this.joinTimestamp,
		lastBroadcast:this.lastBroadcast,
		lastData:this.lastData,
		ardId:this.ardId
	};
	  
  }


}

activeSockets.getIndex = function(devId) {
	var found = -1;
	for(var i = 0; i < activeSockets.length; i++) {
		if (activeSockets[i].id == devId) {
			found = i;
			break;
		}
	}
	return found;
}

function logToFile(type, data) {

	var message='';

	var time = dateFormat(new Date(), "dd-mm-yyyy HH:mm:ss")
	
	message+=time+"#"+type+"#";
	
	switch(type){
    case 0:							//nowe logowanie do panelu administracyjnego
        message +='Pomyślne logowanie do panelu obsługi. Użytkownik: '+data+'';
        break;
    case 1:							//nowe logowanie do panelu administracyjnego
        message +='Nieudana próba logowania do panelu obsługi! Użytkownik: '+data;
        break;
	case 2:
		message +='Wysoki prąd w fazie: '+data.phase+' na rejestratorze o numerze ID: '+data.id+'. Zarejestrowana wartość prądu: '+data.val;
		break;
	case 3:
		message +='Wysokie napięcie w fazie: '+data.phase+' na rejestratorze o numerze ID: '+data.id+'. Zarejestrowana wartość napięcia: '+data.val;
		break;
	case 4:
		message +='Wysokia temperatura na rejestratorze o numerze ID: '+data.id+'. Zarejestrowana wartość temperatury: '+data.val;
		break;
	}
		
	fs.appendFileSync('EventsLog.txt', message + "\n"); 

}

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats["size"];
    return (fileSizeInBytes/1000000).toFixed(3);
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function createDailyLog(){
	var logFile="dailyLog.txt";
	
	var files = fs.readdirSync(__dirname);
	var path = require('path');
	var filesOutput=[];
	for(var i in files) {
		if(path.extname(files[i]) === ".txt" && files[i].indexOf('arduino') !== -1 ) {
	
			filesOutput.push(files[i]);
		}
	}

	//odczytywanie pliku dailyLog
	var data = fs.readFileSync(logFile);	//czytanie zawartości dailyLog
	data=data.toString('utf8');
	
	//split na linie
	var splited=data.split('\n');
	
	//usuwanie pustych wierszy 
	if(splited[0]=="") splited.shift();
	if(splited[splited.length-1]=="") splited.splice(splited.length-1,1);

	var today = dateFormat(new Date(), "dd-mm-yyyy");
	
	//usunąć wszystkie z dzisiejszym dniem
	for(j=0;j<filesOutput.length;j++)
		if(filesOutput[j].indexOf(today)!=-1)
			filesOutput.splice(j, 1);
	
	//split wierszy
	for(j=0;j<splited.length;j++){
		splited[j]=splited[j].split("#");	
		var tmpFileName = "arduino-"+splited[j][1]+"_log_"+splited[j][0]+".txt";
		var index = filesOutput.indexOf(tmpFileName);
		console.log(tmpFileName);
		if(index!=-1)
			filesOutput.splice(index, 1);

	}
	
	console.log("dailyLog: Pliki gotowe do wyznaczenia średnich wartości dziennych: "+filesOutput);

	for(j=0;j<filesOutput.length;j++){
		
		//odczytywanie pliku dailyLog
		var dataTmp = fs.readFileSync(filesOutput[j]);	//czytanie zawartości dailyLog
		dataTmp=dataTmp.toString('utf8');
		
		//split na linie
		var dataTmp=dataTmp.split('\n');
		var totalLinesNumber = dataTmp.length;
		
		for(i=0;i<dataTmp.length;i++){
			
			//split wierszy na komórki
			dataTmp[i]=dataTmp[i].split("#");

			//ustalenie typu float komórek
			for(k=2;k<dataTmp[i].length;k++){
				dataTmp[i][k]=parseFloat(dataTmp[i][k]);
				dataTmp[0][k]+=dataTmp[i][k];
			}
		}
		
		console.log(filesOutput);
		
		
		var dateFromFilename=filesOutput[j].replace(".txt","");
		dateFromFilename=dateFromFilename.split("_");
		dateFromFilename = dateFromFilename[dateFromFilename.length-1];
		
		dataTmp[0][0]=dateFromFilename;
	
		var msg=dataTmp[0][0] +"#"+ dataTmp[0][1];

		
		for(k=2;k<dataTmp[0].length;k++){
			dataTmp[0][k]=(dataTmp[0][k]/totalLinesNumber).toFixed(2);
		
			msg+="#"+dataTmp[0][k];
		
		}
		
		fs.appendFileSync('dailyLog.txt', msg + "\n"); 
		
	}
	
}

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    //console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}
