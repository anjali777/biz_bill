<?php

class BaseModel {
    private static $dbInstance = null;

    function __construct() {
    }

    public static function getInstance() {
        if (!self::$dbInstance) {
            try {
                // Specify the correct DSN (Data Source Name)
                $dsn = "mysql:host=localhost;port=3306;dbname=ngkproje_bizbill";

                // Create a new PDO instance
                self::$dbInstance = new PDO($dsn, 'ngkproje_ajay', 'Jaya@1975');

                // Set PDO to throw exceptions on error
                self::$dbInstance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                // Handle any connection errors here
                echo "Connection failed: " . $e->getMessage();
                die();
            }
        }
        return self::$dbInstance;
    }
}

?>