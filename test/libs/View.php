<?php

class BaseView {

    function __construct() {
        
    }

    public function render($name) {
        require 'views/header.php';
        require 'views/' . $name . '.php';
        require 'views/footer.php';
    }

    public function render_no_footer($name) {
        require 'views/header.php';
        require 'views/' . $name . '.php';
    }

    public function render_no_header_footer($name) {
        require 'views/' . $name . '.php';
    }

}

?>
