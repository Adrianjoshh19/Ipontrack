<?php
include "config.php";

$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$display_name = $_POST['display_name'] ?? explode('@', $email)[0];

@$conn->query("ALTER TABLE users ADD COLUMN display_name VARCHAR(100) DEFAULT NULL AFTER email");

$stmt = $conn->prepare("INSERT INTO users (email, password, display_name) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $password, $display_name);

if ($stmt->execute()) {
    $user_id = $conn->insert_id;
    $conn->query("INSERT INTO goals (user_id, goal_name, target_amount, current_amount) VALUES ($user_id, 'General Savings', 999999999, 0)");
    echo "success";
} else {
    echo "error";
}
?>