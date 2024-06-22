<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pfe";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(array("status" => "error", "message" => "Connection failed: " . $conn->connect_error)));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['nom'])) {
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $address = $_POST['addresse'];
    $telphone = $_POST['n_telephone'];
    $type = $_POST['type_c'];

    // Start transaction
    $conn->begin_transaction();

    try {
        // Prepare SQL statement to insert data into the client table
        $stmt = $conn->prepare("INSERT INTO client (nom, prenom, adresse, n_telephone) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $nom, $prenom, $address, $telphone);

        if ($stmt->execute()) {
            $last_id = $conn->insert_id; // Get the last inserted client ID
            $target_dir = "uploads/uploads/";

            // Ensure the uploads directory exists
            if (!is_dir($target_dir)) {
                mkdir($target_dir, 0777, true);
            }

            // Use last inserted client ID for the file name
            $target_file = $target_dir . $last_id . ".pdf";

            // Check if file is uploaded
            if (!isset($_FILES["fileToUpload"]) || $_FILES["fileToUpload"]["error"] != UPLOAD_ERR_OK) {
                throw new Exception("No file selected or error during upload.");
            }

            // Allow only PDF files
            $file_extension = strtolower(pathinfo($_FILES["fileToUpload"]["name"], PATHINFO_EXTENSION));
            if ($file_extension != "pdf") {
                throw new Exception("Only PDF files are allowed.");
            }

            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                $filename = htmlspecialchars(basename($_FILES["fileToUpload"]["name"]));

                // Prepare SQL statement to insert data into 'demande_compteur' table
                $stmt = $conn->prepare("INSERT INTO demande_compteur (filename, id_client, type_c) VALUES (?, ?, ?)");
                $stmt->bind_param("sis", $filename, $last_id, $type);

                if ($stmt->execute()) {
                    // Commit transaction
                    $conn->commit();
                    echo json_encode(array("status" => "success", "message" => "File " . $filename . " uploaded successfully"));
                } else {
                    throw new Exception("Error inserting data into demande_compteur: " . $stmt->error);
                }
            } else {
                throw new Exception("Error uploading the file.");
            }
        } else {
            throw new Exception("Error inserting client data: " . $stmt->error);
        }
        $stmt->close();
    } catch (Exception $e) {
        // Rollback transaction in case of any error
        $conn->rollback();
        echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    }

    $conn->close();
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid request method or missing parameters."));
}
?>
