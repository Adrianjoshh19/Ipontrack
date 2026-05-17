<?php
include "config.php";

if (!isset($_SESSION['user_id'])) {
    echo "not_logged_in";
    exit;
}

$user_id = $_SESSION['user_id'];
$amount = $_POST['amount'];

// Find General Savings goal
$genRes = $conn->query("SELECT id, current_amount FROM goals WHERE user_id = $user_id AND goal_name = 'General Savings' LIMIT 1");
$genRow = $genRes->fetch_assoc();
$generalGoalId = $genRow['id'];
$currentRemaining = $genRow['current_amount'];

// Check if enough remaining balance
if ($currentRemaining < $amount) {
    echo "insufficient";
    exit;
}

// Subtract from General Savings
$conn->query("UPDATE goals SET current_amount = current_amount - $amount WHERE id = $generalGoalId");

// Record transaction
$conn->query("INSERT INTO transactions (goal_id, user_id, amount) VALUES ($generalGoalId, $user_id, -$amount)");

echo "success";
?>