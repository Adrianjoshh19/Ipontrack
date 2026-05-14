<?php

include "config.php";

if (!isset($_SESSION['user_id'])) {

  echo "not_logged_in";
  exit;

}

$user_id = $_SESSION['user_id'];

if (!isset($_POST['amount'])) {

  echo "no_amount";
  exit;

}

$amount = floatval($_POST['amount']);

/* =========================
   CHECK USER GOAL
========================= */

$stmt = $conn->prepare("
SELECT id
FROM goals
WHERE user_id = ?
LIMIT 1
");

$stmt->bind_param("i", $user_id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {

  echo "no_goal";
  exit;

}

$goal = $result->fetch_assoc();

$goal_id = $goal['id'];

/* =========================
   UPDATE GOAL SAVINGS
========================= */

$update = $conn->prepare("
UPDATE goals
SET current_amount = current_amount + ?
WHERE id = ?
");

$update->bind_param(
  "di",
  $amount,
  $goal_id
);

$update->execute();

/* =========================
   INSERT TRANSACTION
========================= */

$insert = $conn->prepare("
INSERT INTO transactions (
  goal_id,
  amount,
  user_id
)
VALUES (?, ?, ?)
");

$insert->bind_param(
  "idi",
  $goal_id,
  $amount,
  $user_id
);

$insert->execute();

echo "success";

?>