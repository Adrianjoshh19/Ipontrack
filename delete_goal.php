<?php
include "config.php";

if (!isset($_POST['id'])) exit("No goal ID");

$id = $_POST['id'];
$reason = $_POST['reason'] ?? 'incomplete';

session_start();
$user_id = $_SESSION['user_id'];

$genRes = $conn->query("SELECT id FROM goals WHERE user_id = $user_id AND goal_name = 'General Savings' LIMIT 1");
$genRow = $genRes->fetch_assoc();
$generalGoalId = $genRow['id'];

$goalRes = $conn->query("SELECT current_amount, target_amount, goal_name FROM goals WHERE id = $id");
$goalData = $goalRes->fetch_assoc();

// Save completed goal before deleting
if ($goalData['current_amount'] >= $goalData['target_amount'] && $goalData['target_amount'] > 0) {
    $goalName = $conn->real_escape_string($goalData['goal_name']);
    $target = $goalData['target_amount'];
    
    // Calculate stats from transactions
    $txRes = $conn->query("SELECT amount, created_at FROM transactions WHERE goal_id = $id AND amount > 0 ORDER BY created_at ASC");
    $deposits = 0;
    $totalDeposited = 0;
    $firstDate = null;
    $lastDate = null;
    
    while ($tx = $txRes->fetch_assoc()) {
        $deposits++;
        $totalDeposited += $tx['amount'];
        if (!$firstDate) $firstDate = $tx['created_at'];
        $lastDate = $tx['created_at'];
    }
    
    $avgDeposit = $deposits > 0 ? $totalDeposited / $deposits : 0;
    $daysToComplete = ($firstDate && $lastDate) ? ceil((strtotime($lastDate) - strtotime($firstDate)) / 86400) + 1 : 0;
    $consistency = ($deposits > 0 && $daysToComplete > 0) ? round(($deposits / $daysToComplete) * 100) : 100;
    
    $conn->query("INSERT INTO completed_goals (user_id, goal_name, target_amount, deposit_count, avg_deposit, days_to_complete, consistency, completed_date) VALUES ($user_id, '$goalName', $target, $deposits, $avgDeposit, $daysToComplete, $consistency, NOW())");
}

if ($reason === 'refund') {
    $refund = $goalData['current_amount'];
    $conn->query("UPDATE goals SET current_amount = current_amount + $refund WHERE id = $generalGoalId");
    $conn->query("INSERT INTO transactions (goal_id, user_id, amount) VALUES ($generalGoalId, $user_id, $refund)");
} elseif ($reason === 'incomplete' && $goalData['current_amount'] > 0) {
    $conn->query("UPDATE goals SET current_amount = current_amount + {$goalData['current_amount']} WHERE id = $generalGoalId");
}

$conn->query("DELETE FROM transactions WHERE goal_id = $id");
$conn->query("DELETE FROM goals WHERE id = $id");

echo "success";
?>