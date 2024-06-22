
    

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




$sql = "SELECT nom,prenom,type_c,reference,n_affire,categorie,adresse FROM demande_compteur inner join client on client.id_client=demande_compteur.id_client";
$sql=
$result = $conn->query($sql);
  $rows[]=array();
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

