import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";

function CartPage() {
    const navigate = useNavigate();
    const { cart, addToCart, removeFromCart, removeOneFromCart } = useCart();

    // Calculate the total price of the cart
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item: CartItem) => (
                                <tr key={item.bookId}>
                                    <td>{item.title}</td>
                                    <td>${item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price * item.quantity}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm me-2"
                                            onClick={() => removeOneFromCart(item.bookId)}
                                        >
                                            −
                                        </button>
                                        <button
                                            className="btn btn-outline-primary btn-sm me-2"
                                            onClick={() => addToCart(item)}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => removeFromCart(item.bookId)}
                                        >
                                            Remove All
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="d-flex justify-content-between mt-4">
                <h3>Total: ${calculateTotal()}</h3>
                <div>
                    <button className="btn btn-success me-2">Checkout</button>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/books')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
