// 【修改這裡】放入你的 Google 試算表 ID
const SHEET_ID = '190kDZpP_bmwHqwLSaY4Ak8xaIps5LfPvObgMyAIt2HY'; 
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

let stores = [];
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let currentRotation = 0;

// 從 Google Sheets 抓取資料
async function fetchSheetData() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        
        // 解析 CSV 資料 (簡單處理：按行分開並去除引號)
        const rows = data.split('\n').slice(1); // 跳過第一行標題
        stores = rows.map(row => row.replace(/"/g, '').trim()).filter(row => row !== "");
        
        if (stores.length === 0) {
            alert("試算表裡沒東西喔！請在 A 欄輸入店家。");
            stores = ["請在表格輸入資料"];
        }
        
        updateList();
        drawWheel();
    } catch (error) {
        console.error("抓取資料失敗:", error);
        alert("無法讀取資料，請確認試算表已「發佈到網路」。");
    }
}

function drawWheel() {
    const numOptions = stores.length;
    const arcSize = (2 * Math.PI) / numOptions;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stores.forEach((store, i) => {
        const angle = i * arcSize;
        ctx.beginPath();
        ctx.fillStyle = `hsl(${i * (360 / numOptions)}, 70%, 60%)`;
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle, angle + arcSize);
        ctx.fill();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.fillText(store, 180, 10);
        ctx.restore();
    });
}

function updateList() {
    const list = document.getElementById('storeList');
    list.innerHTML = stores.map(s => `<span class="store-item">${s}</span>`).join('');
}

function spinWheel() {
    if (stores.length < 2) return alert("選項不足！");
    
    const extraDegrees = Math.floor(Math.random() * 360) + 1800;
    currentRotation += extraDegrees;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const actualDegrees = currentRotation % 360;
        const arcSize = 360 / stores.length;
        const index = Math.floor((360 - (actualDegrees % 360) + 270) % 360 / arcSize);
        document.getElementById('result').innerText = `今天吃：${stores[index]}！`;
    }, 4000);
}

// 初始化：自動抓取一次資料
fetchSheetData();
