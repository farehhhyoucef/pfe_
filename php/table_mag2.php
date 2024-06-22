<?php
session_start();
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
    $response['etat_status'] = 'warning';

    // Begin transaction
    $conn->begin_transaction();

    $allSuccessful = true;

    // Loop through each row of data and perform the desired database operations
    foreach ($data as $row) {
        $n_serie = $conn->real_escape_string($row['n_serie']);
        $entreprise = $conn->real_escape_string($row['nom_entreprise']);
        $id = $conn->real_escape_string($row['id_client']);
        $id_c = $conn->real_escape_string($row['id_demande']);
        $id_magasinier = $_SESSION['user_id'];

        // Construct the SQL query to update the compteur table
        $sql = "UPDATE compteur
                SET id_client = '$id', nom_entreprise = '$entreprise', id_magasinier = '$id_magasinier', etat = 'forne'
                WHERE n_serie = '$n_serie'";

        if ($conn->query($sql) === TRUE) {
            // If the first query was successful, update the etat_demande
            $sql_update = "UPDATE demande_compteur
                           SET etat_demande = 'valide' 
                           WHERE id_demande_c = '$id_c'";

            if ($conn->query($sql_update) === TRUE) {
                $response['update_status'][] = "Record updated successfully for n_serie $n_serie";
                $response['etat_status'] = "ok";
            } else {
                $response['update_status'][] = "Error updating etat_demande for n_serie $n_serie: " . $conn->error;
                $allSuccessful = false;
            //     break; // Exit the loop if an error occurs
             }
        } else {
            $response['update_status'][] = "Error updating record for n_serie $n_serie: " . $conn->error;
            $allSuccessful = false;
         //   break; // Exit the loop if an error occurs
        }
    }

    if ($allSuccessful) {
        // If all queries were successful, commit the transaction
        $conn->commit();
    } else {
        // If any query failed, rollback the transaction
        $conn->rollback();
        $response['status'] = 'error';
        $response['message'] = 'Transaction failed and was rolled back';
    }
} else {
    $response['message'] = 'No data received';
}

// Return the response as JSON
echo json_encode($response);

$conn->close();
?>
