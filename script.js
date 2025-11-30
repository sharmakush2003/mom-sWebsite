// Product Data
const products = [
    {
        id: 1,
        name: "Mango Achar",
        price500g: 250,
        price1kg: 480,
        image: "Images/Mango Achar.jpg",
        desc: "Hand-cut raw mangoes sun-dried and matured in a rich blend of mustard oil, fenugreek, and fennel seeds. A timeless classic."
    },
    {
        id: 2,
        name: "Mirchi Achar",
        price500g: 200,
        price1kg: 380,
        image: "Images/Mirchi Achar.jpg",
        desc: "Fresh green chillies slit and stuffed with a tangy, spicy masala mix. A fiery companion to your parathas."
    },
    {
        id: 3,
        name: "Adrak Achar",
        price500g: 300,
        price1kg: 580,
        image: "Images/Adrak Achar.jpg",
        desc: "Tender ginger strips pickled in lemon juice and spices. A zesty, digestive aid that warms the soul."
    },
    {
        id: 4,
        name: "Amla Achar",
        price500g: 280,
        price1kg: 540,
        image: "Images/Amla Achar.jpg",
        desc: "Whole Indian gooseberries steeped in spices. A perfect balance of sour and spicy, packed with tradition and health."
    },
    {
        id: 5,
        name: "Haldi Achar",
        price500g: 350,
        price1kg: 680,
        image: "Images/Haldi Achar.jpg",
        desc: "Fresh turmeric roots pickled to perfection. An earthy, immunity-boosting delight with a golden hue."
    },
    {
        id: 6,
        name: "Lasson Achar",
        price500g: 320,
        price1kg: 620,
        image: "Images/Lasson Achar.jpg",
        desc: "Whole garlic cloves slow-matured in mustard oil and red chilli powder. A robust, pungent flavor for the bold palate."
    }
];

// State
let cart = {};

// Elements
const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountEl = document.getElementById('total-amount');
const orderForm = document.getElementById('order-form');

// Initialize
function init() {
    renderProducts();
    updateCartDisplay();
    setupAnimations();
}

// Scroll Animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Observe hero elements immediately
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    if (heroContent) heroContent.classList.add('reveal-visible');
    if (heroVisual) heroVisual.classList.add('reveal-visible');
}

// Notification Logic
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.innerText = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Render Products
function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                
                <div class="price-options">
                    <div class="price-row">
                        <span>500g - <span class="price-tag">₹${product.price500g}</span></span>
                        <button class="btn-sm" onclick="addToCart(${product.id}, '500g')">Add</button>
                    </div>
                    <div class="price-row">
                        <span>1kg - <span class="price-tag">₹${product.price1kg}</span></span>
                        <button class="btn-sm" onclick="addToCart(${product.id}, '1kg')">Add</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to Cart
window.addToCart = function (id, size) {
    const key = `${id}_${size}`;
    if (cart[key]) {
        cart[key]++;
    } else {
        cart[key] = 1;
    }
    updateCartDisplay();
    showNotification(`Added ${size} to cart! 🛒`);

    // Scroll to order section if it's the first item
    if (Object.keys(cart).length === 1 && cart[key] === 1) {
        const orderSection = document.getElementById('order');
        if (orderSection) orderSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// Remove/Decrease from Cart
window.changeQty = function (key, change) {
    if (cart[key]) {
        cart[key] += change;
        if (cart[key] <= 0) {
            delete cart[key];
        }
    }
    updateCartDisplay();
};

// Update Cart UI
function updateCartDisplay() {
    if (!cartItemsContainer || !totalAmountEl) return;

    const cartKeys = Object.keys(cart);

    if (cartKeys.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your basket is empty. Add some delicious achaar!</p>';
        totalAmountEl.innerText = '0';
        return;
    }

    let total = 0;

    cartItemsContainer.innerHTML = cartKeys.map(key => {
        const [id, size] = key.split('_');
        const product = products.find(p => p.id == id);
        const qty = cart[key];
        const price = size === '500g' ? product.price500g : product.price1kg;
        const itemTotal = price * qty;
        total += itemTotal;

        return `
            <div class="cart-item">
                <div>
                    <strong>${product.name}</strong> <span style="font-size: 0.8rem; background: #eee; padding: 2px 6px; border-radius: 4px;">${size}</span>
                    <div style="font-size: 0.85rem; color: #666;">₹${price} x ${qty}</div>
                </div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="changeQty('${key}', -1)">-</button>
                    <span>${qty}</span>
                    <button class="qty-btn" onclick="changeQty('${key}', 1)">+</button>
                </div>
            </div>
        `;
    }).join('');

    totalAmountEl.innerText = total;
}

// Handle Form Submission
window.addEventListener('load', () => {
    setTimeout(() => {
        const modal = document.getElementById('welcome-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }, 1000); // Show after 1 second
});

window.closeModal = function () {
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// Handle Form Submission
if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const instructions = document.getElementById('instructions').value;
        const payment = document.querySelector('input[name="payment"]:checked').value;

        // Check if cart is empty
        if (Object.keys(cart).length === 0) {
            showNotification("Your cart is empty! Add some items first.");
            return;
        }

        // Construct Message
        let message = `नमस्ते! I want to order some delicious Achaar! 🌶️✨\n\n`;
        message += `👤 *Customer Details*\n`;
        message += `Name: ${name}\n`;
        message += `📞 Phone: ${phone}\n`;
        message += `🏠 Address: ${address}\n`;
        message += `💳 Payment: ${payment}\n`;
        if (instructions) message += `📝 Note: ${instructions}\n`;

        message += `\n🛒 *My Order Summary*\n`;

        let total = 0;
        Object.keys(cart).forEach(key => {
            const [id, size] = key.split('_');
            const product = products.find(p => p.id == id);
            const qty = cart[key];
            const price = size === '500g' ? product.price500g : product.price1kg;
            const itemTotal = price * qty;
            total += itemTotal;

            message += `▪️ ${product.name} (${size}) x ${qty} = ₹${itemTotal}\n`;
        });

        message += `\n💰 *Total Amount: ₹${total}*`;
        message += `\n\nPlease confirm my order! ❤️`;

        // WhatsApp URL
        const phoneNumber = "919785054474";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        window.open(url, '_blank');
    });
}