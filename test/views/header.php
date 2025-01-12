<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>My Business Information</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta content="My business | 4asolutions" name="description" />
        <meta content="4asolutions" name="author" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />

        <?php
         
        /*
        // Check if the request is HTTPS or HTTP
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

        // Get the server name (e.g., localhost)
        $serverName = $_SERVER['SERVER_NAME'];

        // Get the port if it's not the default for the protocol (e.g., 8080 for HTTP, 443 for HTTPS)
        $port = ($_SERVER['SERVER_PORT'] != '80' && $_SERVER['SERVER_PORT'] != '443') ? ':' . $_SERVER['SERVER_PORT'] : '';

        // Output the full URL
        $url = $protocol . $serverName . $port;
        ?>
        <base href="<?= $url ?>" >

        <!-- App favicon -->
        <link rel="shortcut icon" href="/images/favicon.ico">
        <link href="<?php echo $url; ?>/assets/css/icons.css" rel="stylesheet" type="text/css" />
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="<?php echo $url; ?>/assets/js/jquery-3.5.1.slim.min.js"></script>
        <link href="<?php echo $url; ?>/assets/css/bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="<?php echo $url; ?>/assets/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    </head>

    <body>
        <!-- Navigation Bar-->
        <header id="topnav">
            <!-- Topbar Start -->
            <div class="navbar-custom">
                <div class="container-fluid">
                </div> <!-- end container-fluid-->
            </div>
            <!-- end Topbar -->
        </header>
        <!-- End Navigation Bar-->
    </body>
</html>
*/ ?>


<?php
        $http = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on'? "https://" : "http://";
        // Get the port if it's not the default for the protocol (e.g., 8080 for HTTP, 443 for HTTPS)
        $port = ($_SERVER['SERVER_PORT'] != '80' && $_SERVER['SERVER_PORT'] != '443') ? ':' . $_SERVER['SERVER_PORT'] : '';
        $url = $http . $_SERVER["SERVER_NAME"]. $port;
        ?>
        <base href="<?= $url ?>" >
        <?php
            $url_parts = explode('/', $_GET['rt']);
            $controller = filter_var($url_parts[1], FILTER_UNSAFE_RAW);
            
                // For other pages, include the original bootstrap.css
        ?>
            <!-- App favicon -->
        <link rel="shortcut icon" href="/images/favicon.ico">
        <link href="<?= $url ?>/assets/css/icons.css" rel="stylesheet" type="text/css" />
    
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="<?= $url ?>/assets/js/jquery-3.5.1.slim.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

        <link href="<?= $url ?>/assets/css/bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="<?= $url ?>/assets/css/jquery.dataTables.min.css" rel="stylesheet"  type="text/css" />
        

    </head>

    <body>

        <!-- Navigation Bar-->
        <header id="topnav">

            <!-- Topbar Start -->
            <div class="navbar-custom">
                <div class="container-fluid">
                
                </div> <!-- end container-fluid-->
            </div>
            <!-- end Topbar -->

        </header>
        <!-- End Navigation Bar-->
