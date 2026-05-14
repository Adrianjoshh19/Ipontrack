<?php
include "config.php";

header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "daily" => 0,
        "weekly" => 0,
        "monthly" => 0
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];

/* 🔥 FIXED QUERY
   Removed JOIN because your transactions most likely
   do not store goal_id yet.
*/

$query = "
SELECT 
    SUM(
        CASE 
            WHEN DATE(created_at) = CURDATE() 
            THEN amount 
            ELSE 0 
        END
    ) as daily,

    SUM(
        CASE 
            WHEN YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) 
            THEN amount 
            ELSE 0 
        END
    ) as weekly,

    SUM(
        CASE 
            WHEN MONTH(created_at) = MONTH(CURDATE()) 
            AND YEAR(created_at) = YEAR(CURDATE())
            THEN amount 
            ELSE 0 
        END
    ) as monthly

FROM transactions
WHERE user_id = $user_id
";

$res = $conn->query($query);

if (!$res) {
    echo json_encode([
        "daily" => 0,
        "weekly" => 0,
        "monthly" => 0
    ]);
    exit;
}

$row = $res->fetch_assoc();

echo json_encode([
    "daily" => $row['daily'] ?? 0,
    "weekly" => $row['weekly'] ?? 0,
    "monthly" => $row['monthly'] ?? 0
]);
?>