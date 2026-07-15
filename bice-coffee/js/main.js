// ========================
// B'ICE Coffee - Main JS
// ========================

// Cart State
let cart = [];
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.querySelector('.cart-badge');
const cartSidebar = document.getElementById('cartSidebar');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const contactForm = document.getElementById('contactForm');

// ========================
// Fetch Menu from Backend
// ========================
async function fetchMenu() {
    try {
        const response = await fetch(`${API_URL}/menu`);
        const data = await response.json();
        renderMenu(data);
    } catch (error) {
        console.error('Error fetching menu:', error);
        // Fallback data if backend is not running
        const fallbackMenu = [
            { id: 1, name: 'Classic Iced Coffee', price: 4.50, description: 'Smooth and refreshing', icon: 'fa-mug-saucer' },
            { id: 2, name: 'Caramel Iced Latte', price: 5.50, description: 'Sweet caramel delight', icon: 'fa-mug-hot' },
            { id: 3, name: 'Mocha Ice Blended', price: 6.00, description: 'Chocolate coffee fusion', icon: 'fa-glass-water' },
            { id: 4, name: 'Vanilla Iced Cold Brew', price: 5.00, description: 'Smooth vanilla cold brew', icon: 'fa-mug-saucer' },
            { id: 5, name: 'Hazelnut Iced Coffee', price: 5.50, description: 'Nutty and aromatic', icon: 'fa-mug-hot' },
            { id: 6, name: 'Espresso on Ice', price: 4.00, description: 'Strong and bold', icon: 'fa-coffee' }
        ];
        renderMenu(fallbackMenu);
    }
}

// ========================
// Render Menu
// ========================
function renderMenu(items) {
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-card" data-id="${item.id}">
            <i class="fas ${item.icon || 'fa-mug-saucer'}"></i>
            <h3>${item.name}</h3>
            <p class="description">${item.description || 'Delicious iced coffee'}</p>
            <p class="price">$${item.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">
                <i class="fas fa-plus"></i> Add to Cart
            </button>
        </div>
    `).join('');
}

// ========================
// Cart Functions
// ========================
function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
    showNotification(`${name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    cartBadge.textContent = totalItems;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// ========================
// Cart Sidebar Toggle
// ========================
cartToggle.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.toggle('open');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

// ========================
// Checkout
// ========================
checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        });
        
        if (response.ok) {
            showNotification('Order placed successfully! ☕');
            cart = [];
            updateCartUI();
            cartSidebar.classList.remove('open');
        }
    } catch (error) {
        showNotification('Order placed! (Demo mode)', 'success');
        cart = [];
        updateCartUI();
        cartSidebar.classList.remove('open');
    }
});

// ========================
// Contact Form
// ========================
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    try {
        await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        showNotification('Message sent! We\'ll get back to you soon.');
        contactForm.reset();
    } catch (error) {
        showNotification('Message sent! (Demo mode)');
        contactForm.reset();
    }
});

// ========================
// Notifications
// ========================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : '#6f4e37'};
        color: #fff;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================
// Hamburger Menu
// ========================
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// ========================
// Init
// ========================
document.addEventListener('DOMContentLoaded', fetchMenu);

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);