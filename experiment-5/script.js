const products = [
    { name: "Laptop", category: "Electronics" },
    { name: "Smartphone", category: "Electronics" },
    { name: "Deep_Learning", category: "Books" },
    { name: "Shirt", category: "clothing" },
    { name: "football", category: "sports" },
    { name: "Jeans", category: "clothing" },
    { name: "Basketball", category: "sports" },
    { name: "Data_Science", category: "Books" },
    { name: "tablet", category: "Home" },
    { name: "Blender", category: "Home" }
];

const categorySelect = document.getElementById("category");
const productList = document.getElementById("product-list");

function updateProductList() {
    const selectedCategory = categorySelect.value;

    const filteredProducts = products.filter(product => {
        return selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
    });

    productList.innerHTML = '';

    filteredProducts.forEach(product => {
        productList.innerHTML += `<div class="product-item">${product.name}</div>`;
    });
}

categorySelect.addEventListener('change', updateProductList);

updateProductList();