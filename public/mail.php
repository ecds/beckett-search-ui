<?php
$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Get POST data
  $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
  $email = isset($_POST['email']) ? trim($_POST['email']) : '';
  $subject = "Chercher Feedback";
  $body = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';
  $message = "From: $name <$email> \n\n $body";

  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST');
  header("Access-Control-Allow-Headers: X-Requested-With");

  // Validate form fields
  if (empty($name)) {
    $errors[] = 'Name is empty';
  }

  if (empty($email)) {
    $errors[] = 'Email is empty';
  } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email is invalid';
  }

  if (empty($message)) {
    $errors[] = 'Message is empty';
  }

  // If no errors, send email
  if (empty($errors)) {
    $recipient = "chercherbeckettletters@gmail.com";

    // Send email
    if (mail($recipient, $subject, $message)) {
      echo "Email sent successfully!";
    } else {
      header("HTTP/1.1 400 Bad Request");
      echo "Failed to send email. Please try again later.";
    }
  } else {
    // Display errors
    header("HTTP/1.1 400 Bad Request");
    echo "The form contains the following errors:<br>";
    foreach ($errors as $error) {
      echo "- $error<br>";
    }
  }
} else {
  // Not a POST request, display a 403 forbidden error
  header("HTTP/1.1 403 Forbidden");
  echo "You are not allowed to access this page.";
}
