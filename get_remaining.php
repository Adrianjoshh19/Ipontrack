<?php
include "config.php";

// Total savings
$totalResult = $conn->query("SELECT SUM(amount) AS total FROM transactions");
$totalRow = $totalResult->fetch_assoc();
$total = $totalRow['total'] ?? 0;

// Total allocated to goals
$allocatedResult = $conn->query("SELECT SUM(current_amount) AS allocated FROM goals");
$allocatedRow = $allocatedResult->fetch_assoc();
$allocated = $allocatedRow['allocated'] ?? 0;

$remaining = $total - $allocated;

echo json_encode([
    "total" => $total,
    "allocated" => $allocated,
    "remaining" => $remaining
]);
?>