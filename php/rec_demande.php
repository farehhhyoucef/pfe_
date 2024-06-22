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

// Set the content type to JSON
header('Content-Type: application/json');

// Get the raw POST data
$json = file_get_contents('php://input');

// Decode the JSON data
$data = json_decode($json, true);

$response = ['status' => 'error', 'message' => 'No data received'];

if (!empty($data)) {
    $response['status'] = 'success';
    $response['update_status'] = [];

    // Loop through each row of data and perform the desired database operations
    foreach ($data as $row) {
       
        
        $id = $conn->real_escape_string($row['id_client']);
        $id_c = $conn->real_escape_string($row['id_demande']);
        $n_affire = $conn->real_escape_string($row['n_affire']);

        // Construct the SQL query to update the demande_compteur table
        $sql = "UPDATE demande_compteur
                SET n_affire = '$n_affire', etat_demande = 'pret'
                WHERE id_demande_c = '$id_c'";

        if ($conn->query($sql) === TRUE) {
            $response['update_status'][] = "Record updated successfully for id_demande_c $id_c";
        } else {
            $response['update_status'][] = "Error updating record for id_demande_c $id_c: " . $conn->error;
        }
    }
} else {
    $response['message'] = 'No data received';
}

// Return the response as JSON
echo json_encode($response);

$conn->close();
?>
