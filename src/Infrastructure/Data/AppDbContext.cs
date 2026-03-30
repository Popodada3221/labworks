using Microsoft.EntityFrameworkCore;
using Core.Models;

namespace Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Seed data
                entity.HasData(
                    new Product
                    {
                        Id = 1,
                        Name = "Ноутбук Lenovo",
                        Price = 45000.00m,
                        CreatedAt = DateTime.UtcNow,
                        Description = "Мощный ноутбук для работы",
                        Stock = 10
                    },
                    new Product
                    {
                        Id = 2,
                        Name = "Мышь Logitech",
                        Price = 2500.00m,
                        CreatedAt = DateTime.UtcNow,
                        Description = "Беспроводная мышь",
                        Stock = 50
                    },
                    new Product
                    {
                        Id = 3,
                        Name = "Клавиатура Mechanical",
                        Price = 8000.00m,
                        CreatedAt = DateTime.UtcNow,
                        Description = "Механическая клавиатура",
                        Stock = 25
                    }
                );
            });
        }
    }
}