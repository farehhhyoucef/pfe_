<?php
// Database connection
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pfe";

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Extract data from the form submission
    $n_serie = intval($_POST['n_serie']);
    $qte = intval($_POST['qte']);
    $date = $_POST['date'];
    $categorie = $_POST['categorie'];
    $type = $_POST['type'];
    $id_magasinier=$_SESSION['user_id'];
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // Prepare SQL statement to insert data into the compteur table
        $stmt = $conn->prepare("INSERT INTO compteur (n_serie, date_entree, categorie,id_magasinier, type) VALUES (?, ?, ?,?, ?)");
        $stmt->bind_param("issss", $current_serie, $date, $categorie,$id_magasinier ,$type);

        // Loop to insert multiple rows
        for ($i = 0; $i < $qte; $i++) {
            $current_serie = $n_serie + $i;
           if( !$stmt->execute()){
            echo('faux'.$i);
           }
        }

        // Commit transaction
        $conn->commit();
        echo json_encode(array("status" => "success", "message" => "Data added successfully."));

    } catch (Exception $e) {
        // Rollback transaction in case of error
        $conn->rollback();
        echo json_encode(array("status" => "error", "message" => "Error: " . $e->getMessage()));
    }

    // Close the prepared statement and the database connection
    $stmt->close();
    $conn->close();
} else {
    // Invalid request method
    echo json_encode(array("status" => "error", "message" => "Invalid request method."));
}
?>
