const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQzfZTKBqqFnG8FVx__6L9SDbfkkJGeM5mQ74xChqsWag7OB675Rh0i8KID55t7M7WnMZgwopbXJF0/pub?gid=783537768&single=true&output=csv";
let merchData = [];
let currentIndex = 0;

async function loadData() {
    try {
        const response = await fetch(sheetUrl);
        const csvText = await response.text();
        Papa.parse(csvText, {
            header: true, 
            skipEmptyLines: true, 
            transformHeader: h => h.trim(),
            complete: function(results) {
                merchData = results.data.filter(row => row["Item Name / Description"]);
                updateDisplay();
            }
        });
    } catch (err) { 
        document.getElementById('item-name').innerText = "Network Error"; 
    }
}

function updateDisplay() {
    if (!merchData.length) return;
    const item = merchData[currentIndex];
    
    document.getElementById('item-name').innerText = item["Item Name / Description"];
    document.getElementById('item-game').innerText = item["Game"] || "—";
    document.getElementById('item-type').innerText = item["Merch Type"] || "—";
    document.getElementById('item-year').innerText = item["Year"] || "—";
    document.getElementById('item-employee').innerText = item["Employee Only"] || "No";
    document.getElementById('item-price').innerText = item["Price"] || "—";
    document.getElementById('counter').innerText = `${currentIndex + 1} / ${merchData.length}`;

    const displayArea = document.getElementById('display-area');
    const imgUrl = item["Image Preview Link"];
    if (imgUrl && imgUrl.toLowerCase().startsWith('http')) {
        displayArea.innerHTML = `<img src="${imgUrl}" alt="merch">`;
    } else {
        displayArea.innerHTML = `<div class="placeholder-text">${item["Item Name / Description"]}</div>`;
    }
}

function nextItem() { 
    if (merchData.length === 0) return;
    currentIndex = (currentIndex + 1) % merchData.length; 
    updateDisplay(); 
}

function prevItem() { 
    if (merchData.length === 0) return;
    currentIndex = (currentIndex - 1 + merchData.length) % merchData.length; 
    updateDisplay(); 
}

// Event Listeners for buttons
document.getElementById('nextBtn').addEventListener('click', nextItem);
document.getElementById('prevBtn').addEventListener('click', prevItem);

// Event Listener for keyboard arrow keys
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") nextItem();
    if (e.key === "ArrowLeft") prevItem();
});

loadData();

