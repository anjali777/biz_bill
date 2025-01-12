<?php

class InvoiceController  extends BaseController{
    function __construct() {
        parent::__construct();
    }
    // API to get the next invoice number
    public function get_next_invoice_number() {
        require_once 'models/InvoiceModel.php';
        $invoiceModel = new InvoiceModel();
        $nextInvoiceNumber = $invoiceModel->get_next_invoice_number();
        echo json_encode(['next_invoice_number' => $nextInvoiceNumber]);
    }
    
    public function create_invoice() {
        require_once 'models/InvoiceModel.php';
        $invoiceModel = new InvoiceModel();

        $data = json_decode(file_get_contents('php://input'), true);
   
        $result = $invoiceModel->create_invoice($data);
    
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Invoice created successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error creating invoice']);
        }
    }

    public function display_invoices() {
        require_once 'models/InvoiceModel.php';
        $invoiceModel = new InvoiceModel();
    
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $dateRange = isset($_GET['dateRange']) ? $_GET['dateRange'] : null;
    
        // Debugging logs
        error_log("Status filter: " . $status);
        error_log("Date range filter: " . $dateRange);
    
        $invoices = $invoiceModel->get_invoices($status, $dateRange);
    
        header('Content-Type: application/json');
        if ($invoices) {
            echo json_encode($invoices);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error fetching invoices']);
        }
    }
    

    // API to get a specific invoice by ID (for editing)
    public function get_invoice_by_id($invoice_id) {
        require_once 'models/InvoiceModel.php';
        $invoiceModel = new InvoiceModel();
        $invoice = $invoiceModel->get_invoice_by_id($invoice_id);
        header('Content-Type: application/json');
        if ($invoice) {
            echo json_encode($invoice);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error fetching invoice']);
        }
    }

    // API to get a specific invoice by ID
    public function edit_invoice($invoice_id) {
        require_once 'models/InvoiceModel.php';
        $invoiceModel = new InvoiceModel();
        $invoice = $invoiceModel->get_invoice_by_id($invoice_id);
        // Set content type for JSON response
        header('Content-Type: application/json');

        if ($invoice) {
            echo json_encode($invoice);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error fetching invoice']);
        }
    }

    // API to update the invoice
    public function update_invoice($invoice_id) {
        require_once 'models/InvoiceModel.php';
        $invoiceModel = new InvoiceModel();
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data)) {
            $data = $_POST;
        }

        $result = $invoiceModel->update_invoice($invoice_id, $data);
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Invoice updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating invoice']);
        }
    }

    public function update_status($invoice_id) {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $new_status = isset($data['status']) ? $data['status'] : null;
    
        if ($new_status === null) {
            echo json_encode(['success' => false, 'message' => 'Invalid status']);
            return;
        }
    
        require_once 'models/InvoiceModel.php';
        $model = new InvoiceModel();
    
        $result = $model->update_status($invoice_id, $new_status);
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update status']);
        }
    }
    
    
}
