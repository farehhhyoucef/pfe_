<?php

// Database connection details (replace with your actual credentials)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pfe";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
  exit();
}

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data === null) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
    exit();
}

// Process the checked rows data
foreach ($data as $row) {
    $id = $row['id'];
    $nom = $row['nom'];
    $prenom = $row['prenom'];

    $sql = "UPDATE demande_remise SET etat = 'valide' WHERE id_client = ?";
    
    // Prepare and execute the first SQL statement
    $stmt1 = $conn->prepare($sql);
    if ($stmt1) {
        $stmt1->bind_param("i", $id);
        $stmt1->execute();
        $stmt1->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement 1']);
        exit();
    }

    $sql2 = "UPDATE remise SET remarque = 'paye' WHERE id_client = ?";
    
    // Prepare and execute the second SQL statement
    $stmt2 = $conn->prepare($sql2);
    if ($stmt2) {
        $stmt2->bind_param("i", $id);
        $stmt2->execute();
        $stmt2->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement 2']);
        exit();
    }
}

echo json_encode(['status' => 'success', 'message' => 'Data processed successfully']);

$conn->close();

?>
