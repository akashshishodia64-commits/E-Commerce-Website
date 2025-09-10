// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = []; // Initialize products array

// Make functions globally available
window.toggleMenu = toggleMenu;
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.viewProduct = viewProduct;
window.closeModal = closeModal;
window.checkout = checkout;

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateCartDisplay();
    
    // Wait for products to be loaded
    if (window.products && Array.isArray(window.products)) {
        products = window.products;
    } else {
        // Retry after a short delay
        setTimeout(() => {
            if (window.products && Array.isArray(window.products)) {
                products = window.products;
            }
        }, 100);
    }
});

// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Add product to cart
function addToCart(productId) {
    // Ensure products array is available
    if (!products || !Array.isArray(products)) {
        products = window.products || [];
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.currentPrice,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    
    // Show success message
    showNotification('Product added to cart!');
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showNotification('Product removed from cart!');
}

// Update quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>Your cart is empty</p>
                <p style="font-size: 0.9rem; color: #666;">Add some products to get started!</p>
            </div>
        `;
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString();
}

// View product details
function viewProduct(productId) {
    // Ensure products array is available
    if (!products || !Array.isArray(products)) {
        products = window.products || [];
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        showNotification('Product not found!');
        return;
    }
    
    // Create a simple modal for product details
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-content">
            <button class="close-modal" onclick="closeModal()">&times;</button>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-info">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <div class="product-price">
                        <span class="current-price">₹${product.currentPrice}</span>
                        <span class="original-price">₹${product.originalPrice}</span>
                        <span class="discount">${product.discount}</span>
                    </div>
                    <div class="product-rating">
                        <div class="stars">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id}); closeModal();">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles if not already present
    if (!document.querySelector('style[data-modal]')) {
        const modalStyles = document.createElement('style');
        modalStyles.setAttribute('data-modal', 'true');
        modalStyles.textContent = `
        .product-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
        }
        .modal-content {
            position: relative;
            background: white;
            border-radius: 15px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            margin: 20px;
        }
        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            z-index: 1;
        }
        .modal-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            padding: 2rem;
        }
        .modal-image img {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 10px;
        }
        .modal-info h2 {
            margin-bottom: 1rem;
            color: #333;
        }
        .modal-info p {
            margin-bottom: 1.5rem;
            color: #666;
            line-height: 1.6;
        }
        @media (max-width: 768px) {
            .modal-body {
                grid-template-columns: 1fr;
                padding: 1rem;
            }
            .modal-image img {
                height: 250px;
            }
        }
        `;
        document.head.appendChild(modalStyles);
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderSummary = cart.map(item => `${item.name} x ${item.quantity}`).join('\n');
    
    const confirmed = confirm(`Order Summary:\n${orderSummary}\n\nTotal: ₹${total.toLocaleString()}\n\nProceed to checkout?`);
    
    if (confirmed) {
        // Simulate order processing
        showNotification('Order placed successfully! Thank you for shopping with us.');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        toggleCart();
    }
}

// Show notification
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add notification styles if not already present
    if (!document.querySelector('style[data-notification]')) {
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-notification', 'true');
        styleElement.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        `;
        document.head.appendChild(styleElement);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterProducts(searchTerm);
        });
    }
});

// Filter products based on search
function filterProducts(searchTerm) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    // Ensure products array is available
    if (!products || !Array.isArray(products)) {
        products = window.products || [];
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p>No products found matching "${searchTerm}"</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="discount">${product.discount}</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="current-price">₹${product.currentPrice}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});