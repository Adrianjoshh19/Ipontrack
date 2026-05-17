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

$delete = $conn->prepare("DELETE FROM transactions WHERE id = ? AND user_id = ?");
$delete->bind_param("ii", $id, $user_id);

if ($delete->execute()) {
    echo "success";
} else {
    echo "Delete failed";
}
?>