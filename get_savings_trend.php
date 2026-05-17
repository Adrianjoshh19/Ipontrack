<?php
include "config.php";

header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];

$genRes = $conn->query("SELECT id FROM goals WHERE user_id = $user_id AND goal_name = 'General Savings' LIMIT 1");
$genRow = $genRes->fetch_assoc();
$generalGoalId = $genRow['id'] ?? 0;

$query = "
SELECT 
    DATE(created_at) as date,
    SUM(amount) as total
FROM transactions
WHERE user_id = $user_id
  AND goal_id = $generalGoalId
  AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
GROUP BY DATE(created_at)
ORDER BY date ASC
";

$res = $conn->query($query);

$data = [];
$runningTotal = 0;



while ($row = $res->fetch_assoc()) {
    $runningTotal += $row['total'];
    $data[] = [
        "date" => $row['date'],
        "total" => $runningTotal
    ];
}

echo json_encode($data);
?>