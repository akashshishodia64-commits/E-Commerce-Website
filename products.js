// Product data with Indian pricing
const products = [
    {
        id: 1,
        name: "Red Sports T-Shirt",
        description: "Comfortable cotton blend sports t-shirt perfect for workouts",
        image: "/image/gallery-1.jpg",
        currentPrice: 899,
        originalPrice: 1299,
        discount: "31% OFF",
        rating: 4.5,
        reviews: 128,
        category: "Sports"
    },
    {
        id: 2,
        name: "Black Running Shoes",
        description: "Lightweight running shoes with superior comfort and grip",
        image: "/image/product-10.jpg",
        currentPrice: 2499,
        originalPrice: 3999,
        discount: "38% OFF",
        rating: 4.3,
        reviews: 89,
        category: "Footwear"
    },
    {
        id: 3,
        name: "Grey Cargo Pants",
        description: "Stylish cargo pants with multiple pockets for utility",
        image: "/image/product-3.jpg",
        currentPrice: 1599,
        originalPrice: 2199,
        discount: "27% OFF",
        rating: 4.2,
        reviews: 156,
        category: "Pants"
    },
    {
        id: 4,
        name: "Blue Denim Jacket",
        description: "Classic denim jacket for casual and semi-formal occasions",
        image: "/image/Blue Denim Jacket.jpg",
        currentPrice: 1999,
        originalPrice: 2799,
        discount: "29% OFF",
        rating: 4.6,
        reviews: 203,
        category: "Jackets"
    },
    {
        id: 5,
        name: "White Sneakers",
        description: "Trendy white sneakers perfect for everyday wear",
        image: "/image/White Sneakers.jpg",
        currentPrice: 1799,
        originalPrice: 2499,
        discount: "28% OFF",
        rating: 4.4,
        reviews: 174,
        category: "Footwear"
    },
    {
        id: 6,
        name: "Black Formal Shirt",
        description: "Premium formal shirt for office and business meetings",
        image: "/image/BlackFormalShirt.jpg",
        currentPrice: 1299,
        originalPrice: 1899,
        discount: "32% OFF",
        rating: 4.5,
        reviews: 95,
        category: "Formal"
    },
    {
        id: 7,
        name: "Green Casual T-Shirt",
        description: "Soft cotton casual t-shirt for everyday comfort",
        image: "/image/GreenCasualTShirt.jpg",
        currentPrice: 699,
        originalPrice: 999,
        discount: "30% OFF",
        rating: 4.1,
        reviews: 142,
        category: "Casual"
    },
    {
        id: 8,
        name: "Brown Leather Shoes",
        description: "Premium leather formal shoes for professional look",
        image: "/image/BrownLeatherShoes.jpg",
        currentPrice: 3299,
        originalPrice: 4599,
        discount: "28% OFF",
        rating: 4.7,
        reviews: 87,
        category: "Footwear"
    },
    {
        id: 9,
        name: "Navy Blue Hoodie",
        description: "Warm and comfortable hoodie for winter season",
        image: "/image/NavyBlueHoodie.jpg",
        currentPrice: 1899,
        originalPrice: 2699,
        discount: "30% OFF",
        rating: 4.3,
        reviews: 165,
        category: "Winter"
    },
    {
        id: 10,
        name: "Black Track Pants",
        description: "Comfortable track pants for sports and casual wear",
        image: "/image/BlackTrackPants.jpg",
        currentPrice: 1199,
        originalPrice: 1699,
        discount: "29% OFF",
        rating: 4.2,
        reviews: 134,
        category: "Sports"
    },
    {
        id: 11,
        name: "White Polo Shirt",
        description: "Classic polo shirt suitable for casual and semi-formal occasions",
        image: "/image/poloshirt.jpg",
        currentPrice: 999,
        originalPrice: 1399,
        discount: "29% OFF",
        rating: 4.4,
        reviews: 118,
        category: "Casual"
    },
    {
        id: 12,
        name: "Blue Jeans",
        description: "Premium quality denim jeans with perfect fit",
        image: "/image/BlueJeans.jpg",
        currentPrice: 1799,
        originalPrice: 2499,
        discount: "28% OFF",
        rating: 4.6,
        reviews: 201,
        category: "Jeans"
    }
];

// Make products globally available
window.products = products;

// Function to render products
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
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

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', renderProducts);