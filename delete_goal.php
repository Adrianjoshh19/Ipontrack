<?php
include "config.php";

if (!isset($_POST['id'])) {
    exit("No goal ID");
}

$id = $_POST['id'];

/* DELETE related transactions FIRST */
$stmt1 = $conn->prepare("
DELETE FROM transactions
WHERE goal_id = ?
");

$stmt1->bind_param("i", $id);
$stmt1->execute();

/* NOW delete goal */
$stmt2 = $conn->prepare("
DELETE FROM goals
WHERE id = ?
");

$stmt2->bind_param("i", $id);

if ($stmt2->execute()) {
    echo "success";
} else {
    echo "error";
}
?>