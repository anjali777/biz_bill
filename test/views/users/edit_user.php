<!-- ============================================================== -->
<!-- Start Page Content here -->
<!-- ============================================================== -->
<div class="wrapper">
    <div class="container-fluid" style="box-shadow: 0 3px 10px rgb(0,0,0,0.2);">
            <div class="row">
                <div class="col-12">
                    <div class="card-box">
                        <h4 class="header-title m-t-0">Edit User Form</h4>
                        <p class="text-muted font-14 m-b-20">
                            Please edit details as required below and then click the Update button.
                        </p>
                    <?php  $i = 0;//print_r($this->user_data); ?>
                        <form action="https://<?= $_SERVER["SERVER_NAME"]; ?>/barry/users" method="POST" id="edit_date_match_validation">
                            <div class="form-row">
                                <div class="col-6">
                                    <label for="id">User ID<span class="text-danger">*</span></label>
                                    <input type="text" name="id" class="form-control" id="id" parsley-trigger="change" value="<?= $this->user_data[$i]['id']; ?>" readonly>
                                </div>
                                <div class="col-6">
                                    <label for="background_color">Background Color<span class="text-danger">*</span></label>
                                        <input type="color" name="background_color" class="form-control" id="background_color" parsley-trigger="change" value="<?= $this->user_data[$i]['background_color']; ?>">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-6">
                                    <label for="employee_since">Employee Since<span class="text-danger">*</span></label>
                                    <input type="text" name="employee_since" parsley-trigger="change" required value="<?= $this->user_data[$i]['employee_since']; ?>"
                                        placeholder="Employee Since" class="form-control" id="employee_since">
                                </div>
                                <div class="col-6">
                                    <label for="foreground_color">Foreground Color<span class="text-danger">*</span></label>
                                        <input type="color" name="foreground_color" value="<?= $this->user_data[$i]['foreground_color']; ?>" class="form-control" id="foreground_color" parsley-trigger="change" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-6">
                                    <label for="employee_initials">Employee Initials<span class="text-danger">*</span></label>
                                    <input type="text" name="employee_initials" parsley-trigger="change" required value="<?= $this->user_data[$i]['employee_initials']; ?>"
                                        placeholder="Employee Initials" class="form-control" id="employee_initials">
                                </div>
                                <div class="col-6">
                                    <label for="first_name">First Name<span class="text-danger">*</span></label>
                                    <input type="text" name="first_name" parsley-trigger="change" required value="<?= $this->user_data[$i]['first_name']; ?>"
                                        placeholder="Enter first name" class="form-control" id="first_name">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-6">
                                    <label for="suburb_name">Suburb Name<span class="text-danger">*</span></label>
                                    <input type="text" name="suburb_name" parsley-trigger="change" required value="<?= $this->user_data[$i]['suburb_name']; ?>"
                                        placeholder="Enter first name" class="form-control" id="suburb_name">
                                </div>
                                <div class="col-6">
                                    <label for="zip_code">Zip code<span class="text-danger">*</span></label>
                                    <input type="text" name="zip_code" parsley-trigger="change" required value="<?= $this->user_data[$i]['zip_code']; ?>"
                                        placeholder="Zip Code" class="form-control" id="zip_code">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-6">
                                    <label for="email_address">Email address<span class="text-danger">*</span></label>
                                    <input type="email" name="email_address" parsley-trigger="change" required value="<?= $this->user_data[$i]['email_address']; ?>"
                                        placeholder="Enter email address" class="form-control" id="email_address">
                                </div>
                                <div class="col-6">
                                    <label for="first_holidays_from">First Holidays From<span class="text-danger">*</span></label>
                                    <input type="text" name="first_holidays_from" parsley-trigger="change" required value="<?= $this->user_data[$i]['first_holidays_from']; ?>"
                                        placeholder="First Holidays From" class="form-control" id="first_holidays_from">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-6">
                                        <label for="first_holidays_to">First Holidays To<span class="text-danger">*</span></label>
                                        <input type="text" name="first_holidays_to" parsley-trigger="change" required value="<?= $this->user_data[$i]['first_holidays_to']; ?>"
                                            placeholder="First Holidays To" class="form-control" id="first_holidays_to">
                                    </div>
                                <div class="col-6">
                                    <label for="second_holidays_from">Second Holidays From<span class="text-danger">*</span></label>
                                    <input type="text" name="second_holidays_from" parsley-trigger="change" required value="<?= $this->user_data[$i]['second_holidays_from']; ?>"
                                        placeholder="Second Holidays From" class="form-control" id="second_holidays_from">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-6">
                                    <label for="second_holidays_to">Second Holidays To<span class="text-danger">*</span></label>
                                    <input type="text" name="second_holidays_to" parsley-trigger="change" required value="<?= $this->user_data[$i]['second_holidays_to']; ?>"
                                        placeholder="Second Holidays To" class="form-control" id="second_holidays_to">
                                </div>
                                <div class="col-6">
                                    <?PHP
                                        if ($this->user_data[$i]['employee_working'] == 1) {
                                            $checked = "checked";
                                        } else {
                                            $checked = "";
                                        }
                                    ?>
                                    <label for="employee_working">Employee Working Status<span class="text-danger">*</span></label>
                                    <input id="employee_working" type="checkbox" class="form-control" value="1" style="width:37px;" name="employee_working" <?= $checked; ?>>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col-6">
                                    <label for="availability">Employee Availability<span class="text-danger">*</span></label><br />
                                    <select name="availability[]" id="availability" multiple style="width:100%;">
                                        <?php 
                                            $weekdays = explode(",", $this->user_data[$i]['available_days']);
                                        ?>
                                        <?php $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; ?>
                                        <?php foreach ($daysOfWeek as $index => $day): ?>
                                            <option value="<?php echo $index; ?>" <?php if(in_array($index, $weekdays)) echo 'selected'; ?>><?php echo $day; ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div><br /><br />
                            <div class="form-group text-left m-b-0">
                                <button class="btn btn-primary" type="submit" name="btn_update_user">
                                    Update User
                                </button>
                                <a href="https://<?= $_SERVER["SERVER_NAME"]; ?>/barry/users/display_users" class="btn btn-dark"><i class=" mr-1"></i> Cancel</a>
                               
                            </div>
                        </form>
                    </div> <!-- end card-box -->
                </div>
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
        document.addEventListener('DOMContentLoaded', function() {
        var form = document.getElementById('edit_date_match_validation'); 

            form.addEventListener('submit', function(event) {
                var firstFrom = new Date(document.getElementById('first_holidays_from').value);
                var firstTo = new Date(document.getElementById('first_holidays_to').value);
                var secondFrom = new Date(document.getElementById('second_holidays_from').value);
                var secondTo = new Date(document.getElementById('second_holidays_to').value);

                if (firstFrom > firstTo || secondFrom > secondTo) {
                    alert('Employee holidays To Date should not be less than holidays from date');
                    event.preventDefault(); // Prevent form submission
                }
            });
        });
    </script>