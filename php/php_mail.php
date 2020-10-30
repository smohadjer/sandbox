<?php
    $to = "saeid@fastmail.fm";
    $subject = "New test";
    $message = "This is a simple email message.";
    $from = "ops+launcher-dev@recallinfolink.com";
    $headers = "From:" . $from;
    $mail = mail($to,$subject,$message,$headers);

    if ($mail) {
        echo "Mail Sent!";
    } else {
        echo "Error!";
        $errorMessage = error_get_last()['message'];
        echo $errorMessage;
    }
?>
