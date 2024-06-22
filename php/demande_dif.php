<?php



// Check if user ID is set in session
if (!isset($_SESSION['user_id'])) {
    die(json_encode(array("status" => "error", "message" => "User not authenticated.")));
}

$user_id = $_SESSION['user_id'];

$servername = "localhost"; // Replace with your server name
$username = "root"; // Replace with your username
$password = ""; // Replace with your password
$dbname = "pfe"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(array("status" => "error", "message" => "Connection failed: " . $conn->connect_error)));
}

// Check if the required POST variables are set
if (isset($_POST['nom']) && isset($_POST['n_serie'])) {
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $address = $_POST['addresse'];
    $telphone = $_POST['n_telephone'];
    $n_serie = $_POST['n_serie'];

    // Check if n_serie exists and has etat='fourni'
    $stmt = $conn->prepare("SELECT ss.reference, c.type, c.categorie FROM compteur c INNER JOIN (SELECT client.id_client, reference FROM client INNER JOIN demande_compteur ON client.id_client = demande_compteur.id_client) ss ON ss.id_client = c.id_client WHERE n_serie = ? AND etat = 'forne'");
    $stmt->bind_param("s", $n_serie);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($reference, $type, $categorie);
        $stmt->fetch();

        // Insert into client table
        $stmt = $conn->prepare("INSERT INTO client (nom, prenom, adresse, n_telephone, id_agent_r) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssss", $nom, $prenom, $address, $telphone);

        if ($stmt->execute()) {
            $last_id = $conn->insert_id; // Get the last inserted client ID
            $target_dir = "uploads/";
            $recent_id = $last_id; // Use last inserted ID for file naming

            // Handle file upload
            $target_file = $target_dir . $recent_id . ".pdf";
            $uploadOk = 1;
            $file_extension = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

            if (!isset($_FILES["fileToUpload"])) {
                echo json_encode(array("status" => "error", "message" => "No file selected."));
                $uploadOk = 0;
            }

            // Check if the uploaded file is a PDF
            if ($file_extension != "pdf") {
                echo json_encode(array("status" => "error", "message" => "Only PDF files are allowed."));
                $uploadOk = 0;
            }

            if ($uploadOk == 0) {
                echo json_encode(array("status" => "error", "message" => "File was not uploaded."));
            } else {
                if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                    $filename = htmlspecialchars(basename($_FILES["fileToUpload"]["name"]));

                    // Insert into demande_compteur table
                    $stmt = $conn->prepare("INSERT INTO demande_compteur (id_demande_c, filename, id_client, type_c, categorie, reference, ) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $stmt->bind_param("isssss", $recent_id, $filename, $last_id, $type, $categorie, $reference);

                    if ($stmt->execute()) {
                        // Update compteur table
                        $stmt = $conn->prepare("UPDATE compteur SET etat = 'dif' WHERE n_serie = ?");
                        $stmt->bind_param("s", $n_serie);

                        if ($stmt->execute()) {
                            echo json_encode(array("status" => "success", "message" => "Form submitted successfully."));
                        } else {
                            echo json_encode(array("status" => "error", "message" => "Error updating compteur table."));
                        }
                    } else {
                        // Delete client record if demande_compteur insertion fails
                        $stmt = $conn->prepare("DELETE FROM client WHERE id_client = ?");
                        $stmt->bind_param("i", $last_id);
                        $stmt->execute();
                        echo json_encode(array("status" => "error", "message" => "Error inserting into demande_compteur table."));
                    }
                } else {
                    echo json_encode(array("status" => "error", "message" => "Error uploading file."));
                }
            }
        } else {
            echo json_encode(array("status" => "error", "message" => "Error inserting into client table."));
        }

        $stmt->close();
    } else {
        echo json_encode(array("status" => "error", "message" => "n_serie not found or etat is not 'fourni'."));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid request or missing parameters."));
}

$conn->close();
?>
