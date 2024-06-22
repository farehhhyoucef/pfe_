<?php
$servername = "localhost";
$dbname = "pfe";
$username = "root";
$password = "";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT r.id_remise, r.date_coupure, r.nom_entreprise, r.remarque, r.type, cc.nom, cc.prenom, cc.adresse, cc.reference 
        FROM remise r 
        INNER JOIN (
            SELECT cl.id_client, cl.nom, cl.prenom, cl.adresse, dc.reference 
            FROM client cl  
            INNER JOIN demande_compteur dc ON cl.id_client = dc.id_client
        ) cc ON cc.id_client = r.id_client where r.remarque='non paye' " ;
$result = $conn->query($sql);
$sql4 = "SELECT r.id_remise, r.date_coupure, r.nom_entreprise, r.remarque, r.type, cc.nom, cc.prenom, cc.adresse, cc.reference 
        FROM remise r 
        INNER JOIN (
            SELECT cl.id_client, cl.nom, cl.prenom, cl.adresse, dc.reference 
            FROM client cl  
            INNER JOIN demande_compteur dc ON cl.id_client = dc.id_client
        ) cc ON cc.id_client = r.id_client where r.remarque='paye'";
$result4 = $conn->query($sql4);

$sql2 = "SELECT count(*) AS non_paye_count FROM remise WHERE remarque = 'non paye'";
$sql3 = "SELECT count(*) AS paye_count FROM remise WHERE remarque = 'paye'";
$sql5 = "SELECT count(*) AS demande FROM demande_remise WHERE etat = 'pret'";
$result2 = $conn->query($sql2);
$result3 = $conn->query($sql3);
$result5 = $conn->query($sql5);

$rows = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}
$rows2 = array();
if ($result2->num_rows > 0) {
  while($row2 = $result4->fetch_assoc()) {
      $rows2[] = $row2;
  }
}

$nonPayeCount = $result2->fetch_assoc()['non_paye_count'];
$payeCount = $result3->fetch_assoc()['paye_count'];
$demande = $result5->fetch_assoc()['demande'];

$response = array(
    'data' => $rows,
    'counts' => array(
        'non_paye' => $nonPayeCount,
        'paye' => $payeCount,
        'demande' => $demande

    ),
    'data2'=>$rows2
);

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>

