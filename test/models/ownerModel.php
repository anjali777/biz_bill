<?php

class OwnerModel extends BaseModel {

    function __construct() {
        parent::__construct();
    }
    
    public function get_owner_by_id($user_id) {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("SELECT * FROM business_owner WHERE owner_id = :owner_id");
        $sth->bindParam(':owner_id', $user_id, PDO::PARAM_INT);
        $sth->execute();
        
        $user = $sth->fetch(PDO::FETCH_ASSOC);
    
        if ($user && !empty($user['owner_business_logo'])) {
            // Append base URL if owner_business_logo is just a file path
            $baseImageUrl = "http://localhost:8082/images/";
            $user['owner_business_logo'] = $baseImageUrl . $user['owner_business_logo'];
        }
    
        return $user;
    }
    
    
    
    public function delete_owner($owner_id) {
        try {
            // Validate owner_id
            if (!is_numeric($owner_id)) {
                echo "Invalid owner_id: owner_id must be a valid integer.";
                return false;
            }
    
            // Delete the owner's data from the database
            $db = BaseModel::getInstance();
            $sth = $db->prepare("DELETE FROM business_owner WHERE owner_id = :owner_id");
            $sth->bindParam(':owner_id', $owner_id, PDO::PARAM_INT);
    
            return $sth->execute(); // Execute the query
        } catch (Exception $e) {
            echo "Error deleting owner: " . $e->getMessage() . "<br>"; // Debug: exception message
            return false;
        }
    }
    
    
    public function get_users() {

        $db = BaseModel::getInstance();
        $sth = $db->prepare("SELECT owner_id, salutation, owner_first_name, owner_last_name, owner_display_name, owner_business_name, owner_email, owner_phone_number, owner_mobile_number, owner_address, owner_street_number, owner_suburb, owner_state, owner_postcode, owner_country, owner_business_logo, bank_name, account_name, bsb, account_number FROM business_owner");
        $sth->execute();

        $user_data = array();
        $i = 0;

        while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $user_data[$i]['owner_id'] = $row['owner_id'];

            $user_data[$i]['salutation'] = $row['salutation'];

            $user_data[$i]['owner_first_name'] = $row['owner_first_name'];

            $user_data[$i]['owner_last_name'] = $row['owner_last_name'];

            $user_data[$i]['owner_display_name'] = $row['owner_display_name'];

            $user_data[$i]['owner_business_name'] = $row['owner_business_name'];

            $user_data[$i]['owner_email'] = $row['owner_email'];

            $user_data[$i]['owner_phone_number'] = $row['owner_phone_number'];

            $user_data[$i]['owner_mobile_number'] = $row['owner_mobile_number'];

            $user_data[$i]['owner_address'] = $row['owner_address'];

            $user_data[$i]['owner_street_number'] = $row['owner_street_number'];

            $user_data[$i]['owner_suburb'] = $row['owner_suburb'];

            $user_data[$i]['owner_state'] = $row['owner_state'];

            $user_data[$i]['owner_postcode'] = $row['owner_postcode'];
            
            $user_data[$i]['owner_country'] = $row['owner_country'];

            // Prepend the base URL to the logo filename
            $baseImageUrl = "http://localhost:8082/images/";
            $user_data[$i]['owner_business_logo'] = $baseImageUrl . $row['owner_business_logo'];


            $user_data[$i]['bank_name'] = $row['bank_name'];

            $user_data[$i]['account_name'] = $row['account_name'];

            $user_data[$i]['bsb'] = $row['bsb'];

            $user_data[$i]['account_number'] = $row['account_number'];

            $i++;
        }
        
        return $user_data;
    }

    public function create_owner($data, $files) {
        try {
            // Validate and sanitize owner_id
            $id_user = isset($data['owner_id']) && is_numeric($data['owner_id']) ? (int)$data['owner_id'] : null;
    
            if ($id_user === null) {
                echo "Invalid owner_id: owner_id must be a valid integer.";
                return false; // Stop execution if owner_id is not valid
            }
    
            // Sanitize other fields
            $salutation = filter_var($data['salutation'], FILTER_SANITIZE_STRING);
            $owner_first_name = filter_var($data['owner_first_name'], FILTER_SANITIZE_STRING);
            $owner_last_name = filter_var($data['owner_last_name'], FILTER_SANITIZE_STRING);
            $owner_display_name = filter_var($data['owner_display_name'], FILTER_SANITIZE_STRING);
            $owner_business_name = filter_var($data['owner_business_name'], FILTER_SANITIZE_STRING);
            $owner_email = filter_var($data['owner_email'], FILTER_SANITIZE_EMAIL);
            $owner_phone_number = filter_var($data['owner_phone_number'], FILTER_SANITIZE_STRING);
            $owner_mobile_number = filter_var($data['owner_mobile_number'], FILTER_SANITIZE_STRING);
            $owner_address = filter_var($data['owner_address'], FILTER_SANITIZE_STRING);
            $owner_street_number = filter_var($data['owner_street_number'], FILTER_SANITIZE_STRING);
            $owner_suburb = filter_var($data['owner_suburb'], FILTER_SANITIZE_STRING);
            $owner_state = filter_var($data['owner_state'], FILTER_SANITIZE_STRING);
            $owner_postcode = filter_var($data['owner_postcode'], FILTER_SANITIZE_STRING);
            $owner_country = filter_var($data['owner_country'], FILTER_SANITIZE_STRING);
            $bank_name = filter_var($data['bank_name'], FILTER_SANITIZE_STRING);
            $account_name = filter_var($data['account_name'], FILTER_SANITIZE_STRING);
            $bsb = filter_var($data['bsb'], FILTER_SANITIZE_NUMBER_INT);
            $account_number = filter_var($data['account_number'], FILTER_SANITIZE_NUMBER_INT);
            $owner_registeration_completed = filter_var($data['owner_registeration_completed'], FILTER_SANITIZE_NUMBER_INT);
            $owner_registeration_email_sent = filter_var($data['owner_registeration_email_sent'], FILTER_SANITIZE_NUMBER_INT);
            $owner_account_enabled = filter_var($data['owner_account_enabled'], FILTER_SANITIZE_NUMBER_INT);
    
            // Handle file upload for the logo
            $owner_business_logo = null;
            if (isset($files['owner_business_logo']) && $files['owner_business_logo']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $files['owner_business_logo']['tmp_name'];
                $fileName = $files['owner_business_logo']['name'];
                $fileSize = $files['owner_business_logo']['size'];
                $fileType = $files['owner_business_logo']['type'];
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));
    
                // Sanitize the file name
                $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
    
                // Set the upload directory
                $uploadFileDir = './images/';
                $dest_path = $uploadFileDir . $newFileName;
    
                // Validate file size (optional)
                if ($fileSize > 5000000) {
                    echo "Error: File size exceeds the limit of 5MB.";
                    return false;
                }
    
                // Check allowed file extensions
                $allowedfileExtensions = array('jpg', 'gif', 'png', 'jpeg');
                if (!in_array($fileExtension, $allowedfileExtensions)) {
                    echo "Error: Only images with extensions jpg, gif, png, and jpeg are allowed.";
                    return false;
                }
    
                // Move file to destination folder
                if (move_uploaded_file($fileTmpPath, $dest_path)) {
                    $owner_business_logo = $newFileName; // Save the file name in the database
                } else {
                    echo "Error moving the uploaded file.";
                    return false;
                }
            }
    
            // Insert owner data into the database
            $db = BaseModel::getInstance();
            $sth = $db->prepare("
                INSERT INTO business_owner(
                    owner_id, salutation, owner_first_name, owner_last_name, 
                    owner_display_name, owner_business_name, owner_email, 
                    owner_phone_number, owner_mobile_number, owner_address, 
                    owner_street_number, owner_suburb, owner_state, owner_postcode, 
                    owner_country, owner_business_logo, bank_name, account_name, bsb, account_number, owner_registeration_completed, owner_registeration_email_sent, owner_account_enabled
                ) 
                VALUES (
                    :owner_id, :salutation, :owner_first_name, :owner_last_name, 
                    :owner_display_name, :owner_business_name, :owner_email, 
                    :owner_phone_number, :owner_mobile_number, :owner_address, 
                    :owner_street_number, :owner_suburb, :owner_state, :owner_postcode, 
                    :owner_country, :owner_business_logo, :bank_name, :account_name, :bsb, :account_number, :owner_registeration_completed, :owner_registeration_email_sent, :owner_account_enabled
                )
            ");
    
            // Bind all parameters
            $sth->bindParam(':owner_id', $id_user);
            $sth->bindParam(':salutation', $salutation);
            $sth->bindParam(':owner_first_name', $owner_first_name);
            $sth->bindParam(':owner_last_name', $owner_last_name);
            $sth->bindParam(':owner_display_name', $owner_display_name);
            $sth->bindParam(':owner_business_name', $owner_business_name);
            $sth->bindParam(':owner_email', $owner_email);
            $sth->bindParam(':owner_phone_number', $owner_phone_number);
            $sth->bindParam(':owner_mobile_number', $owner_mobile_number);
            $sth->bindParam(':owner_address', $owner_address);
            $sth->bindParam(':owner_street_number', $owner_street_number);
            $sth->bindParam(':owner_suburb', $owner_suburb);
            $sth->bindParam(':owner_state', $owner_state);
            $sth->bindParam(':owner_postcode', $owner_postcode);
            $sth->bindParam(':owner_country', $owner_country);
            $sth->bindParam(':bank_name', $bank_name);
            $sth->bindParam(':account_name', $account_name);
            $sth->bindParam(':bsb', $bsb);
            $sth->bindParam(':account_number', $account_number);
            $sth->bindParam(':owner_business_logo', $owner_business_logo);  // Save logo filename
            $sth->bindParam(':owner_registeration_completed', $owner_registeration_completed);
            $sth->bindParam(':owner_registeration_email_sent', $owner_registeration_email_sent);
            $sth->bindParam(':owner_account_enabled', $owner_account_enabled);
    
            return $sth->execute(); // Execute the query
    
        } catch (Exception $e) {
            echo "Error saving user to database: " . $e->getMessage() . "<br>"; // Debug: exception message
            return false;
        }
    }
    
    
    public function update_owner($data) {
        try {
            // Validate and sanitize customer_id
            $id_user = isset($data['owner_id']) && is_numeric($data['owner_id']) ? (int)$data['owner_id'] : null;
    
            if ($id_user === null) {
                echo "Invalid customer_id: customer_id must be a valid integer.";
                return false; // Stop execution if customer_id is not valid
            }
    
            // Sanitize other input fields
            $salutation = filter_var($data['salutation'], FILTER_SANITIZE_STRING);
            $owner_first_name = filter_var($data['owner_first_name'], FILTER_SANITIZE_STRING);
            $owner_last_name = filter_var($data['owner_last_name'], FILTER_SANITIZE_STRING);
            $owner_display_name = filter_var($data['owner_display_name'], FILTER_SANITIZE_STRING);
            $owner_business_name = filter_var($data['owner_business_name'], FILTER_SANITIZE_STRING);
            $owner_email = filter_var($data['owner_email'], FILTER_SANITIZE_EMAIL);
            $owner_phone_number = filter_var($data['owner_phone_number'], FILTER_SANITIZE_STRING);
            $owner_mobile_number = filter_var($data['owner_mobile_number'], FILTER_SANITIZE_STRING);
            $owner_address = filter_var($data['owner_address'], FILTER_SANITIZE_STRING);
            $owner_street_number = filter_var($data['owner_street_number'], FILTER_SANITIZE_STRING);
            $owner_suburb = filter_var($data['owner_suburb'], FILTER_SANITIZE_STRING);
            $owner_state = filter_var($data['owner_state'], FILTER_SANITIZE_STRING);
            $owner_postcode = filter_var($data['owner_postcode'], FILTER_SANITIZE_STRING);
            $owner_country = filter_var($data['owner_country'], FILTER_SANITIZE_STRING);
            $bank_name = filter_var($data['bank_name'], FILTER_SANITIZE_STRING);
            $account_name = filter_var($data['account_name'], FILTER_SANITIZE_STRING);
            $bsb = filter_var($data['bsb'], FILTER_SANITIZE_NUMBER_INT);
            $account_number = filter_var($data['account_number'], FILTER_SANITIZE_NUMBER_INT);
            $$owner_business_logo = filter_var($data['$owner_business_logo'], FILTER_SANITIZE_STRING);
            $owner_registration_completed = filter_var($data['owner_registeration_completed'], FILTER_SANITIZE_NUMBER_INT);
            $owner_registration_email_sent = filter_var($data['owner_registeration_email_sent'], FILTER_SANITIZE_NUMBER_INT);
            $owner_account_enabled = filter_var($data['owner_account_enabled'], FILTER_SANITIZE_NUMBER_INT);
    
            // Database connection
            $db = BaseModel::getInstance();
            
            // Prepare the SQL query to update the user record
            $sth = $db->prepare("UPDATE business_owner SET 
                salutation = :salutation, 
                owner_first_name = :owner_first_name, 
                owner_last_name = :owner_last_name, 
                owner_display_name = :owner_display_name, 
                owner_business_name = :owner_business_name, 
                owner_email = :owner_email, 
                owner_phone_number = :owner_phone_number, 
                owner_mobile_number = :owner_mobile_number, 
                owner_address = :owner_address, 
                owner_street_number = :owner_street_number, 
                owner_suburb = :owner_suburb, 
                owner_state = :owner_state, 
                owner_postcode = :owner_postcode, 
                owner_country = :owner_country, 
                bank_name = :bank_name,
                account_name = :account_name,
                bsb = :bsb,
                account_number = :account_number,
                owner_business_logo = :owner_business_logo,
                owner_registeration_completed = :owner_registeration_completed, 
                owner_registeration_email_sent = :owner_registeration_email_sent, 
                owner_account_enabled = :owner_account_enabled 
                WHERE owner_id = :owner_id");
    
            // Bind parameters to the prepared statement
            $sth->bindParam(':owner_id', $id_user);
            $sth->bindParam(':salutation', $salutation);
            $sth->bindParam(':owner_first_name', $owner_first_name);
            $sth->bindParam(':owner_last_name', $owner_last_name);
            $sth->bindParam(':owner_display_name', $owner_display_name);
            $sth->bindParam(':owner_business_name', $owner_business_name);
            $sth->bindParam(':owner_email', $owner_email);
            $sth->bindParam(':owner_phone_number', $owner_phone_number);
            $sth->bindParam(':owner_mobile_number', $owner_mobile_number);
            $sth->bindParam(':owner_address', $owner_address);
            $sth->bindParam(':owner_street_number', $owner_street_number);
            $sth->bindParam(':owner_suburb', $owner_suburb);
            $sth->bindParam(':owner_state', $owner_state);
            $sth->bindParam(':owner_postcode', $owner_postcode);
            $sth->bindParam(':owner_country', $owner_country);
            $sth->bindParam(':bank_name', $bank_name);
            $sth->bindParam(':account_name', $account_name);
            $sth->bindParam(':bsb', $bsb);
            $sth->bindParam(':account_number', $account_number);
            $sth->bindParam(':owner_business_logo', $owner_business_logo);
            $sth->bindParam(':owner_registeration_completed', $owner_registration_completed);
            $sth->bindParam(':owner_registeration_email_sent', $owner_registration_email_sent);
            $sth->bindParam(':owner_account_enabled', $owner_account_enabled);
    
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
