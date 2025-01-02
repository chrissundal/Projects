async function goToStore() {
    Model.app.currentPage = Model.app.currentPages[2];
    let user = await axios.get(`/users/${Model.currentUser.id}`);
    Model.currentUser = user.data;
    Model.app.html.quantity = '';
    await sortBy(7)
}

async function fromSignupToStore() {
    Model.app.currentPage = Model.app.currentPages[2];
    let user = await axios.get(`/users/${Model.currentUser}`);
    Model.currentUser = user.data;
    await sortBy(7)
}

async function deleteCart() {
    for (let itemInCart of Model.currentUser.myCart) {
        let product = Model.input.productItems.find(p => p.id === itemInCart.id);
        if (product) {
            product.stock += itemInCart.stock;
            await axios.put(`/products/${product.id}`, {stock: product.stock});
        }
    }
    Model.currentUser.myCart = [];
    await axios.put(`/users/${Model.currentUser.id}`, Model.currentUser);
    closePocket();
    updateView();
}

async function deleteItem(cartIndex) {
    let itemInCart = Model.currentUser.myCart[cartIndex];
    let product = Model.input.productItems.find(p => p.id === itemInCart.id);

    if (itemInCart.stock === 1) {
        Model.currentUser.myCart.splice(cartIndex, 1);
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

async function addToCart(itemId, input) {
    let product = Model.input.productItems.find(p => p.id === itemId);
    let itemInCart = Model.currentUser.myCart.find(item => item.id === product.id);
    if (itemInCart) {
        if (Model.input.inputQty <= product.stock) {
            itemInCart.stock += Model.input.inputQty;
            product.stock -= Model.input.inputQty;
            await updateServerData(product)
            await sortBy(input)
            displaySuccessMessage(`${Model.input.inputQty} stk av ${product.nameOfProduct} er lagt til i handlekurven`)
        } else {
            displayErrorMessage("Ikke nok på lager");

        }
    } else {
        if (Model.input.inputQty <= product.stock) {
            let productToAdd = {...product, stock: Model.input.inputQty};
            Model.currentUser.myCart.push(productToAdd);
            product.stock -= Model.input.inputQty;
            await updateServerData(product)
            await sortBy(input)
            displaySuccessMessage(`${Model.input.inputQty} stk av ${product.nameOfProduct} er lagt til i handlekurven`)
        } else {
            displayErrorMessage("Ikke nok på lager");

        }
    }

}

async function updateServerData(product) {
    try {
        await axios.put(`/users/${Model.currentUser.id}`, Model.currentUser);
        await axios.put(`/products/${product.id}`, {stock: product.stock});
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
            totalPrice: Model.input.totalPrice,
            orderItems: Model.currentUser.myCart,
            status: 0
        }
        let found = Model.orders.find(item => item.orderId === orderStore.orderId);
        if (!found) {
            Model.orders.push(orderStore);
            Model.currentUser.myCart = [];
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
    for (let item of Model.currentUser.myCart) {
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