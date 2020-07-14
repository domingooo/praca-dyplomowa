var dt=null;
function initTable(dataset){

    dt = $('#dataTable').DataTable( {
		"language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Polish.json"
        },
        data: dataset,
        columns: [
            { title: "Data i czas wystąpienia" },
            { title: "Typ zgłoszenia" },
            { title: "Opis" },

        ]
    } );
	
	
	
	
}


