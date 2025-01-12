<?php

class ServiceController extends BaseController {
    public function get_services() {
        require_once 'models/serviceModel.php';
        $model = new ServiceModel();
        echo json_encode($model->get_services());
    }

    public function create_service() {
        require_once 'models/serviceModel.php';
        $model = new ServiceModel();
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(['success' => $model->create_service($data)]);
    }

    public function update_service($id) {
        require_once 'models/serviceModel.php';
        $model = new ServiceModel();
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(['success' => $model->update_service($id, $data)]);
    }

    public function delete_service($id) {
        require_once 'models/serviceModel.php';
        $model = new ServiceModel();
        echo json_encode(['success' => $model->delete_service($id)]);
    }
}
