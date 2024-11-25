using Microsoft.EntityFrameworkCore;
using UbyApi.Data;
using UbyApi.Models;
using UbyApi.Services;
var builder = WebApplication.CreateBuilder(args);

//MongoDB
builder.Services.Configure<UbyTableSettings>(
    builder.Configuration.GetSection("Uby_Table"));

builder.Services.AddSingleton<UbyTableService>();

// Obtener la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("SqlServerConnection");

// Configurar los DbContext dentro del contenedor de inyección de dependencias (DI)
builder.Services.AddDbContext<AdministradorContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<PedidosClienteContextSQL>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ValidacionComercioContextSQL>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ClienteContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ReporteVentasContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ReporteConsolidadoContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<UltimaCompraContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<RecepcionPedidoContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddDbContext<ComercioAfiliadoContext>(options =>
    options.UseSqlServer(connectionString)
           .EnableSensitiveDataLogging()
           .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));



builder.Services.AddDbContext<DireccionAdministradorContext>(options =>
    options.UseSqlServer(connectionString));


builder.Services.AddDbContext<DireccionComercioContext>(options =>
    options.UseSqlServer(connectionString)
           .EnableSensitiveDataLogging()
           .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));


builder.Services.AddDbContext<DireccionPedidoContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<DireccionRepartidorContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<DireccionClienteContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<PedidoContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ProductoContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ProductosComercioContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ProductosPedidosContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<RepartidorContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<TarjetaCreditoContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<TelefonoAdminContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<TelefonoClienteContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<TelefonoComercioContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<TelefonoRepartidorContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<TipoComercioContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDbContext<DireccionClienteContext>(options =>
    options.UseSqlServer(connectionString));

// Configurar servicios
builder.Services.AddControllers();
// Configurar Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configuración del pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Configuración de CORS
#region Config. CORS
app.UseCors(options =>
    options.AllowAnyOrigin()
           .AllowAnyHeader()
           .AllowAnyMethod());
#endregion

app.UseAuthorization();

app.MapControllers();

Console.WriteLine($"Environment: {Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}");

app.Run();
