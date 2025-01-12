<?php

class ProductModel extends BaseModel {
    public function get_products() {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("SELECT * FROM products");
        $sth->execute();
        return $sth->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create_product($data) {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("
            INSERT INTO products (name, sku, product_image, category, description, sales_price, income_account, gst_inclusive, purchase_from_supplier)
            VALUES (:name, :sku, :product_image, :category, :description, :sales_price, :income_account, :gst_inclusive, :purchase_from_supplier)
        ");
        return $sth->execute($data);
    }

    public function update_product($id, $data) {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("
            UPDATE products
            SET name = :name, sku = :sku, product_image = :product_image, category = :category,
                description = :description, sales_price = :sales_price, income_account = :income_account,
                gst_inclusive = :gst_inclusive, purchase_from_supplier = :purchase_from_supplier
            WHERE product_id = :id
        ");
        $data['id'] = $id;
        return $sth->execute($data);
    }

    public function delete_product($id) {
        $db = BaseModel::getInstance();
        $sth = $db->prepare("DELETE FROM products WHERE product_id = :id");
        $sth->bindParam(':id', $id, PDO::PARAM_INT);
        return $sth->execute();
    }
}
