#!/bin/sh

docker run -d \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  --name postgres_ZettaMerge \
  postgres:17-alpine

sleep 2

goose -dir ../src/context/domain/migration/postgres \
  postgres "postgres://postgres:postgres@localhost:5432?sslmode=disable" up
