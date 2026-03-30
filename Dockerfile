# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем csproj файлы
COPY src/Core/Core.csproj Core/
COPY src/Infrastructure/Infrastructure.csproj Infrastructure/
COPY src/Api/Api.csproj Api/

# Восстанавливаем зависимости
RUN dotnet restore Api/Api.csproj

# Копируем весь исходный код
COPY src/ .

# Публикуем приложение
WORKDIR /src/Api
RUN dotnet publish -c Release -o /app/publish -r linux-x64 --self-contained false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Устанавливаем curl для healthcheck
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Копируем опубликованное приложение
COPY --from=build /app/publish .

# Создаем пользователя с низкими привилегиями
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8080
EXPOSE 8081

# Настройка healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "Api.dll"]