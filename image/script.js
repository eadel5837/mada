const fallbackImage = "image/hoodie.men.jpeg.jpeg";

const products = [
    { id: 1, name: "هودي مدى كلاسيك", category: "men", catName: "هودي رجالي", price: 850, img: "image/hoodie.men.jpeg.jpeg" },
    { id: 2, name: "هودي أوفر سايز", category: "women", catName: "هودي حريمي", price: 820, img: "image/hoodie.women2.jpeg" },
    { id: 3, name: "سويت بانتس مريح", category: "men", catName: "سويت بانتس رجالي", price: 650, img: "image/suit-men.jpeg" },
    { id: 4, name: "سويت بانتس وايد ليج", category: "women", catName: "سويت بانتس حريمي", price: 680, img: "image/pans-women.jpeg" },
    { id: 5, name: "سوت حريمي كامل", category: "suits", catName: "سوتات حريمي", price: 1450, img: "image/suit-women.jpeg" },
    { id: 6, name: "سوت حريمي كاجوال", category: "suits", catName: "سوتات حريمي", price: 1380, img: "suit-women2.jpeg" }
];

let cart = [];

function displayProducts(filter = 'all') {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const filtered = filter === 'all' ? products : products.filter(product => product.category === filter);

    productsGrid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <img src="${product.img}" alt="${product.name}" class="product-img" onerror="this.onerror=null;this.src='${fallbackImage}'">
            <div class="product-info">
                <span class="product-category">${product.catName}</span>
                <h3>${product.name}</h3>
                <div class="product-price">${product.price} ج.م</div>

                <div class="options-row">
                    <div class="option-box">
                        <label for="size-${product.id}">المقاس:</label>
                        <select id="size-${product.id}" aria-label="مقاس ${product.name}">
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M" selected>M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                    </div>

                    <div class="option-box">
                        <label for="color-${product.id}">اللون:</label>
                        <select id="color-${product.id}" aria-label="لون ${product.name}">
                            <option value="برجاندي">برجاندي</option>
                            <option value="أسود">أسود</option>
                            <option value="جراي">جراي</option>
                            <option value="زيتي">زيتي</option>
                            <option value="بني" selected>بني</option>
                            <option value="بيج">بيج</option>
                        </select>
                    </div>
                </div>

                <div class="btn-group">
                    <button class="btn-add" type="button" onclick="addToCart(${product.id})">أضف للسلة</button>
                    <button class="btn-try" type="button" onclick="tryOnProduct('${product.name}', document.getElementById('color-${product.id}').value)">جربه بالـ AI</button>
                </div>
            </div>
        </article>
    `).join('');
}

function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    } else {
        const labels = { all: 'الكل', men: 'رجالي', women: 'حريمي', suits: 'سوتات حريمي' };
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.textContent.trim() === labels[category]) btn.classList.add('active');
        });
    }
    displayProducts(category);
}

function previewImage(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('preview-img');
        output.src = reader.result;
        output.style.display = 'block';
        document.getElementById('upload-text').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function simulateAI() {
    const heightInput = document.getElementById('user-height');
    const weightInput = document.getElementById('user-weight');
    const bodyInput = document.getElementById('user-body');
    const height = Number(heightInput.value);
    const weight = Number(weightInput.value);
    const bodyType = bodyInput.value;
    const status = document.getElementById('ai-status');

    if (!height || !weight || !bodyType) {
        alert('من فضلك اكتب الطول والوزن واختر هيئة الجسم الأول!');
        return;
    }

    status.innerHTML = "<p class='ai-loading'>⏳ جاري تحليل قياسات جسمك واقتراح أطقم متناسقة...</p>";

    let recommendedSize = 'M';
    if (weight < 60) recommendedSize = 'S';
    else if (weight < 75) recommendedSize = 'M';
    else if (weight < 90) recommendedSize = 'L';
    else recommendedSize = 'XL';

    if (bodyType === 'ممتلئ' && recommendedSize !== 'XL') {
        recommendedSize = recommendedSize === 'S' ? 'M' : recommendedSize === 'M' ? 'L' : 'XL';
    }

    setTimeout(() => {
        status.innerHTML = `
            <div class="ai-recommendation-head">
                <strong>✅ مقاسك المثالي في مدى:</strong>
                <span class="size-badge">${recommendedSize}</span>
                <small>اختر طقمًا من الاقتراحات وتجربته على صورتك</small>
            </div>
            <div class="outfit-card"><h4>1️⃣ طقم كلاسيك دافئ (هودي بني + سويت بانتس بيج)</h4><p>تناسق مناسب لهيئة الجسم (${bodyType}).</p><button type="button" class="try-outfit-btn" onclick="applyOutfitToPhoto('هودي بني + سويت بانتس بيج', '${recommendedSize}')">جرب الطقم على صورتك ✨</button></div>
            <div class="outfit-card"><h4>2️⃣ طقم كاجوال عصري (هودي برجاندي + سويت بانتس جراي)</h4><p>ألوان جريئة ومتوازنة للاستخدام اليومي.</p><button type="button" class="try-outfit-btn" onclick="applyOutfitToPhoto('هودي برجاندي + سويت بانتس جراي', '${recommendedSize}')">جرب الطقم على صورتك ✨</button></div>
            <div class="outfit-card"><h4>3️⃣ طقم إيرث تون (هودي زيتي + سويت بانتس أسود)</h4><p>إطلالة عملية تناسب طولك (${height} سم).</p><button type="button" class="try-outfit-btn" onclick="applyOutfitToPhoto('هودي زيتي + سويت بانتس أسود', '${recommendedSize}')">جرب الطقم على صورتك ✨</button></div>
        `;
    }, 1300);
}

function applyOutfitToPhoto(outfitName, size) {
    const img = document.getElementById('preview-img');
    if (!img || img.style.display === 'none' || !img.src) {
        alert('من فضلك ارفع صورتك الأول في مربع الصورة لتجربة الطقم!');
        return;
    }
    alert(`✨ تم اختيار (${outfitName}) بمقاس (${size}) لتجربته على صورتك.`);
}

function tryOnProduct(productName, color) {
    document.getElementById('ai-studio').scrollIntoView({ behavior: 'smooth' });
    const img = document.getElementById('preview-img');
    const status = document.getElementById('ai-status');

    if (!img || img.style.display === 'none' || !img.src) {
        status.innerHTML = `<div class="empty-ai-state"><p>ارفع صورتك عشان تشوف <b>${productName} - لون ${color}</b> عليك!</p></div>`;
    } else {
        status.innerHTML = `<div class="empty-ai-state"><p>⏳ جاري تجربة <b>${productName} - لون ${color}</b> على صورتك...</p></div>`;
        setTimeout(() => {
            status.innerHTML = `<div class="empty-ai-state"><p class="success-message">✨ تم اختيار <b>${productName} - لون ${color}</b> للتجربة على صورتك!</p></div>`;
        }, 1200);
    }
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function addToCart(id) {
    const item = products.find(product => product.id === id);
    if (!item) return;

    const selectedSize = document.getElementById(`size-${id}`).value;
    const selectedColor = document.getElementById(`color-${id}`).value;

    cart.push({ ...item, size: selectedSize, color: selectedColor });
    updateCart();
}

function updateCart() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>السلة فاضية حالياً</p>';
        cartTotal.innerText = '0';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `<div class="cart-item"><div><b>${item.name}</b><br><small>المقاس: ${item.size} | اللون: ${item.color}</small></div><span>${item.price} ج.م <b class="remove-item" onclick="removeFromCart(${index})">✖</b></span></div>`;
    }).join('');
    cartTotal.innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert('السلة فاضية!');
        return;
    }

    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !phone || !address) {
        alert('من فضلك أدخل الاسم ورقم الموبايل والعنوان لإتمام الأوردر.');
        return;
    }

    alert(`تم استلام أوردرك يا ${name} بنجاح! سيتواصل معك فريق مدى على ${phone}.`);
}

displayProducts();
