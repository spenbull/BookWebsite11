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

    }
}