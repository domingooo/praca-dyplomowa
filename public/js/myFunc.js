var labele = ["Timestamp", "ID", "Prąd IL1", "Prąd IL2", "Prąd IL3", "Temperatura", "Napięcie UL1", "Napięcie UL2", "Napięcie UL3", "Moc PL1", "Moc PL2", "Moc PL3", "Moc QL1", "Moc QL2", "Moc QL3", "Moc SL1", "Moc SL2", "Moc SL3", "cos φ L1", "cos φ L2", "cos φ L3", "Energia L1", "Energia L2", "Energia L3", "Przysp X", "Przysp Y", "Przysp Z"];
SocketAddress='192.168.0.101';

function prepCard(dev){
	var txt='';

	var onoff='';
	var border='';
	var txtStatus='';
	var lastonline='';
	var join='';

	if(dev.active){
		border='success';
		txtStatus='Aktywne';
		onoff='on';
		lastonline='Teraz';
		join=getDateStr(dev.joinTimestamp).time;
		
	}else{
		border='secondary';
		txtStatus='Nieaktywne';
		onoff='off';
		lastonline=getDateStr(dev.lastBroadcast).time;
		join=getDateStr(dev.joinTimestamp).time;
	}



     txt='  <div arduinoId="'+dev.id+'" class="arduino-block col-xl-3 col-md-6 mb-4"> \
              <div class="card border-left-'+border+' shadow"> \
					<img class="card-img-top mx-auto element" src="img/arduino_'+onoff+'.png" alt="..."> \
					<div class="card-body"> \
						<h5 class="card-title text-primary">Urządzenie ID: '+dev.ardId+'</h5> \
						<p class="card-text mb-0">IP: <span class="pl-2">'+dev.ip+' ('+dev.port+')</span></p> \
						<p data-toggle="tooltip" title="Hooray!" class="card-text mb-0">Status: <span class="pl-2 text-'+border+'">'+txtStatus+'</span></p> \
						<p class="card-text mb-0">Dołączyło: <span class="pl-2">'+join+'</span></p> \
						<p class="card-text mb-0">Ostatnio online: <span class="pl-2">'+lastonline+'</span></p> \
					</div> \
					<a class="card-footer d-flex align-items-center justify-content-between" href="/dashboard?id='+dev.id+'">Dashboard<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a> \
              </div> \
            </div>';	  

	return txt;

}

function getDateStr(seed){ 
 var DayName = ["niedziela ","poniedziałek ","wtorek ","środa ","czwartek " ,"piątek ","sobota "];
 var MonthName = ["Stycznia","Lutego", "Marca","Kwietnia","Maja","Czerwca","Lipca","Sierpnia","Września","Października", "Listopada","Grudnia"];

 var Today = (typeof seed !== 'undefined') ?  new Date(seed) : new Date();
 var WeekDay = Today.getDay() 
 var Month = Today.getMonth() 
 var Day = Today.getDate() 
 var Year = Today.getFullYear() 
 var Hou = ("0" + (Today.getHours())).slice(-2);
 var Sec = ("0" + (Today.getSeconds())).slice(-2);
 var Min = ("0" + (Today.getMinutes())).slice(-2);
 var Mil = (1000 + Today.getMilliseconds()).toString().substr(1);

 return {day:DayName[WeekDay],
		time:Hou+":"+Min+":"+Sec,
		date:Day + " " + MonthName[Month] + ", " + Year,
		full:Hou+":"+Min+":"+Sec+'.'+Mil};
} 

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
}




$( document ).ready(function() {

	$("input[type^='search']").on('input', function() { 
		$('#content').unhighlight();
		$('#content').highlight($(this).val());
	});

	$("#userDropdown").children().first().text(readCookie("user"));
	
	$("#alertsDropdown").on('click', function() { 
		alertsCount=0;
		updateAletrsInfo();
	});
	
	setInterval(function(){ 
		var dateStr = getDateStr();
		$( "div[class^='small']" ).not("div.text-gray-500").html('<span class="font-weight-500 text-primary">'+dateStr.day+'</span> · '+dateStr.date+' · '+dateStr.time);
	}, 500);

});


jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);

    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};



var alertsCount=0;
function updateAletrsInfo(){
	if(alertsCount==0)
		$("#alertsDropdown").children().last().text("");
	else if(alertsCount<=2) 
		$("#alertsDropdown").children().last().text(alertsCount);
	else 
		$("#alertsDropdown").children().last().text("3+");
}

function addAlert(type, txt){
	if(typeof type == 'undefined' || typeof txt == 'undefined') return false;
	var txt_type ='';
	var txt_icon ='';
	
	switch(type){
    case 0:							//info
        txt_type ='info'
		txt_icon ='info';
        break;
    case 1:							//warning
        txt_type ='warning'
		txt_icon ='exclamation';
        break;
    case 2:							//success
        txt_type ='success'
		txt_icon ='check';
        break;
    case 3:							//danger
        txt_type ='danger'
		txt_icon ='radiation';
        break;
    default:	
		txt_type ='secondary';
		txt_icon ='desktop';
        
}
	
	
	if($("#droplist").children("a").length>=3) 
		$("#droplist").children("a").first().remove();

	var html='<a class="dropdown-item d-flex align-items-center" href="#"> \
			  <div class="mr-3"> \
				<div class="icon-circle bg-'+txt_type+'"> \
				  <i class="fas fa-'+txt_icon+' text-white"></i> \
				</div> \
			  </div> \
			  <div> \
				<div class="small text-gray-500">Dziś, '+getDateStr().time+'</div> \
				<span class="font-weight-bold">'+txt+'</span> \
			  </div> \
			</a>';
	
	alertsCount++;
	if(alertsCount<=2)
		$("#alertsDropdown").children().last().text(alertsCount);
	else 
		$("#alertsDropdown").children().last().text("3+");
	
	$("#droplist").append(html);
}

function checkMobile(){
	var isMobile = false; //initiate as false
	// device detection
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
		|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
		isMobile = true;
	}
	return isMobile;
}



//---------------------------------------

  function getListFiles(){
  
	$.ajax({
		url         : "http://"+SocketAddress+":80/tables.html", //gdzie się łączymy
		method      : "post",
		dataType    : "json", 
		data        : {file : "list"},
		success : function(res) {
			items=JSON.parse(res);
			
			for(i=0;i<items.length;i++){
				
				var txt = "Plik: "+'\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + items[i].filename + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+" Rozmiar: "+'\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + items[i].size+'MB';
				
				//jeśli małe urządzenie to tylko nazwa pliku w select
				if(checkMobile()){
					txt=items[i].filename;
				}
			
				$('#Select1').append($("<option>", { 
					value: items[i].filename,
					text : txt 
				}));
			}
		},
		error : function() {
			alert("Wystąpił problem z pobraniem listy plików!");
			items=[];
		}
	});
  
  }
  
  //---------------------------------------
  
    function getFileTxt(plik,func,dest){
  
		$.ajax({
			xhr: function() {
				var xhr = new window.XMLHttpRequest();

			   xhr.addEventListener("progress", function(evt) {
				   if (evt.lengthComputable) {
					   var percentComplete = ((evt.loaded / evt.total)*100).toFixed(0);
					   
					   $("#downloadProg").text(percentComplete+'%');
					   $("#downloadProg").width(percentComplete+'%');
				   }
			   }, false);

			   return xhr;
			},
			type: 'POST',
			url         : "http://"+SocketAddress+":80/tables.html",
			method      : "post", 
			dataType    : "json", 
			data        : {getFile : plik},
			success : function(splited) {

				//split na linie
				var splited=splited.txt.split('\n');
				
				//usuwanie pustych wierszy
				if(splited[0]=="") splited.shift();
				if(splited[splited.length-1]=="") splited.splice(-1,1);
				
				//split wierszy
				for(j=0;j<splited.length;j++){
					splited[j]=splited[j].split("#");
					
					if(dest=="highchart"){
						
						for(k=0;k<splited[j].length;k++)				//pętla na konwersję do zmiennoprzecinkowych na potrzeby hCh				
							splited[j][k]=parseFloat(splited[j][k]);
					
					}else if(dest=="datatable"){
						splited[j][0]=getDateStr(parseInt(splited[j][0])).full;	
						
					}else if(dest=="daily"){
						for(k=1;k<splited[j].length;k++)				//pętla na konwersję do zmiennoprzecinkowych na potrzeby hCh				
							splited[j][k]=parseFloat(splited[j][k]);
						
					}
					
				}
				
				
				//funkcja po załadowaniu
				func(splited);
				setTimeout(function(){$("#Loading").fadeOut('fast');$("#downloadProg").width('0%');},2000);
			},
			error : function() {
				alert("Wystąpił problem podczas ładowania pliku!");
			}
		});

  }
  
 
 
 function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}


function proc(a, b, c){

	var a = parseFloat(a);
	var b = parseFloat(b);
	var c = parseFloat(c);
	var sum = a+b+c;

	a=100*a/sum;
	b=100*b/sum;
	c=100*c/sum;

	return [a.toFixed(1), b.toFixed(1), c.toFixed(1)];
}

	