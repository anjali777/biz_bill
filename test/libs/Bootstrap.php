<?php
ini_set('display_errors', 1);


date_default_timezone_set("Australia/Sydney");

class Bootstrap {

    function __construct() {
        // start php sessions to track authentication
       // session_start();
        
        
        // explode URL GET variable $rt into $url
        $url = explode('/', $_GET['rt']);

        // construct tagret file name of requested controller
        $file = 'controllers/' . $url[0] . 'Controller.php';

        //if the requested controller file exists
        if (file_exists($file)) {
            require $file;
            $conVar = $url[0] . "Controller";
            $controller = new $conVar();

            // check method varable request
            if (isset($url[2])) {
                $controller->{$url[1]}($url[2]);
                // check for method request
            } else {
                if (isset($url[1])) {
                    $controller->{$url[1]}();
                }
            }
            // if the requested controller file does not exist
        } else {
            require 'controllers/homeController.php';
            $controller = new HomeController();
            return false;
        }
    }

}

?>
