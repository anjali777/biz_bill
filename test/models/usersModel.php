<?php

class UsersModel extends BaseModel {

    function __construct() {
        parent::__construct();
    }

    function verify_to_from_dates() {

        $first_holidays_from = filter_var($_POST['first_holidays_from'], FILTER_SANITIZE_STRING);
        $first_holidays_to = filter_var($_POST['first_holidays_to'], FILTER_SANITIZE_STRING);
        $second_holidays_from = filter_var($_POST['second_holidays_from'], FILTER_SANITIZE_STRING);
        $second_holidays_to = filter_var($_POST['second_holidays_to'], FILTER_SANITIZE_STRING);

        if ($first_holidays_from > $first_holidays_to) {
            return 1;
        }
        if ($second_holidays_from > $second_holidays_to) {
            return 1;
        }
        
        /*
         * all fields completed and email verified
         */
        return 0;
    }

    function register_user($data) {
        try {
            error_log("Inside UsersModel::register_user() method");
            error_log("Received data: " . print_r($data, true));
            $db = BaseModel::getInstance();
            $password_hash = password_hash($data['password'], PASSWORD_BCRYPT);
            $registration_key = bin2hex(random_bytes(16)); // Generate unique registration key
            $registration_time = date('Y-m-d H:i:s');

            $sth = $db->prepare("INSERT INTO users (email, password_hash, registration_key, registration_time, is_active, first_name, last_name, role, created_at) 
                VALUES (:email, :password_hash, :registration_key, :registration_time, :is_active, :first_name, :last_name, :role, :created_at)");
            
            $sth->bindParam(':email', $data['email']);
            $sth->bindParam(':password_hash', $password_hash);
            $sth->bindParam(':registration_key', $registration_key);
            $sth->bindParam(':registration_time', $registration_time);
            $sth->bindValue(':is_active', 0); // Default inactive until email verification
            $sth->bindParam(':first_name', $data['first_name']);
            $sth->bindParam(':last_name', $data['last_name']);
            $sth->bindValue(':role', 'customer');
            $sth->bindValue(':created_at', $registration_time);
error_log("SQL about to execute with values: " . json_encode($data));

            $executed = $sth->execute();
            error_log("Execution result: " . var_export($executed, true));
            return $executed;
        } catch (Exception $e) {
            error_log("Error registering user: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Registration failed. ' . $e->getMessage()]);
            return false;
        }
    }

    function login_user($email) {
        try {
            $db = BaseModel::getInstance();
            $sth = $db->prepare("SELECT * FROM users WHERE email = :email");
            $sth->bindParam(':email', $email);
            $sth->execute();
            return $sth->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Error fetching user for login: " . $e->getMessage());
            return false;
        }
    }

    function activate_user($registration_key) {
        try {
            $db = BaseModel::getInstance();
            $sth = $db->prepare("UPDATE users SET is_active = 1 WHERE registration_key = :registration_key AND is_active = 0");
            $sth->bindParam(':registration_key', $registration_key);
            return $sth->execute();
        } catch (Exception $e) {
            error_log("Error activating user: " . $e->getMessage());
            return false;
        }
    }
    
    public function get_user_by_id($user_id) {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("SELECT * FROM customer WHERE customer_id = :customer_id");
        $sth->bindParam(':customer_id', $user_id, PDO::PARAM_INT);
        $sth->execute();
        
        return $sth->fetch(PDO::FETCH_ASSOC); // Return single user data
    }
    
    public function delete_user_by_id($user_id) {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("DELETE FROM customer WHERE customer_id = :customer_id");
        $sth->bindParam(':customer_id', $user_id, PDO::PARAM_INT);
        
        return $sth->execute(); // Return true if successful
    }
    
    public function get_users() {

        $db = BaseModel::getInstance();
        $sth = $db->prepare("SELECT customer_id, salutation, first_name, last_name, customer_display_name, company_name, customer_email, customer_phone_number, customer_mobile_number, customer_address, customer_street_number, customer_suburb, customer_state, customer_postcode, customer_country FROM customer");
        $sth->execute();

        $user_data = array();
        $i = 0;

        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $user_data[$i]['customer_id'] = $row['customer_id'];

            $user_data[$i]['salutation'] = $row['salutation'];

            $user_data[$i]['first_name'] = $row['first_name'];

            $user_data[$i]['last_name'] = $row['last_name'];

            $user_data[$i]['customer_display_name'] = $row['customer_display_name'];

            $user_data[$i]['company_name'] = $row['company_name'];

            $user_data[$i]['customer_email'] = $row['customer_email'];

            $user_data[$i]['customer_phone_number'] = $row['customer_phone_number'];

            $user_data[$i]['customer_mobile_number'] = $row['customer_mobile_number'];

            $user_data[$i]['customer_address'] = $row['customer_address'];

            $user_data[$i]['customer_street_number'] = $row['customer_street_number'];

            $user_data[$i]['customer_suburb'] = $row['customer_suburb'];

            $user_data[$i]['customer_state'] = $row['customer_state'];

            $user_data[$i]['customer_postcode'] = $row['customer_postcode'];
            
            $user_data[$i]['customer_country'] = $row['customer_country'];

            $i++;
        }
        
        return $user_data;
    }

    public function save_user($data) {
        try {
            // Validate and sanitize customer_id
            $id_user = isset($data['customer_id']) && is_numeric($data['customer_id']) ? (int)$data['customer_id'] : null;

            if ($id_user === null) {
                echo "Invalid customer_id: customer_id must be a valid integer.";
                return false; // Stop execution if customer_id is not valid
            }

            $salutation = filter_var($data['salutation'], FILTER_SANITIZE_STRING);
            $first_name = filter_var($data['first_name'], FILTER_SANITIZE_STRING);
            $last_name = filter_var($data['last_name'], FILTER_SANITIZE_STRING);
            $customer_display_name = strtoupper(filter_var($data['customer_display_name'], FILTER_SANITIZE_STRING));
            $company_name = strtoupper(filter_var($data['company_name'], FILTER_SANITIZE_STRING)); // Convert to uppercase
            $customer_email = filter_var($data['customer_email'], FILTER_SANITIZE_EMAIL);
            $customer_phone_number = filter_var($data['customer_phone_number'], FILTER_SANITIZE_STRING);
            $customer_mobile_number = filter_var($data['customer_mobile_number'], FILTER_SANITIZE_STRING);
            $customer_address = filter_var($data['customer_address'], FILTER_SANITIZE_STRING);
            $customer_street_number = filter_var($data['customer_street_number'], FILTER_SANITIZE_STRING);
            $customer_suburb = filter_var($data['customer_suburb'], FILTER_SANITIZE_STRING);
            $customer_state = filter_var($data['customer_state'], FILTER_SANITIZE_STRING);
            $customer_postcode = filter_var($data['customer_postcode'], FILTER_SANITIZE_STRING);
            $customer_country = filter_var($data['customer_country'], FILTER_SANITIZE_STRING);
            $customer_registration_completed = filter_var($data['customer_registeration_completed'], FILTER_SANITIZE_NUMBER_INT);
            $customer_registration_email_sent = filter_var($data['customer_registeration_email_sent'], FILTER_SANITIZE_NUMBER_INT);
            $customer_account_enabled = filter_var($data['Customer_account_enabled'], FILTER_SANITIZE_NUMBER_INT);
            
            // Database connection
            $db = BaseModel::getInstance();
            
            $sth = $db->prepare("INSERT INTO customer(customer_id, salutation, first_name, last_name, customer_display_name, company_name, customer_email, customer_phone_number, customer_mobile_number, customer_address, customer_street_number, customer_suburb, customer_state, customer_postcode, customer_country, customer_registeration_completed, customer_registeration_email_sent, Customer_account_enabled) VALUES (:customer_id, :salutation, :first_name, :last_name, :customer_display_name, :company_name, :customer_email, :customer_phone_number, :customer_mobile_number, :customer_address, :customer_street_number, :customer_suburb, :customer_state, :customer_postcode, :customer_country, :customer_registeration_completed, :customer_registeration_email_sent, :Customer_account_enabled)");
      
            $sth->bindParam(':customer_id', $id_user);
            $sth->bindParam(':salutation', $salutation);
            $sth->bindParam(':first_name', $first_name);
            $sth->bindParam(':last_name', $last_name);
            $sth->bindParam(':customer_display_name', $customer_display_name);
            $sth->bindParam(':company_name', $company_name);
            $sth->bindParam(':customer_email', $customer_email);
            $sth->bindParam(':customer_phone_number', $customer_phone_number);
            $sth->bindParam(':customer_mobile_number', $customer_mobile_number);
            $sth->bindParam(':customer_address', $customer_address);
            $sth->bindParam(':customer_street_number', $customer_street_number);
            $sth->bindParam(':customer_suburb', $customer_suburb);
            $sth->bindParam(':customer_state', $customer_state);
            $sth->bindParam(':customer_postcode', $customer_postcode);
            $sth->bindParam(':customer_country', $customer_country);
            $sth->bindParam(':customer_registeration_completed', $customer_registration_completed);
            $sth->bindParam(':customer_registeration_email_sent', $customer_registration_email_sent);
            $sth->bindParam(':Customer_account_enabled', $customer_account_enabled);
    
            $result = $sth->execute(); // Save the result of execution
            return $result; // Return result to controller

        } catch (Exception $e) {
            echo "Error saving user to database: " . $e->getMessage() . "<br>"; // Debug: exception message
            return false;
        }
    }
    
    public function update_user($data) {
        try {
            // Validate and sanitize customer_id
            $id_user = isset($data['customer_id']) && is_numeric($data['customer_id']) ? (int)$data['customer_id'] : null;
    
            if ($id_user === null) {
                echo "Invalid customer_id: customer_id must be a valid integer.";
                return false; // Stop execution if customer_id is not valid
            }
    
            // Sanitize other input fields
            $salutation = filter_var($data['salutation'], FILTER_SANITIZE_STRING);
            $first_name = filter_var($data['first_name'], FILTER_SANITIZE_STRING);
            $last_name = filter_var($data['last_name'], FILTER_SANITIZE_STRING);
            $customer_display_name = filter_var($data['customer_display_name'], FILTER_SANITIZE_STRING);
            $company_name = filter_var($data['company_name'], FILTER_SANITIZE_STRING);
            $customer_email = filter_var($data['customer_email'], FILTER_SANITIZE_EMAIL);
            $customer_phone_number = filter_var($data['customer_phone_number'], FILTER_SANITIZE_STRING);
            $customer_mobile_number = filter_var($data['customer_mobile_number'], FILTER_SANITIZE_STRING);
            $customer_address = filter_var($data['customer_address'], FILTER_SANITIZE_STRING);
            $customer_street_number = filter_var($data['customer_street_number'], FILTER_SANITIZE_STRING);
            $customer_suburb = filter_var($data['customer_suburb'], FILTER_SANITIZE_STRING);
            $customer_state = filter_var($data['customer_state'], FILTER_SANITIZE_STRING);
            $customer_postcode = filter_var($data['customer_postcode'], FILTER_SANITIZE_STRING);
            $customer_country = filter_var($data['customer_country'], FILTER_SANITIZE_STRING);
            $customer_registration_completed = filter_var($data['customer_registeration_completed'], FILTER_SANITIZE_NUMBER_INT);
            $customer_registration_email_sent = filter_var($data['customer_registeration_email_sent'], FILTER_SANITIZE_NUMBER_INT);
            $customer_account_enabled = filter_var($data['Customer_account_enabled'], FILTER_SANITIZE_NUMBER_INT);
    
            // Database connection
            $db = BaseModel::getInstance();
            
            // Prepare the SQL query to update the user record
            $sth = $db->prepare("UPDATE customer SET 
                salutation = :salutation, 
                first_name = :first_name, 
                last_name = :last_name, 
                customer_display_name = :customer_display_name, 
                company_name = :company_name, 
                customer_email = :customer_email, 
                customer_phone_number = :customer_phone_number, 
                customer_mobile_number = :customer_mobile_number, 
                customer_address = :customer_address, 
                customer_street_number = :customer_street_number, 
                customer_suburb = :customer_suburb, 
                customer_state = :customer_state, 
                customer_postcode = :customer_postcode, 
                customer_country = :customer_country, 
                customer_registeration_completed = :customer_registeration_completed, 
                customer_registeration_email_sent = :customer_registeration_email_sent, 
                Customer_account_enabled = :Customer_account_enabled 
                WHERE customer_id = :customer_id");
    
            // Bind parameters to the prepared statement
            $sth->bindParam(':customer_id', $id_user);
            $sth->bindParam(':salutation', $salutation);
            $sth->bindParam(':first_name', $first_name);
            $sth->bindParam(':last_name', $last_name);
            $sth->bindParam(':customer_display_name', $customer_display_name);
            $sth->bindParam(':company_name', $company_name);
            $sth->bindParam(':customer_email', $customer_email);
            $sth->bindParam(':customer_phone_number', $customer_phone_number);
            $sth->bindParam(':customer_mobile_number', $customer_mobile_number);
            $sth->bindParam(':customer_address', $customer_address);
            $sth->bindParam(':customer_street_number', $customer_street_number);
            $sth->bindParam(':customer_suburb', $customer_suburb);
            $sth->bindParam(':customer_state', $customer_state);
            $sth->bindParam(':customer_postcode', $customer_postcode);
            $sth->bindParam(':customer_country', $customer_country);
            $sth->bindParam(':customer_registeration_completed', $customer_registration_completed);
            $sth->bindParam(':customer_registeration_email_sent', $customer_registration_email_sent);
            $sth->bindParam(':Customer_account_enabled', $customer_account_enabled);
    
            // Execute the update query
            $result = $sth->execute();
    
            // Return result to controller (true if successful, false otherwise)
            return $result;
    
        } catch (Exception $e) {
            echo "Error updating user in the database: " . $e->getMessage() . "<br>"; // Debug: exception message
            return false;
        }
    }
    

}
