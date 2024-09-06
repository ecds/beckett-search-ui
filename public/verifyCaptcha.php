<?php
switch ($_SERVER["REQUEST_METHOD"]) {
  case 'POST':
    $captcha_value = $_POST['captchaValue'];
    $url = "https://www.google.com/recaptcha/api/siteverify?secret=<KEY>&response=$captcha_value";
    $request = [
      'https' => [
        'method' => 'POST',
      ]
    ];
    $context = stream_context_create($request);
    $response = json_decode(file_get_contents($url, false, $context));
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header("Access-Control-Allow-Headers: X-Requested-With");
    header('Content-type: application/json');
    echo json_encode($response);
    break;

  default:
    // Not a POST request, display a 403 forbidden error
    header("HTTP/1.1 403 Forbidden");
    echo "You are not allowed to access this page.";
    # code...
    break;
}
