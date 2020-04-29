var socket = io.connect(SocketAddress);

socket.on('ArduinoConnect', function (data) {	//nowy nadajnik
	data = JSON.parse(data);

	addAlert(0,"Dołączyło nowe urządzenie!");
	
	//sidebar
	$("#collapseTwo").find("span").remove()
	$("#collapseTwo").children().first().append('<a class="collapse-item" href="/dashboard?id='+data.id+'">Urządzenie ID: '+data.ardId+' </a>');
});



socket.on('ArduinoChangeStatus', function (data) {	//nadajnik zmienił status
	
	addAlert(0,"Rejestrator zmienił status!");

});

socket.on('danger', function (data) {	//alarm sprzetowy
	data=JSON.parse(data);

	var txt='';
	if(data.alertType==4) txt+= "Wysoka temperatura "+data.val+"°C na urządzeniu ID: "+data.id;
	else if(data.alertType==3) txt+= "Wysokie napięcie "+data.val+" na urządzeniu ID: "+data.id+" w fazie L"+data.phase;
	else if(data.alertType==2) txt+= "Wysoki prąd "+data.val+" na urządzeniu ID: "+data.id+" w fazie L"+data.phase;
	
	addAlert(3,txt);
});


socket.on('oldData', function (data) {	//pierwsza paczka danych
	data = JSON.parse(data);

	if(data.length>0){

		$("#collapseTwo").find("span").remove();
		
		for (var i = 0; i < data.length; i++) {
			
			//menu sidebar
			$("#collapseTwo").children().first().append('<a class="collapse-item" href="/dashboard?id='+data[i].id+'">Urządzenie ID: '+data[i].ardId+' </a>');
		}
	}
	

});