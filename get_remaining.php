<?php
include "config.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["total" => 0, "allocated" => 0, "remaining" => 0]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Total savings (all transactions)
$totalRes = $conn->query("SELECT SUM(amount) AS total FROM transactions WHERE user_id = $user_id");
$totalRow = $totalRes->fetch_assoc();
$total = $totalRow['total'] ?? 0;

// Allocated to goals (excluding General Savings)
$allocatedRes = $conn->query("SELECT SUM(current_amount) AS allocated FROM goals WHERE user_id = $user_id AND goal_name != 'General Savings'");
$allocatedRow = $allocatedRes->fetch_assoc();
$allocated = $allocatedRow['allocated'] ?? 0;

// Remaining = General Savings current_amount
$remainingRes = $conn->query("SELECT current_amount AS remaining FROM goals WHERE user_id = $user_id AND goal_name = 'General Savings' LIMIT 1");
$remainingRow = $remainingRes->fetch_assoc();
$remaining = $remainingRow['remaining'] ?? 0;

echo json_encode([
    "total" => $total,
    "allocated" => $allocated,
    "remaining" => $remaining
]);
?>