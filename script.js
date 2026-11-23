const products = [
    { 
        id: 1, 
        name: "هودي مدى كلاسيك - برجاندي", 
        category: "men", 
        catName: "هودي رجالي",
        price: 850, 
       img: "image/hoodie.men.jpeg.jpeg"

 
    },
    { 
        id: 2, 
        name: "هودي أوفر سايز - أوف وايت", 
        category: "women", 
        catName: "هودي حريمي",
        price: 820, 
        img: "https://unsplash.com" 
    },
    { 
        id: 3, 
        name: "سويت بانتس مريح - بيج", 
        category: "men", 
        catName: "سويت بانتس رجالي",
        price: 650, 
        img: "https://unsplash.com" 
    },
    { 
        id: 4, 
        name: "سويت بانتس وايد ليج - بني", 
        category: "women", 
        catName: "سويت بانتس حريمي",
        price: 680, 
        img: "image/pans-women.jpeg" 
    },
    { 
        id: 5, 
        name: "سوت حريمي كامل - بني موكا", 
        category: "suits", 
        catName: "سوتات حريمي",
        price: 1450, 
       img: "image/suit-women.jpeg"

    },
    { 
        id: 6, 
        name: "سوت حريمي كاجوال - أبيض كريمي", 
        category: "suits", 
        catName: "سوتات حريمي",
        price: 1380, 
        img: "https://unsplash.com" 
    }
];

let cart = [];

// عرض المنتجات مع قائمة اختيار المقاس
function displayProducts(filter = 'all') {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    filtered.forEach(product => {
        productsGrid.innerHTML += `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <span class="product-category">${product.catName}</span>
                    <h3>${product.name}</h3>
                    <div class="product-price">${product.price} ج.م</div>
                    
                    <div class="size-selector">
                        <label for="size-${product.id}">المقاس:</label>
                        <select id="size-${product.id}">
                            <option value="S">S</option>
                            <option value="M" selected>M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </div>

                    <div class="btn-group">
                        <button class="btn-add" onclick="addToCart(${product.id})">أضف للسلة</button>
                        <button class="btn-try" onclick="tryOnProduct('${product.name}')">جربه بالـ AI</button>
                    </div>
                </div>
            </div>
        `;
    });
}

displayProducts();

function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayProducts(category);
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('preview-img');
        output.src = reader.result;
        output.style.display = 'block';
        document.getElementById('upload-text').style.display = 'none';
    };
    if(event.target.files && event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

function simulateAI() {
    const img = document.getElementById('preview-img');
    const status = document.getElementById('ai-status');
    
    if (img.style.display === 'none') {
        alert("من فضلك ارفع صورتك الأول عشان الـ AI يختارلك!");
        return;
    }

    status.innerHTML = "⏳ جاري تحليل صورتك واختيار أنسب قطعة من مدى...";
    
    setTimeout(() => {
        status.innerHTML = `
            <strong style="color:#4A3525;">✅ تم التحليل بنجاح!</strong><br><br>
            بنرشحلك من تشكيلة مدى: <b>سوت حريمي كامل - بني موكا</b> أو <b>هودي أوفر سايز أوف وايت</b>.<br>
            <small style="color:#7D7068;">(جاهز للربط مع سيرفر الـ AI لدمج القطع على صورتك)</small>
        `;
    }, 1800);
}

function tryOnProduct(productName) {
    document.getElementById('ai-studio').scrollIntoView({ behavior: 'smooth' });
    const img = document.getElementById('preview-img');
    const status = document.getElementById('ai-status');

    if (img.style.display === 'none') {
        status.innerHTML = `ارفع صورتك في المربع اللي على اليمين عشان تشوف <b>${productName}</b> عليك!`;
    } else {
        status.innerHTML = `⏳ جاري تجربة <b>${productName}</b> على صورتك...`;
        setTimeout(() => {
            status.innerHTML = `✨ تم دمج <b>${productName}</b> من مدى على صورتك!`;
        }, 1500);
    }
}

// التحكم في السلة وإضافة المنتج بالمقاس المختار
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    const selectedSize = document.getElementById(`size-${id}`).value;
    
    cart.push({
        ...item,
        size: selectedSize
    });
    
    updateCart();
}

function updateCart() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>السلة فاضية حالياً</p>";
        cartTotal.innerText = "0";
        return;
    }

    let total = 0;
    cartItems.innerHTML = "";
    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <b>${item.name}</b><br>
                    <small style="color:#7A5C43;">المقاس: ${item.size}</small>
                </div>
                <span>${item.price} ج.م <b style="color:#b02a37;cursor:pointer;margin-right:5px;" onclick="removeFromCart(${index})">✖</b></span>
            </div>
        `;
    });
    cartTotal.innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// التحقق من بيانات العميل عند تأكيد الأوردر
function checkout() {
    if (cart.length === 0) return alert("السلة فاضية!");

    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !phone || !address) {
        alert("من فضلك اكتب اسمك ورقم موبايلك وعنوانك بالكامل لإتمام الأوردر.");
        return;
    }

    alert(`شكراً يا ${name}! تم استلام أوردرك من براند مدى بنجاح 🔒\nهنتواصل معاك على رقم ${phone} لتأكيد الشحن.`);
    
    // تفريغ السلة والبيانات بعد الطلب
    cart = [];
    updateCart();
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-address').value = '';
    toggleCart();
}
