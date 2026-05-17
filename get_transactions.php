<?php
include "config.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];

$query = "
SELECT t.id, t.amount, t.created_at, g.goal_name
FROM transactions t
LEFT JOIN goals g ON t.goal_id = g.id
WHERE t.user_id = $user_id
ORDER BY t.created_at DESC
";

$res = $conn->query($query);

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = [
        "id" => $row['id'],
        "amount" => $row['amount'],
        "created_at" => $row['created_at'],
        "goal_name" => $row['goal_name'] ?? "General Savings"
    ];
}

echo json_encode($data);
?>