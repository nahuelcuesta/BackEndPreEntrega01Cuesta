
const socket = io();

socket.on("products", (products) => {
    try {
        const productCards = products.map((product) => {
            return `
                <div>
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <div><p>$${product.price} - Stock: ${product.stock}</p></div>
                    <button class="delete-btn" data-id="${product.id}">Eliminar</button>
                </div>
            `;
        }).join(" ");

        document.getElementById("card-container").innerHTML = productCards;

        // botones de eliminar

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                deletProd(productId);
            });
        });
    } catch (error) {
        console.error(error);
    }
});

// eliminar un producto
const deletProd = (id) => {
    console.log("evento deleteProduct enviado");
    socket.emit('deleteProduct', id);
}


// agregar un nuevo producto
document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault();

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value, 10)
    }
    socket.emit('newProduct', newProduct);
    document.getElementById('form').reset();
});

