<div class="wrapper">
    <div class="container-fluid" style="box-shadow: 0 3px 10px rgb(0,0,0,0.2);">
        <div class="row">
            <div class="col-12">
                <form action="<?= $url ?>/users/save_user" method="POST" id="date_match_validation">

                    <h2 class="text-center">Add a new Customer</h2> 
                    <p class="text-center">
                        Please complete all fields below in order to create a new user for your organisation.
                    </p>
                    <div class="form-row">
                        <div class="col-6">
                            <label for="customer_id">Customer ID<span class="text-danger">*</span></label>
                            <input type="text" name="customer_id" placeholder="Customer ID" class="form-control" id="customer_id" parsley-trigger="change" required>
                        </div>
                        <div class="col-6">
                            <label> Your Salutation (required)
                                <span class="wpcf7-form-control-wrap">
                                    <select name="salutation" class="select-full-width" aria-required="true" aria-invalid="false">
                                        <option value="mr.">Mr.</option>
                                        <option value="mrs.">Mrs.</option>
                                        <option value="miss">Miss</option>
                                        <option value="Dr.">Dr.</option>
                                        <option value="ms.">Ms.</option>
                                    </select>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-6">
                            <label for="first_name">First Name of Customer<span class="text-danger">*</span></label>
                            <input type="text" name="first_name" placeholder="First Name of Customer" class="form-control" id="first_name" parsley-trigger="change" required>
                        </div>
                        <div class="col-6">
                            <label for="last_name">Last Name of Customer<span class="text-danger">*</span></label>
                            <input type="text" name="last_name" placeholder="Last Name of Customer" class="form-control" id="last_name" parsley-trigger="change" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-6">
                            <label for="customer_display_name">Customer Display Name<span class="text-danger">*</span></label>
                            <input type="text" name="customer_display_name" placeholder="Customer Display Name" class="form-control" id="customer_display_name" parsley-trigger="change" required>
                        </div>
                        <div class="col-6">
                            <label for="company_name">Company Name<span class="text-danger">*</span></label>
                            <input type="text" name="company_name" placeholder="Company Name" class="form-control" id="company_name" parsley-trigger="change" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-6">
                            <label for="customer_email">Email address<span class="text-danger">*</span></label>
                            <input type="email" name="customer_email" placeholder="Email Address" class="form-control" id="customer_email" parsley-trigger="change" required>
                        </div>
                        <div class="col-6">
                            <label for="customer_phone_number">Phone Number<span class="text-danger">*</span></label>
                            <input type="text" name="customer_phone_number" placeholder="Customer Phone Number" class="form-control" id="customer_phone_number" parsley-trigger="change" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-6">
                            <label for="customer_mobile_number">Mobile Number<span class="text-danger">*</span></label>
                            <input type="text" name="customer_mobile_number" placeholder="Mobile Number" class="form-control" id="customer_mobile_number" parsley-trigger="change" required>
                        </div>
                        <div class="col-6">
                            <label for="customer_address">Customer Address<span class="text-danger">*</span></label>
                            <input type="text" name="customer_address" placeholder="Customer Address" class="form-control" id="customer_address" parsley-trigger="change" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-6">
                            <label for="customer_street_number">Street Number<span class="text-danger">*</span></label>
                            <input type="text" name="customer_street_number" placeholder="Street Number" class="form-control" id="customer_street_number" parsley-trigger="change" required>
                        </div>
                        <div class="col-6">
                            <label for="customer_suburb">Suburb<span class="text-danger">*</span></label>
                            <input type="text" name="customer_suburb" placeholder="Suburb" class="form-control" id="customer_suburb" parsley-trigger="change" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-6">
                            <label for="customer_state">State<span class="text-danger">*</span></label>
                            <input type="text" name="customer_state" placeholder="State" class="form-control" id="customer_state" parsley-trigger="change" required>
                        </div>
                        <div class="col-6">
                            <label for="customer_postcode">Postcode<span class="text-danger">*</span></label>
                            <input type="text" name="customer_postcode" placeholder="Postcode" class="form-control" id="customer_postcode" parsley-trigger="change" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-6">
                            <label for="customer_country">Country<span class="text-danger">*</span></label>
                            <input type="text" name="customer_country" placeholder="Country" class="form-control" id="customer_country" parsley-trigger="change" required>
                        </div>
                        <div class="col-6">
                            <input type="hidden" name="customer_registeration_completed" class="form-control" id="customer_registeration_completed" value="1" parsley-trigger="change">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-6">
                            <input type="hidden" name="customer_registeration_email_sent" class="form-control" id="customer_registeration_email_sent" value="0" parsley-trigger="change">
                        </div>
                        <div class="col-6">
                            <input type="hidden" name="Customer_account_enabled" value="1" class="form-control" id="Customer_account_enabled" parsley-trigger="change">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-auto">
                            <button class="btn btn-primary" type="submit" name="btn_save_user">
                                Create User
                            </button>
                            <a href="<?php echo $url; ?>/users/display_users" class="btn btn-dark"><i class=" mr-1"></i> Cancel</a>
                        </div>
                    </div>
                    <br /><br />
                </form>
            </div>
        </div>
    </div> <!-- end container -->
</div>
<!-- end wrapper -->

<!-- ============================================================== -->
<!-- End Page content -->
<!-- ============================================================== -->

