<?php


// Include your database connection

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

$data = json_decode(file_get_contents('php://input'), true);
$idClient = $data['id_client'];
$action = $data['action'];

if ($idClient && $action) {
    if ($action === 'accept') {
        $query = "UPDATE demande_remise SET etat = 'pret' WHERE id_client = ?";
    } elseif ($action === 'refuse') {
        $query = "UPDATE demande_remise SET etat = 'refuse' WHERE id_client = ?";
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid action"]);
        exit;
    }

    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $idClient);
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Client status updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to update client status"]);
    }
    $stmt->close();
    $conn->close();
} else {
    http_response_code(400);
    echo json_encode(["message" => "Invalid client ID or action"]);
}
?>
