let stores = ["而且", "牛肉麵", "便利商店", "排骨飯", "義大利麵"];
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let currentRotation = 0;

// 【新增】從網址讀取資料
function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('list');
    if (data) {
        stores = data.split(',');
    }
}

// 【新增】更新網址，讓你可以分享
function updateURL() {
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?list=' + stores.join(',');
    window.history.pushState({ path: newUrl }, '', newUrl);
}

function drawWheel() {
    const numOptions = stores.length;
    if (numOptions === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }
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

function addStore() {
    const input = document.getElementById('storeInput');
    if (input.value.trim() !== "") {
        stores.push(input.value.trim());
        input.value = "";
        updateList();
        drawWheel();
        updateURL(); // 儲存到網址
    }
}

function removeStore(index) {
    stores.splice(index, 1);
    updateList();
    drawWheel();
    updateURL(); // 儲存到網址
}

function updateList() {
    const list = document.getElementById('storeList');
    list.innerHTML = stores.map((s, i) => `
        <span class="store-item">${s} <b onclick="removeStore(${i})" style="margin-left:8px; cursor:pointer">&times;</b></span>
    `).join('');
}

function spinWheel() {
    if (stores.length < 2) return alert("請至少輸入兩個選項！");
    
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

// 初始化：先讀取網址資料，再畫圖
loadFromURL();
updateList();
drawWheel();
