// Sample Product List
const productList = [
    {
        name: "Art Print - Sunflowers",
        price: 25.0,
        image: "images/3-blue.JPG",
        alt: "Art Print - Sunflowers"
    },
    {
        name: "Art Book - Van Gogh",
        price: 40.0,
        image: "images/1-blues.JPG",
        alt: "Art Book - Van Gogh"
    },
    {
        name: "Art Print - Starry Night",
        price: 30.0,
        image: "images/oranges.JPG",
        alt: "Art Print - Starry Night"
    },
    {
        name: "Recommended Art Print",
        price: 35.0,
        image: "images/3-blues.JPG",
        alt: "Recommended Art Print"
    }
];

// Dynamically Render Products
const productsContainer = document.querySelector('#products .grid');
productList.forEach((product) => {
    const productCard = document.createElement('article');
    productCard.classList.add('product', 'card');
    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.alt}" loading="lazy" width="300" height="300">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="btn" data-product="${product.name}" data-price="${product.price}">Add to Cart</button>
    `;
    productsContainer.appendChild(productCard);
});

// Show/Hide Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

document.getElementById('view-cart-btn').addEventListener('click', () => showModal('cart-modal'));
document.getElementById('close-cart').addEventListener('click', () => hideModal('cart-modal'));

// Search Products
document.getElementById('search-input').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const products = document.querySelectorAll('.product');
    products.forEach((product) => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        product.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});

// Cart Initialization
let cart = [];

// Load cart from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupAddToCartButtons();
    updateCartCount();
    updateCartModal();
});

// Add to Cart Functionality
function addToCart(productName, price, quantity = 1) {
    // Check if the product is already in the cart
    const existingProduct = cart.find(p => p.name === productName);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ name: productName, price: parseFloat(price), quantity });
    }

    saveCart();  // Save updated cart to local storage
    updateCartCount();  // Update cart count on the page
    showAddedToCartMessage(productName, quantity);  // Show success message
    updateCartModal();  // Update cart modal
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
function showAddedToCartMessage(productName, quantity) {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.textContent = `${quantity} x ${productName} has been added to your cart!`;
    document.body.appendChild(message);

    // Remove message after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Local Storage Support
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Button Setup
function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('button[data-product]');
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            const productName = event.target.dataset.product;
            const price = event.target.dataset.price;
            const quantity = event.target.dataset.quantity || 1;
            addToCart(productName, price, parseInt(quantity));
        });
    });
}

// Clear Cart Functionality
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    alert('Your cart has been cleared.');
    updateCartModal();
}

// Remove Item from Cart
function removeFromCart(productName) {
    cart = cart.filter(product => product.name !== productName);
    saveCart();
    updateCartCount();
    updateCartModal();
}

// Show Cart Items
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

// Update the cart modal when items are added or removed
function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<li>Your cart is empty.</li>';
        document.getElementById('total-price').textContent = 'Total: $0.00';
        return;
    }

    let totalPrice = 0;
    cart.forEach(product => {
        const itemElement = document.createElement('li');
        itemElement.innerHTML = `${product.name} - $${product.price.toFixed(2)} x ${product.quantity}
            <button onclick="removeFromCart('${product.name}')">Remove</button>`;
        cartItemsContainer.appendChild(itemElement);
        totalPrice += product.price * product.quantity;
    });

    document.getElementById('total-price').textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Add keyboard accessibility for cart modal
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.getElementById('cart-modal').classList.add('hidden');
    }
});