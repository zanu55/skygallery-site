// ====================
// 1. Cart Initialization
// ====================
let cart = [];

// Load cart from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupAddToCartButtons();
    updateCartCount();
});

// ====================
// 2. Add to Cart Functionality
// ====================
function addToCart(productName, price) {
    // Check if the product is already in the cart
    const existingProduct = cart.find(p => p.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: parseFloat(price), quantity: 1 });
    }

    saveCart();  // Save updated cart to local storage
    updateCartCount();  // Update cart count on the page
    showAddedToCartMessage(productName);  // Show success message
}

// Update the cart count in the header
function updateCartCount() {
    const count = cart.reduce((total, product) => total + product.quantity, 0);
    document.getElementById('cart-count').textContent = count;

    // Animation effect when the cart is updated
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.classList.add('cart-updated');
    setTimeout(() => cartCountElement.classList.remove('cart-updated'), 300);
}

// Show success message when an item is added to the cart
function showAddedToCartMessage(productName) {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.textContent = `${productName} has been added to your cart!`;
    document.body.appendChild(message);

    // Remove message after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// ====================
// 3. Local Storage Support
// ====================
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ====================
// 4. Button Setup
// ====================
function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('button[data-product]');
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            const productName = event.target.dataset.product;
            const price = event.target.dataset.price;
            addToCart(productName, price);
        });
    });
}

// ====================
// 5. Clear Cart Functionality (Optional)
// ====================
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    alert('Your cart has been cleared.');
}

// ====================
// 6. Remove Item from Cart (Additional Feature)
// ====================
function removeFromCart(productName) {
    cart = cart.filter(product => product.name !== productName);
    saveCart();
    updateCartCount();
}

// ====================
// 7. Show Cart Items (Optional for Modal or Cart Page)
// ====================
function showCartContents() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    let cartDetails = 'Your Cart:\n';
    cart.forEach(product => {
        cartDetails += `${product.name} - $${product.price.toFixed(2)} x ${product.quantity}\n`;
    });

    alert(cartDetails);
}