import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, getProductDetails } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col, Container, Card, Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CREATE_PRODUCT_RESET, DELETE_PRODUCT_RESET, UPDATE_PRODUCT_RESET, CARD_CREATE_RESET } from '../constants'
export let cartList = [[28, "Harry Porter and Philosopher's Stone	", 299.99, "/images/51P1Rfz5n3L._SX331_BO1204203200__5newo9T.jpg", 1]]

function ProductDetailsPage({ history, match }) {

    const dispatch = useDispatch()

    // modal state and functions
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // product details reducer
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading, error, product } = productDetailsReducer

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // product details reducer
    const deleteProductReducer = useSelector(state => state.deleteProductReducer)
    const { success: productDeletionSuccess } = deleteProductReducer

    useEffect(() => {
        dispatch(getProductDetails(match.params.id))
        dispatch({
            type: UPDATE_PRODUCT_RESET
        })
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
        dispatch({
            type: CARD_CREATE_RESET
        })
    }, [dispatch, match])

    // product delete confirmation
    const confirmDelete = () => {
        dispatch(deleteProduct(match.params.id))
        handleClose()
    }

    // after product deletion
    if (productDeletionSuccess) {
        alert("Product successfully deleted.")
        history.push("/")
        dispatch({
            type: DELETE_PRODUCT_RESET
        })
    }

    return (
        <div>
            
            {/* Modal Start*/}
            <div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i style={{ color: "#e6e600" }} className="fas fa-exclamation-triangle"></i>
                            {" "}
                            Delete Confirmation
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this product <em>"{product.name}"</em>?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => confirmDelete()}>
                            Confirm Delete
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {/* Modal End */}

            {loading && <span style={{ display: "flex" }}>
                <h5>Getting Product Details</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            
            {error ? <Message variant='danger'>{error}</Message>
                :
                <div>
                    
                    <Container>
                        <Row>
                            <Col md={6}>
                                <Card.Img variant="top" src={product.image} height="420" />
                                {/* Product edit and delete conditions */}

                                {userInfo && userInfo.admin ?
                                    <span style={{ display: "flex" }}>
                                        < button
                                            className="btn mt-2 btn-danger btn-sm button-focus-css"
                                            style={{ width: "100%" }}
                                            onClick={() => handleShow()}
                                        >Delete Product
                                        </button>

                                        <button
                                            className="ml-2 mt-2 btn btn-primary btn-sm button-focus-css"
                                            onClick={() => history.push(`/product-update/${product.id}/`)}
                                            style={{ width: "100%" }}
                                        >Edit Product
                                        </button>
                                    </span>
                                    : ""}
                            </Col>

                            <Col sm>
                                <b>{product.name}</b>
                                <hr />
                                <span className="justify-description-css">
                                    <p>{product.description}</p>
                                </span>
                                <span style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    border: "1px solid",
                                    borderColor: "#C6ACE7",
                                    padding: "2px"
                                }}>
                                    Price:<span className="text-success ml-2">₹ {product.price}</span>


                                </span>
                                <button onClick={() => { 
                                    if(product.stock) {
                                    let product_details = [product.id, product.name, product.price, product.image]
                                    const check_index = cartList.findIndex(item => item[0] === product_details[0]);
                                    if (check_index !== -1) {
                                        cartList[check_index][4]++;
                                        console.log("Quantity updated:");
                                    } else {
                                        product_details.push(1)
                                        cartList.push(product_details) 
                                        console.log('New product has been added to cart:');
                                    }
                                    console.log(cartList)
                                    history.push('/all-orders')
                                    history.goForward()
                                    window.alert("product added to cart")
                                }
                                else {
                                    window.alert("Sorry product is out of stock currently, browse our catalouge for more books.");
                                    history.push('/')
                                    history.goForward()
                                }
                                }
                                }> 
                                Cart </button>
                            </Col>
                            <Col sm>
                                <b>Buy</b>
                                <hr />
                                {product.stock ?
                                    <Link to={`${product.id}/checkout/`}>
                                        <button className="btn btn-primary">
                                            <span>Pay with Stripe</span>
                                        </button>
                                    </Link>
                                    :
                                    <Message variant='danger'>
                                        Out Of Stock!
                                    </Message>}
                            </Col>
                        </Row>

                    </Container>
                </div>
            }
        </div >
    )
}

export default ProductDetailsPage
