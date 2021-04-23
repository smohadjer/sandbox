<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>HTML5</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <p>Code taken from: <a href="https://davidwalsh.name/curl-post">https://davidwalsh.name/curl-post</a></p>

        <p>You are <?php echo $_POST['age'] ?> years old.</p>

        <?php
            //extract data from the post
            //set POST variables
            $url = 'https://www.google.com/recaptcha/api/siteverify';
            $fields = array(
            	'secret' => '6LdDoLYaAAAAAGcTY9P24DU3oyCHXyq8dMUCsDiG',
            	'response' => urlencode($_POST['g-recaptcha-response'] )
            );

            //url-ify the data for the POST
            $fields_string = http_build_query($fields);

            //open connection
            $ch = curl_init();

            //set the url, number of POST vars, POST data
            curl_setopt($ch,CURLOPT_URL, $url);
            curl_setopt($ch,CURLOPT_POST, count($fields));
            curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

            //execute post
            $result = curl_exec($ch);

            //close connection
            curl_close($ch);

            echo $result['success'];
        ?>
    </body>
</html>
