<?php

include "config.php";

if (!isset($_SESSION['user_id'])) {

  echo "not_logged_in";

  exit;
}

$user_id = $_SESSION['user_id'];

$amount = $_POST['amount'];

$goal_id = $_POST['goal_id'];

/* UPDATE GOAL */

$conn->query("
  UPDATE goals
  SET current_amount =
      current_amount + $amount
  WHERE id = $goal_id
");

/* INSERT TRANSACTION */

$conn->query("
  INSERT INTO transactions
  (goal_id, user_id, amount)

  VALUES

  ($goal_id, $user_id, $amount)
");

echo "success";

?>