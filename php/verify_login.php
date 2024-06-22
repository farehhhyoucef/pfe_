<?php
session_start();

$response = array('authenticated' => false, 'message' => '');

if (isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
    $response['authenticated'] = true;
    $response['message'] = 'User is already logged in.';

    // Determine the appropriate dashboard URL
    switch ($_SESSION['role']) {
        case 'admin':
            $response['redirect'] = 'dashboard_admin.html';
            break;
        case 'agent':
            $response['redirect'] = 'dashboard_agent.html';
            break;
        case 'agent_recepiton':
            $response['redirect'] = 'agent_d_acc.html';
            break;
        case 'magasinier':
            $response['redirect'] = 'dashboard_mag.html';
            break;
        default:
            $response['redirect'] = 'pageclient.html';
            break;
    }
} else {
    $response['message'] = 'User is not logged in.';
    $response['redirect'] = 'login (5).html';
}

echo json_encode($response);
?>
