
//For Admin
let socket = io();

socket.emit('join','adminRoom');
// initAdmin(socket);
initAdmin(socket);

function initAdmin(){
    const orderTableBody = document.querySelector('#orderTableBody');
 
    let orders = [];
    let markup;


    axios.get('/dashboard/admin/orders',{
        headers: {
            "X-Requested-With":"XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data;
        markup = generateMarkup(orders);

        orderTableBody.innerHTML = markup;
    }).catch((err) => {
        console.log(err);
    })


    function renderItems(items){
        let parsedItems = Object.values(items)

        return parsedItems.map((product) => {    
            return `
                <p style="    font-size: 13.5px;
                font-weight: bold;margin-bottom:0px;">${product.product.product_name} = ${product.qty} pcs </p>
            `
        }).join('')
    }


  
    function generateMarkup(orders) {
        console.log(orders);
   

        if(orders.length > 0){
            return orders.map(order => {


                if( order.paymentType == 'esewa'){
                    var paymentType = '<td class="border px-2 py-3"><span style="background: #41a124;color: white;padding: 3px 12px;font-size: 18px;font-weight: bold; border-radius: 8px;">'+order.paymentType+'</td>';
                }else{
                    var paymentType = '<td class="border px-2 py-3"><span <span style="background: crimson;color: white;padding: 3px 12px;font-size: 18px;font-weight: bold; border-radius: 8px;">'+order.paymentType+'</span></td>';
                }

            return `
                <tr>
                <td class="border px-4 py-3 text-green-900">
                    <p style="font-weight: bold;background: #6ad600eb;color: white;font-style: italic;padding: 9px 8px;border-radius: 2px;width: 100%;font-size: 17px;
                    margin-left: auto;
                    margin-right: auto;">${ order.orderId }</p>
                    <h5 style="margin-top: 30px;font-size: 16px;color: #0d74b1;font-weight: bold;">Products</h5>
                  
                    <div style="background-color: whitesmoke;padding: 10px 11px;color: #4d4d4d;box-shadow: 0px 0px 4px -1px #ababab;margin-top: 15px;">${ renderItems(order.products) }</div>
                </td>
                <td class="border px-2 py-3" style="font-weight: bold;font-size: 14px;">${ order.fullName }</td>
                <td class="border px-2 py-3" style="font-weight: bold;font-size: 14px;">${ order.city },<br> ${ order.streetAddress }</td>
                <td class="border px-2 py-3" style="font-weight: bold;font-size: 14px;">${ order.phoneNumber }</td>
                ${ paymentType }
                <td class="border px-4 py-3">
                    <div class="inline-block relative w-64">
                        <form action="dashboard/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                    Prepared</option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
               
                    </div>
                </td>
                <td class="border px-2 py-3"  style="font-weight: bold;font-size: 14px;">
                    <span style="background-color: #776ae1;padding: 5px 7px;color: white;">${ moment(order.createdAt).format('MMM Do hh:mm A') }</span>
                </td>
        
            </tr>
        `
        }).join('')
        }else{
           return  `<tr> <td class="border px-2 py-3 text-center" colspan="7"><h4 class="font-weight-bold">No Order Placed Until Now</h4></td></tr>`
        }
      
    }

//     <td class="border px-4 py-3">
//     ${ order.paymentStatus ? 'paid' : 'Not paid' }
// </td>


    //Socket

    socket.on('orderPlaced',(order) => {
        
        new Noty({
            text: 'New Order',
            type:'success',
            layout: 'bottomRight',
            timeout: 8000
        }).show(); 


        orders.unshift(order);
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(orders)    
    })
 
}





