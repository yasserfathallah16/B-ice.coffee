// ========================
// B'ICE Coffee - Backend Server
// ========================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// ========================
// Data (In-memory for demo)
// ========================
const menuItems = [
    { id: 1, name: 'Classic Iced Coffee', price: 4.50, description: 'Smooth and refreshing iced coffee', icon: 'fa-mug-saucer' },
    { id: 2, name: 'Caramel Iced Latte', price: 5.50, description: 'Sweet caramel delight with espresso', icon: 'fa-mug-hot' },
    { id: 3, name: 'Mocha Ice Blended', price: 6.00, description: 'Chocolate coffee fusion blended with ice', icon: 'fa-glass-water' },
    { id: 4, name: 'Vanilla Iced Cold Brew', price: 5.00, description: 'Smooth vanilla cold brew coffee', icon: 'fa-mug-saucer' },
    { id: 5, name: 'Hazelnut Iced Coffee', price: 5.50, description: 'Nutty and aromatic iced coffee', icon: 'fa-mug-hot' },
    { id: 6, name: 'Espresso on Ice', price: 4.00, description: 'Strong and bold espresso over ice', icon: 'fa-coffee' },
    { id: 7, name: 'Coconut Iced Latte', price: 5.75, description: 'Tropical coconut milk iced latte', icon: 'fa-mug-saucer' },
    { id: 8, name: 'Matcha Iced Latte', price: 5.50, description: 'Green tea matcha with milk and ice', icon: 'fa-mug-hot' }
];

let orders = [];
let messages = [];

// ========================
// API Routes
// ========================

// Get all menu items
app.get('/api/menu', (req, res) => {
    res.json(menuItems);
});

// Get single menu item
app.get('/api/menu/:id', (req, res) => {
    const item = menuItems.find(i => i.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});

// Create order
app.post('/api/orders', (req, res) => {
    const { items } = req.body;
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain items' });
    }
    
    const order = {
        id: orders.length + 1,
        items: items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    orders.push(order);
    res.status(201).json({ 
        message: 'Order created successfully!',
        order: order 
    });
});

// Get all orders (admin)
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// Contact form
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const contact = {
        id: messages.length + 1,
        name,
        email,
        message,
        date: new Date().toISOString()
    };
    
    messages.push(contact);
    res.status(201).json({ message: 'Message sent successfully!' });
});

// ========================
// Serve Frontend
// ========================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ========================
// Start Server
// ========================
app.listen(PORT, () => {
    console.log(`☕ B'ICE Coffee Server is running!`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/menu`);
});