<?php	
	$markup = '<p>' . $_GET['name'] . '</p>';
				
	//method 1
	$arr = array('result' => 1, 'markup' => $markup, 'marker' => 3);
	echo json_encode($arr);

	//method 2
	/*
	$json = '{
		"result": 1, 
		"markup": "<p>html makrup comes <strong>here</strong></p>",
		"job": "web developer"
	}';	
	echo $json;
	*/
?>
