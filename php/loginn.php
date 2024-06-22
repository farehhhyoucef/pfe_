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
function verify_user($conn, $username, $password, $table) { 
    $idd = "id_" . $table; 
    $stmt = $conn->prepare("SELECT $idd, password FROM $table WHERE username = ?"); 
    if ($stmt === false) { 
        die("Prepare failed: " . $conn->error); 
    } 
    $stmt->bind_param("s", $username); 
    $stmt->execute(); 
    $stmt->store_result(); 
    
    // Initialize variables to hold results
    $id =0;
    $hashed_password = '';

    if ($stmt->num_rows > 0) { 
        $stmt->bind_result($id, $hashed_password); 
        $stmt->fetch(); 

        // Debugging: Output the hashed password and check input password
        error_log("Hashed password from DB: $hashed_password");
        error_log("Password from input: $password");

        // Verify the password here if it's hashed
        if ($password==$hashed_password) {
            return array('id' => $id, 'username' => $username, 'role' => $table); 
        } else {
            error_log("Password verification failed for user $username in table $table.");
            return false;
        }
    } else { 
        error_log("No user found with username $username in table $table.");
        return false; 
    } 
} 

// Check if form is submitted 
if ($_SERVER["REQUEST_METHOD"] == "POST") { 
    $username = $_POST['username']; 
    $password = $_POST['password']; 

    // Validate input 
    if (empty($username) || empty($password)) { 
        echo json_encode(['success' => false, 'message' => 'All fields are required.']); 
        exit; 
    } 

    // Attempt to verify user in each table 
    $tables = array('admin', 'agent', 'agent_recepiton', 'magasinier'); 
    $user = false; 

    foreach ($tables as $table) { 
        // Clean table name 
        $table = trim($table); 
        $user = verify_user($conn, $username, $password, $table); 
        if ($user) { 
            break; 
        } 
    } 

    if ($user) { 
        // Set session variables 
        $_SESSION['user_id'] = $user['id']; 
        $_SESSION['username'] = $user['username']; 
        $_SESSION['role'] = $user['role']; 

        // Redirect based on role 
        switch ($user['role']) { 
            case 'admin': 
                $redirect = 'dashboard_admin.html';  
                break; 
            case 'agent': 
                $redirect = 'dashboard_agent.html'; 
                break; 
            case 'agent_recepiton': 
                $redirect = 'agent_d_acc.html';
                break; 
            case 'magasinier': 
                $redirect = 'dashboard_mag.html'; 
                break; 
            default: 
                $redirect = 'user.html';
                break; 
        } 
        echo json_encode(['success' => true, 'redirect' => $redirect]);
    } else { 
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']); 
    } 
} else { 
    echo json_encode(['success' => false, 'message' => 'Invalid request method']); 
}

$conn->close(); 
?>
