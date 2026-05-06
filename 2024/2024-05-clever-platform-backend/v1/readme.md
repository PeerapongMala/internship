Prepare PostgreSQL database using the following tools.

Postgres.app with PostgreSQL 17 (Universal)
https://postgresapp.com/downloads.html

pgadmin4 @ v8.12
https://www.postgresql.org/ftp/pgadmin/pgadmin4/v8.12

https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

------------------------------------------------
Migration

https://github.com/pressly/goose
go install github.com/pressly/goose/v3/cmd/goose@latest
...\v1\src\context\domain\migration\postgres> goose postgres "postgres://postgres:password@127.0.0.1:5432/test?sslmode=disable" up

Alternatively,
Try using the "SQLTools" and "SQLTools PostgreSQL/Cockroach Driver" vs code extension
https://www.youtube.com/watch?v=cc-cSSsGqbA&ab_channel=ProgrammingKnowledge

------------------------------------------------
## API Response Format
- Dates are returned in ISO8601 (Date and time in UTC) format: YYYY-MM-DDTHH:MM:SSZ
- Blank fields are included as null
- JSON field names are in snake_case format
### (No data) Success / Error Response
```
{
  "status_code": 500,
  "message": "Password updated / Something went wrong"
}
```
### (Individual) Data Response
```
{
  "status_code": 200,
  "data": [
    {
      "id": "b8fa1230-feaf-41ee-bd1d-9624ce2bec68",
      "email": "admin@admin.com",
      "roles": [1, 2, 3]
    }
  ],
  "message": "Data retrieved"
}
```
```
{
  "status_code": 200,
  "data": [
    {
      "access_token": "some access token"
    }
  ],
  "message": "Login successfully"
}
```
### (List) Data Response
```
{
  "status_code": 200,
  "_pagination": {
    "page": 1
    "limit": 10
    "total_count": 3
  },
  "data": [
    {
      "id": "39fa1230-feaf-41ee-bd1d-9624ce2bec68",
      "email": "pat@doe.com",
      "roles": [1]
    },
    {
      "id": "12fa1230-feaf-41ee-bd1d-9624ce2bec68",
      "email": "john@doe.com",
      "roles": [2, 3]
    },
    {
      "id": "b8fa1230-feaf-41ee-bd1d-9624ce2bec68",
      "email": "jane@doe.com",
      "roles": [1, 2, 3]
    },
  ]
  "message": "Data retrieved"
}
```

## Docker

Run the following command to start the Docker containers.

```bash
docker-compose up -d
```

(Optional) Run the following command to delete all the schema in the database.

```bash
docker cp ./src/context/domain/migration/postgres/helper/0-delete-all-schema postgres_ZettaMerge:/0-delete-all-schema
docker exec -it postgres_ZettaMerge psql -U postgres -f /0-delete-all-schema
```

**WARNING**: This will delete all the schema in the database. Use with caution.

Run the following command to initialize the database with the necessary data.

```bash
python initialize_db.py
```

โปรเจค v1 ให้เก็บ postman collection ไว้ที่ backend repo 
v1\third-party\postman\docs 

## Test step on each environment
# local 
# - ข้อมูล mock ควรใช้ชื่อ field ก่อนเพื่อเข้าใจความเชื่อมโยง
# dev 
# - ข้อมูล mock ควรใช้ชื่อ field ก่อนเพื่อเข้าใจความเชื่อมโยง
# staging 
# - ข้อมูล mock ควรใช้คำที่สมจริง แต่ยังคงง่ายต่อการเข้าใจความเชื่อมโยง
# production 
# - ใช้ข้อมูลจริง ควรขอข้อมูลที่ใช้จริงจากลูกค้า
##