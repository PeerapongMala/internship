package main

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core"
	_ "github.com/ZettaMerge/2024-05-clever-platform-backend/third-party/swagger/docs"
	_ "github.com/jackc/pgx/v5/stdlib"
)

//	@title		Clever Platform API
//	@version	1.0
//
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	core.Init()

}
