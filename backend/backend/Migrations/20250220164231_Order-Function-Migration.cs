using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class OrderFunctionMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Adding OrderId column to CartItems table
            migrationBuilder.AddColumn<int>(
                name: "OrderId",
                table: "CartItems",
                type: "int",
                nullable: true);

            // Creating the Orders table
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<double>(type: "float", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Payment = table.Column<bool>(type: "bit", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                });

            // Adding an index for OrderId column in CartItems table
            migrationBuilder.CreateIndex(
                name: "IX_CartItems_OrderId",
                table: "CartItems",
                column: "OrderId");

            // Adding foreign key for CartItems to Orders
            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Orders_OrderId",
                table: "CartItems",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Dropping foreign key and index
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Orders_OrderId",
                table: "CartItems");

            migrationBuilder.DropIndex(
                name: "IX_CartItems_OrderId",
                table: "CartItems");

            // Dropping Orders table
            migrationBuilder.DropTable(
                name: "Orders");

            // Dropping OrderId column from CartItems table
            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "CartItems");
        }
    }
}
