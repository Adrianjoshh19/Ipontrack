<?php
include "config.php";

$user_id = $_SESSION['user_id'];

$query = "
SELECT 
  g.id as goal_id,
  g.goal_name, -- 🔥 ADD THIS

  SUM(CASE WHEN DATE(t.created_at)=CURDATE() THEN t.amount ELSE 0 END) as daily,
  SUM(CASE WHEN YEARWEEK(t.created_at,1)=YEARWEEK(CURDATE(),1) THEN t.amount ELSE 0 END) as weekly,
  SUM(CASE WHEN MONTH(t.created_at)=MONTH(CURDATE()) AND YEAR(t.created_at)=YEAR(CURDATE()) THEN t.amount ELSE 0 END) as monthly

FROM goals g
LEFT JOIN transactions t ON g.id = t.goal_id
WHERE g.user_id = $user_id
GROUP BY g.id
";

$res = $conn->query($query);

$data = [];
while ($row = $res->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
?>