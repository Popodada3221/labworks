using Api.Controllers;
using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Api.Tests.UnitTests
{
    [Trait("Category", "Unit")]
    public class ProductControllerTests
    {
        [Fact]
        public async Task GetAll_ReturnsOkResult_WithProducts()
        {
            // Arrange
            var mockRepo = new Mock<IProductRepository>();
            mockRepo.Setup(repo => repo.GetAllAsync())
                    .ReturnsAsync(new List<Product>
                    {
                        new Product { Id = 1, Name = "Test", Price = 100 }
                    });

            var controller = new ProductsController(mockRepo.Object, Mock.Of<ILogger<ProductsController>>());

            // Act
            var result = await controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var products = Assert.IsType<List<Product>>(okResult.Value);
            Assert.Single(products);
        }
    }
}