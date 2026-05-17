<?php
include "config.php";
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) { echo json_encode([]); exit; }

$user_id = $_SESSION['user_id'];
$res = $conn->query("SELECT * FROM completed_goals WHERE user_id = $user_id ORDER BY completed_date DESC");

$data = [];
while ($row = $res->fetch_assoc()) $data[] = $row;

echo json_encode($data);
?>