<?php

class BaseModel {
    private static $dbInstance = null;

    function __construct() {
    }

    public static function getInstance() {
        if (!self::$dbInstance) {
            try {
                // Specify the correct DSN (Data Source Name)
                $dsn = "mysql:host=db_biz;dbname=biz_bill_db";

                // Create a new PDO instance
                self::$dbInstance = new PDO($dsn, 'ajay_biz', 'ajay_biz');

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