FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 7037
ENV ASPNETCORE_URLS=http://+:7037

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["BSS_API/BSS_API.csproj", "BSS_API/"]
RUN dotnet restore "BSS_API/BSS_API.csproj"
COPY . .
WORKDIR "/src/BSS_API"
RUN dotnet build "BSS_API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BSS_API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BSS_API.dll"]

ENV TZ=Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update \
    && apt-get install -y apt-utils

RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser