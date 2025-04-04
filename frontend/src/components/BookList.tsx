import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                setLoading(true);
                const data = await fetchBooks(pageSize, pageNum, selectedCategories);
                setBooks(data.books);
                setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, [pageSize, pageNum, selectedCategories]);

    if (loading) return <p>Loading Books...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

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

                <div className="mt-4 mb-3">
                    <button
                        className="btn btn-warning"
                        onClick={() => {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            setPageNum(1); // Optional: reset page on sort
                        }}
                    >
                        Sort by Title ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </button>
                </div>

                <div className={`row row-cols-1 row-cols-md-${books.length > 1 ? 3 : 1} g-4`}>
                    {[...books]
                        .sort((a, b) => {
                            const titleA = a.title.toLowerCase();
                            const titleB = b.title.toLowerCase();
                            return sortOrder === 'asc'
                                ? titleA.localeCompare(titleB)
                                : titleB.localeCompare(titleA);
                        })
                        .map((b) => (
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

                <Pagination
                    currentPage={pageNum}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={setPageNum}
                    onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setPageNum(1);
                    }}
                />
            </div>
        </>
    );
}

export default BookList;
