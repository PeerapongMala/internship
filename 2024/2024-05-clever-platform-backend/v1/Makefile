ifeq ($(OS),Windows_NT)
SHELL := powershell.exe
.SHELLFLAGS := -NoProfile -Command
endif
  
ifeq ($(OS),Windows_NT)
build:
	$$env:GO111MODULE="on"; $$env:API_ENV="localhost"; go build -o .\dist\app.exe .\main.go

compile:
	$$env:GO111MODULE="on"; $$env:API_ENV="localhost"; go build -o app.exe .\main.go; .\dist\app.exe

run:
	$$env:GO111MODULE="on"; $$env:API_ENV="localhost";
	go run .\main.go
else

build:
	env GO111MODULE=on go build -o ./dist/app main.go;

compile:
	env GO111MODULE=on go build -o ./dist/app main.go;
	env API_ENV=localhost ./dist//app

run:
	env GO111MODULE=on API_ENV=localhost go run main.go
endif

# =========================================================
# development
# =========================================================

up:
	make up-build

up-build:
	docker compose -f docker-compose.yml up --build -d

down:
	docker compose -f docker-compose.yml down --remove-orphans

log:
	docker logs -f --tail 10 go-app

exec:
	docker exec -it go-app /bin/sh