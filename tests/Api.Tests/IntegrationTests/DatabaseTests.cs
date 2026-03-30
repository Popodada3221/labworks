using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Core.Models;
using Xunit;

namespace Api.Tests.IntegrationTests;

public class DatabaseTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CanAddAndRetrieveProduct()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var repository = new ProductRepository(context);
        var product = new Product
        {
            Name = "Integration Test Product",
            Price = 99.99m
        };

        // Act
        var created = await repository.AddAsync(product);
        var retrieved = await repository.GetByIdAsync(created.Id);

        // Assert
        Assert.NotNull(retrieved);
        Assert.Equal("Integration Test Product", retrieved.Name);
        Assert.Equal(99.99m, retrieved.Price);
    }

    [Fact]
    public async Task GetAll_ReturnsAllProducts()
    {
        using var context = GetInMemoryDbContext();
        var repository = new ProductRepository(context);

        // Seed
        await repository.AddAsync(new Product { Name = "Product1", Price = 10 });
        await repository.AddAsync(new Product { Name = "Product2", Price = 20 });

        // Act
        var products = await repository.GetAllAsync();

        // Assert
        Assert.Equal(2, products.Count());
    }
}