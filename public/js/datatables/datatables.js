var dt=null;
function initTable(dataset){
	
	if(dt==null){
	$('#dataTableDiv').removeClass('d-none');
	
    dt = $('#dataTable').DataTable( {
		
        data: dataset,
		ordering: false,
            deferRender:    true,
            scrollY:        400,
            scroller:       true,
			scroller: {
            loadingIndicator: true
        },
			"bLengthChange": false,
        searching: false,
        columns: [
            { title: "Czas" },
             { "visible": false, "targets": 0 },
            { title: "IL1" },
            { title: "IL2" },
            { title: "IL3" },
            { title: "Temp" },
			{ title: "UL1" },
			{ title: "UL2" },
			{ title: "UL3" },
			{ title: "PL1" },
			{ title: "PL2" },
			{ title: "PL3" },
			{ title: "QL1" },
			{ title: "QL2" },
			{ title: "QL3" },
			{ title: "SL1" },
			{ title: "SL2" },
			{ title: "SL3" },
			{ title: "cos L1" },
			{ title: "cos L2" },
			{ title: "cos L3" },		
	{ "visible": false, "targets": 0 },
	{ "visible": false, "targets": 0 },
	{ "visible": false, "targets": 0 },
	{ "visible": false, "targets": 0 },
	{ "visible": false, "targets": 0 },
	{ "visible": false, "targets": 0 },
			

			
        ]
    } );
	
	}else{
		
	    dt.clear();
		dt.rows.add(dataset);
		dt.draw();
		
	}
	
	
	
}


