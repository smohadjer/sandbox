<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>HTML5</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <?php
          var_dump($_FILES);
          
          foreach($_FILES['myfiles']['tmp_name'] as $key => $tmp_name) {
              $file_name = $_FILES['myfiles']['name'][$key];
              $file_size =$_FILES['myfiles']['size'][$key];
              $file_tmp =$_FILES['myfiles']['tmp_name'][$key];
              $file_type=$_FILES['myfiles']['type'][$key];  

              $detectedType = exif_imagetype($file_tmp);
              $path = 'upload/' . $file_name;
              
              if ($detectedType) {
                // save image to disk
                move_uploaded_file($file_tmp, $path);
                // show image
                echo '<p><img src="' . $path . '" /></p>';
              }
          }

        ?>
    </body>
</html>
