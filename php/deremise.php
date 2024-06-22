<?php
$servername = "localhost"; // replace with your server name
$username = "root"; // replace with your username
$password = ""; // replace with your password
$dbname = "pfe"; // replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['nom']) && isset($_POST['prenom']) && isset($_POST['n_serie'])) {
    $nom = $conn->real_escape_string($_POST['nom']);
    $prenom = $conn->real_escape_string($_POST['prenom']);
    $nSerie = $conn->real_escape_string($_POST['n_serie']);

    // Prepare the SQL statement
    $stmt = $conn->prepare("
        SELECT cc.id_client FROM compteur c 
        INNER JOIN (
            SELECT cl.id_client FROM client cl 
            INNER JOIN remise r ON cl.id_client = r.id_client
        ) cc ON cc.id_client = c.id_client 
        WHERE c.n_serie = ?
    ");
    $stmt->bind_param("s", $nSerie);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id);
        $stmt->fetch();
        $target_dir = "uploads/";

        // Get the most recent ID from the 'demande_remise' table
        $sql = "SELECT MAX(id_demande_r) AS id FROM demande_remise";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $recent_id = isset($row["id"]) ? $row["id"] + 1 : 1;

        // Create a file name with the ID
        $target_file = $target_dir . $recent_id . ".pdf";
        $uploadOk = 1;

        // Check if file is uploaded
        if (!isset($_FILES["fileToUpload"]) || $_FILES["fileToUpload"]["error"] != UPLOAD_ERR_OK) {
            echo json_encode(["status" => "error", "message" => "No file selected or error in file upload."]);
            $uploadOk = 0;
        }

        // Allow only PDF files
        $allowed_extensions = array("pdf");
        $file_extension = strtolower(pathinfo($_FILES["fileToUpload"]["name"], PATHINFO_EXTENSION));
        if (!in_array($file_extension, $allowed_extensions)) {
            echo json_encode(["status" => "error", "message" => "Sorry, only PDF files are allowed."]);
            $uploadOk = 0;
        }

        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            echo json_encode(["status" => "error", "message" => "Sorry, your file was not uploaded."]);
        } else {
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                // Prepare SQL statement to insert data into 'demande_remise' table
                $sql = "INSERT INTO demande_remise (filename, id_client) VALUES (?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("si", $target_file, $id);

                if ($stmt->execute()) {
                    echo json_encode(["status" => "success", "message" => "The file has been uploaded with ID: " . $recent_id]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Sorry, there was an error uploading your file and inserting data."]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Sorry, there was an error uploading your file."]);
            }
        }
    } else {
        echo json_encode(["status" => "error", "message" => "No matching client found for the given series number."]);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method or missing parameters."]);
}
?>
