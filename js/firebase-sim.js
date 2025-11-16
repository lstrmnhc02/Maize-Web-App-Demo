// Simulated Real-Time Data
const fakeDB = {
    temp: 28,
    humidity: 65,
    timestamp: Date.now()
};

function getRealtimeData(callback) {
    setInterval(() => {
        fakeDB.temp = 25 + Math.random() * 10;
        fakeDB.humidity = 55 + Math.random() * 25;
        fakeDB.timestamp = Date.now();
        callback(fakeDB);
    }, 3000);
}

async function getHistoryData() {
    const response = await fetch("../data/sample-history.json");
    return response.json();
}
