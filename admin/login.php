<?php session_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Untitled Document</title>
</head>

<body>
<form action="login_respons.php" method="post">

<input type="text" name="username" />
<input type="password" name="password" />
<input type="submit" value="Login" />
<br/>
<?php if(isset($_SESSION['wrong'])){
	echo $_SESSION['wrong'];
}
?>

</form>
</body>
</html>