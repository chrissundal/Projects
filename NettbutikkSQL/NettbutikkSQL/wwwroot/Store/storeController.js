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
            await updateProduct(product);
            await deleteCartItem({ userId: Model.currentUser.id, productId: product.id, quantity: itemInCart.stock });
        }
    }
    Model.cart = [];
    closePocket();
    await sortBy(Model.input.pageNumber);
}
async function emptyCart() {
    for (let itemInCart of Model.cart) {
        let product = Model.input.productItems.find(p => p.id === itemInCart.id);
        if (product) {
            await deleteCartItem({ userId: Model.currentUser.id, productId: product.id, quantity: itemInCart.stock });
        }
    }
    Model.cart = [];
    Model.input.totalPrice = 0;
    Model.input.ShoppingCartCounter = 0;
    closePocket();
    await sortBy(Model.input.pageNumber);
}


async function deleteItem(itemId) {
    let product = Model.input.productItems.find(p => p.id === itemId);
    let itemInCart = Model.cart.find(item => item.id === product.id);
    let cartIndex = Model.cart.findIndex(cart => cart.id === itemId);
    if (itemInCart.stock === 1) {
        Model.cart.splice(cartIndex, 1);
        await deleteCartItem({ userId: Model.currentUser.id, productId: product.id });
    } else {
        itemInCart.stock -= 1;
        let cartItem = { userId: Model.currentUser.id, productId: product.id, quantity: itemInCart.stock };
        await updateCartItem(cartItem);
    }
    product.stock += 1;
    await updateProduct(product);
    await sortBy(Model.input.pageNumber);
}

async function deleteCartItem(cartItem) {
    await axios.delete(`/cart`, { data: cartItem });
}

function openCart() {
    Model.app.dropdown.isOpen = true;
    updateView();
}
async function addToCart(itemId,inputPrice) {
    let product = Model.input.productItems.find(p => p.id === itemId);
    let itemInCart = Model.cart.find(item => item.id === product.id);

    if (itemInCart) {
        if (Model.input.inputQty <= product.stock) {
            itemInCart.stock += Model.input.inputQty;
            product.stock -= Model.input.inputQty;
            let cartItem = { userId: Model.currentUser.id, productId: product.id, quantity: itemInCart.stock };
            await updateCartItem(cartItem);
            await updateProduct(product);
            await sortBy(Model.input.pageNumber);
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
            await updateProduct(product);
            await sortBy(Model.input.pageNumber);
            displaySuccessMessage(`${Model.input.inputQty} stk av ${product.nameOfProduct} er lagt til i handlekurven`);
        } else {
            displayErrorMessage("Ikke nok på lager");
        }
    }
}

async function updateCartItem(cartItem) {
    await axios.put('/cart', cartItem);
}
async function updateProduct(product) {
    await axios.put(`/products/${product.id}`, product);
}

async function checkOut() {
    if (confirm('Betale nå?')) {
        let orderStore = {
            userId: Model.currentUser.id,
            totalPrice: Model.input.totalPrice.toFixed(2),
            orderItems: [],
            status: 0
        };
        for (let item of Model.cart) {
            orderStore.orderItems.push({
                productId: item.id,
                productName: item.nameOfProduct,
                quantity: item.stock,
                price: item.price
            });
        }
        await axios.post('/orders', orderStore);
        await emptyCart();
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