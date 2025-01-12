<?php

class OwnerController extends BaseController {
    
    function __construct() {
        parent::__construct();
        
        if (isset($_POST['btn_display_users'])) {
            $this->display_owner();
        }

        if (isset($_POST['btn_save_user'])) {

            $this->create_owner();
        }
        
        if (isset($_POST['btn_update_owner'])) {
            $this->update_owner();
        } 

    }

    public function edit_owner($user_id) {
        // Ensure the model file is included
        require_once 'models/ownerModel.php';
    
        // Initialize the OwnerModel
        $ownerModel = new OwnerModel();
        // Fetch user data by user_id
        $user_data =  $ownerModel->get_owner_by_id($user_id);
    
        // Set content type for JSON response
        header('Content-Type: application/json');
        echo json_encode($user_data);
        exit(); // Ensure no further code is executed after JSON output
    }

    
    
    public function delete_owner($owner_id) {
        // Ensure the model file is included
        require_once 'models/ownerModel.php';
    
        // Initialize the OwnerModel
        $ownerModel = new OwnerModel();
    
        // Call the delete_owner function with the provided owner_id
        $result = $ownerModel->delete_owner($owner_id);
    
        // Prepare and send the JSON response
        if ($result) {
            // Log success and return a JSON success message
            error_log('Owner deleted successfully.');
            echo json_encode(['success' => true, 'message' => 'Owner deleted successfully']);
        } else {
            // Log failure and return a JSON error message
            error_log('Error occurred while deleting owner.');
            echo json_encode(['success' => false, 'message' => 'Error deleting owner']);
        }
    
        // Exit the script to ensure no further processing
        exit();
    }
    
    
    
    
    public function display_owner() {
        
        require_once 'models/ownerModel.php';
        $model = new OwnerModel();
        
        $users = $model->get_users();
    
        // Set content type for JSON response
        header('Content-Type: application/json');
        echo json_encode($users);
        exit(); // Ensure no further code is executed after JSON output
    }
    

    public function create_user() {
            $this->view->render('users/create_user');
        }

  /*  public function save_user() {
        
            require_once 'models/usersModel.php';
            $model = new UsersModel();

            $model->save_user();
            return $this->display_users();
    } */
        
    public function create_owner() {
        // Ensure the model file is included
        require_once 'models/ownerModel.php';
    
        // Initialize the OwnerModel
        $ownerModel = new OwnerModel();
    
        // Since this is a multipart/form-data request, use $_POST for form fields and $_FILES for the file
        $result = $ownerModel->create_owner($_POST, $_FILES);  // Pass both $_POST and $_FILES
    
        // Prepare and send the JSON response
        if ($result) {
            // Log success and return a JSON success message
            error_log('Owner created successfully.');
            echo json_encode(['success' => true, 'message' => 'Owner created successfully']);
        } else {
            // Log failure and return a JSON error message
            error_log('Error occurred while creating owner.');
            echo json_encode(['success' => false, 'message' => 'Error creating owner']);
        }
    
        // Stop further execution of the script
        exit();
    }
    
    public function update_owner() {
        // Get the raw POST data (JSON)
        $json = file_get_contents('php://input');
        
        // Decode the JSON data to an associative array
        $data = json_decode($json, true);
        
        // Ensure data was received
        if ($data === null) {
            error_log('Invalid JSON input.'); // Log the error
            echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
            exit(); // Exit to prevent further execution
        }
    
        // Require the model for updating users
        require_once 'models/ownerModel.php';
        $ownerModel = new OwnerModel();
    
        // Call the model's update function and pass the user data
        $result = $ownerModel->update_owner($data);
    
        // Check if the update was successful
        if ($result) {
            error_log('User updated successfully.'); // Log success
            echo json_encode(['success' => true, 'message' => 'User updated successfully']);
        } else {
            error_log('Error occurred while updating user.'); // Log error
            echo json_encode(['success' => false, 'message' => 'Error updating user']);
        }
    
        exit(); // Exit after handling the response
    }
    


}
