<?php
// Set headers
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");

ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'libs/Controller.php';
require 'libs/View.php';
require 'libs/Model.php';

// Get the route from query string or fallback to path
$route = isset($_GET['rt']) ? $_GET['rt'] : null;

// If not set via ?rt=users/register_user, try to get from REQUEST_URI
if (!$route && isset($_SERVER['REQUEST_URI'])) {
    // Remove leading slashes and query string
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $scriptDir = dirname($_SERVER['SCRIPT_NAME']);
    $uri = substr($uri, strlen($scriptDir));
    $uri = trim($uri, '/');
    $route = $uri;
}

$route = $route ?: 'home/index';  // fallback

$route_parts = explode('/', $route);
$controller_name = ucfirst($route_parts[0]) . 'Controller';
$method_name = isset($route_parts[1]) ? $route_parts[1] : 'index';

error_log("Routing: Controller - $controller_name, Method - $method_name");

// Load controller
if (file_exists('controllers/' . $controller_name . '.php')) {
    require 'controllers/' . $controller_name . '.php';
    $controller = new $controller_name();

    if (method_exists($controller, $method_name)) {
        if (isset($route_parts[2])) {
            $controller->{$method_name}($route_parts[2]);
        } else {
            $controller->{$method_name}();
        }
    } else {
        echo json_encode(['error' => 'Method not found']);
    }
} else {
    echo json_encode(['error' => 'Controller not found']);
}

exit;
?>
