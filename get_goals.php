<?php
include "config.php";

if (!isset($_SESSION['user_id'])) {
  echo json_encode([]);
  exit;
}

$user_id = $_SESSION['user_id'];

$res = $conn->query("SELECT * FROM goals WHERE user_id = $user_id");

$data = [];
while ($row = $res->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
?>