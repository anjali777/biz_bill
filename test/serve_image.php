<?php
// Set headers for the image response and handle CORS
header('Content-Type: image/png'); // Define image type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set the absolute local path to the image file (not URL)
$imagePath = '/var/www/html/images/e2bb9ed4e4878a32d9b3d86c367f135e.png'; 

// Ensure the file exists and serve it; otherwise, return a 404 error
if (file_exists($imagePath)) {
    readfile($imagePath); // Output the image
    exit();
} else {
    header('Content-Type: application/json');
    http_response_code(404);
    echo json_encode(["error" => "Image not found"]);
    exit();
}
