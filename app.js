window.login = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("login.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  .then(res => res.text())
  .then(data => {
    console.log("LOGIN:", data);

    if (data.trim() === "success") {
      window.location.href = "dashboard.html"; // ✅ redirect fixed
    } else {
      alert(data);
    }
  })
  .catch(err => console.error("Login error:", err));
};

window.deposit = () => {

  const amount =
    document.getElementById("amount").value;

  if (!amount) {

    alert("Enter amount");

    return;

  }

  fetch("deposit.php", {

    method: "POST",

    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded"
    },

    body: `amount=${encodeURIComponent(amount)}`,

    credentials: "same-origin"

  })
  .then(res => res.text())
  .then(data => {

    console.log("DEPOSIT:", data);

    if (data.trim() === "success") {

      alert("Saved!");

      closeDeposit();

      /* =========================
         REFRESH ALL UI
      ========================= */

      loadSavings();

      loadGoals();

      loadHistory();

      loadAnalytics();

      loadAnalyticsPanel();

      loadGoalProgress();

    } else {

      alert(data);

    }

  })
  .catch(err => {

    console.error(
      "Deposit error:",
      err
    );

  });
};


window.addGoal = () => {
  const name = document.getElementById("goalName").value;
  const amount = document.getElementById("goalAmount").value;

  if (!name || !amount) {
    alert("Fill all fields");
    return;
  }

  fetch("add_goal.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `name=${encodeURIComponent(name)}&amount=${encodeURIComponent(amount)}`,
    credentials: "same-origin"
  })
  .then(res => res.text())
  .then(data => {
    console.log("ADD GOAL:", data);

    if (data.trim() === "success") {
      alert("Goal added!");
      loadGoals(); // refresh UI
    } else {
      alert(data);
    }
  })
  .catch(err => console.error("Error:", err));
};


window.register = () => {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  fetch("register.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  .then(res => res.text())
  .then(data => {
    console.log("REGISTER:", data);

    if (data.trim() === "success") {
      alert("Registered successfully");
      window.location.href = "index.html"; // redirect to login
    } else {
      alert(data);
    }
  })
  .catch(err => console.error("Register error:", err));
};

function loadHistory() {

  fetch("get_transactions.php", {
    credentials: "same-origin"
  })
  .then(res => res.json())
  .then(data => {

    let html = "";

    data.forEach(t => {

      html += `
        <tr>

          <td>₱${t.amount}</td>

          <td>${t.created_at}</td>

          <td>
            <button
              class="delete-btn"
              onclick="deleteTransaction(${t.id})"
            >
              Delete
            </button>
          </td>

        </tr>
      `;
    });

    document.getElementById("historyList").innerHTML = html;

  });
}

function loadGoals() {
  fetch("get_goals.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(data => {
      let html = "";

      data.forEach(g => {
        const percent = ((g.current_amount / g.target_amount) * 100).toFixed(1);

        html += `
          <div class="goal-card">
            <h3>${g.goal_name}</h3>
            <p>₱${g.current_amount} / ₱${g.target_amount}</p>

            <!-- progress -->
            <div class="progress-bar">
              <div class="progress-fill" style="width:${percent}%"></div>
            </div>

            <!-- 🔥 analytics per goal -->
            <div class="goal-analytics">
              <div class="mini-card">
                <small>Daily</small>
                <strong id="daily-${g.id}">₱0</strong>
              </div>
              <div class="mini-card">
                <small>Weekly</small>
                <strong id="weekly-${g.id}">₱0</strong>
              </div>
              <div class="mini-card">
                <small>Monthly</small>
                <strong id="monthly-${g.id}">₱0</strong>
              </div>
            </div>

          </div>
        `;
      });

      document.getElementById("goalList").innerHTML = html;

      // 🔥 after rendering → load analytics per goal
      loadGoalAnalytics();
    });
}

function loadSavings() {
  fetch("get_total.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalSavings").textContent = "₱" + data.total;
    });
}

function loadAnalytics() {

  fetch("get_analytics.php", {
    credentials: "same-origin"
  })
  .then(res => res.json())
  .then(data => {

    const daily =
      document.getElementById("dailyAvg");

    const weekly =
      document.getElementById("weeklyAvg");

    const monthly =
      document.getElementById("monthlyAvg");

    if (daily) {
      daily.textContent = "₱" + data.daily;
    }

    if (weekly) {
      weekly.textContent = "₱" + data.weekly;
    }

    if (monthly) {
      monthly.textContent = "₱" + data.monthly;
    }

    const noAnalytics =
      document.getElementById("noAnalytics");

    if (noAnalytics) {

      if (!data || Object.keys(data).length === 0) {
        noAnalytics.style.display = "block";
      } else {
        noAnalytics.style.display = "none";
      }

    }

  })
  .catch(err => {

    console.error("Analytics error:", err);

  });
}

function loadGoalAnalytics() {

  

  fetch("get_goal_analytics.php", {
    credentials: "same-origin"
  })
  .then(res => res.json())
  .then(data => {

    console.log("ANALYTICS:", data);

    data.forEach(g => {

      const daily =
        document.getElementById(`daily-${g.goal_id}`);

      const weekly =
        document.getElementById(`weekly-${g.goal_id}`);

      const monthly =
        document.getElementById(`monthly-${g.goal_id}`);

      if (daily) {
        daily.textContent = "₱" + g.daily;
      }

      if (weekly) {
        weekly.textContent = "₱" + g.weekly;
      }

      if (monthly) {
        monthly.textContent = "₱" + g.monthly;
      }

    });

  })
  .catch(err => {

    console.error("Goal analytics error:", err);

  });
}

function loadAnalyticsPanel() {
  fetch("get_goal_analytics.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(data => {
      console.log("ANALYTICS:", data); // 🔥 DEBUG

      let html = "";

      data.forEach(g => {
        html += `
          <div class="goal-card">
            <h3>${g.goal_name}</h3>

            <div class="goal-analytics">
              <div class="mini-card">
                <small>Daily</small>
                <strong>₱${g.daily || 0}</strong>
              </div>
              <div class="mini-card">
                <small>Weekly</small>
                <strong>₱${g.weekly || 0}</strong>
              </div>
              <div class="mini-card">
                <small>Monthly</small>
                <strong>₱${g.monthly || 0}</strong>
              </div>
            </div>
          </div>
        `;
      });

      document.getElementById("analyticsList").innerHTML = html;
    });
}


// DELETE FUNCTION
function deleteGoal(id) {
  if (!confirm("Delete this goal?")) return;

  fetch("delete_goal.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id=${id}`,
    credentials: "same-origin"
  })
  .then(res => res.text())
  .then(data => {
    if (data.trim() === "success") {
      loadGoals();
    } else {
      alert(data);
    }
  });
}

function deleteTransaction(id) {

  if (!confirm("Delete this savings record?"))
    return;

  fetch("delete_transaction.php", {

    method: "POST",

    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded"
    },

    body: `id=${id}`,

    credentials: "same-origin"

  })
  .then(res => res.text())
  .then(data => {

    if (data.trim() === "success") {

      loadHistory();
      loadSavings();
      loadGoals();
      loadAnalyticsPanel();
      loadGoalProgress();

    } else {

      alert(data);

    }

  });
}

function loadGoalProgress() {

  fetch("get_goal_progress.php", {
    credentials: "same-origin"
  })
  .then(res => res.json())
  .then(data => {

    console.log("GOAL PROGRESS:", data);

    let html = "";

    data.forEach(g => {

      html += `
        <div style="
          background:rgba(255,255,255,0.7);
          backdrop-filter:blur(15px);
          padding:24px;
          border-radius:24px;
          margin-bottom:20px;
          border:1px solid rgba(160,200,120,0.18);
          box-shadow:0 8px 24px rgba(0,0,0,0.04);
        ">

          <h3 style="
            margin-top:0;
            font-size:28px;
            color:#425133;
          ">
            ${g.goal_name}
          </h3>

          <p style="
            font-size:20px;
            font-weight:600;
            color:#4f5f3c;
          ">
            ₱${g.current_amount} / ₱${g.target_amount}
          </p>

          <p style="
            color:#7c8d5b;
            font-size:18px;
          ">
            Remaining: ₱${g.remaining}
          </p>

          <div style="
            width:100%;
            height:14px;
            background:#edf3d0;
            border-radius:14px;
            overflow:hidden;
            margin-top:18px;
          ">

            <div style="
              width:${g.percent}%;
              height:100%;
              background:linear-gradient(
                90deg,
                #A0C878,
                #DDEB9D
              );
              border-radius:14px;
              transition:0.5s ease;
            ">
            </div>

          </div>

          <small style="
            display:block;
            margin-top:10px;
            color:#6e8452;
            font-weight:600;
            font-size:15px;
          ">
            ${g.percent}% completed
          </small>

        </div>
      `;
    });

    document.getElementById("goalProgressList").innerHTML = html;

  })
  .catch(error => {

    console.error("GOAL PROGRESS ERROR:", error);

  });
}

window.showPanel = (panel) => {

  document
    .querySelectorAll(".panel")
    .forEach(p => p.classList.add("hidden"));

  document
    .getElementById(panel)
    .classList.remove("hidden");

  if (panel === "analytics") {

    loadAnalyticsPanel();
    loadGoalProgress();

  }
};

function logout() {
  window.location.href = "index.html";
}


// MODAL FIX
window.openDeposit = () => {
  document.getElementById("depositModal").classList.remove("hidden");
};

window.closeDeposit = () => {
  document.getElementById("depositModal").classList.add("hidden");
};

// navigation
window.goRegister = () => window.location.href = "register.html";
window.goLogin = () => window.location.href = "index.html";

window.onload = () => {
  loadSavings();
  loadGoals();
  loadHistory();
  loadAnalytics();
  loadAnalyticsPanel();
  loadGoalProgress();
};