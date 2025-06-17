<?php
// Set headers
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");

// Include necessary libraries
require 'libs/Bootstrap.php';
require 'libs/Controller.php';
require 'libs/View.php';
require 'libs/Model.php';

// Initialize the Bootstrap class
$app = new Bootstrap();

// Check if 'rt' parameter is passed in the URL
$route = isset($_GET['rt']) ? $_GET['rt'] : 'home/index';  // Default route if none is set

// Split the route into controller and method
$route_parts = explode('/', $route);
$controller_name = ucfirst($route_parts[0]) . 'Controller';  // Capitalize controller name
$method_name = isset($route_parts[1]) ? $route_parts[1] : 'index';  // Default to 'index' if no method is set
error_log("Routing: Controller - $controller_name, Method - $method_name");

// Load the controller if it exists
if (file_exists('controllers/' . $controller_name . '.php')) {
    require 'controllers/' . $controller_name . '.php';
    $controller = new $controller_name();

    // Call the method in the controller if it exists
    if (method_exists($controller, $method_name)) {
        $controller->$method_name();
    } else {
        echo json_encode(['error' => 'Method not found']);
    }
} else {
    echo json_encode(['error' => 'Controller not found']);
}

exit;
?>
