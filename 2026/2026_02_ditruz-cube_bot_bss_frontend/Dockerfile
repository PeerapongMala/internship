# ---------------- BASE RUNTIME ----------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 7050
ENV ASPNETCORE_URLS=https://+:7050

# ---------------- BUILD ----------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["BSS_WEB/BSS_WEB.csproj", "BSS_WEB/"]
RUN dotnet restore "BSS_WEB/BSS_WEB.csproj"

COPY . .
WORKDIR "/src/BSS_WEB"

# ---------------- PUBLISH ----------------
FROM build AS publish
RUN dotnet publish "BSS_WEB.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ติดตั้ง Playwright
RUN pwsh /app/publish/playwright.ps1 install chromium

# Generate HTTPS dev certificate
RUN dotnet dev-certs https -ep /https.pfx -p P@ssw0rd

# ---------------- FINAL ----------------
FROM base AS final
WORKDIR /app

# Minimal packages สำหรับ Headless Chromium (PDF use-case เท่านั้น)
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libasound2 \
    fonts-liberation \
    fonts-thai-tlwg \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .
COPY --from=publish /root/.cache/ms-playwright /root/.cache/ms-playwright
COPY --from=publish /https.pfx /https.pfx

ENV TZ=Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# ตั้งค่า Kestrel ใช้ cert นี้
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https.pfx
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=P@ssw0rd

ENTRYPOINT ["dotnet", "BSS_WEB.dll"]