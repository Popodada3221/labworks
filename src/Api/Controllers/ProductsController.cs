using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Models;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repo;
    private readonly ILogger<ProductsController> _logger;

    // Конструктор с двумя параметрами
    public ProductsController(IProductRepository repo, ILogger<ProductsController> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation("Getting all products");
        return Ok(await _repo.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _repo.GetByIdAsync(id);
        if (product == null)
        {
            _logger.LogWarning("Product {Id} not found", id);
            return NotFound();
        }
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Product product)
    {
        var created = await _repo.AddAsync(product);
        _logger.LogInformation("Product {Id} created", created.Id);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}