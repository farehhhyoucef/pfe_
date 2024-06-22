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
        FROM demande_remise dr
        INNER JOIN client c ON dr.id_client = c.id_client 
        WHERE dr.etat IN ('valide', 'pret')";

        $sql2 = "SELECT count(*) AS remise FROM demande_remise WHERE etat = 'attente' " ;
        $sql3 = "SELECT count(*) AS nouveau FROM demande_compteur where reference is null  and etat_demande = 'attente' " ;
        $sql4 = "SELECT count(*) AS changement FROM demande_compteur WHERE reference is not null  and etat_demande = 'attente' " ; 


$result = $conn->query($sql);
$result2 = $conn->query($sql2);
$result3 = $conn->query($sql3);
$result4 = $conn->query($sql4);

$remise = $result2 -> fetch_assoc()['remise']; 
$nouveau = $result3 -> fetch_assoc()['nouveau']; 
$changement = $result4 -> fetch_assoc()['changement']; 


$rows = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}

$response = array(
    'data' => $rows,
   'counts' => array(
    'remise' => $remise,
     'nouveau' => $nouveau,
     'changement' => $changement,
   ),
   
);
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
