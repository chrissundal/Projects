async function updateEmployeeView() {
    document.getElementById('app').innerHTML = /*HTML*/`
    <div class="topHeader">
        <h3>Ansatt: ${Model.currentUser.firstName}</h3>
    </div>
    <img src="IMG/back.png" class="logoutButton" height=40px onclick="goToStore()">
    ${showSortButtonsAdmin()}
    <div class="storeMessage">${Model.input.errorMessage}</div>
    <div class="employeeContainer">
        ${createAddProducts() ?? ''}
        ${createNewEmployee() ?? ''}
        ${await editEmployee() ?? ''}
    </div>
        <div class="categoryResult">
            ${Model.app.html.productHtml} 
        </div>
    `;
}
function createAddProducts() {
    if (Model.app.dropdown.isAdding)
        return `
    <div class="addProducts">
    <h3>Legg til nytt produkt</h3>
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
    <button onclick="addItems()">Legg til</button>
    <button onclick="closeAddProducts()">Avslutt</button>
    </div>
    `;
}
async function editEmployee() {
    if(!Model.app.dropdown.isEditEmployee) return '';
    else {
    let found = await axios.get(`/users/${Model.app.html.editUser}`);
    Model.input.editUser = found.data;
    let html = `
    <div class="addProducts">
        <h3>Endre ansatt</h3>
        <input type="text" placeholder="${Model.input.editUser.firstName}" onchange="Model.input.register.firstname=this.value" />    
        <input type="text" placeholder="${Model.input.editUser.lastName}" oninput="Model.input.register.lastname=this.value" />
        <input type="text" placeholder="${Model.input.editUser.userName}"  oninput="Model.input.register.username=this.value" />    
        <input type="text" placeholder="${Model.input.editUser.address}" oninput="Model.input.register.address=this.value" />    
        <input type="text" placeholder="${Model.input.editUser.city}" oninput="Model.input.register.city=this.value" />    
        <input type="text" placeholder="${Model.input.editUser.passWord}" oninput="Model.input.register.password=this.value" />    
        <button onclick="updateEmployee()">Endre</button>
        <button onclick="closeEditEmployee()">Avbryt</button>
    </div>
    `;
    return html;
    }
}
function createNewEmployee() {
    if (Model.app.dropdown.isAddEmployee)
        return `
    <div class="addProducts">
    <h3>Legg til ny ansatt</h3>
    <input type="text" placeholder="skriv inn fornavn..." value="${Model.input.register.firstname}" oninput="Model.input.register.firstname=this.value"/>    
    <input type="text" placeholder="skriv inn etternavn..." value="${Model.input.register.lastname}" oninput="Model.input.register.lastname=this.value"/>
    <input type="text" placeholder="skriv inn brukernavn..." value="${Model.input.register.username}" oninput="Model.input.register.username=this.value"/>    
    <input type="text" placeholder="skriv inn adresse..." value="${Model.input.register.address}" oninput="Model.input.register.address=this.value"/>    
    <input type="text" placeholder="skriv inn by..." value="${Model.input.register.city}" oninput="Model.input.register.city=this.value"/>    
    <input type="text" placeholder="skriv inn passord..." oninput="Model.input.register.password=this.value"/>    
    <button onclick="addEmployee()">Legg til</button>
    <button onclick="closeAddEmployee()">Avslutt</button>
    </div>
    `;
}
function showSortButtonsAdmin() {
    let html = '';
    for (let i = 0; i < Model.app.category.length; i++) {
        html += `
            <button onclick="sortByCategoryAdmin(${i})">${Model.app.category[i]}</button>
        `;
    }
    return `
    <div class="categoryButtons">
        ${html}
        <button onclick="openAddProducts()">Legg til produkt</button>
        <button onclick="openAddEmployee()">Legg til ansatt</button>
        <button onclick="showEmployee()">Se Ansatte</button>
        <button onclick="showAllUsers()">Se Brukere</button>
        <button onclick="showPendingOrders()">Sende</button>
    </div>
    `;
}
async function showAllUsers() {
    let response = await axios.get(`/users`)
    let users = await response.data;
    Model.app.html.productHtml = `
    <h3>Ansatte</h3>
    <table class="ordersTable">
        <tr>
             <th>Id nummer</th>
             <th>Navn</th>
             <th>Adresse</th>
             <th>By</th>
             <th></th>
        </tr>
    `;
    for (let user of users) {
            Model.app.html.productHtml += `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.address}</td>
                <td>${user.city}</td>
                <td><button onclick="blockUser(${user.id})">Blokker</button></td>
            </tr>
            `;
        
    }
    Model.app.html.productHtml += `</table>`;
    closeAllDropEmployee();
}
async function showEmployee() {
    let response = await axios.get(`/users`)
    let users = await response.data;
    Model.app.html.productHtml = `
    <h3>Ansatte</h3>
    <table class="ordersTable">
        <tr>
             <th>Id nummer</th>
             <th>Navn</th>
             <th>Adresse</th>
             <th>By</th>
             <th></th>
        </tr>
    `;
    for (let user of users) {
        if (user.isEmployee) {
            Model.app.html.productHtml += `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.address}</td>
                <td>${user.city}</td>
                <td>${Model.currentUser.isAdmin ? `<button onclick="openEditEmployee(${user.id})">Endre</button> <button onclick="removeEmployee(${user.id})">Slett</button>` : ''}</td>
            </tr>
            `;
        }
    }
    Model.app.html.productHtml += `</table>`;
    closeAllDropEmployee();
}

async function showPendingOrders() {
    let orderResponse = await axios.get(`/orders`);
    let orders = orderResponse.data;
    Model.orders = orders;
    Model.app.html.productHtml = `${getTopTableOrders()}`;
    let sortedOrders = Model.orders.sort((a, b) => a.status - b.status);
    for (let order of sortedOrders) {
        let orderItemsHtml = '';
        let response = await axios.get(`/users/${order.userId}`);
        let user = response.data;
        orderItemsHtml = GetInnerItems(order, orderItemsHtml);
        let checksend = order.status === 0 ? `<button onclick="changeOrder(${order.orderId}, 1)">Send ordre</button> <button onclick="changeOrder(${order.orderId}, 2)">Kanseller ordre</button>` : '';
        let statusText = '';
        switch (order.status) {
            case 1:
                statusText = 'sendt';
                break;
            case 2:
                statusText = 'kansellert av butikk';
                break;
            case 3:
                statusText = 'kansellert av bruker';
                break;
            default:
                statusText = 'ikke sendt';
        }
        Model.app.html.productHtml += `
            <tr>
                <td>${order.orderId}</td>
                <td>${user.firstName} ${user.lastName}<br>
                ${user.address}, ${user.city}
                </td>
                <td>${orderItemsHtml}</td>
                <td>${order.totalPrice} kr</td>
                <td>${checksend ? checksend : statusText}</td>
            </tr>
        `;
    }

    Model.app.html.productHtml += `</table>`;
    closeAllDropEmployee();
}

function GetInnerItems(order, orderItemsHtml) {
    for (let item of order.orderItems) {
        orderItemsHtml += `
                <div class="orderItem">
                    <img src="${item.imageUrl}" alt="${item.nameOfProduct}" class="orderItemImage" />
                    <span>${item.nameOfProduct}</span>
                    <span>Antall: ${item.stock}</span>
                    <span>Pris: ${item.price} kr</span>
                </div>
            `;
    }
    return orderItemsHtml;
}

function getTopTableOrders() {
    return `
        <table class="ordersTable">
         <tr>
             <th>Ordre Nummer</th>
             <th>Mottaker</th>
             <th></th>
             <th>Total Pris</th>
             <th>Ordre Status</th>
         </tr>
         `;
}

async function sortByCategoryAdmin(input) {
    let response = await axios.get('/products');
    Model.input.productItems = response.data;
    let result;
    if (input === 7) {
        result = Model.input.productItems;
    } else {
        let index = Model.app.category[input];
        result = Model.input.productItems.filter(item => item.typeOfProduct === index);
    }
    let productHtml = '';
    for (let item of result) {
        let setInventory = Model.app.dropdown.editMode === item.nameOfProduct ?
            `<input type="number" placeholder="Nytt antall" onInput="Model.input.inputStock=this.value"/> 
             <button onclick="addInventoryAdmin(${item.id},${input})">Bekreft</button>` :
            `<button class="addInventoryBtn" onclick="Model.app.dropdown.editMode='${item.nameOfProduct}'; sortByCategoryAdmin(${input})">Sett antall</button>`;
        productHtml += `
            <tr class="productRow">
                <td>${item.nameOfProduct}</td>
                <td class="innerImg"><img src="${item.imageUrl}" height="100px" width="100px" /></td>
                <td>${item.price} kr</td>
                <td>${item.stock}</td>
                <td>
                    ${setInventory}
                    <button class="deleteItemBtn" style="background-color: red" onclick="deleteItemAdmin(${item.id},${input})">Slett produkt</button>
                </td>
            </tr>
        `;
    }

    Model.app.html.productHtml = `
        <table class="productTable">
            <thead>
                <tr>
                    <th>Navn</th>
                    <th>Bilde</th>
                    <th>Pris</th>
                    <th>Tilgjengelig</th>
                    <th>Handlinger</th>
                </tr>
            </thead>
            <tbody>
                ${productHtml}
            </tbody>
        </table>
    `;
    closeAllDropEmployee();
}
 