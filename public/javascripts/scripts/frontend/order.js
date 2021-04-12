function initAdmin(socket){
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
                <p>${product.product_name} = ${product.qty} pcs </p>
            `
        }).join('')
    }


  
    function generateMarkup(orders) {
      

        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-3 text-green-900">
                    <p style="font-weight: bold;background: #6b5ddeeb;color: white;padding: 7px 9px;border-radius: 5px;font-size:15px">${ order._id }</p>
                    <div>${ renderItems(order.products) }</div>
                </td>
                <td class="border px-4 py-3">${ order.customerId.user_name }</td>
                <td class="border px-4 py-3">${ order.city }, ${ order.streetAddress }</td>
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
                <td class="border px-4 py-3">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
                <td class="border px-4 py-3">
                    ${ order.paymentStatus ? 'paid' : 'Not paid' }
                </td>
            </tr>
        `
        }).join('')
    }

     //Socket
     socket.on('orderPlaced',(order) => {
         console.log(order);
        // new Noty({
        //     text: 'New Order',
        //     type:'success',
        //     layout: 'topRight',
        //     timeout: 2000
        // }).show(); 


        // orders.unshift(order);
        // orderTableBody.innerHTML = ''
        // orderTableBody.innerHTML = generateMarkup(orders)  

    })
    
}






let statuses = document.querySelectorAll('.status_line');
let hiddenInput =  document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);

let time = document.createElement('small');

updateStatus(order);

function updateStatus(order){
    statuses.forEach(function(status){
        status.classList.remove('step-completed');
        status.classList.remove('current');
    })



    let stepComplete = true;

    statuses.forEach((status,index) => {
        let dataProp = status.dataset.status;
        
        if(stepComplete){
            status.classList.add('step-completed');
        }
        
        if(dataProp === order.status){
            stepComplete = false;

            time.innerText = moment(order.UpdatedAt).format('hh:mm  A');
            status.appendChild(time)

            if(status.nextElementSibling){
            status.nextElementSibling.classList.add('current')  }
        }

    })

}


//Socket
let socket = io();
// initAdmin(socket);
//Join
if(order){
    socket.emit('join',`order_${order._id}`)
    console.log(order._id)
}

//After Emit
socket.on('orderUpdated',(data) =>{

    const updatedOrder = {...order}
    console.log(order);
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;


    updateStatus(updatedOrder);
    bootoast.toast({
        message: 'Order Updated',
        type: 'success'
      });
    // new Noty({
    //     text: 'Order Updated',
    //     type:'success',
    //     layout: 'topRight',
    //     timeout: 2000
    // }).show();
   
})