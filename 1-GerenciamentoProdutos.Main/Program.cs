using GerenciamentoProdutos.Domain.Interface.Repository;
using GerenciamentoProdutos.Domain.Interface.Service;
using GerenciamentoProdutos.Domain.Mapper;
using GerenciamentoProdutos.Domain.Service;
using GerenciamentoProdutos.Repository;
using GerenciamentoProdutos.Repository.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

//contexto Db
builder.Services.AddDbContext<RepositoryPatternContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<RepositoryPatternContext, RepositoryPatternContext>();

//Injeção de Dependência Repository
builder.Services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddTransient(typeof(IPerfilRepository), typeof(PerfilRepository));
builder.Services.AddTransient(typeof(IUsuarioRepository), typeof(UsuarioRepository));
builder.Services.AddTransient(typeof(IProdutoRepository), typeof(ProdutoRepository));
builder.Services.AddTransient(typeof(IEmpresaRepository), typeof(EmpresaRepository));
builder.Services.AddTransient(typeof(ICategoriaRepository), typeof(CategoriaRepository));

//AutoMapper
builder.Services.AddAutoMapper(cfg =>
{
    // Configurações adicionais se necessário
    cfg.AllowNullCollections = true;
}, typeof(ApplicationMapper));


//Injeção de Dependência Service            
builder.Services.AddTransient(typeof(IUsuarioService), typeof(UsuarioService));
builder.Services.AddTransient(typeof(IPerfilService), typeof(PerfilService));
builder.Services.AddTransient(typeof(IEmpresaService), typeof(EmpresaService));
builder.Services.AddTransient(typeof(IProdutoService), typeof(ProdutoService));
builder.Services.AddTransient(typeof(ICategoriaService), typeof(CategoriaService));


builder.Services
             .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
             .AddJwtBearer(options =>
             {
                 options.TokenValidationParameters = new TokenValidationParameters
                 {
                     ValidateIssuer = true,
                     ValidateAudience = true,
                     ValidateLifetime = true,
                     ValidateIssuerSigningKey = true,

                     ValidIssuer = builder.Configuration["Jwt:Issuer"],
                     ValidAudience = builder.Configuration["Jwt:Audience"],
                     IssuerSigningKey = new SymmetricSecurityKey
                   (Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                 };
             });

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Sistema Gerenciamento de Produtos.API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        //Type = SecuritySchemeType.ApiKey,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header usando o esquema Bearer."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
                 {
                     {
                           new OpenApiSecurityScheme
                             {
                                 Reference = new OpenApiReference
                                 {
                                     Type = ReferenceType.SecurityScheme,
                                     Id = "Bearer"
                                 }
                             },
                             new string[] {}
                     }
                 });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(x => x.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
