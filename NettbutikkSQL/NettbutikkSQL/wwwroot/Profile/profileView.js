async function updateProfileView() {
    findPriceOfCartItems();
    document.getElementById('app').innerHTML = /*HTML*/`
    <div class="topHeader">
        <img class="logo" src="IMG/prisparadis.png" height="75px" alt=""/>
    </div>
    <div class="profileHeader">Mine ordre</div>
    <img src="IMG/back.png" class="employeeBackButton" height=40px onclick="goToStore()">
    <div class="categoryResult">
        <table class="ordersTable">
            <tr>
                <th>Ordre Nummer</th>
                <th>Total Pris</th>
                <th></th>
                <th>Ordre Status</th>
                <th></th>
            </tr>
            <tbody>
                ${await showAllOrders()}
            </tbody>
        </table>
    </div>
    <footer>
        <p>Author: Chris</p>
        <p><a href="mailto:christoffersj@hotmail.com">Kontakt oss</a></p>
    </footer>
    `;
}

async function showAllOrders() {
    let response = await axios.get(`/orders`);
    let orders = response.data;
    Model.orders = orders;
    let html = '';
    let myOrders = Model.orders.filter(order => order.userId === Model.currentUser.id);
    if (myOrders.length > 0) {
        for (let order of myOrders) {
            let orderItemsHtml = '';
            for (let o of order.orderItems) {
                let item = Model.input.productItems.find(product => product.id === o.productId);
                if (item) {
                let discountPercentage = item.priceModifier.toFixed(2).split('.')[1];
                let checkSale = item.isOnSale ? `-${discountPercentage}%` : "";
                orderItemsHtml += `
                    <div class="orderItem">
                        <img src="${item.imageUrl}" alt="${item.nameOfProduct}" class="orderItemImage" />
                        <span>${item.nameOfProduct}</span>
                        <span>Antall: ${o.quantity}</span>
                        <span>Pris: ${item.price} kr</span>
                        <span>${checkSale}</span>
                    </div>
                `;
                }
                else {
                    console.log("ikke noe i profil");
                }
            }
            let statusText = '';
            let ordercheck = order.status === 0 ? `<button onclick="changeOrder(${order.orderId}, 3)">Avbryt ordre</button>` : '';
            switch (order.status) {
                case 1:
                    statusText = 'sendt';
                    break;
                case 2:
                    statusText = 'kansellert av butikk';
                    break;
                case 3:
                    statusText = 'kansellert av deg';
                    break;
                default:
                    statusText = 'ikke sendt';
            }
            html += `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${order.totalPrice} kr</td>
                    <td>${orderItemsHtml}</td>
                    <td>${statusText}</td>
                    <td>${ordercheck}</td>
                </tr>
            `;
        }
    } else {
        html = `<h2 style="text-align: center">Her var det tomt...</h2>`;
    }

    return html;
}