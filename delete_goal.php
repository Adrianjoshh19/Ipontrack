<?php
include "config.php";

if (!isset($_POST['id'])) {
    exit("No goal ID");
}

$id = $_POST['id'];
$reason = $_POST['reason'] ?? 'incomplete';

session_start();
$user_id = $_SESSION['user_id'];
$genRes = $conn->query("SELECT id FROM goals WHERE user_id = $user_id AND goal_name = 'General Savings' LIMIT 1");
$genRow = $genRes->fetch_assoc();
$generalGoalId = $genRow['id'];

$goalRes = $conn->query("SELECT current_amount, target_amount FROM goals WHERE id = $id");
$goalData = $goalRes->fetch_assoc();

if ($reason === 'refund') {
    // Move money back to General Savings
    $refund = $goalData['current_amount'];
    $conn->query("UPDATE goals SET current_amount = current_amount + $refund WHERE id = $generalGoalId");
    $conn->query("INSERT INTO transactions (goal_id, user_id, amount) VALUES ($generalGoalId, $user_id, $refund)");
} elseif ($reason === 'incomplete') {
    // Refund to Remaining
    if ($goalData['current_amount'] > 0) {
        $conn->query("UPDATE goals SET current_amount = current_amount + {$goalData['current_amount']} WHERE id = $generalGoalId");
    }
}
// 'spent' does nothing — just deletes the goal, money disappears

// Delete related transactions
$stmt1 = $conn->prepare("DELETE FROM transactions WHERE goal_id = ?");
$stmt1->bind_param("i", $id);
$stmt1->execute();

// Delete the goal
$stmt2 = $conn->prepare("DELETE FROM goals WHERE id = ?");
$stmt2->bind_param("i", $id);

if ($stmt2->execute()) {
    echo "success";
} else {
    echo "error";
}
?>