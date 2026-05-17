// ==========================================
// DARK MODE TOGGLE
// ==========================================
// ==========================================
// OVERVIEW ENHANCEMENTS
// ==========================================

// ==========================================
// CONFIRMATION MODAL
// ==========================================
window.confirmAction = null;

window.showConfirm = (title, message, onConfirm) => {
  window.confirmAction = onConfirm;
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMessage').textContent = message;
  document.getElementById('confirmModal').classList.remove('hidden');
};

window.closeConfirm = () => {
  document.getElementById('confirmModal').classList.add('hidden');
  window.confirmAction = null;
  // Reset modal buttons to default
  const actions = document.querySelector('#confirmModal .modal-actions');
  if (actions) {
    actions.innerHTML = `
      <button class="cancel-btn" onclick="closeConfirm()">Cancel</button>
      <button class="save-btn" onclick="executeConfirm()" style="background: var(--danger);">Delete</button>
    `;
  }
};

window.executeConfirm = () => {
  if (typeof window.confirmAction === 'function') {
    window.confirmAction();
  }
  document.getElementById('confirmModal').classList.add('hidden');
  window.confirmAction = null;
};

// Time-based greeting
function updateGreeting() {
  const greeting = document.getElementById('greetingMessage');
  if (!greeting) return;

  fetch("get_user.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(user => {
      const name = user.display_name || "there";
      const hour = new Date().getHours();
      let message;

      if (hour < 12) {
        message = `Good morning, ${name}! ☀️`;
      } else if (hour < 17) {
        message = `Good afternoon, ${name}! 🌤️`;
      } else {
        message = `Good evening, ${name}! 🌙`;
      }

      greeting.textContent = message;
    });
}

// Animated counter
function animateCounter(element, target) {
  const startValue = 0;
  const duration = 1200; // 1.2 seconds
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startValue + (target - startValue) * eased);

    element.textContent = '₱' + current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = '₱' + target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}



window.toggleDarkMode = () => {
  const body = document.body;
  const isDark = body.classList.toggle('dark');
  localStorage.setItem('ipontrack-theme', isDark ? 'dark' : 'light');
  updateDarkModeButton();
};

function updateDarkModeButton() {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;
  toggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

// Apply saved theme on page load
(function () {
  if (localStorage.getItem('ipontrack-theme') === 'dark') {
    document.body.classList.add('dark');
  }
  updateDarkModeButton();
})();

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
  const amount = document.getElementById("amount").value;
  const goalId = document.getElementById("depositGoalId").value;

  if (!amount) {
    showToast("Enter an amount", 'error');
    return;
  }

  fetch("allocate.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `amount=${encodeURIComponent(amount)}&goal_id=${encodeURIComponent(goalId)}`,
    credentials: "same-origin"
  })
    .then(res => res.text())
    .then(data => {
      console.log("ALLOCATE:", data);

      if (data.trim() === "success") {
        showToast("Allocated!");
        closeDeposit();
        document.getElementById("amount").value = "";
        loadSavings();
        loadGoals();
        loadHistory();
        loadAnalytics();
        loadAnalyticsPanel();
        loadGoalProgress();
        loadTotalTransactions();
        loadRemainingBalance();
        loadActiveGoals();
      } else if (data.trim() === "insufficient") {
        showToast("Not enough Remaining!", 'error');
      } else {
        alert(data);
      }
    })
    .catch(err => console.error("Allocate error:", err));
};


window.addGoal = () => {
  const name = document.getElementById("goalName").value;
  const amount = document.getElementById("goalAmount").value;

  if (!name || !amount) {
    showToast("Fill all fields", 'error');
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
        showToast("Goal added!");
        loadGoals();
        loadActiveGoals(); // Refresh
      } else {
        alert(data);
      }
    })
    .catch(err => console.error("Error:", err));
};


window.register = () => {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const display_name = document.getElementById("regDisplayName").value;

  fetch("register.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&display_name=${encodeURIComponent(display_name)}`
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

      data.filter(g => g.goal_name !== 'General Savings').forEach(g => {
        const percent = ((g.current_amount / g.target_amount) * 100).toFixed(1);

        html += `
          <div class="goal-card">
            <div class="goal-top">
              <h3>${g.goal_name}</h3>
              <div class="goal-actions">
  <button type="button" class="goal-add-btn" onclick="openDeposit(${g.id})">ADD SAVINGS</button>
  <button type="button" class="goal-withdraw-btn" onclick="openGoalWithdraw(${g.id})">WITHDRAW</button>
  <button type="button" class="goal-delete-btn" onclick="deleteGoal(${g.id})">DELETE GOAL</button>
</div>
            </div>
            <p>₱${g.current_amount} / ₱${g.target_amount}</p>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${percent}%"></div>
            </div>
            <select class="prediction-select" onchange="updatePrediction(this, ${g.target_amount}, ${g.current_amount}, ${g.id})">
              <option value="1">1 Week</option>
              <option value="2">2 Weeks</option>
              <option value="3">3 Weeks</option>
              <option value="4">4 Weeks</option>
              <option value="1m">1 Month</option>
              <option value="2m">2 Months</option>
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="12m">12 Months</option>
            </select>
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
      loadGoalAnalytics();

      setTimeout(() => {
        document.querySelectorAll(".prediction-select").forEach(select => {
          select.dispatchEvent(new Event("change"));
        });
      }, 100);
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

function updatePrediction(
  select,
  target,
  current,
  goalId
) {

  let remaining =
    target - current;

  if (remaining < 0) {

    remaining = 0;
  }

  let weeks = 1;
  let months = 1;

  const value = select.value;

  if (value.includes("m")) {

    months =
      parseInt(value);

    weeks =
      months * 4;

  } else {

    weeks =
      parseInt(value);

    months =
      weeks / 4;
  }

  const daily =
    remaining / (weeks * 7);

  const weekly =
    remaining / weeks;

  const monthly =
    remaining / months;

  document.getElementById(
    `daily-${goalId}`
  ).textContent =
    "₱" + daily.toFixed(2);

  document.getElementById(
    `weekly-${goalId}`
  ).textContent =
    "₱" + weekly.toFixed(2);

  document.getElementById(
    `monthly-${goalId}`
  ).textContent =
    "₱" + monthly.toFixed(2);
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
  fetch("get_goals.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(goals => {
      const goal = goals.find(g => g.id == id);

      if (!goal) return;

      const isCompleted = parseFloat(goal.current_amount) >= parseFloat(goal.target_amount);

      if (isCompleted) {
        // Completed goal
        document.getElementById('confirmTitle').textContent = 'Delete Completed Goal';
        document.getElementById('confirmMessage').textContent = 'Why are you deleting this completed goal?';
        document.getElementById('confirmModal').classList.remove('hidden');
        document.querySelector('#confirmModal .modal-actions').innerHTML = `
          <button class="cancel-btn" onclick="closeConfirm()">Cancel</button>
          <button class="save-btn" onclick="executeGoalDelete(${id}, 'spent')" style="background: var(--danger);">I Spent It</button>
          <button class="save-btn" onclick="executeGoalDelete(${id}, 'refund')">Refund Me</button>
        `;
      } else {
        // Incomplete goal
        showConfirm(
          "Delete Goal",
          "Delete this goal? The allocated amount will be refunded to Remaining Savings.",
          () => executeGoalDelete(id, 'incomplete')
        );
      }
    });
}

function showCompleteDeleteConfirm(id) {
  document.getElementById('confirmTitle').textContent = 'Delete Completed Goal';
  document.getElementById('confirmMessage').textContent = 'Why are you deleting this completed goal?';
  document.getElementById('confirmModal').classList.remove('hidden');

  // Update modal buttons
  const actions = document.querySelector('#confirmModal .modal-actions');
  actions.innerHTML = `
    <button class="cancel-btn" onclick="closeConfirm()">Cancel</button>
    <button class="save-btn" onclick="executeGoalDelete(${id}, 'spent')" style="background: var(--danger);">I Spent It</button>
    <button class="save-btn" onclick="executeGoalDelete(${id}, 'refund')">Refund Me</button>
  `;
}

window.openGoalWithdraw = (goalId) => {
  document.getElementById("goalWithdrawModal").classList.remove("hidden");
  document.getElementById("withdrawGoalId").value = goalId;
  document.getElementById("goalWithdrawAmount").value = "";
};

window.closeGoalWithdraw = () => {
  document.getElementById("goalWithdrawModal").classList.add("hidden");
};

window.goalWithdraw = () => {
  const amount = document.getElementById("goalWithdrawAmount").value;
  const goalId = document.getElementById("withdrawGoalId").value;

  if (!amount) {
    showToast("Enter an amount", 'error');
    return;
  }

  fetch("goal_withdraw.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `amount=${encodeURIComponent(amount)}&goal_id=${encodeURIComponent(goalId)}`,
    credentials: "same-origin"
  })
    .then(res => res.text())
    .then(data => {
      if (data.trim() === "success") {
        showToast("Withdrawn from goal!");
        closeGoalWithdraw();
        loadSavings();
        loadGoals();
        loadHistory();
        loadTotalTransactions();
        loadRemainingBalance();
        loadActiveGoals();
        loadGoalProgress();
      } else if (data.trim() === "insufficient") {
        showToast("Not enough funds!", 'error');
      } else {
        alert(data);
      }
    })
    .catch(err => console.error("Goal withdraw error:", err));
};

window.executeGoalDelete = (id, reason) => {
  closeConfirm();

  fetch("delete_goal.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id=${encodeURIComponent(id)}&reason=${reason}`,
    credentials: "same-origin"
  })
    .then(res => res.text())
    .then(data => {
      console.log("DELETE GOAL:", data);
      loadGoals();
      loadGoalProgress();
      loadActiveGoals();
      loadSavings();
      loadRemainingBalance();
      loadTotalTransactions();
      loadHistory();
    })
    .catch(err => console.error("DELETE GOAL ERROR:", err));
};

function deleteTransaction(id) {
  console.log("Deleting transaction ID:", id);

  showConfirm(
    'Delete this savings record?',
    'This will remove the transaction from your history.',
    () => {
      console.log("Confirmed! Sending request for ID:", id);

      fetch("delete_transaction.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${id}`,
        credentials: "same-origin"
      })
        .then(res => {
          console.log("Response status:", res.status);
          return res.text();
        })
        .then(data => {
          console.log("Server response:", data);

          if (data.trim() === "success") {
            console.log("Delete successful, refreshing...");
            loadHistory();
            loadSavings();
            loadGoals();
            loadAnalyticsPanel();
            loadGoalProgress();
            loadRemainingBalance();
          } else {
            console.log("Delete failed:", data);
            alert(data);
          }
        })
        .catch(err => {
          console.error("Fetch error:", err);
        });
    }
  );
}

/* =========================
   REAL TIME CLOCK
========================= */

function startClock() {

  function updateClock() {

    const now = new Date();

    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday"
    ];

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const day = days[now.getDay()];

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const date = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    document.getElementById("clockDay").textContent = day;
    document.getElementById("clockTime").textContent = `${hours}:${minutes} ${ampm}`;
    document.getElementById("clockDate").textContent = date;



  }

  updateClock();
  setInterval(updateClock, 1000);
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
          background:var(--card-bg);
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
            color:var(--text-dark);
          ">
            ${g.goal_name}
          </h3>

          <p style="
            font-size:20px;
            font-weight:600;
            color:var(--text-dark);
          ">
            ₱${g.current_amount} / ₱${g.target_amount}
          </p>

          <p style="
            color:var(--text-soft);
            font-size:18px;
          ">
            Remaining: ₱${g.remaining}
          </p>

          <div style="
            width:100%;
            height:14px;
            background:rgba(255,255,255,0.08);
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
            ">
            </div>

          </div>

          <small style="
            display:block;
            margin-top:10px;
            color:var(--text-soft);
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

      console.error(
        "GOAL PROGRESS ERROR:",
        error
      );

    });
}

function loadRemainingBalance() {
  fetch("get_remaining.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById("remainingBalance");
      const amount = parseFloat(data.remaining).toLocaleString();
      el.textContent = "₱" + amount;

      el.style.fontSize = "42px";
      while (el.scrollWidth > el.clientWidth && parseInt(el.style.fontSize) > 14) {
        el.style.fontSize = (parseInt(el.style.fontSize) - 1) + "px";
      }
    })
    .catch(err => console.error("Remaining balance error:", err));
}

/* =========================
   ACTIVE GOALS COUNT
========================= */

function loadActiveGoals() {

  fetch("get_goals.php", {
    credentials: "same-origin"
  })
    .then(res => res.json())
    .then(data => {
      const realGoals = data.filter(g => g.goal_name !== 'General Savings');
      document.getElementById("activeGoals").textContent = realGoals.length;
    })
    .catch(error => {

      console.error(
        "ACTIVE GOALS ERROR:",
        error
      );

    });
}

/* =========================
   TOTAL TRANSACTIONS COUNT
========================= */

function loadTotalTransactions() {

  fetch("get_transactions.php", {
    credentials: "same-origin"
  })
    .then(res => res.json())
    .then(data => {

      document.getElementById(
        "totalTransactions"
      ).textContent = data.length;

    })
    .catch(error => {

      console.error(
        "TOTAL TRANSACTIONS ERROR:",
        error
      );

    });
}

/* =========================
   ROTATING SAVINGS TIPS
========================= */

function startSavingsTips() {

  const tips = [

    'Pay yourself first — save before you spend.',
    'Track every peso. Small leaks sink big ships.',
    'Set specific goals. "New laptop" beats "save more".',
    'The 50-30-20 rule: 50% needs, 30% wants, 20% savings.',
    'Automate your savings. Set it and forget it.',
    'Wait 24 hours before big purchases. Impulse kills budgets.',
    'Save your bonuses and windfalls, future you will thank you.',
    'Comparison is the thief of joy. Focus on your own goals.',
    'A little saved daily becomes a lot saved monthly.',
    '"A penny saved is a penny earned." — Benjamin Franklin"',
    'Start small. Even ₱100 a week adds up to over ₱5,000 a year.',
    '"Beware of little expenses; a small leak will sink a great ship." — Benjamin Franklin',
    '"The quickest way to double your money is to fold it in half and put it in your back pocket." — Will Rogers',
    'Emergency fund first — aim for 3-6 months of expenses.',
    '"Budgeting is telling your money where to go instead of wondering where it went." — Dave Ramsey'

  ];

  let current = 0;
  const tipText = document.getElementById("tipsText");
  const dotsContainer = document.getElementById("tipDots");

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    const maxDots = Math.min(4, tips.length);
    for (let i = 0; i < maxDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'tip-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Tip ' + (i + 1));
      dot.onclick = () => {
        current = i;
        updateTip();
      };
      dotsContainer.appendChild(dot);
    }
  }

  function updateTip() {
    const maxDots = Math.min(4, tips.length);
    const activeDotIndex = current % maxDots;
    document.querySelectorAll('#tipDots .tip-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeDotIndex);
    });

    // Animate text
    tipText.classList.remove("tip-slide-in");
    tipText.classList.add("tip-slide-out");

    setTimeout(() => {
      tipText.textContent = tips[current];
      tipText.classList.remove("tip-slide-out");
      tipText.classList.add("tip-slide-in");
    }, 400);
  }

  // Rotate every 15 seconds
  setInterval(() => {
    current = (current + 1) % tips.length;
    updateTip();
  }, 7000);
}

window.showPanel = (panel) => {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar && overlay && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }

  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(panel).classList.remove("hidden");

  if (panel === "analytics") {
    loadAnalyticsSummary();
    loadSavingsTrend();
    loadGoalBreakdown();
  }

  if (panel === "home") {
    updateGreeting();
    loadSavings();
    loadRemainingBalance();
  }
};

function logout() {
  showConfirm(
    "Logout",
    "Are you sure you want to logout?",
    () => {
      window.location.href = "index.html";
    }
  );
}


// MODAL FIX
window.openDeposit = (goalId) => {
  document.getElementById("depositModal").classList.remove("hidden");
  document.getElementById("depositGoalId").value = goalId;
  document.getElementById("amount").value = ""; // ← ADD THIS
};

window.closeDeposit = () => {
  document.getElementById("depositModal").classList.add("hidden");
};

// General Deposit Modal
window.openGeneralDeposit = () => {
  document.getElementById("generalDepositModal").classList.remove("hidden");
};

window.closeGeneralDeposit = () => {
  document.getElementById("generalDepositModal").classList.add("hidden");
};

window.generalDeposit = () => {
  const amount = document.getElementById("generalAmount").value;

  if (!amount) {
    showToast("Enter an amount", 'error');
    return;
  }

  fetch("deposit_general.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `amount=${encodeURIComponent(amount)}`,
    credentials: "same-origin"
  })
    .then(res => res.text())
    .then(data => {
      if (data.trim() === "success") {
        showToast("Savings added!");
        closeGeneralDeposit();
        document.getElementById("generalAmount").value = "";
        loadSavings();
        loadTotalTransactions();
        loadRemainingBalance();
      } else {
        alert(data);
      }
    })
    .catch(err => console.error("General deposit error:", err));
};



function loadSavingsTrend() {
  fetch("get_savings_trend.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("savingsTrend");
      if (!container) return;

      if (!data || data.length === 0) {
        container.innerHTML = "<p style='color: var(--text-soft); text-align: center; padding: 40px;'>No savings data yet</p>";
        return;
      }

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const amounts = data.map(d => parseFloat(d.total));
      const maxAmount = Math.max(...amounts.map(Math.abs), 1);

      let html = "";
      data.forEach(d => {
        const date = new Date(d.date);
        const day = days[date.getDay()];
        const value = Math.max(0, parseFloat(d.total));
        const height = (Math.abs(value) / maxAmount) * 180 + 8;
        const color = value >= 0 ? "var(--primary)" : "var(--danger)";

        html += `
          <div class="bar-wrapper">
            <span class="bar-amount">₱${value.toLocaleString()}</span>
            <div class="bar" style="height: ${height}px; background: ${color};"></div>
            <span class="bar-label">${day}</span>
          </div>
        `;
      });

      container.innerHTML = html;
    })
    .catch(err => console.error("Trend error:", err));
}

function loadGoalBreakdown() {
  fetch("get_goals.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(data => {
      const realGoals = data.filter(g => g.goal_name !== "General Savings");
      const container = document.getElementById("goalBreakdown");
      const legend = document.getElementById("donutLegend");
      if (!container || !legend) return;

      if (realGoals.length === 0) {
        container.style.background = "conic-gradient(#e0e0e0 0% 100%)";
        legend.innerHTML = "<p style='color: var(--text-soft);'>No goals yet</p>";
        return;
      }

      const colors = ["#A0C878", "#4A90D9", "#ff6a6a", "#fd8d42", "#7B68EE", "#50C878", "#FF6B6B", "#45B7D1"];
      const total = realGoals.reduce((sum, g) => sum + parseFloat(g.current_amount), 0) || 1;

      let gradient = "conic-gradient(";
      let cumulative = 0;

      realGoals.forEach((g, i) => {
        const percent = (parseFloat(g.current_amount) / total) * 100;
        gradient += `${colors[i % colors.length]} ${cumulative}% ${cumulative + percent}%`;
        if (i < realGoals.length - 1) gradient += ", ";
        cumulative += percent;
      });
      gradient += ")";

      container.style.background = gradient;

      let legendHtml = "";
      realGoals.forEach((g, i) => {
        const percent = ((parseFloat(g.current_amount) / total) * 100).toFixed(1);
        legendHtml += `
          <div class="legend-item">
            <div class="legend-dot" style="background: ${colors[i % colors.length]};"></div>
            <span>${g.goal_name} (${percent}%)</span>
          </div>
        `;
      });
      legend.innerHTML = legendHtml;
    })
    .catch(err => console.error("Breakdown error:", err));
}

function loadAnalyticsSummary() {
  fetch("get_total.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(data => {
      document.getElementById("analyticsTotalSavings").textContent = "₱" + parseFloat(data.total).toLocaleString();
    });

  fetch("get_remaining.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(data => {
      document.getElementById("analyticsAllocated").textContent = "₱" + parseFloat(data.allocated).toLocaleString();
      document.getElementById("analyticsRemaining").textContent = "₱" + parseFloat(data.remaining).toLocaleString();
    });

  fetch("get_goals.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(data => {
      const completed = data.filter(g => g.goal_name !== "General Savings" && parseFloat(g.current_amount) >= parseFloat(g.target_amount)).length;
      document.getElementById("analyticsCompleted").textContent = completed;
    });
}

function loadSavings() {
  fetch("get_total.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(data => {
      const totalElement = document.getElementById("totalSavings");
      const target = parseFloat(data.total) || 0;
      animateCounter(totalElement, target);
    });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

window.openWithdraw = () => {
  document.getElementById("withdrawModal").classList.remove("hidden");
  document.getElementById("withdrawAmount").value = "";
};

window.closeWithdraw = () => {
  document.getElementById("withdrawModal").classList.add("hidden");
};

window.withdraw = () => {
  const amount = document.getElementById("withdrawAmount").value;

  if (!amount) {
    showToast("Enter an amount", 'error');
    return;
  }

  fetch("withdraw.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `amount=${encodeURIComponent(amount)}`,
    credentials: "same-origin"
  })
    .then(res => res.text())
    .then(data => {
      if (data.trim() === "success") {
        showToast("Withdrawn!");
        closeWithdraw();
        loadSavings();
        loadTotalTransactions();
        loadRemainingBalance();
      } else {
        alert(data);
      }
    })
    .catch(err => console.error("Withdraw error:", err));
};

// navigation
window.goRegister = () => window.location.href = "register.html";
window.goLogin = () => window.location.href = "index.html";

window.onload = () => {
  updateGreeting();
  loadSavings();
  loadGoals();
  loadHistory();
  loadAnalytics();
  startClock();
  loadActiveGoals();
  loadTotalTransactions();
  startSavingsTips();
  renderCalendar();
  loadRemainingBalance();
  loadAnalyticsSummary();
  loadSavingsTrend();
  loadGoalBreakdown();
};

function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  document.getElementById("calMonth").textContent = monthNames[month];
  document.getElementById("calYear").textContent = year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = '';

  for (let i = 0; i < firstDay; i++) {
    html += '<span class="cal-day-cell empty"></span>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (d === today) ? ' today' : '';
    html += `<span class="cal-day-cell${isToday}">${d}</span>`;
  }

  document.getElementById("calDays").innerHTML = html;
}

