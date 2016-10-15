<?php
session_start();
	if($_SESSION['loggedin']=="ok"){
//...
 
}else{
 	header("location:login.php");

}

?>
