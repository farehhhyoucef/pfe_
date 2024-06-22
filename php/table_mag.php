
    

<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pfe";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}




$sql = "SELECT n_serie,type,date_entree,categorie,reonnage FROM compteur where etat='stocke'  ORDER BY n_serie asc ";

$result = $conn->query($sql);
$rows=array();
if ($result->num_rows > 0) {
    // Fetch all rows and store them in the $rows array
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}

// Embed JSON data into HTML
$json_data = json_encode($rows);

// Write JSON data to a file
echo $json_data;


?>

