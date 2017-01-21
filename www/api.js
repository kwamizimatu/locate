 jQuery(document).ready(function(){
 
		
		$.ajax({
		async: true, 
		type: "GET",
		url: "/api3",
		dataType: "json", 
		success: function( data ) { 
						 
		var output="";
		for (key in data){
			if (data.hasOwnProperty(key)){
				output += '<li>' + 
				 key + '==>'+
				data[key].distance +  
				'</li>';
				console.log(key);
			}
		}
		var update = document.getElementById('links');
		update.innerHTML = output;
		
		}
		
		});
		
		
		
		
		////////////////////////////////////////////////////
		
						/*** AJAX FORM SUBMISSION FOR petty cash***/
	$('#names').submit(function(){
		console.log('clicked');
		$.post("/api5", {
			
			email: $('#email').val() 
			
		
		}, 
		  function(data){
			
			console.log(data.warningCount);
		 
		  }
		);
		
		//$('#name').find('input:text').val('');$('input:checkbox').removeAttr('checked');
		
		return false;
		
	});
		
		
		
 });

/**/
 
 
 /*
 
  var api_url= "/api" 
  $.getJSON( api_url, { 
    dataType: "json",
	headers : { Authorization : auth }
  })
    .done(function( data ) { 
	///data = JSON.parse(data);
       console.log(data);
	   //JSON.parse(results)
	   //document.getElementById('output').innerHTML=data.id;
    });
 
 */