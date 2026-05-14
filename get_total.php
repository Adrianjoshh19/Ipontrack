<?php
include "config.php";

if (!isset($_SESSION['user_id'])) {
  echo json_encode(["total" => 0]);
  exit;
}

$user_id = $_SESSION['user_id'];

$res = $conn->query("SELECT SUM(current_amount) as total FROM goals WHERE user_id = $user_id");
$row = $res->fetch_assoc();

echo json_encode(["total" => $row['total'] ?? 0]);
?>