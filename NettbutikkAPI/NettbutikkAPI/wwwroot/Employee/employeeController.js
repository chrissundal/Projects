async function goToEmployee() {
    Model.app.currentPage = Model.app.currentPages[1];
    await showPendingOrders()
    updateView();
}

//add products

function createAddProducts() {
    if (Model.app.dropdown.isAdding)
        return `
    <div class="addProducts">
    <input type="text" placeholder="Navn på produkt" onInput="Model.input.inputName=this.value"/>
    <select onchange="Model.input.inputCategory=this.value">
        <option></option>
        <option value="${Model.app.category[0]}">${Model.app.category[0]}</option>
        <option value="${Model.app.category[1]}">${Model.app.category[1]}</option>
        <option value="${Model.app.category[2]}">${Model.app.category[2]}</option>
        <option value="${Model.app.category[3]}">${Model.app.category[3]}</option>
        <option value="${Model.app.category[4]}">${Model.app.category[4]}</option>
        <option value="${Model.app.category[5]}">${Model.app.category[5]}</option>
    </select>
    <input type="file" onchange="readPhotoMemory(this)"/>
    <input type="number" placeholder="Pris" onInput="Model.input.inputPrice=this.valueAsNumber"/>
    <input type="number" placeholder="Antall" onInput="Model.input.inputStock=this.valueAsNumber"/>
    <button onclick="addItems()">Add</button>
    <button onclick="closeAddProducts()">Close</button>
    </div>
    `;
}
function openAddProducts() {
    Model.app.dropdown.isAdding = true;
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

//modify products

async function sendOrder(orderId) {
    let foundOrder = Model.orders.find(order => order.orderId === orderId);
    foundOrder.isSent = true;
    await axios.put('/orders', foundOrder);
    await showPendingOrders();
}
async function addInventoryAdmin(itemId,input)
{
    let product = Model.input.productItems[itemId]
    product.stock = Model.input.inputStock;
    Model.input.inputStock = 0;
    Model.app.dropdown.editMode = '';
    await updateServerData(product);
    await sortByCategoryAdmin(input);
}
async function deleteItemAdmin(itemId,input)
{
    if(confirm('Er du sikker?') == true)
    {
        Model.input.productItems.splice(itemId, 1);
        await axios.delete(`/products/${itemId}`);
        await sortByCategoryAdmin(input);
    }
}