function calculateStatistics() {
	
  this.series.slice(0, this.series.length).forEach(series => { 
  
	if(series.name.indexOf("Navigator")!=-1 || series.visible==false) return;
    const data = series.points.filter(point => point.isInside).map(point => point.y); 
    
    const statistics = [
      series.options.data[series.options.data.length - 1][1],
      Math.max.apply(null, data).toFixed(2),
      Math.min.apply(null, data).toFixed(2),
      (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2)
    ];
    
    // construct the legend string
    const text = `${series.name}<br>Ostatnia wartość: ${statistics[0]} <br>Max: ${statistics[1]}<br>Min: ${statistics[2]}<br>Średnio: ${statistics[3]}`;

    series.legendItem.attr({
      text: text 
    });
  });
}

function showDataLabels() {
	Highcharts.charts[0].update({
		plotOptions: {
			series: {
				dataLabels: {
					enabled: true,
					formatter: function() {
						
/*					  //console.log(this);
						if (this.y == 24.4 || this.y == 22.7 || this.y == 0.8 || this.y == -5.8) {
							return this.y;
						} else {
							return null;
						}*/
			
			
					}
				}
			}
		}
	});
}




function getHighChartTitles(){
	
	chartTitle = "Wykres wybranych wartości: ";
	for(i=0;i<$("#checkboxDiv").find("input").length;i++)
		if($("#checkboxDiv").find("input")[i].checked==true)
			chartTitle += labele[i]+', ';
	
	chartTitle = chartTitle.substring(0,chartTitle.length-2);


	var filenameSplit = $('#Select1').val().split("_");
		chartSubtitle = "Dane zarejestrowano dnia: "+filenameSplit[filenameSplit.length-1].replace(".txt","")+' na rejestratorze o ID: '+filenameSplit[0];
		
		
	return {ct:chartTitle,cs:chartSubtitle};
}


var hCh = null;
function initHighChart(seriesSetting) {


    if (hCh == null) {
		
		var titles = getHighChartTitles();
		
		var mySeries = [];
		var title = "Wykres prezentujący przebieg ";

		for(i=0; i<seriesSetting.length; i++){
			mySeries.push({name: labele[seriesSetting[i]], data: splited[seriesSetting[i]], dataGrouping: {enabled: true}});

		}

        $('#dataTableDiv').removeClass('d-none');
		$('#datacheckboxDiv').removeClass('d-none');

        hCh = Highcharts.setOptions({
            time: {
                timezoneOffset: -2 * 60
            }
        });
        Highcharts.stockChart('container', {
            chart: {
                type: 'line',
                zoomType: 'x',
			    events: {
				    load: calculateStatistics,
					redraw: calculateStatistics
				}
            },
			
            navigator: {
                adaptToUpdatedData: false
            },
            scrollbar: {
                liveRedraw: true
            },
            title: {
                text: titles.ct
            },
            subtitle: {
                text: titles.cs
            },
            rangeSelector: {
                buttons: [{
                    type: 'hour',
                    count: 1,
                    text: '1h'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                inputEnabled: false, // it supports only days
                selected: 4 // all
            },

            xAxis: {
                events: {		
					afterSetExtremes: showDataLabels
                },
                minRange: 3600 * 1000 // one hour
            },

            yAxis: {
                floor: 0
            },
			legend: {
				enabled: true,
				labelFormatter: function() {
					return this.name + '<br>' + 'Ostatnia wartość: ' + '0.0' + ' ' + '<br>Max: ' + '0.0' + '<br>Min: ' + '0.0' + '<br>Średnio: ' + '0.0';
				}
			},
            series: mySeries
        });


    } else {		//odświeżanie datasetu
		
		for(i=0;i<Highcharts.charts[0].series.length;i++){
			
			if(Highcharts.charts[0].series[i].type!='areaspline'){
				
				var name=Highcharts.charts[0].series[i].name;
				var index = labele.indexOf(name);
				
				Highcharts.charts[0].series[i].setData(splited[index]);	
			}
		}
		
		var titles = getHighChartTitles();
		
		Highcharts.charts[0].setTitle({text: titles.ct});
		Highcharts.charts[0].setSubtitle({text: titles.cs});
		
		Highcharts.charts[0].redraw();
    }
}





