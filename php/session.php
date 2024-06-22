<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.html');
    exit;
}

if ($_SESSION['role'] !== 'admin' && $_SESSION['role'] !== 'agent' && $_SESSION['role'] !== 'magasinier' && $_SESSION['role'] !== 'agent_reception') {
    header('Location: ../login.html');
    exit;
}

switch ($_SESSION['role']) {
    case 'admin':
        header('Location: ../admin_dashboard.html');
        break;
    case 'agent':
        header('Location: ../dashboard_agent.html');
        break;
    case 'magasinier':
        header('Location: ../dashboard_mag.html');
        break;
    case 'agent_reception':
        header('Location: ../agent_reception_dashboard.html');
        break;
    default:
        header('Location: ../login.html');
        break;
}
?>
