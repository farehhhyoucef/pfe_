<?php
$servername = "localhost"; // replace with your server name
$username = "root"; // replace with your username
$password = ""; // replace with your password
$dbname = "pfe"; // replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_POST['nom']) && isset($_POST['n_serie'])) {
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $address = $_POST['addresse'];
    $telphone = $_POST['n_telephone'];
    $n_serie = $_POST['n_serie'];
    
    // Check if n_serie exists in the database with etat = 'fourni'
    $stmt = $conn->prepare("SELECT ss.reference,c.type,c.categorie FROM compteur c inner join (select client.id_client,reference from client inner join demande_compteur on client.id_client=demande_compteur.id_client) ss on ss.id_client= c.id_client WHERE n_serie = ? AND etat = 'forne'");
    $stmt->bind_param("s", $n_serie);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($reference, $type, $categorie);
        $stmt->fetch();
        
        // Prepare the SQL statement to insert into client table
        $stmt = $conn->prepare("INSERT INTO client (nom, prenom, adresse, n_telephone) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $nom, $prenom, $address, $telphone);
        
        if ($stmt->execute()) {
            echo "New client record created successfully";
            $target_dir = "uploads/";
            $last_id = $conn->insert_id;
            
            // Get the most recent ID from the 'demande_compteur' table
            $sql = "SELECT MAX(id_demande_c) AS id FROM demande_compteur";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($result);
            $recent_id = $row["id"] + 1; // Increment by 1 for the next ID
            
            // Create a file name with the ID
            $target_file = $target_dir . $recent_id . ".pdf";
            $uploadOk = 1;
            
            // Check if file is uploaded
            if (!isset($_FILES["fileToUpload"])) {
                echo "No file selected.";
                $uploadOk = 0;
            }
            
            // Allow only PDF files
            $allowed_extensions = array("pdf");
            $file_extension = pathinfo($target_file, PATHINFO_EXTENSION);
            if (!in_array($file_extension, $allowed_extensions)) {
                echo "Sorry, only PDF files are allowed.";
                $uploadOk = 0;
            }
            
            // Check if $uploadOk is set to 0 by an error
            if ($uploadOk == 0) {
                echo "Sorry, your file was not uploaded.";
            } else {
                if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                    $filename = htmlspecialchars(basename($_FILES["fileToUpload"]["name"]));
                    
                    // Prepare SQL statement to insert data into 'demande_compteur' table
                    $sql = "INSERT INTO demande_compteur (id_demande_c, filename, id_client, type_c,categorie) VALUES (?, ?, ?, ?,?)";
                    $stmt = mysqli_prepare($conn, $sql);
                    mysqli_stmt_bind_param($stmt, "issss", $recent_id, $filename, $last_id, $type,$categorie);
                    
                    if (mysqli_stmt_execute($stmt)) {
                        echo "The file " . $filename . " has been uploaded with ID: " . $recent_id;
                        $sql = "update  compteur set etat='dif' WHERE n_serie = ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param("i", $n_serie);
                        if (mysqli_stmt_execute($stmt)) {
                            echo "Client history  in file upload.";
                        } else {
                            echo "Error occurred while attempting to delete client histroy.";
                        }
                        

                    } else {
                        echo "Sorry, there was an error uploading your file and inserting data.";
                        
                        // Delete query with prepared statement fo r security
                       $sql = "DELETE FROM client WHERE id_client = ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param("i", $last_id); // Bind parameter for ID
                        
                        if (mysqli_stmt_execute($stmt)) {
                            echo "Client record deleted due to error in file upload.";
                        } else {
                            echo "Error occurred while attempting to delete client record.";
                        }
                    }
                    
                 
                } else {
                    echo "Sorry, there was an error uploading your file.";
                }
            }
            
            mysqli_close($conn);
        } else {
            echo "Error: " . $stmt->error;
        }
        
        // Close statement and connection
        $stmt->close();
    } else {
        echo "Error: n_serie not found or etat is not 'fourni'.";
    }
} else {
    echo "Invalid request method or missing n_serie.";
}
?>
