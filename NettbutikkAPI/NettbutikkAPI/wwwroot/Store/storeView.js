
async function updateStoreView() {
    findPriceOfCartItems();
    let checkifEmployee = Model.currentUser.isEmployee ? `<img src="IMG/employee.png" class="addItemsButton" height=50px onclick="goToEmployee()">` : '';
    document.getElementById('app').innerHTML = /*HTML*/`
    <div class="topHeader">
    <h1>Nettbutikk</h1>
    </div>
    ${showButtons()}
    <img src="IMG/orders.png" class="ordersButton" height=40px onclick="goToProfile()">
    <div class="storeMessage">${Model.input.errorMessage}</div>
    <div class="productsCategoryText">${Model.app.html.categoryText}</div>
    <div class="categoryResult">
        ${Model.app.html.storeItems}
    </div>
    <div class="qtyGrid">
        ${Model.app.html.quantity}
    </div>
        ${createDropdown()}
        <img src="IMG/logoutuser.png" class="logoutButton" height=60px onclick="goToLogin()">
        ${checkifEmployee}
    <footer>
        <p>Author: Chris</p>
        <p><a href="mailto:christoffersj@hotmail.com">Kontakt oss</a></p>
    </footer>
    `;
}
function showButtons()
{
    return `
    <div class="categoryButtons">
        <button onclick="sortBy(0)">${Model.app.category[0]}</button>
        <button onclick="sortBy(1)">${Model.app.category[1]}</button>
        <button onclick="sortBy(2)">${Model.app.category[2]}</button>
        <button onclick="sortBy(3)">${Model.app.category[3]}</button>
        <button onclick="sortBy(4)">${Model.app.category[4]}</button>
        <button onclick="sortBy(5)">${Model.app.category[5]}</button>
        <button onclick="sortBy(6)">${Model.app.category[6]}</button>
        <button onclick="sortBy(7)">${Model.app.category[7]}</button>
    </div>
    `;
}
async function sortBy(input) {
    Model.app.html.storeItems = '';
    let response = await axios.get('/products');
    Model.input.productItems = response.data;
    if (input === 7) {
        for (let i = 0; i < Model.app.category.length -1; i++) {
            let categoryItems = Model.input.productItems.filter(item => item.typeOfProduct === Model.app.category[i]);
            if (categoryItems.length == 0) {
                Model.app.html.storeItems += `
                <h3>${Model.app.category[i]}</h3>
                <div>Her var det tomt</div>
                <br><div class="borderBottomProduct"></div>
            `;
            }
            buildProductHtml(categoryItems,input,i);
        }
    } else {
        let sortedProducts = Model.input.productItems.filter(item => item.typeOfProduct === Model.app.category[input]);
        let i = input;
        buildProductHtml(sortedProducts,input,i);
    }
    updateView();
}

function GetQuantity(itemId, input) {
    Model.app.html.quantity = `
    <div class="qty">
        <div>Hvor mange vil du legge til?</div>
        <div class="innerqtybuttons">
            <button onclick="Model.input.inputQty=1; addToCart(${itemId}, ${input})">1</button>
            <button onclick="Model.input.inputQty=2; addToCart(${itemId}, ${input})">2</button>
            <button onclick="Model.input.inputQty=5; addToCart(${itemId}, ${input})">5</button>
            <button onclick="Model.input.inputQty=10; addToCart(${itemId}, ${input})">10</button>
            <button onclick="CloseQuantity()">Avbryt</button>
        </div>
    </div>
    `;
    updateView();
}
function CloseQuantity(){
    Model.app.html.quantity = '';
    Model.input.inputQty = 0;
    updateView();
}
function buildProductHtml(sortedProducts, input,i) {
    if (sortedProducts.length > 0) {
        let html = '';
        for(let item of sortedProducts) {
            let checkstock = item.stock > 0 ? `<button class="addToCartBtn" onclick="GetQuantity(${item.id},${input})">add to cart</button>` : '';
            html += `
                <div class="products">
                    <div class="innerItem">
                        <div>${item.nameOfProduct}</div><br>
                        <div class="innerImg"><img src="${item.imageUrl}" height="100px" width="100px" /></div>
                        <div>Pris: ${item.price} kr</div>
                        <div>Tilgjengelig: ${item.stock}</div>
                    </div>
                        ${checkstock}
                </div>
            `;
        }
        Model.app.html.storeItems += `
        <h3>${Model.app.category[i]}</h3>
        <div class="categoryDividers">${html}</div>
        <div class="borderBottomProduct"></div>
        `;
    }
    updateView()
}

function createDropdown() {
    let html = '';
    if (Model.app.dropdown.isOpen == false) return `
    <div class="cartButtonDiv" onclick="openCart()">
        <img src="IMG/cart.png" class="cartButton" height = 60px>
        <div class="cartCounter">${Model.input.ShoppingCartCounter}</div>
    </div>
    `;
    else if (Model.app.dropdown.isOpen == true) {
        html = `
        <div class="dropDown">
            <div class="main">
                <div>${createCartItems()}</div>
                <div><strong>Totalt: ${Model.input.totalPrice} kr</strong></div>
                <button onclick="checkOut()">Checkout</button>
                <button onclick="closePocket()">Close</button>
                <button onclick="deleteCart()">Delete</button>
            </div>
        </div>
        `;
    }
    return html;
}

function createCartItems() {
    let html = '';

    for (let cartIndex = 0; cartIndex < Model.currentUser.myCart.length; cartIndex++) {
        html += `
        <div class="innerCart">
            <div>Antall: ${Model.currentUser.myCart[cartIndex].stock}</div>
            <img src="${Model.currentUser.myCart[cartIndex].imageUrl}" height = 50px width = 50px/>
            <div>${Model.currentUser.myCart[cartIndex].nameOfProduct}</div>
            <div>Pris: ${Model.currentUser.myCart[cartIndex].price} kr</div>
            <button onclick="deleteItem(${cartIndex})">X</button>
        </div>
        ${Model.input.errorMessage ?? ''}
        `;
    }
    return html;
}

