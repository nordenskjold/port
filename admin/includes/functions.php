<?php

function listShowcases(){
	echo "<ul>";
	$showcases = mysql_query("SELECT * FROM showcases ORDER BY id") or die(mysql_error());
	if(mysql_num_rows($showcases) == 0){
		echo "No showcases";
	}
	else{
		while($row = mysql_fetch_array($showcases, MYSQL_ASSOC)){
			echo "<li>" . $row['title'] . "<a href=\"edit.php\">Edit</a> | <a href=\"delete.php?id=" . $row['id'] . "\">Delete</a></li>"; 
		} 
	}
	echo "</ul>";	
}


function deleteShowcase($id){
	$id= (int) $id;
	mysql_query("DELETE FROM showcases WHERE id = $id") or die(mysql_error());
	header("location:showcases.php");
}

?>