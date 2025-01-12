<?php

class ProductController extends BaseController {
    public function get_products() {
        require_once 'models/productModel.php';
        $model = new ProductModel();
        echo json_encode($model->get_products());
    }

    public function create_product() {
        require_once 'models/productModel.php';
        $model = new ProductModel();
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(['success' => $model->create_product($data)]);
    }

    public function update_product($id) {
        require_once 'models/productModel.php';
        $model = new ProductModel();
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(['success' => $model->update_product($id, $data)]);
    }

    public function delete_product($id) {
        require_once 'models/productModel.php';
        $model = new ProductModel();
        echo json_encode(['success' => $model->delete_product($id)]);
    }
}
