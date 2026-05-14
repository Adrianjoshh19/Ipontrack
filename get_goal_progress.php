<?php
include "config.php";

header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];

$query = "
SELECT 
    goal_name,
    target_amount,
    current_amount
FROM goals
WHERE user_id = $user_id
";

$res = $conn->query($query);

$data = [];

while ($row = $res->fetch_assoc()) {

    $target = $row['target_amount'];
    $current = $row['current_amount'];

    $remaining = $target - $current;

    $percent = 0;

    if ($target > 0) {
        $percent = ($current / $target) * 100;
    }

    $data[] = [
        "goal_name" => $row['goal_name'],
        "target_amount" => $target,
        "current_amount" => $current,
        "remaining" => $remaining,
        "percent" => round($percent, 1)
    ];
}

echo json_encode($data);
?>