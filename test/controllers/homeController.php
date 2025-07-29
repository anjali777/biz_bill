<?php

class HomeController extends BaseController {

    function __construct() {
        parent::__construct();



        if (isset($_SESSION['id'])) {
            /*
             * if user logged in, go to dashboard
             */
            $this->home();
        } else {
            /*
             * else, go to login page
             */
            //$this->view->error = $error;
            $this->view->render('users/create_user');
        }
    }

    function home() {
        require 'models/homeModel.php';
        $model = new HomeModel();

        $this->view->render('home/index');
    }

}

?>