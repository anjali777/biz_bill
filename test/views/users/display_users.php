<link href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" rel="stylesheet">
        <link href="https://cdn.datatables.net/select/1.7.0/css/select.dataTables.min.css" rel="stylesheet">
        <link href="https://editor.datatables.net/extensions/Editor/css/editor.dataTables.min.css" rel="stylesheet">
<div class="wrapper">
    <div class="container-fluid" style="box-shadow: 0 3px 10px rgb(0,0,0,0.2);">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-sm-4">
                                    <a href="<?php echo $url; ?>" class="btn btn-primary"><i class="mdi mdi-plus-circle mr-1"></i> Add a user</a>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table id="customer_data" class="display" style="width:100%">
                                    <thead>
                                        <tr>
                                            <th>salutation</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Customer Display Name</th>
                                            <th>Company Name</th>
                                            <th>Customer Email</th>
                                            <th>Phone Number</th>
                                            <th>Mobile Number</th>
                                            <th>Address</th>
                                            <th>Street Number</th>
                                            <th>Suburb</th>
                                            <th>State</th>
                                            <th>Postcode</th>
                                            <th>Country</th>
                                            <th style="width: 140px;">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <?php
                                        foreach ($this->user_data as $user) {
                                            ?>
                                            <tr>
                                                <td class="table-user" style="background-color: <?= $user['background_color']; ?>;">
                                                    <?= $user['salutation']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['first_name']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['last_name']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['customer_display_name']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['company_name']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['customer_email']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['customer_phone_number']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['customer_mobile_number']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['customer_address']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['customer_street_number']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['customer_suburb']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['customer_state']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['customer_postcode']; ?>
                                                </td>
                                                <td>
                                                    <?= $user['customer_country']; ?>
                                                </td>
                                                <td>
                                                    <a href="<?= $url ?>/users/edit_user/<?= $user['id']; ?>" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
                                                    <a href="<?= $url ?>/users/delete_user/<?= $user['id']; ?>" class="action-icon" onclick="if (confirmDelete()) return true; else return false;"><i class="mdi mdi-delete"></i></a>
                                                </td>
                                            </tr>
                                            <?php
                                        }
                                        ?>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th>salutation</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Customer Display Name</th>
                                            <th>Company Name</th>
                                            <th>Customer Email</th>
                                            <th>Phone Number</th>
                                            <th>Mobile Number</th>
                                            <th>Address</th>
                                            <th>Street Number</th>
                                            <th>Suburb</th>
                                            <th>State</th>
                                            <th>Postcode</th>
                                            <th>Country</th>
                                            <th style="width: 140px;">Actions</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div> <!-- end card-body-->
                    </div> <!-- end card-->
                </div> <!-- end col -->
            </div>
            <!-- end row -->
            </div> <!-- end container -->
        </div>
        <!-- end wrapper -->
    </div>                                       
    <!-- ============================================================== -->
    <!-- End Page content -->
    <!-- ============================================================== -->
    <script>
        $(document).ready(function() {
            $('#customer_data').DataTable({
                scrollX: false,
                "lengthChange": false,
                "searching": true,
                "ordering": false,
                "info": false,
                scrollY: "500px",
                scrollCollapse: !0,
                paging: 1,
            });
        });
        function confirmDelete() {
            return confirm("Are you sure you want to delete this user?");
        }
    </script>
    
        
   
