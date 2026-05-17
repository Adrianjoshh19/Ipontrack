<?php
include "config.php";

if (!isset($_SESSION['user_id'])) {
  echo "not_logged_in";
  exit;
}

$user_id = $_SESSION['user_id'];
$name = $_POST['name'];
$amount = $_POST['amount'];
$deadline_num = $_POST['deadline_num'] ?? null;
$deadline_unit = $_POST['deadline_unit'] ?? null;

$conn->query("INSERT INTO goals (user_id, goal_name, target_amount, deadline_num, deadline_unit) VALUES ($user_id, '$name', $amount, $deadline_num, '$deadline_unit')");

echo "success";
?>