<?php
include "config.php";

if (!isset($_SESSION['user_id'])) {
    echo "not_logged_in";
    exit;
}

$user_id = $_SESSION['user_id'];
$goal_id = $_POST['goal_id'];
$amount = $_POST['amount'];

// Get General Savings goal ID
$genRes = $conn->query("SELECT id FROM goals WHERE user_id = $user_id AND goal_name = 'General Savings' LIMIT 1");
$genRow = $genRes->fetch_assoc();
$generalGoalId = $genRow['id'];

// Check goal has enough
$goalRes = $conn->query("SELECT current_amount FROM goals WHERE id = $goal_id");
$goalRow = $goalRes->fetch_assoc();
$goalCurrent = $goalRow['current_amount'];

if ($goalCurrent < $amount) {
    echo "insufficient";
    exit;
}

// Cap at goal's current amount
if ($amount > $goalCurrent) {
    $amount = $goalCurrent;
}

// Add back to General Savings
$conn->query("UPDATE goals SET current_amount = current_amount + $amount WHERE id = $generalGoalId");

// Subtract from goal
$conn->query("UPDATE goals SET current_amount = current_amount - $amount WHERE id = $goal_id");

// Record transactions
$conn->query("INSERT INTO transactions (goal_id, user_id, amount) VALUES ($generalGoalId, $user_id, $amount)");
$conn->query("INSERT INTO transactions (goal_id, user_id, amount) VALUES ($goal_id, $user_id, -$amount)");

echo "success";