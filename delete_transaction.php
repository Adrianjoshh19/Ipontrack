<?php

include "config.php";

if (!isset($_SESSION['user_id'])) {

    exit("Unauthorized");

}

if (!isset($_POST['id'])) {

    exit("Missing ID");

}

$id = intval($_POST['id']);

$user_id = $_SESSION['user_id'];

/* =========================
   GET TRANSACTION INFO
========================= */

$get = $conn->prepare("
SELECT
    amount,
    goal_id
FROM transactions
WHERE id = ?
AND user_id = ?
");

$get->bind_param("ii", $id, $user_id);

$get->execute();

$result = $get->get_result();

if ($result->num_rows == 0) {

    exit("Transaction not found");

}

$transaction = $result->fetch_assoc();

$amount = $transaction['amount'];

$goal_id = $transaction['goal_id'];

/* =========================
   SUBTRACT FROM GOAL
========================= */

$update = $conn->prepare("
UPDATE goals
SET current_amount = current_amount - ?
WHERE id = ?
");

$update->bind_param(
    "di",
    $amount,
    $goal_id
);

$update->execute();

/* =========================
   DELETE TRANSACTION
========================= */

$delete = $conn->prepare("
DELETE FROM transactions
WHERE id = ?
AND user_id = ?
");

$delete->bind_param("ii", $id, $user_id);

if ($delete->execute()) {

    echo "success";

} else {

    echo "Delete failed";

}

?>