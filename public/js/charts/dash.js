// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}



function initCharts(ctxx, ds1, ds2, ds3, lb1, lb2, lb3){

	myLineChart = new Chart(ctxx, {
	  type: 'line',
	  data: {
		datasets: [{
			data: ds1,
			label:lb1,
			borderWidth:  2,
			backgroundColor: "rgba(78, 115, 223, 0.05)",
			borderColor: "rgba(78, 115, 223, 0.5)"
		},{
			data: ds2,
			label:lb2,
			borderWidth:  2,
		  backgroundColor: "rgba(28, 200, 138, 0.05)",
		  borderColor: "rgba(28, 200, 138, 0.5)"
		},{
			data: ds3,
			label:lb3,
			borderWidth:  2,
		  backgroundColor: "rgba(54, 185, 204, 0.05)",
		  borderColor: "rgba(54, 185, 204, 0.5)",
		}]
	  },
	  options: {
		scales: {
		  xAxes: [{
			type: 'realtime',
			realtime: {
				delay:1000
			}
		  }]
		}
	  },
	  
	});
	return myLineChart;
}



function initPieCharts(ctxz, ds, lb){

	 myPieChart = new Chart(ctxz, {
	  type: 'doughnut',
	  data: {
		labels: lb,
		datasets: [{
		  data: ds,
		  backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
		  hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
		  hoverBorderColor: "rgba(234, 236, 244, 0.8)",
		}],
	  },
	  options: {
		maintainAspectRatio: false,
		tooltips: {
		  backgroundColor: "rgb(255,255,255)",
		  bodyFontColor: "#858796",
		  borderColor: '#dddfeb',
		  borderWidth: 1,
		  xPadding: 15,
		  yPadding: 15,
		  displayColors: false,
		  caretPadding: 10,
		},
		tooltips: {
			enabled:false
		},
		legend: {
		  display: false
		},
		cutoutPercentage: 75,
	  },
	});
	return myPieChart;
}

