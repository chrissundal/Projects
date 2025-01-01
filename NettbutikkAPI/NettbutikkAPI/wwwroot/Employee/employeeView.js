async function updateEmployeeView() {
    document.getElementById('app').innerHTML = /*HTML*/`
    <div class="topHeader">
    <h3>Ansatt: ${Model.currentUser.firstName}</h3>
    </div>
    <img src="IMG/back.png" class="logoutButton" height=40px onclick="goToStore()">
    ${showSortButtonsAdmin()}
    ${createAddProducts() ?? ''}
    <div class="categoryResult">
        ${Model.app.html.productHtml} 
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
        <button onclick="showPendingOrders()">Sende</button>
    </div>
    `;
}

async function showPendingOrders() {
    let orderResponse = await axios.get(`/orders`)
    let orders = orderResponse.data;
    Model.orders = orders;
    let response = await axios.get(`/users`);
    let users = response.data;
    Model.app.html.productHtml = `
        ${getTopTableOrders()}
    `;
    let sortedOrders = Model.orders.sort((a, b) => a.isSent - b.isSent);
    for (let order of sortedOrders) {
        let orderItemsHtml = '';
        orderItemsHtml = GetInnerItems(order, orderItemsHtml);
        let checksend = order.isSent ? '' : `<button onclick="sendOrder(${order.orderId})">Send ordre</button>`;
        Model.app.html.productHtml += `
            <tr>
                <td>${order.orderId}</td>
                <td>${users[order.userId].firstName} ${users[order.userId].lastName}</td>
                <td>
                    ${orderItemsHtml}
                </td>
                <td>${order.totalPrice} kr</td>
                <td>${order.isSent ? 'sendt' : 'ikke sendt'}</td>
                <td>${checksend}</td>
            </tr>
        `;
    }

    Model.app.html.productHtml += `</table>`;
    updateView();
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
             <th></th>
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
    updateView();
}
 