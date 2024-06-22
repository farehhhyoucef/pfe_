<?php
// Start a session
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pfe";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to verify user from a specific table
function verify_user($conn, $nom, $prenom, $password, $table) {
    $idd = "id_" . $table;
    $stmt = $conn->prepare("SELECT $idd, password FROM $table WHERE nom = ? AND prenom = ?");
    if ($stmt === false) {
        die("Prepare failed: " . $conn->error);
    }
    $stmt->bind_param("ss", $nom, $prenom);

    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

      
            return array('id' => $id, 'nom' => $nom, 'prenom' => $prenom, 'role' => $table);
      
        
      
    } else {
        return false;
    }
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $password = $_POST['password'];

    // Validate input
    if (empty($nom) || empty($prenom) || empty($password)) {
        echo "All fields are required.";
        exit;
    }

    // Attempt to verify user in each table
    $tables = array('admin', 'agent', 'agent_recepiton', 'magasinier');
    $user = false;

    foreach ($tables as $table) {
        // Clean table name
        $table = trim($table);
        $user = verify_user($conn, $nom, $prenom, $password, $table);
        if ($user) {
            break;
        }
    }

    if ($user) {
        // Set session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['nom'] . ' ' . $user['prenom'];
        $_SESSION['role'] = $user['role'];

        // Redirect based on role
        switch ($user['role']) {
            case 'admin':
                header("Location: admin_dashboard.php");
                break;
            case 'agent':
                header("Location: clients.php");
                break;
            case 'agent_recepiton':
                    header("Location: agent_reception_dashboard.php");
                break;
            case 'magasinier':
                    header("Location: agent_dashboard.php");
                break;
            default:
                header("Location: user_dashboard.php");
                break;
        }
        exit;
    } else {
        echo "Invalid username or password.";
    }
}

$conn->close();
?>
