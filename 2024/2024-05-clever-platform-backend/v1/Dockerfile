FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
COPY . .
RUN go build -o /app/server main.go

#  clean runtime image
FROM alpine:latest
WORKDIR /root/

COPY --from=builder /app/server .

EXPOSE 8100
CMD ["./server"]