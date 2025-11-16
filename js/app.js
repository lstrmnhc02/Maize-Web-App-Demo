// Chart Setup
const ctx = document.getElementById("realtimeChart");
const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            { label: "Temperature (°C)", data: [], borderColor: "#ff4d4d", fill: false },
            { label: "Humidity (%)", data: [], borderColor: "#4d79ff", fill: false }
        ]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: false } }
    }
});

// Compute Risk and trigger devices
function computeRisk(temp, humidity) {
    if (temp > 35 || humidity > 85) return "HIGH";
    if (temp > 30 || humidity > 75) return "MODERATE";
    return "LOW";
}

function updateDevices(risk) {
    const fan = document.getElementById("fanStatus");
    const dehumid = document.getElementById("dehumidStatus");
    const notif = document.getElementById("deviceNotification");

    if (risk === "HIGH" || risk === "MODERATE") {
        fan.textContent = "ON";
        dehumid.textContent = "ON";
        notif.textContent = `⚠️ Preventive devices activated due to ${risk} risk!`;
    } else {
        fan.textContent = "OFF";
        dehumid.textContent = "OFF";
        notif.textContent = "All systems normal";
    }
}

function updateUI(data) {
    const { temp, humidity, timestamp } = data;

    chart.data.labels.push(new Date(timestamp).toLocaleTimeString());
    chart.data.datasets[0].data.push(temp);
    chart.data.datasets[1].data.push(humidity);
    chart.update();

    const risk = computeRisk(temp, humidity);
    const riskBox = document.getElementById("riskLevel");

    riskBox.textContent = risk;
    if (risk === "HIGH") riskBox.style.background = "#ff4d4d";
    else if (risk === "MODERATE") riskBox.style.background = "#ffcc00";
    else riskBox.style.background = "#5cd65c";

    updateDevices(risk);

    // Add to history table
    const table = document.getElementById("historyTable");
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${new Date(timestamp).toLocaleString()}</td>
        <td>${temp.toFixed(1)}</td>
        <td>${humidity.toFixed(1)}</td>
        <td>${risk}</td>
    `;
    table.prepend(tr);
}

// Load historical data
function loadHistory() {
    getHistoryData().then(history => {
        const table = document.getElementById("historyTable");
        history.forEach(row => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.timestamp}</td>
                <td>${row.temp}</td>
                <td>${row.humidity}</td>
                <td>${row.risk}</td>
            `;
            table.appendChild(tr);
        });
    });
}

// Start simulation
getRealtimeData(updateUI);
loadHistory();
