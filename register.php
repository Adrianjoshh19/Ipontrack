<?php
include "config.php";

$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$display_name = $_POST['display_name'] ?? explode('@', $email)[0];

// Safe column/table creation – only adds if missing
$conn->query("CREATE TABLE IF NOT EXISTS completed_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    deposit_count INT DEFAULT 0,
    avg_deposit DECIMAL(10,2) DEFAULT 0,
    days_to_complete INT DEFAULT 0,
    consistency INT DEFAULT 0,
    completed_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)");

// Check for display_name column
$colCheck = $conn->query("SHOW COLUMNS FROM users LIKE 'display_name'");
if ($colCheck->num_rows == 0) {
    $conn->query("ALTER TABLE users ADD COLUMN display_name VARCHAR(100) DEFAULT NULL AFTER email");
}

// Check for deadline columns
$colCheck = $conn->query("SHOW COLUMNS FROM goals LIKE 'deadline_num'");
if ($colCheck->num_rows == 0) {
    $conn->query("ALTER TABLE goals ADD COLUMN deadline_num INT DEFAULT NULL AFTER target_amount");
}
$colCheck = $conn->query("SHOW COLUMNS FROM goals LIKE 'deadline_unit'");
if ($colCheck->num_rows == 0) {
    $conn->query("ALTER TABLE goals ADD COLUMN deadline_unit VARCHAR(10) DEFAULT NULL AFTER deadline_num");
}

// Insert user
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