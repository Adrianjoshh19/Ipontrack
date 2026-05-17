<?php
include "config.php";

$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$display_name = $_POST['display_name'] ?? explode('@', $email)[0];

// Auto-create columns and tables if missing (first-time setup)
@$conn->query("ALTER TABLE users ADD COLUMN display_name VARCHAR(100) DEFAULT NULL AFTER email");
@$conn->query("ALTER TABLE goals ADD COLUMN deadline_num INT DEFAULT NULL AFTER target_amount");
@$conn->query("ALTER TABLE goals ADD COLUMN deadline_unit VARCHAR(10) DEFAULT NULL AFTER deadline_num");
@$conn->query("CREATE TABLE IF NOT EXISTS completed_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    completed_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)");

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