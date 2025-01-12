<?php

class SalesModel extends BaseModel {

    public function get_all_sales($status = null, $dateRange = null, $customer = null) {
        $db = BaseModel::getInstance();
        try {
            $query = "
                SELECT 
                    invoice_id, invoice_create_date, invoice_number, customer_display_name, 
                    invoice_total, invoice_status 
                FROM 
                    customer_invoice
                WHERE 1=1
            ";

            // Filter by status
            if ($status && $status !== 'all') {
                $query .= " AND invoice_status = :status";
            }

            // Filter by date range
            if ($dateRange) {
                $currentDate = date('Y-m-d');
                $startDate = null;

                if ($dateRange === 'last_twelve_months') {
                    $startDate = date('Y-m-d', strtotime('-12 months'));
                } elseif ($dateRange === 'last_six_months') {
                    $startDate = date('Y-m-d', strtotime('-6 months'));
                } elseif ($dateRange === 'this_quarter') {
                    $startDate = date('Y-m-d', strtotime('first day of this quarter'));
                }

                if ($startDate) {
                    $query .= " AND invoice_create_date BETWEEN :startDate AND :currentDate";
                }
            }

            // Filter by customer name
            if ($customer) {
                $query .= " AND customer_display_name LIKE :customer";
            }

            $sth = $db->prepare($query);

            // Bind parameters
            if ($status && $status !== 'all') {
                $sth->bindValue(':status', $status);
            }

            if ($startDate && isset($currentDate)) {
                $sth->bindValue(':startDate', $startDate);
                $sth->bindValue(':currentDate', $currentDate);
            }

            if ($customer) {
                $sth->bindValue(':customer', '%' . $customer . '%');
            }

            $sth->execute();
            return $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Error fetching all sales: " . $e->getMessage());
            return false;
        }
    }

    public function get_sales_total($status = null, $dateRange = null, $customer = null) {
        $db = BaseModel::getInstance();
        try {
            $query = "
                SELECT 
                    SUM(invoice_total) AS total_amount 
                FROM 
                    customer_invoice
                WHERE 1=1
            ";

            // Filter by status
            if ($status && $status !== 'all') {
                $query .= " AND invoice_status = :status";
            }

            // Filter by date range
            if ($dateRange) {
                $currentDate = date('Y-m-d');
                $startDate = null;

                if ($dateRange === 'last_twelve_months') {
                    $startDate = date('Y-m-d', strtotime('-12 months'));
                } elseif ($dateRange === 'last_six_months') {
                    $startDate = date('Y-m-d', strtotime('-6 months'));
                } elseif ($dateRange === 'this_quarter') {
                    $startDate = date('Y-m-d', strtotime('first day of this quarter'));
                }

                if ($startDate) {
                    $query .= " AND invoice_create_date BETWEEN :startDate AND :currentDate";
                }
            }

            // Filter by customer name
            if ($customer) {
                $query .= " AND customer_display_name LIKE :customer";
            }

            $sth = $db->prepare($query);

            // Bind parameters
            if ($status && $status !== 'all') {
                $sth->bindValue(':status', $status);
            }

            if ($startDate && isset($currentDate)) {
                $sth->bindValue(':startDate', $startDate);
                $sth->bindValue(':currentDate', $currentDate);
            }

            if ($customer) {
                $sth->bindValue(':customer', '%' . $customer . '%');
            }

            $sth->execute();
            return $sth->fetch(PDO::FETCH_ASSOC)['total_amount'];
        } catch (Exception $e) {
            error_log("Error fetching sales total: " . $e->getMessage());
            return false;
        }
    }

    public function get_gst_total($status = null, $dateRange = null, $customer = null) {
        $db = BaseModel::getInstance();
        try {
            $query = "
                SELECT 
                    SUM(invoice_gst_total) AS total_amount 
                FROM 
                    customer_invoice
                WHERE 1=1
            ";

            // Filter by status
            if ($status && $status !== 'all') {
                $query .= " AND invoice_status = :status";
            }

            // Filter by date range
            if ($dateRange) {
                $currentDate = date('Y-m-d');
                $startDate = null;

                if ($dateRange === 'last_twelve_months') {
                    $startDate = date('Y-m-d', strtotime('-12 months'));
                } elseif ($dateRange === 'last_six_months') {
                    $startDate = date('Y-m-d', strtotime('-6 months'));
                } elseif ($dateRange === 'this_quarter') {
                    $startDate = date('Y-m-d', strtotime('first day of this quarter'));
                }

                if ($startDate) {
                    $query .= " AND invoice_create_date BETWEEN :startDate AND :currentDate";
                }
            }

            // Filter by customer name
            if ($customer) {
                $query .= " AND customer_display_name LIKE :customer";
            }

            $sth = $db->prepare($query);

            // Bind parameters
            if ($status && $status !== 'all') {
                $sth->bindValue(':status', $status);
            }

            if ($startDate && isset($currentDate)) {
                $sth->bindValue(':startDate', $startDate);
                $sth->bindValue(':currentDate', $currentDate);
            }

            if ($customer) {
                $sth->bindValue(':customer', '%' . $customer . '%');
            }

            $sth->execute();
            return $sth->fetch(PDO::FETCH_ASSOC)['total_amount'];
        } catch (Exception $e) {
            error_log("Error fetching sales total: " . $e->getMessage());
            return false;
        }
    }
}
