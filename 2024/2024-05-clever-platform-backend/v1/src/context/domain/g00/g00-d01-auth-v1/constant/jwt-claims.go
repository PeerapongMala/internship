package constant

import "github.com/golang-jwt/jwt/v5"

type UserClaims struct {
	jwt.RegisteredClaims
}
type ArcadeUserClaims struct {
	jwt.RegisteredClaims
	PlayId       string
	ArcadeGameId int
}
