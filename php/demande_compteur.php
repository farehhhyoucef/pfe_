<?php
// Database connection
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

// SQL query to select data from demande_remise and client tables
$sql = "SELECT n_telephone, nom, prenom, adresse 
        FROM demande_compteur dc
        INNER JOIN client c ON dc.id_client = c.id_client 
        WHERE dc.etat_demande IN ('valide', 'pret')";

$result = $conn->query($sql);

$rows = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($rows);

$conn->close();
?>
