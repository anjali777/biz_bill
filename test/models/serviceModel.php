<?php

class ServiceModel extends BaseModel {
    public function get_services() {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("SELECT * FROM services");
        $sth->execute();
        return $sth->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create_service($data) {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("
            INSERT INTO services (name, sku, service_image, category, description, sales_price, income_account, gst_inclusive, purchase_from_supplier)
            VALUES (:name, :sku, :service_image, :category, :description, :sales_price, :income_account, :gst_inclusive, :purchase_from_supplier)
        ");
        return $sth->execute($data);
    }

    public function update_service($id, $data) {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("
            UPDATE services
            SET name = :name, sku = :sku, service_image = :service_image, category = :category,
                description = :description, sales_price = :sales_price, income_account = :income_account,
                gst_inclusive = :gst_inclusive, purchase_from_supplier = :purchase_from_supplier
            WHERE service_id = :id
        ");
        $data['id'] = $id;
        return $sth->execute($data);
    }

    public function delete_service($id) {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("DELETE FROM services WHERE service_id = :id");
        $sth->bindParam(':id', $id, PDO::PARAM_INT);
        return $sth->execute();
    }
}
