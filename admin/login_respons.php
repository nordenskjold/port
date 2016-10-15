<?php
session_start();

include("includes/connection.php") ;


$username = $_POST['username'];
$password = $_POST['password'];

$result = mysql_query("SELECT id FROM users WHERE username='$username' AND  password='$password'") or die(mysql_error());
$row = mysql_fetch_array( $result );
$id = (int)$row['id'];

if ($id > 0) {
	$_SESSION['loggedin']="ok";
	$_SESSION['wrong']="";
	header("location:index.php");
 	//success
 
}else{
	$_SESSION['wrong']="Wrong username or password";
 	header("location:login.php");
 	//send user back
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Untitled Document</title>
</head>

<body>
<h1>Grattis du har vunnit en bil!</h1>
<a href="index.php">gå vidare till admin</a>
</body>
</html>