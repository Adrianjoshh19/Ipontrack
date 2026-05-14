<?php
include "config.php";

if (!isset($_SESSION['user_id'])) {
  echo "not_logged_in";
  exit;
}

$user_id = $_SESSION['user_id'];
$name = $_POST['name'];
$amount = $_POST['amount'];

$conn->query("INSERT INTO goals (user_id, goal_name, target_amount) VALUES ($user_id, '$name', $amount)");

echo "success";
?>