var dt=null;
function initTable(dataset){
	
	if(dt==null){
	$('#dataTableDiv').removeClass('d-none');
	$('#infoDiv').removeClass('d-none');
	
    dt = $('#dataTable').DataTable( {
		"language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Polish.json"
        },
        data: dataset,
		ordering: false,
        searching: true,
        columns: [
            { title: "Dzień" },
            { title: "IL1 [A]" },
			{ title: "Δ% IL1" },
            { title: "IL2 [A]" },
			{ title: "Δ% IL2" },
            { title: "IL3 [A]" },
			{ title: "Δ% IL3" },
			{ title: "Temp [°C]" },
			{ title: "Δ% Temp" },
			{ title: "UL1 [V]" },
			{ title: "Δ% UL1" },
			{ title: "UL2 [V]" },
			{ title: "Δ% UL2" },
			{ title: "UL3 [V]" },
			{ title: "Δ% UL3" },



        ]
    } );
	
	}else{
		
	    dt.clear();
		dt.rows.add(dataset);
		dt.draw();
		
	}
	
	
	
}


