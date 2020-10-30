<?php
if ( isset($_REQUEST['email']) ) {
	//send email	
	$email = $_REQUEST['email'];	
	$email_message = "Year: " . $_REQUEST['year'] . "\n";
    $email_message .= "Email: " . $email . "\n";
	$email_message .= "Email: " . $_REQUEST['last_name'] . "\n";
	$subject = 'form submission via email';

	mail("saeid@fastmail.fm", $subject, $email_message, "From:" . $email);
	echo "Thank you for using our mail form";
}
?>