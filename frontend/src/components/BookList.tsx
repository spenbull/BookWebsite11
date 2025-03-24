import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchBooks = async () => {
            const categoryParams = selectedCategories
                .map((cat) => `bookCategory=${encodeURIComponent(cat)}`)
                .join('&');

            const response = await fetch(
                `http://localhost:5005/Book?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}&sortOrder=${sortOrder}`
            );
            const data = await response.json();
            setBooks(data.books);
            setTotalItems(data.totalNumBooks);
            setTotalPages(Math.ceil(totalItems / pageSize));
        };

        fetchBooks();
    }, [pageSize, pageNum, sortOrder, totalItems, selectedCategories]);

    const handleAddToCart = (book: Book) => {
        const newItem: CartItem = {
            bookId: book.bookId,
            title: book.title,
            price: book.price,
            quantity: 1,
        };
        addToCart(newItem);
        navigate('/cart');
    };

    return (
        <>
            <div className="container mt-4">
                <h2 className="mb-4">Book List</h2>
                <div className={`row row-cols-1 row-cols-md-${books.length > 1 ? 3 : 1} g-4`}>
                    {books.map((b) => (
                        <div key={b.bookId} className="col">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{b.title}</h5>
                                    <ul className="list-unstyled">
                                        <li><strong>Author:</strong> {b.author}</li>
                                        <li><strong>Publisher:</strong> {b.publisher}</li>
                                        <li><strong>ISBN:</strong> {b.isbn}</li>
                                        <li><strong>Classification:</strong> {b.classification}</li>
                                        <li><strong>Category:</strong> {b.category}</li>
                                        <li><strong>Page Count:</strong> {b.pageCount}</li>
                                        <li><strong>Price: $</strong> {b.price}</li>
                                    </ul>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleAddToCart(b)}
                                    >
                                        Add To Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <button
                        className="btn btn-secondary"
                        disabled={pageNum === 1}
                        onClick={() => setPageNum(pageNum - 1)}
                    >
                        Previous
                    </button>

                    <div>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className="btn btn-outline-primary mx-1"
                                onClick={() => setPageNum(i + 1)}
                                disabled={pageNum === i + 1}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        className="btn btn-secondary"
                        disabled={pageNum === totalPages}
                        onClick={() => setPageNum(pageNum + 1)}
                    >
                        Next
                    </button>
                </div>

                <div className="mt-4">
                    <button
                        className="btn btn-warning"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        Sort by Title ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </button>
                </div>

                <div className="mt-4">
                    <label>
                        Results per Page:
                        <select
                            className="form-select ms-2"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPageNum(1);
                            }}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </label>
                </div>
            </div>
        </>
    );
}

export default BookList;
