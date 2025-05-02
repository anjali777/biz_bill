<?php


class UsersController extends BaseController {
    
    function __construct() {
        parent::__construct();
       
        if (isset($_POST['btn_display_users'])) {
            $this->display_users();
        }

        if (isset($_POST['btn_save_user'])) {

            $this->save_user();
        }
        
        if (isset($_POST['btn_update_user'])) {
            $this->update_user();
        } 

    }

    function register_user() {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        require_once 'models/UsersModel.php';
        $model = new UsersModel();

        $result = $model->register_user($data);
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Registration successful. Please verify your email.']);
            
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed.']);
        }
    }

    public function login_user() {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $email = $data['email'];
        $password = $data['password'];
    
        require_once 'models/UsersModel.php';
        $model = new UsersModel();
        $user = $model->login_user($email);
    
        header('Content-Type: application/json'); // Ensure correct header
    
        if ($user && password_verify($password, $user['password_hash'])) {
            $token = bin2hex(random_bytes(16));
            $_SESSION['auth_token'] = $token;
            echo json_encode(['success' => true, 'message' => 'Login successful', 'token' => $token]);
            exit; // ✅ Required
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
            exit; // ✅ Required
        }
    }
    
    

    function activate_user() {
        $registration_key = $_GET['key'];

        require_once 'models/UsersModel.php';
        $model = new UsersModel();

        $result = $model->activate_user($registration_key);
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Account activated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Activation failed or already active.']);
        }
    }
    
    public function edit_user($user_id) {
        require_once 'models/usersModel.php';
        $model = new UsersModel();
    
        // Fetch user data by user_id
        $user_data = $model->get_user_by_id($user_id);
    
        // Set content type for JSON response
        header('Content-Type: application/json');
        echo json_encode($user_data);
        exit(); // Ensure no further code is executed after JSON output
    }
    
    
    public function delete_user($user_id) {
        require_once 'models/usersModel.php';
        $model = new UsersModel();
    
        // Delete the user by user_id
        $is_deleted = $model->delete_user_by_id($user_id);
    
        // Set content type for JSON response
        header('Content-Type: application/json');
    
        if ($is_deleted) {
            echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
        }
        exit();
    }
    
    
    
    public function display_users() {
        require_once 'models/usersModel.php';
        $model = new UsersModel();
        
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
        
    public function save_user() {
        // Get the raw POST data (JSON)
       // print_r(file_get_contents('php://input'));die("reached till here");
        $json = file_get_contents('php://input');
       // error_log('Raw JSON input: ' . $json); // Log raw JSON input
        $data = json_decode($json, true);
      //  print_r($data);die("ajay");

        // Directly call the model without additional conditions
        require_once 'models/usersModel.php';
        $userModel = new UsersModel();
       // error_log('Data before saving: ' . print_r($data, true)); die("ajay"); // Log data before saving
        $result = $userModel->save_user($data);
        if ($result) {
            error_log('User created successfully.'); // Log success
            echo json_encode(['success' => true, 'message' => 'User created successfully']);
        } else {
            error_log('Error occurred while creating user.'); // Log error
            echo json_encode(['success' => false, 'message' => 'Error creating user']);
        }
        exit();
    }
    
    
    
            

    public function update_user() {
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
        require_once 'models/usersModel.php';
        $userModel = new UsersModel();
    
        // Call the model's update function and pass the user data
        $result = $userModel->update_user($data);
    
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
