
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




$sql = "SELECT date_entree,n_serie,fullname,reference,n_affire,adresse,nom_entreprise FROM compteur inner join(select client.id_client,CONCAT(nom, ' ', prenom) As fullname,reference,n_affire,adresse,n_telephone from client inner join demande_compteur on client.id_client=demande_compteur.id_client ) ss on ss.id_client=compteur.id_client ";

$result = $conn->query($sql);
$rows=array();
if ($result->num_rows > 0) {
    // Fetch all rows and store them in the $rows array
    $rows=array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}

$sql2 = "SELECT count(*) AS compteur_stocke FROM compteur WHERE etat = 'stocke'"; 
$sql3 = "SELECT count(*) AS compteur_vendue FROM compteur WHERE etat !='stocke'"; 
$sql5 = "SELECT count(*) AS demande FROM demande_compteur WHERE etat_demande = 'pret'"; 
$result2 = $conn->query($sql2); 
$result3 = $conn->query($sql3); 
$result5 = $conn->query($sql5); 

$nonPayeCount = array();
$payeCount = array();
$demande = array();


$nonPayeCount = $result2->fetch_assoc()['compteur_stocke']; 
$payeCount = $result3->fetch_assoc()['compteur_vendue']; 
$demande = $result5->fetch_assoc()['demande']; 
 
$response = array( 
    'data' => $rows, 
    'counts' => array( 
        'compteur_stocke' => $nonPayeCount, 
        'compteur_vendue' => $payeCount, 
        'demande' => $demande 
 
    ) 
     
);

// Embed JSON data into HTML
$json_data = json_encode($response);

// Write JSON data to a file
echo $json_data;


?>

