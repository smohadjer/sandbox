<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>HTML5 boilerplate</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>	
		<?php
			if (isset($_POST["image"])) {
				$img = $_POST["image"];
				echo $img;
				$success = file_put_contents('upload/test.svg', $img);
				echo $success ? '<a href="upload/test.svg">See saved SVG in browser</a>' : 'Error';	
			}
		?>
    </body>
</html>
