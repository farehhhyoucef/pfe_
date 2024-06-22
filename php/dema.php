
    

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



$sql = "SELECT client.id_client,nom,prenom,type_c,reference,n_affire,categorie,adresse,id_demande_c FROM demande_compteur inner join client on client.id_client=demande_compteur.id_client where etat_demande='pret' ";
$sql1="SELECT n_serie from compteur where id_client is null";
$result = $conn->query($sql);
$result1 = $conn->query($sql1);

$rows = array(); 
if ($result->num_rows > 0) { 
    while($row = $result->fetch_assoc()) { 
        $rows[] = $row;
    } 
} 
$rows1 = array(); 
if ($result1->num_rows > 0) { 
  while($row1 = $result1->fetch_assoc()) { 
      $rows1[] = $row1; 
  } 
} 
$response = array( 
    'data' => $rows, 
    'data2'=>$rows1
); 
 
header('Content-Type: application/json'); 
echo json_encode($response); 
 
$conn->close();

// header('Content-Type: application/json');

// // Get the raw POST data
// $json = file_get_contents('php://input');

// // Decode the JSON data
// $data = json_decode($json, true);
// echo('fdaafd');



?>

