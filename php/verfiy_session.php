<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['username']) || !isset($_SESSION['role'])) {
    echo json_encode(['authenticated' => false, 'message' => 'User not logged in.']);
    exit;
}

// Define role-based access
$role = $_SESSION['role'];
$page = isset($_GET['page']) ? $_GET['page'] : '';

// Define page access based on roles
$access_rules = [
    'admin' => ['dashboard_admin.html', 'table_admin.html'],
    'agent_recepiton' => [ 'agent_d_acc.html','dashbord_reception.html','tabl_agent_r.html','table_agent_r.html','demende_remise.html'],
    'agent' => ['dashboard_agent.html','remisetable.html','addremise.html'],
    'magasinier' => ['dashboard_mag.html','table_mag.html','ajouter_comptuer.html']
];

// Check if the user has access to the requested page
if (!in_array($page, $access_rules[$role] ?? [])) {
    echo json_encode(['authenticated' => false, 'message' => 'Access denied.']);
    exit;
}

// User is authenticated and has the right role
echo json_encode(['authenticated' => true, 'message' => 'Access granted.']);
?>
