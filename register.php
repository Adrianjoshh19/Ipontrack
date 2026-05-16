<?php
include "config.php";

$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $password);

if ($stmt->execute()) {
    // Auto-create General Savings goal for this user
    $user_id = $conn->insert_id;
    $conn->query("INSERT INTO goals (user_id, goal_name, target_amount, current_amount) VALUES ($user_id, 'General Savings', 999999999, 0)");
    echo "success";
} else {
    echo "error";
}
?>