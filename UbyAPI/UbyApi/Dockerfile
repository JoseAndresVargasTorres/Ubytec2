# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy and restore dependencies
COPY *.csproj .
RUN dotnet restore

# Copy and build the application
COPY . .
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/out/ .

# Set the URL for the application to listen on port 80
ENV ASPNETCORE_URLS=http://+:80

# Set the environment variable
ENV ASPNETCORE_ENVIRONMENT=Development

EXPOSE 80 

# Run the application
ENTRYPOINT ["dotnet", "UbyApi.dll"]

CMD ["bundle",  "exec", "rails", "server", "-e", "production"]