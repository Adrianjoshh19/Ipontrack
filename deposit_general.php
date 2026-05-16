<?php
include "config.php";

if (!isset($_SESSION['user_id'])) {
    echo "not_logged_in";
    exit;
}

$user_id = $_SESSION['user_id'];
$amount = $_POST['amount'];

// Find the General Savings goal for this user
$stmt = $conn->prepare("SELECT id FROM goals WHERE user_id = ? AND goal_name = 'General Savings' LIMIT 1");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$goalRow = $result->fetch_assoc();
$generalGoalId = $goalRow['id'];

// Update General Savings current_amount
$conn->query("UPDATE goals SET current_amount = current_amount + $amount WHERE id = $generalGoalId");

// Insert transaction linked to General Savings goal
$stmt2 = $conn->prepare("INSERT INTO transactions (goal_id, user_id, amount) VALUES (?, ?, ?)");
$stmt2->bind_param("iid", $generalGoalId, $user_id, $amount);

if ($stmt2->execute()) {
    echo "success";
} else {
    echo "error";
}
?>