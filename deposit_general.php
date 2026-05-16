<?php
include "config.php";

if (!isset($_SESSION['user_id'])) {
    echo "not_logged_in";
    exit;
}

$user_id = $_SESSION['user_id'];
$amount = $_POST['amount'];


$stmt = $conn->prepare("INSERT INTO transactions (goal_id, user_id, amount) VALUES (0, ?, ?)");
$stmt->bind_param("id", $user_id, $amount);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error";
}
?>