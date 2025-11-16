const ctx = document.getElementById("realtimeChart");
const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Temperature (°C)",
                data: [],
            },
            {
                label: "Humidity (%)",
                data: [],
            }
        ]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: false } }
    }
});

function computeRisk(temp, humidity) {
    if (temp > 35 || humidity > 85) return "HIGH";
    if (temp > 30 || humidity > 75) return "MODERATE";
    return "LOW";
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
}

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

getRealtimeData(updateUI);
loadHistory();
