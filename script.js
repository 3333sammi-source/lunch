let stores = ["麥當勞", "牛肉麵", "便利商店", "排骨飯", "義大利麵"];
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let currentRotation = 0;

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

        // 繪製文字
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
    }
}

function updateList() {
    const list = document.getElementById('storeList');
    list.innerHTML = stores.map((s, i) => `
        <span class="store-item">${s} <b onclick="removeStore(${i})" style="margin-left:8px; cursor:pointer">&times;</b></span>
    `).join('');
}

function removeStore(index) {
    stores.splice(index, 1);
    updateList();
    drawWheel();
}

function spinWheel() {
    if (stores.length < 2) return alert("請至少輸入兩個選項！");
    
    const extraDegrees = Math.floor(Math.random() * 360) + 1800; // 旋轉至少 5 圈
    currentRotation += extraDegrees;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // 計算結果
    setTimeout(() => {
        const actualDegrees = currentRotation % 360;
        const arcSize = 360 / stores.length;
        // 指針在上方（270度方向），逆向計算索引
        const index = Math.floor((360 - (actualDegrees % 360) + 270) % 360 / arcSize);
        document.getElementById('result').innerText = `今天吃：${stores[index]}！`;
    }, 4000);
}

// 初始化
updateList();
drawWheel();
