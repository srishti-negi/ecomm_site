import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkTokenValidation, getAllOrders, logout } from '../actions/userActions'
import { useHistory } from 'react-router-dom'
import { Table, Spinner } from 'react-bootstrap'
import { dateCheck } from '../components/GetDate'
import { changeDeliveryStatus } from '../actions/productActions'
import { CHANGE_DELIVERY_STATUS_RESET, SAVED_CARDS_LIST_SUCCESS } from '../constants'
import SearchBarForOrdersPage from '../components/SearchBarForOrdersPage'
import Message from '../components/Message'
import {cartList} from './ProductDetailsPage'

let total_amount = 0

function OrdersListPage() {

    // cartList.forEach(element => {
    //     console.log(element)
    //     if(element[2] != "Price")
    //     total_amount += element[2]
    // });

    let history = useHistory()
    const dispatch = useDispatch()
    const placeholderValue = "Search orders by book name"

    const todays_date = dateCheck(new Date().toISOString().slice(0, 10))

    const [currentDateInfo] = useState(todays_date)
    const [idOfchangeDeliveryStatus, setIdOfchangeDeliveryStatus] = useState(0)
    const [cloneSearchTerm, setCloneSearchTerm] = useState("")

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // get all orders reducer
    const getAllOrdersReducer = useSelector(state => state.getAllOrdersReducer)
    const { orders, loading: loadingOrders } = getAllOrdersReducer

    // change delivery status reducer
    const changeDeliveryStatusReducer = useSelector(state => state.changeDeliveryStatusReducer)
    const { success: deliveryStatusChangeSuccess, loading: deliveryStatusChangeSpinner } = changeDeliveryStatusReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getAllOrders())
        }
    }, [userInfo, dispatch, history])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const changeDeliveryStatusHandler = (id, status) => {
        setIdOfchangeDeliveryStatus(id)
        const productData = {
            "is_delivered": status,
            "delivered_at": status ? currentDateInfo : "Not Delivered"
        }
        dispatch(changeDeliveryStatus(id, productData))
    }

    if (deliveryStatusChangeSuccess) {
        alert("Delivery status changed successfully")
        dispatch({
            type: CHANGE_DELIVERY_STATUS_RESET
        })
        dispatch(getAllOrders())
    }

    const handleSearchTerm = (term) => {
        setCloneSearchTerm(term)
    };

    let total_amount=(cartList.reduce((total,currentItem) =>  total = total + currentItem[2] * currentItem[4] , 0 ));

    return (
        // <div>
        //     {loadingOrders && <span style={{ display: "flex" }}>
        //         <h5>Getting Orders</h5>
        //         <span className="ml-2">
        //             <Spinner animation="border" />
        //         </span>
        //     </span>}
        //     {userInfo.admin && <SearchBarForOrdersPage handleSearchTerm={handleSearchTerm} placeholderValue={placeholderValue} />}
        //         {orders.length > 0 ?
        //         <Table className="mt-2" striped bordered>
        //             <thead>
        //                 <tr className="p-3 bg-info text-white text-center">
        //                     <th>Order Id</th>
        //                     <th>Image</th>
        //                     <th>Ordered Item</th>
        //                     <th>Total Amount</th>
        //                     {userInfo.admin &&
        //                         <th>Remove from cart</th>
        //                     }
        //                 </tr>
        //             </thead>


        //             {orders.filter((item) => (

        //                 item.name.toLowerCase().includes(cloneSearchTerm)
        //                 ||
        //                 item.ordered_item.toLowerCase().includes(cloneSearchTerm)
        //                 ||
        //                 item.address.toLowerCase().includes(cloneSearchTerm)
        //             )

        //             ).map((order, idx) => (
        //                 <tbody key={idx}>
        //                     <tr className="text-center">
        //                         <td>
        //                             {order.id}
        //                         </td>
        //                         <td>
        //                         <img src = {order.image} className="order"></img></td>
        //                         <td>{order.name}</td>
        //                         <td>{order.total_price}</td>
        //                         {userInfo.admin &&
        //                             <td>
        //                                 {order.is_delivered ?
        //                                     <button
        //                                         className="btn btn-outline-danger btn-sm"
        //                                         onClick={() => changeDeliveryStatusHandler(order.id, false)}
        //                                     >
        //                                         {deliveryStatusChangeSpinner
        //                                             &&
        //                                             idOfchangeDeliveryStatus === order.id
        //                                             ?
        //                                             <Spinner animation="border" />
        //                                             :
        //                                             "Mark as Undelivered"}
        //                                     </button>
        //                                     :
        //                                     <button
        //                                         className="btn btn-outline-primary btn-sm"
        //                                         onClick={() => changeDeliveryStatusHandler(order.id, true)}
        //                                     >
        //                                         {deliveryStatusChangeSpinner
        //                                             &&
        //                                             idOfchangeDeliveryStatus === order.id
        //                                             ?
        //                                             <Spinner animation="border" />
        //                                             :
        //                                             "Mark as delivered"}
        //                                     </button>
        //                                 }
        //                             </td>
        //                         }
        //                         <td>
        //                             <button className="removeFromCart">Remove From Cart</button>
        //                         </td>
        //                     </tr>

        //                 </tbody>
        //             ))}
        //         </Table>
        //         : <Message variant="info">No orders yet.</Message> }
        //         <button className="removeFromCart">Total Amount: 7200.98</button>
        // </div>
        <div>
        <table className="mt-2" striped bordered id='cartTable'>
          <thead>
            <tr className="p-3 bg-info text-white text-center">
                <th>Order Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Details</th>
                <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {
            cartList.slice(0, cartList.length).map((item, index) => {
              return (
                <tr className="text-center">
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                  <td>{item[2]}</td>
                  <a href = {`/product/${item[0]}`}>
                  <td> <img src = {item[3]} className="order"  ></img></td>
                  </a>
                  <td>{item[4]}
                  <button onClick={() => { 
                     let check_index = cartList.findIndex(i => i[0] === item[0]);
                     cartList[check_index][4]++;
                     console.log("++++")
                     console.log( cartList[check_index][4])
                     total_amount += cartList[check_index][2]
                     window.alert("Quantity increased")

                     history.push('/all-orders')
                     history.goForward()

                  }}>+</button>

                  <button onClick={() => {
                      let check_index = cartList.findIndex(i => i[0] === item[0]);
                      if(cartList[check_index][4] > 1){
                      cartList[check_index][4]--;
                      console.log("----")
                      console.log( cartList[check_index][4])
                      total_amount -= cartList[check_index][2]
                      } 
                      else {
                        cartList.splice(check_index, 1)
                      }
                      window.alert("Quantity decreased")
                      history.push('/all-orders')
                      history.goForward()
                   }}>-</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button className="removeFromCart" onClick={() => {
            history.push("/stripe-card-details/")
            history.goForward()
        }}>Total Amount: {total_amount}</button>
      </div>
    )
}

export default OrdersListPage