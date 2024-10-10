using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class feedDataToDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "_firstModel",
                columns: new[] { "Id", "Description", "Name", "Path" },
                values: new object[,]
                {
                    { 1, "I'm the first person", "ABC", "Null" },
                    { 2, "I'm the Second person", "DEF", "Null" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "_firstModel",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "_firstModel",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
