using BookWebsite.API.Data;
using Microsoft.AspNetCore.Mvc;

namespace BookWebsite.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        
        public BookController(BookDbContext temp) => _bookContext = temp;
        
        [HttpGet(Name = "GetBooks")]
        public IActionResult Get(int pageSize = 5, int pageNum = 1, string sortOrder = "asc", [FromQuery] List<string>? bookCategory = null)
        {
            var booksQuery = _bookContext.Books.AsQueryable();

            if (bookCategory != null && bookCategory.Any())
            {
                booksQuery = booksQuery.Where(b=>bookCategory.Contains(b.Category));
            }
            // Apply sorting
            if (sortOrder.ToLower() == "desc")
            {
                booksQuery = booksQuery.OrderByDescending(b => b.Title);
            }
            else
            {
                booksQuery = booksQuery.OrderBy(b => b.Title);
            }

            var books = booksQuery
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = booksQuery.Count();

            var result = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };

            return Ok(result);
        }

        [HttpGet("GetBookCategory")]
        public IActionResult GetBookCategory()
        {
            var bookCategory = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();
            return Ok(bookCategory);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);
            
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;
            
            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();
            
            return Ok(existingBook);
        }
        
        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }
            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();
            
            return NoContent();
        }

    }
}