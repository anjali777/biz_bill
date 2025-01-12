<?php

class SalesController extends BaseController {

    public function get_all_sales() {
        require_once 'models/salesModel.php';
        $salesModel = new SalesModel();

        $status = $_GET['status'] ?? null;
        $dateRange = $_GET['dateRange'] ?? null;
        $customer = $_GET['customer'] ?? null;

        $sales = $salesModel->get_all_sales($status, $dateRange, $customer);

        header('Content-Type: application/json');
        if ($sales) {
            echo json_encode($sales);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error fetching sales']);
        }
    }

    public function get_sales_total() {
        require_once 'models/SalesModel.php';
        $salesModel = new SalesModel();

        $status = $_GET['status'] ?? null;
        $dateRange = $_GET['dateRange'] ?? null;
        $customer = $_GET['customer'] ?? null;

        $total = $salesModel->get_sales_total($status, $dateRange, $customer);

        header('Content-Type: application/json');
        if ($total !== false) {
            echo json_encode(['total' => $total]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error fetching total']);
        }
    }

    public function get_gst_total() {
        require_once 'models/SalesModel.php';
        $salesModel = new SalesModel();

        $status = $_GET['status'] ?? null;
        $dateRange = $_GET['dateRange'] ?? null;
        $customer = $_GET['customer'] ?? null;

        $total = $salesModel->get_gst_total($status, $dateRange, $customer);

        header('Content-Type: application/json');
        if ($total !== false) {
            echo json_encode(['total' => $total]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error fetching total']);
        }
    }
}
