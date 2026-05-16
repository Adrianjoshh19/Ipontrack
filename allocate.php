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

// Check remaining balance (General Savings current_amount)
$remRes = $conn->query("SELECT current_amount FROM goals WHERE id = $generalGoalId");
$remRow = $remRes->fetch_assoc();
$remaining = $remRow['current_amount'];

// Calculate how much the goal actually needs
$goalRes = $conn->query("SELECT current_amount, target_amount FROM goals WHERE id = $goal_id");
$goalData = $goalRes->fetch_assoc();
$needed = $goalData['target_amount'] - $goalData['current_amount'];

// Only take what's needed
if ($amount > $needed) {
    $amount = $needed;
}

if ($remaining < $amount) {
    echo "insufficient";
    exit;
}

// Subtract from General Savings
$conn->query("UPDATE goals SET current_amount = current_amount - $amount WHERE id = $generalGoalId");

// Add to target goal
$conn->query("UPDATE goals SET current_amount = current_amount + $amount WHERE id = $goal_id");

// Record transaction (positive for target goal)
$conn->query("INSERT INTO transactions (goal_id, user_id, amount) VALUES ($goal_id, $user_id, $amount)");

// Record negative transaction for General Savings
$conn->query("INSERT INTO transactions (goal_id, user_id, amount) VALUES ($generalGoalId, $user_id, -$amount)");

echo "success";
?>