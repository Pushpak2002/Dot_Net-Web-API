using Microsoft.EntityFrameworkCore;
using WebApplication1.Model;

namespace WebApplication1.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<firstModel> _firstModel { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<firstModel>().HasData(
                    new firstModel{
                    Id = 1,
                    Name = "ABC",
                    Description = "I'm the first person",
                    Path = "Null"
                },

                new firstModel{
                    Id = 2,
                    Name = "DEF",
                    Description = "I'm the Second person",
                    Path = "Null"
                }

                );

        }

    }
}
