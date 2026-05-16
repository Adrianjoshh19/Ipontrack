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
  
  const hour = new Date().getHours();
  let message;
  
  if (hour < 12) {
    message = 'Good morning! ☀️';
  } else if (hour < 17) {
    message = 'Good afternoon! 🌤️';
  } else {
    message = 'Good evening! 🌙';
  }
  
  greeting.textContent = message;
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
  if (document.body.classList.contains('dark')) {
    toggle.textContent = '☀️ Light Mode';
  } else {
    toggle.textContent = '🌙 Dark Mode';
  }
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

  const amount =
    document.getElementById("amount").value;

    const goalId =
  document.getElementById(
    "depositGoalId"
  ).value;

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

    body: `amount=${encodeURIComponent(amount)}&goal_id=${encodeURIComponent(goalId)}`,

    credentials: "same-origin"

  })
  .then(res => res.text())
  .then(data => {

    console.log("DEPOSIT:", data);

    if (data.trim() === "success") {

      alert("Saved!");

      closeDeposit();
      loadTotalTransactions();

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

  fetch("get_goals.php", {
    credentials: "same-origin"
  })

    .then(res => res.json())

    .then(data => {

      let html = "";

      data.forEach(g => {

        const percent =
          (
            (g.current_amount /
              g.target_amount) * 100
          ).toFixed(1);

        html += `

          <div class="goal-card">

            <div class="goal-top">

  <h3>
    ${g.goal_name}
  </h3>

  <div class="goal-actions">

    <button
    type="button"
      class="goal-add-btn"
      onclick="
        openDeposit(${g.id})
      "
    >
      ADD SAVINGS
    </button>

    <button
    type="button"
      class="goal-delete-btn"
      onclick="
        deleteGoal(${g.id})
      "
    >
      DELETE GOAL
    </button>

  </div>

</div>

            <p>
              ₱${g.current_amount}
              /
              ₱${g.target_amount}
            </p>

            <!-- PROGRESS -->

            <div class="progress-bar">

              <div
                class="progress-fill"
                style="width:${percent}%"
              >
              </div>

            </div>

            <!-- PREDICTION GUIDE -->

            <select
              class="prediction-select"

              onchange="
                updatePrediction(
                  this,
                  ${g.target_amount},
                  ${g.current_amount},
                  ${g.id}
                )
              "
            >

              <option value="1">
                1 Week
              </option>

              <option value="2">
                2 Weeks
              </option>

              <option value="3">
                3 Weeks
              </option>

              <option value="4">
                4 Weeks
              </option>

              <option value="1m">
                1 Month
              </option>

              <option value="2m">
                2 Months
              </option>

              <option value="3m">
                3 Months
              </option>

              <option value="6m">
                6 Months
              </option>

              <option value="12m">
                12 Months
              </option>

            </select>

            <!-- ANALYTICS -->

            <div class="goal-analytics">

              <div class="mini-card">

                <small>
                  Daily
                </small>

                <strong
                  id="daily-${g.id}"
                >
                  ₱0
                </strong>

              </div>

              <div class="mini-card">

                <small>
                  Weekly
                </small>

                <strong
                  id="weekly-${g.id}"
                >
                  ₱0
                </strong>

              </div>

              <div class="mini-card">

                <small>
                  Monthly
                </small>

                <strong
                  id="monthly-${g.id}"
                >
                  ₱0
                </strong>

              </div>

            </div>

          </div>

        `;
      });

      document.getElementById(
        "goalList"
      ).innerHTML = html;

      loadGoalAnalytics();

      /* AUTO LOAD PREDICTION */

      setTimeout(() => {

        document
          .querySelectorAll(
            ".prediction-select"
          )

          .forEach(select => {

            select.dispatchEvent(
              new Event("change")
            );

          });

      }, 100);

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

  showConfirm(

    "Delete Goal",

    "Delete this goal permanently?",

    () => {

      fetch("delete_goal.php", {

        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },

        body: `id=${encodeURIComponent(id)}`,

        credentials: "same-origin"

      })

      .then(res => res.text())

      .then(data => {

        console.log(
          "DELETE GOAL:",
          data
        );

        loadGoals();

        loadGoalProgress();

        loadActiveGoals();

      })

      .catch(err => {

        console.error(
          "DELETE GOAL ERROR:",
          err
        );

      });

    }

  );
}

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

/* =========================
   ACTIVE GOALS COUNT
========================= */

function loadActiveGoals() {

  fetch("get_goals.php", {
    credentials: "same-origin"
  })
  .then(res => res.json())
  .then(data => {

    document.getElementById(
      "activeGoals"
    ).textContent = data.length;

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
  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar && overlay && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }

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

  // Refresh Home when switching back
  if (panel === "home") {
    updateGreeting();
    loadSavings();
}
};


function logout() {
  window.location.href = "index.html";
}


// MODAL FIX
window.openDeposit = (goalId) => {

  document
    .getElementById("depositModal")
    .classList.remove("hidden");

  document
    .getElementById("depositGoalId")
    .value = goalId;
};

window.closeDeposit = () => {
  document.getElementById("depositModal").classList.add("hidden");
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
  loadAnalyticsPanel();
  loadGoalProgress();
  startClock();
  loadActiveGoals();
  loadTotalTransactions();
  startSavingsTips();
  renderCalendar();
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