<?php
include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $user_id = $_SESSION['user_id']; // current logged-in user
    $code = $_POST['activation_code'];

    // check code
    $stmt = $conn->prepare("SELECT * FROM activation_codes WHERE code = ? AND is_used = 0");
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {

        // mark code as used
        $update = $conn->prepare("UPDATE activation_codes SET is_used = 1 WHERE code = ?");
        $update->bind_param("s", $code);
        $update->execute();

        // 🔥 THIS WAS MISSING → make user premium
        $conn->query("UPDATE users SET is_premium = 1 WHERE id = $user_id");

        echo "success";

    } else {
        echo "invalid";
    }
}
?>