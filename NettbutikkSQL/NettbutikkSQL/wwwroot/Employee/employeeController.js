async function goToEmployee() {
    Model.app.currentPage = Model.app.currentPages[1];
    closeAllDropEmployee();
    await showPendingOrders()
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
        isAdmin: false,
        isBanned: false,
        isDeleted: false,
    };
    await axios.post('/users', newUser);
    Model.app.dropdown.isAddEmployee = false;
    displayWelcomeMessage(`${Model.input.register.firstname} ${Model.input.register.lastname} er lagt til`);
    blankSignup();
    await showPendingOrders()
}

function openAddProducts() {
    Model.app.dropdown.isAddEmployee = false;
    Model.app.dropdown.isEditEmployee = false;
    Model.app.dropdown.isAdding = true;
    Model.app.html.productHtml = '';
    updateView();
}

function closeAllDropEmployee() {
    Model.app.dropdown.isAddEmployee = false;
    Model.app.dropdown.isEditEmployee = false;
    Model.app.dropdown.isAdding = false;
    Model.app.dropdown.isOpen = false;
    updateView();
}

function openAddEmployee() {
    Model.app.dropdown.isAdding = false;
    Model.app.dropdown.isEditEmployee = false;
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
        imageUrl: Model.input.inputImage,
        isOnSale: false,
        priceModifier: 1.1
    };
    Model.input.productItems.push(newProduct);
    await axios.post('/products', newProduct);
    closeAddProducts();
    await sortByCategoryAdmin(7)
}

//modify

async function RemoveItemsOrder(foundOrder) {
    for (let itemInOrder of foundOrder.orderItems) {
        let product = Model.input.productItems.find(p => p.id === itemInOrder.productId);
        if (product) {
            product.stock += itemInOrder.quantity;
            await updateProduct(product);
        }
        else {
            console.log("ikke noe her");
        }
    }
}

async function changeOrder(orderId, input) {
    let orderResponse = await axios.get(`/orders`);
    let orders = orderResponse.data;
    let foundOrder = orders.find(order => order.orderId === orderId);
    foundOrder.status = input;
    await axios.put('/orders', foundOrder);
    if (input == 1) {
        await showPendingOrders();
    } else if (input == 2) {
        await RemoveItemsOrder(foundOrder);
        await showPendingOrders();
    } else if (input == 3) {
        await RemoveItemsOrder(foundOrder);
        updateView();
    }
}

async function blockUser(userId) {
    let response = await axios.get(`/users/${userId}`);
    let user = response.data;
    user.isBanned = true;
    await axios.put(`/users/${user.id}`, user);
    displayWelcomeMessage(`${user.firstName} ${user.lastName} er blokkert!`);
    await showAllUsers()
}
async function unBlockUser(userId) {
    let response = await axios.get(`/users/${userId}`);
    let user = response.data;
    user.isBanned = false;
    await axios.put(`/users/${user.id}`, user);
    displayWelcomeMessage(`${user.firstName} ${user.lastName}'s konto er åpnet igjen!`);
    await showAllUsers()
}
async function deleteUser(userId) {
    let response = await axios.get(`/users/${userId}`);
    let user = response.data;
    for (let itemInCart of user.myCart) {
        let product = Model.input.productItems.find(p => p.id === itemInCart.id);
        if (product) {
            product.stock += itemInCart.stock;
            await axios.put(`/products/${product.id}`, product);
        }
    }
    user.isDeleted = true;
    await axios.put(`/users/${userId}`, user);
    displayWelcomeMessage(`${user.firstName} ${user.lastName} er slettet!`);
    await showAllUsers();
}
async function unDeleteUser(userId) {
    let response = await axios.get(`/users/${userId}`);
    let user = response.data;
    user.isDeleted = false;
    await axios.put(`/users/${user.id}`, user);
    displayWelcomeMessage(`${user.firstName} ${user.lastName}'s konto er åpnet igjen!`);
    await showAllUsers()
}
function openEditEmployee(userId) {
    Model.app.dropdown.isEditEmployee = true;
    Model.app.dropdown.isAddEmployee = false;
    Model.app.dropdown.isAdding = false;
    Model.app.html.editUser = userId;
    blankSignup();
    updateView();
}

function closeEditEmployee() {
    Model.app.dropdown.isEditEmployee = false;
    blankSignup();
    updateView();
}

async function removeEmployee(userId) {
    let response = await axios.get(`/users/${userId}`);
    let user = response.data;
    user.isEmployee = false;
    await axios.put(`/users/${user.id}`, user);
    await showEmployee();
    displayWelcomeMessage("Bruker fjernet som ansatt")
}

async function updateEmployee() {
    Model.app.html.editUser = null;
    Model.input.editUser.firstName = !Model.input.register.firstname ? Model.input.editUser.firstName : Model.input.register.firstname;
    Model.input.editUser.lastName = !Model.input.register.lastname ? Model.input.editUser.lastName : Model.input.register.lastname;
    Model.input.editUser.userName = !Model.input.register.username ? Model.input.editUser.userName : Model.input.register.username;
    Model.input.editUser.address = !Model.input.register.address ? Model.input.editUser.address : Model.input.register.address;
    Model.input.editUser.city = !Model.input.register.city ? Model.input.editUser.city : Model.input.register.city;
    Model.input.editUser.passWord = !Model.input.register.password ? Model.input.editUser.passWord : Model.input.register.password;
    await axios.put(`/users/${Model.input.editUser.id}`, Model.input.editUser);
    Model.input.editUser = '';
    closeEditEmployee();
    blankSignup()
    await showEmployee();
    displayWelcomeMessage("Bruker oppdatert")
}

async function addInventoryAdmin(itemId, input) {
    let product = Model.input.productItems.find(item => item.id === itemId);
    product.stock = Model.input.inputStock;
    Model.input.inputStock = 0;
    Model.app.dropdown.editMode = '';
    await updateProduct(product)
    await sortByCategoryAdmin(input);
}
async function setSaleOnOff(itemId,input) {
    let product = Model.input.productItems.find(item => item.id === itemId);
    if (product) {
        product.isOnSale = !product.isOnSale;
        await updateProduct(product)
        await sortByCategoryAdmin(input);
    }
    else {
        console.error("Produkt ikke funnet.");
    }
}
async function setPercent(itemId, input) {
    let product = Model.input.productItems.find(item => item.id === itemId);
    product.priceModifier = Model.input.inputQty;
    Model.app.html.quantity = '';
    await updateProduct(product)
    await sortByCategoryAdmin(input);
}
async function cancelOrder(orderId) {
    if (confirm('Er du sikker?')) {
        let foundOrder = Model.orders.find(p => p.orderId === orderId);
        if (foundOrder) {
            await axios.put(`/orders/${orderId}`);
        } else {
            alert("Ordere ikke funnet.");
        }
    }
}

async function deleteItemAdmin(itemId, input) {
    if (confirm('Er du sikker?') == true) {
        let index = Model.input.productItems.findIndex(item => item.id === itemId);
        Model.input.productItems.splice(index, 1);
        await axios.delete(`/products/${index}`);
        await sortByCategoryAdmin(input);
    }
}