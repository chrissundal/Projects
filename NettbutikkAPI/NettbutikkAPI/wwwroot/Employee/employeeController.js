async function goToEmployee() {
    Model.app.currentPage = Model.app.currentPages[1];
    await showPendingOrders()
    updateView();
}

//add

async function addEmployee() {
    let idCount = await axios.get('/userslength');
    let idNumber = idCount.data
    let newUser = {
        firstName: Model.input.register.firstname,
        lastName: Model.input.register.lastname,
        userName: Model.input.register.username,
        passWord: Model.input.register.password,
        address: Model.input.register.address,
        city: Model.input.register.city,
        id: idNumber,
        myCart: [],
        isEmployee: true,
        isAdmin: false
    };
    await axios.post('/users', newUser);
    Model.app.dropdown.isAddEmployee = false;
    displayWelcomeMessage(`${Model.input.register.firstname} ${Model.input.register.lastname} er lagt til`);
    blankSignup();
    await showPendingOrders()
}

function openAddProducts() {
    Model.app.dropdown.isAdding = true;
    Model.app.html.productHtml = '';
    updateView();
}

function openAddEmployee() {
    Model.app.dropdown.isAddEmployee = true;
    Model.app.html.productHtml = '';
    updateView();
}

function closeAddProducts() {
    Model.app.dropdown.isAdding = false;
    Model.input.inputName = "";
    Model.input.inputPrice = 0;
    Model.input.inputCategory = "";
    Model.input.inputStock = 0;
    Model.input.inputImage = "";
    updateView();
}

function closeAddEmployee() {
    Model.app.dropdown.isAddEmployee = false;
    blankSignup();
    updateView();
}

function readPhotoMemory(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (event) {
            Model.input.inputImage = event.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function addItems() {
    let newProduct = {
        id: 0,
        nameOfProduct: Model.input.inputName,
        typeOfProduct: Model.input.inputCategory,
        price: Model.input.inputPrice,
        stock: Model.input.inputStock,
        imageUrl: Model.input.inputImage
    };
    Model.input.productItems.push(newProduct);
    await axios.post('/products', newProduct);
    closeAddProducts();
    await sortByCategoryAdmin(4)
}

//modify

async function changeOrder(orderId, input) {
    let foundOrder = Model.orders.find(order => order.orderId === orderId);
    foundOrder.status = input;
    await axios.put('/orders', foundOrder);
    if (input == 1) {
        await showPendingOrders();
    } else if (input == 2) {
        await cancelOrder(orderId)
        await showPendingOrders();
    } else if (input == 3) {
        await cancelOrder(orderId)
        updateView();
    }
}

async function addInventoryAdmin(itemId, input) {
    let product = Model.input.productItems[itemId]
    product.stock = Model.input.inputStock;
    Model.input.inputStock = 0;
    Model.app.dropdown.editMode = '';
    await updateServerData(product);
    await sortByCategoryAdmin(input);
}

async function cancelOrder(orderId) {
    if (confirm('Er du sikker?')) {
        let foundOrder = Model.orders.find(p => p.orderId === orderId);
        if (foundOrder) {
            await axios.put(`/orders/${orderId}`);
        } else {
            alert("Order not found.");
        }
    }
}

async function deleteItemAdmin(itemId, input) {
    if (confirm('Er du sikker?') == true) {
        Model.input.productItems.splice(itemId, 1);
        await axios.delete(`/products/${itemId}`);
        await sortByCategoryAdmin(input);
    }
}