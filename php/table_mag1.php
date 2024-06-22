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

// Prepare and execute the first SQL query
$sql = "SELECT client.id_client, nom, prenom, type_c, reference, n_affire, categorie, adresse, id_demande_c 
        FROM demande_compteur 
        INNER JOIN client ON client.id_client = demande_compteur.id_client 
        WHERE etat_demande = 'pret'";
$result = $conn->query($sql);

// Prepare and execute the second SQL query
$sql1 = "SELECT n_serie, type, categorie FROM compteur WHERE etat = 'stocke'";
$result1 = $conn->query($sql1);

// Check and process the results of the first query
$rows = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}

// Check and process the results of the second query
$rows1 = array();
if ($result1->num_rows > 0) {
    while($row1 = $result1->fetch_assoc()) {
        $rows1[] = $row1;
    }
}

// Map available n_serie to the corresponding client requests
foreach ($rows as &$row) {
    $row['option'] = [];
    foreach ($rows1 as $compteur) {
        if ($compteur['type'] == $row['type_c'] && $compteur['categorie'] == $row['categorie']) {
            $row['option'][] = $compteur['n_serie'];
        }
    }
}

// Prepare the response
$response = array('data' => $rows);

// Set the content type to JSON and echo the response
header('Content-Type: application/json');
echo json_encode($response);

// Close the connection
$conn->close();
?>
