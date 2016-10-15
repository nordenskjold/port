<?php
include("includes/admin-include.php") ;
include("includes/connection.php") ;
include("includes/functions.php");
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Untitled Document</title>
</head>

<body>
<a href="logout.php">Logout</a>
<h1>PORT</h1>
    <ul>
        <li><a href="index.php">Home</a></li>
        <li><a href="showcases.php">Showcases</a></li>
        <li><a href="#">Blogposts</a></li>
        <li><a href="#">Fields</a></li>
        <li><a href="#">Style</a></li>
    </ul>
<br/>
<br/>
    <?php
	listShowcases();
	?>
    </ul>
</body>
</html>