<?php

include "config.php";

if (!isset($_SESSION['user_id'])) {

    exit("Unauthorized");

}

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("
SELECT
    id,
    amount,
    created_at
FROM transactions
WHERE user_id = ?
ORDER BY created_at DESC
");

$stmt->bind_param("i", $user_id);

$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = $row;

}

echo json_encode($data);

?>