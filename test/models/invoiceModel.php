<?php

class InvoiceModel extends BaseModel{

    public function __construct() {
        parent::__construct();
    }

    public function get_next_invoice_number() {
        // Get the current AUTO_INCREMENT value from the customer_invoice table
        $db = BaseModel::getInstance();
        $sth = $db->prepare("SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'biz_bill_db' AND TABLE_NAME = 'customer_invoice'");
        $sth->execute();
        $result = $sth->fetch(PDO::FETCH_ASSOC);
        $nextInvoiceNumber = $result['AUTO_INCREMENT'];
    
        // If the next invoice number is less than 1001, set it to 1001
        if ($nextInvoiceNumber < 1001) {
            $sth = $db->prepare("ALTER TABLE customer_invoice AUTO_INCREMENT = 1001");
            $sth->execute();
            $nextInvoiceNumber = 1001; // Set it to 1001 manually
        }
    
        return $nextInvoiceNumber;
    }
    
    

    public function create_invoice($data) {
        $db = BaseModel::getInstance();
        try {
            $db->beginTransaction();
            if (empty($data['invoice_create_date']) || empty($data['invoice_number']) || empty($data['customer_id'])) {
                throw new Exception("Missing essential data for creating invoice.");
            }
    
            // Insert the invoice data with subtotal and gst_total
            $sth = $db->prepare("
                INSERT INTO customer_invoice (
                    invoice_create_date, invoice_due_date, invoice_number, customer_id, 
                    customer_display_name, customer_email, customer_address, invoice_subtotal, 
                    invoice_gst_total, invoice_total, invoice_status, invoice_created
                ) 
                VALUES (
                    :invoice_create_date, :invoice_due_date, :invoice_number, :customer_id, 
                    :customer_display_name, :customer_email, :customer_address, :invoice_subtotal, 
                    :invoice_gst_total, :invoice_total, :invoice_status, NOW()
                )
            ");
            
            $sth->execute([
                ':invoice_create_date' => $data['invoice_create_date'],
                ':invoice_due_date' => $data['invoice_due_date'],
                ':invoice_number' => $data['invoice_number'],
                ':customer_id' => $data['customer_id'],
                ':customer_display_name' => $data['customer_display_name'],
                ':customer_email' => $data['customer_email'],
                ':customer_address' => $data['customer_address'],
                ':invoice_subtotal' => $data['subtotal'], // Set subtotal excluding GST
                ':invoice_gst_total' => $data['gstTotal'], // Set GST total
                ':invoice_total' => $data['total'], // Total including GST
                ':invoice_status' => 1  // Assuming 1 means 'created'
            ]);
    
            $invoice_id = $db->lastInsertId();
    
            // Insert each line item
            foreach ($data['line_items'] as $lineItem) {
                $lineItemStmt = $db->prepare("
                    INSERT INTO invoice_line_items (
                        invoice_id, service_date, product_service, description, quantity, rate, amount, gst
                    ) 
                    VALUES (
                        :invoice_id, :service_date, :product_service, :description, :quantity, :rate, :amount, :gst
                    )
                ");
                $lineItemStmt->execute([
                    ':invoice_id' => $invoice_id,
                    ':service_date' => $lineItem['service_date'],
                    ':product_service' => $lineItem['product_service'],
                    ':description' => $lineItem['description'],
                    ':quantity' => $lineItem['quantity'],
                    ':rate' => $lineItem['rate'],
                    ':amount' => $lineItem['amount'],
                    ':gst' => $lineItem['gst'] ? 1 : 0
                ]);
            }
    
            $db->commit();
            return $invoice_id;
        } catch (Exception $e) {
            $db->rollBack();
            error_log("Error creating invoice: " . $e->getMessage());
            return false;
        }
    }
    
    public function get_invoices($status = null, $dateRange = null) {
        $db = BaseModel::getInstance();
        try {
            // Log incoming parameters for debugging
            error_log("Fetching invoices with status: " . $status . ", dateRange: " . $dateRange);
    
            $query = "
                SELECT 
                    invoice_id, invoice_create_date, invoice_number, customer_display_name, 
                    invoice_total, invoice_status 
                FROM 
                    customer_invoice
                WHERE 1=1
            ";
    
            $params = [];
    
            if ($status === 'unpaid') {
                $query .= " AND invoice_status = 0"; // Unpaid
            } elseif ($status === 'paid') {
                $query .= " AND invoice_status = 1"; // Paid
            }
    
            if ($dateRange) {
                $currentDate = date('Y-m-d');
                if ($dateRange === 'last_quarter') {
                    $startDate = date('Y-m-d', strtotime('-3 months'));
                } elseif ($dateRange === 'last_six_months') {
                    $startDate = date('Y-m-d', strtotime('-6 months'));
                } elseif ($dateRange === 'last_twelve_months') {
                    $startDate = date('Y-m-d', strtotime('-12 months'));
                }
                $query .= " AND invoice_create_date BETWEEN :startDate AND :currentDate";
                $params[':startDate'] = $startDate;
                $params[':currentDate'] = $currentDate;
            }
    
            $sth = $db->prepare($query);
            foreach ($params as $key => $value) {
                $sth->bindValue($key, $value);
            }
    
            $sth->execute();
            return $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Error fetching invoices: " . $e->getMessage());
            return false;
        }
    }
    

    public function get_invoice_by_id($invoice_id) {
        $db = BaseModel::getInstance();
        try {
            // Fetch invoice data including customer details
            $sth = $db->prepare("
                SELECT 
                    ci.*, 
                    c.customer_display_name, c.customer_email, c.customer_email, c.company_name, c.customer_address, 
                    il.line_item_id, il.service_date, il.product_service, il.description, 
                    il.quantity, il.rate, il.amount, il.gst
                FROM customer_invoice ci
                LEFT JOIN invoice_line_items il ON ci.invoice_id = il.invoice_id
                LEFT JOIN customer c ON ci.customer_id = c.customer_id
                WHERE ci.invoice_id = :invoice_id
            ");
            $sth->bindParam(':invoice_id', $invoice_id, PDO::PARAM_INT);
            $sth->execute();
            
            $invoice_data = [];
            while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
                // Map the general invoice and customer details
                if (empty($invoice_data)) {
                    $invoice_data = [
                        'invoice_id' => $row['invoice_id'],
                        'invoice_create_date' => $row['invoice_create_date'],
                        'invoice_due_date' => $row['invoice_due_date'],
                        'invoice_number' => $row['invoice_number'],
                        'customer_id' => $row['customer_id'],
                        'customer_display_name' => $row['customer_display_name'],
                        'customer_email' => $row['customer_email'],
                        'company_name' => $row['company_name'],
                        'customer_address' => $row['customer_address'],
                        'invoice_total' => $row['invoice_total'],
                        'invoice_status' => $row['invoice_status'],
                        'line_items' => []
                    ];
                }
    
                // Map the line items
                if ($row['line_item_id']) {
                    $invoice_data['line_items'][] = [
                        'line_item_id' => $row['line_item_id'],
                        'service_date' => $row['service_date'],
                        'product_service' => $row['product_service'],
                        'description' => $row['description'],
                        'quantity' => $row['quantity'],
                        'rate' => $row['rate'],
                        'amount' => $row['amount'],
                        'gst' => $row['gst']
                    ];
                }
            }
    
            return $invoice_data;
        } catch (Exception $e) {
            error_log("Error fetching invoice: " . $e->getMessage());
            return false;
        }
    }
    
    public function update_invoice($invoice_id, $data) {
        $db = BaseModel::getInstance();
        try {
            $db->beginTransaction();
            
            // Update invoice data
            $sth = $db->prepare("
                UPDATE customer_invoice
                SET
                    invoice_create_date = :invoice_create_date,
                    invoice_due_date = :invoice_due_date,
                    customer_display_name = :customer_display_name,
                    customer_email = :customer_email,
                    customer_address = :customer_address,
                    invoice_subtotal = :invoice_subtotal,
                    invoice_gst_total = :invoice_gst_total,
                    invoice_total = :invoice_total
                WHERE invoice_id = :invoice_id
            ");
            $sth->execute([
                ':invoice_create_date' => $data['invoice_create_date'],
                ':invoice_due_date' => $data['invoice_due_date'],
                ':customer_display_name' => $data['customer_display_name'],
                ':customer_email' => $data['customer_email'],
                ':customer_address' => $data['customer_address'],
                ':invoice_subtotal' => $data['subtotal'],
                ':invoice_gst_total' => $data['gstTotal'],
                ':invoice_total' => $data['total'],
                ':invoice_id' => $invoice_id
            ]);
    
            // Fetch current line items from the database
            $currentLineItems = $db->prepare("SELECT line_item_id FROM invoice_line_items WHERE invoice_id = :invoice_id");
            $currentLineItems->execute([':invoice_id' => $invoice_id]);
            $currentLineItemIds = $currentLineItems->fetchAll(PDO::FETCH_COLUMN, 0);
    
            // Get line item IDs from the front end data
            $newLineItemIds = array_column(array_filter($data['line_items'], fn($item) => isset($item['line_item_id'])), 'line_item_id');
    
            // Find line items to delete
            $lineItemsToDelete = array_diff($currentLineItemIds, $newLineItemIds);
            if (!empty($lineItemsToDelete)) {
                $deleteStmt = $db->prepare("DELETE FROM invoice_line_items WHERE line_item_id = :line_item_id");
                foreach ($lineItemsToDelete as $lineItemId) {
                    $deleteStmt->execute([':line_item_id' => $lineItemId]);
                }
            }
    
            // Update or insert line items
            foreach ($data['line_items'] as $lineItem) {
                if (isset($lineItem['line_item_id'])) {
                    // Update existing line items
                    $lineItemStmt = $db->prepare("
                        UPDATE invoice_line_items
                        SET
                            service_date = :service_date,
                            product_service = :product_service,
                            description = :description,
                            quantity = :quantity,
                            rate = :rate,
                            amount = :amount,
                            gst = :gst
                        WHERE line_item_id = :line_item_id
                    ");
                    $lineItemStmt->execute([
                        ':service_date' => $lineItem['service_date'],
                        ':product_service' => $lineItem['product_service'],
                        ':description' => $lineItem['description'],
                        ':quantity' => $lineItem['quantity'],
                        ':rate' => $lineItem['rate'],
                        ':amount' => $lineItem['amount'],
                        ':gst' => $lineItem['gst'] ? 1 : 0,
                        ':line_item_id' => $lineItem['line_item_id']
                    ]);
                } else {
                    // Insert new line items
                    $lineItemStmt = $db->prepare("
                        INSERT INTO invoice_line_items (
                            invoice_id, service_date, product_service, description, 
                            quantity, rate, amount, gst
                        ) VALUES (
                            :invoice_id, :service_date, :product_service, :description, 
                            :quantity, :rate, :amount, :gst
                        )
                    ");
                    $lineItemStmt->execute([
                        ':invoice_id' => $invoice_id,
                        ':service_date' => $lineItem['service_date'],
                        ':product_service' => $lineItem['product_service'],
                        ':description' => $lineItem['description'],
                        ':quantity' => $lineItem['quantity'],
                        ':rate' => $lineItem['rate'],
                        ':amount' => $lineItem['amount'],
                        ':gst' => $lineItem['gst'] ? 1 : 0
                    ]);
                }
            }
    
            // Commit the transaction
            $db->commit();
            return true;
        } catch (Exception $e) {
            $db->rollBack();
            error_log("Error updating invoice: " . $e->getMessage());
            return false;
        }
    }
    
    public function update_status($invoice_id, $new_status) {
        try {
            $db = BaseModel::getInstance();
            $sth = $db->prepare("UPDATE customer_invoice SET invoice_status = :status WHERE invoice_id = :id");
            $sth->bindParam(':status', $new_status, PDO::PARAM_INT);
            $sth->bindParam(':id', $invoice_id, PDO::PARAM_INT);
            return $sth->execute();
        } catch (Exception $e) {
            error_log('Error updating invoice status: ' . $e->getMessage());
            return false;
        }
    }
    
        
}
