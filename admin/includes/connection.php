<?php
$con = mysql_connect("ellenn.se.mysql", "ellenn_se", "znsQab3h") or die("Could not connect to the database");
$db_selected = mysql_select_db("ellenn_se", $con) or die("Could not select correct database");
?>