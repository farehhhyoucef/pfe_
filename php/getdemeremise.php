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
$sql="SELECT * FROM demande_remise dr inner join client c on dr.id_client=c.id_client where etat='pret' ";
$result=$conn->query($sql);
if($result->num_rows > 0){
    while($row=$result->fetch_assoc()){
        $rows[]=$row;
    }
    header('Content-Type: application/json');
    echo json_encode($rows);
}