async function goToStore() {
    let user = await axios.get(`/users/${Model.currentUser.id}`);
    Model.currentUser = user.data;
    let cart = await axios.get(`/users/${Model.currentUser.id}/cart`);
    Model.cart = cart.data;
    if (Model.currentUser.isBanned) {
        goToBanned();
    } else {
        Model.app.currentPage = Model.app.currentPages[2];
        Model.app.html.quantity = '';
        await sortBy(7)
    }
    updateView();
}

async function fromSignupToStore() {
    Model.app.currentPage = Model.app.currentPages[2];
    let user = await axios.get(`/users/${Model.currentUser}`);
    Model.currentUser = user.data;
    await sortBy(7)
}

async function deleteCart() {
    for (let itemInCart of Model.cart) {
        let product = Model.input.productItems.find(p => p.id === itemInCart.id);
        if (product) {
            product.stock += itemInCart.stock;
            await axios.put(`/products/${product.id}`, product);
        }
    }
    Model.cart = [];
    await axios.put(`/users/${Model.currentUser.id}`, Model.currentUser);
    closePocket();
    await sortBy(7);
}

async function deleteItem(cartIndex) {
    let itemInCart = Model.cart[cartIndex];
    let product = Model.input.productItems.find(p => p.id === itemInCart.id);

    if (itemInCart.stock === 1) {
        Model.cart.splice(cartIndex, 1);
    } else {
        itemInCart.stock -= 1;
    }

    if (product) {
        product.stock += 1;
        await updateServerData(product);
    }
    updateView();
}

function openCart() {
    Model.app.dropdown.isOpen = true;
    updateView();
}
async function addToCart(itemId, input, inputPrice) {
    let product = Model.input.productItems.find(p => p.id === itemId);
    let itemInCart = Model.cart.find(item => item.id === product.id);

    if (itemInCart) {
        if (Model.input.inputQty <= product.stock) {
            itemInCart.stock += Model.input.inputQty;
            product.stock -= Model.input.inputQty;
            let cartItem = { userId: Model.currentUser.id, productId: product.id, quantity: itemInCart.stock };
            await updateCartItem(cartItem);
            await updateProductStock(product);
            await sortBy(input);
            displaySuccessMessage(`${Model.input.inputQty} stk av ${product.nameOfProduct} er lagt til i handlekurven`);
        } else {
            displayErrorMessage("Ikke nok på lager");
        }
    } else {
        if (Model.input.inputQty <= product.stock) {
            let productToAdd = { ...product, price: inputPrice.toFixed(2), stock: Model.input.inputQty };
            Model.cart.push(productToAdd);
            product.stock -= Model.input.inputQty;
            let cartItem = { userId: Model.currentUser.id, productId: product.id, quantity: Model.input.inputQty };
            await updateCartItem(cartItem);
            await updateProductStock(product);
            await sortBy(input);
            displaySuccessMessage(`${Model.input.inputQty} stk av ${product.nameOfProduct} er lagt til i handlekurven`);
        } else {
            displayErrorMessage("Ikke nok på lager");
        }
    }
}

async function updateCartItem(cartItem) { 
    try { 
        await axios.put('/cart', cartItem); 
    } catch (error) { 
        console.error("Error updating cart item:", error); 
    } 
}
async function updateProductStock(product) {
    try {
        await axios.put(`/products/${product.id}`, product);
    } catch (error) {
        console.error("Error updating product stock:", error);
    }
}

async function updateServerData(product) {
    try {
        await axios.put(`/users/${Model.currentUser.id}`, Model.currentUser);
        await axios.put(`/products/${product.id}`, product);
    } catch (error) {
        console.error("Error updating the server:", error);
    }
}

async function checkOut() {
    if (confirm('Betale nå?')) {
        let response = await axios.get(`/orders`)
        let orders = response.data;
        Model.orders = orders;
        let orderStore = {
            userId: Model.currentUser.id,
            orderId: Model.orders.length,
            totalPrice: Model.input.totalPrice.toFixed(2),
            orderItems: Model.cart,
            status: 0
        }
        let found = Model.orders.find(item => item.orderId === orderStore.orderId);
        if (!found) {
            Model.orders.push(orderStore);
            Model.cart = [];
            await axios.put(`/users/${Model.currentUser.id}`, Model.currentUser);
            await axios.post('/orders', orderStore);
            Model.input.totalPrice = 0;
            Model.input.ShoppingCartCounter = 0;
            Model.app.dropdown.isOpen = false;
            resetSort();
            updateView();
        } else {
            displayErrorMessage("Ordre finnes allerede")
        }
    }
}

function findPriceOfCartItems() {
    Model.input.ShoppingCartCounter = 0;
    Model.input.totalPrice = 0;
    for (let item of Model.cart) {
        let price = item.price * item.stock
        Model.input.totalPrice += price;
        Model.input.ShoppingCartCounter += item.stock;
    }
}

function closePocket() {
    Model.app.dropdown.isOpen = false;
    updateView();
}

function resetSort() {
    Model.app.html.productHtml = '';
    Model.app.html.categoryText = '';
    updateView();
}

function displayErrorMessage(message) {
    Model.input.errorMessage = message;
    updateView();
    setTimeout(() => {
        Model.input.errorMessage = '';
        updateView();
    }, 5000);
}

function displaySuccessMessage(message) {
    Model.input.errorMessage = message;
    Model.app.html.quantity = '';
    Model.input.inputQty = 0;
    updateView();
    setTimeout(() => {
        Model.input.errorMessage = '';
        updateView();
    }, 5000);
}