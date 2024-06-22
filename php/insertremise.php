<?php
$servername="localhost";
$dbname="pfe";
$username="root";
$password="";
// Create connection
$conn = new mysqli($servername, $username, $password,$dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


// Check if form is submitted and data is not empty
if (isset($_POST['save']) ) {

    $id_client = mysqli_real_escape_string($conn, $_POST['idClient']);  // Escape for security

    $entreprise = mysqli_real_escape_string($conn, $_POST['entrprise']);
    $remarque = mysqli_real_escape_string($conn, $_POST['remarque']);
    $type = mysqli_real_escape_string($conn, $_POST['type']);
    $date = mysqli_real_escape_string($conn, $_POST['date']);
    $id_agent=2;

    // Build the query with escaped values
    $sql2="INSERT INTO `remise` (`id_client`, `nom_entreprise`, `remarque`, `type`,`id_agent`,`date_coupure`) VALUES('$id_client','$entreprise', '$remarque','$type',' $id_agent','$date')";

    // Execute the query (handle potential errors)
    if ($conn->query($sql2) === TRUE) {
        echo "Remise inserted successfully!";
    } else {
        echo "Error inserting remise: " . $conn->error;
    }
}

$conn->close();
?>
