<?php
include "config.php";

header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["display_name" => "User"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$res = $conn->query("SELECT display_name, email FROM users WHERE id = $user_id");
$row = $res->fetch_assoc();

echo json_encode([
    "display_name" => $row['display_name'] ?? explode('@', $row['email'])[0]
]);
?>