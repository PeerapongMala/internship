package arcadehelper

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

func GenerateJwtArcadeGame(userId string, arcadeGameId int) (*string, error) {
	lifetimeString := os.Getenv("GAME_ARCADE_ACCESS_TOKEN_LIFETIME")
	lifetime, err := strconv.Atoi(lifetimeString)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	PlayId := uuid.NewString()
	claims := constant.ArcadeUserClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "Clever Platform",
			Subject:   userId,
			Audience:  []string{"api"},
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(lifetime) * time.Second)),
			NotBefore: jwt.NewNumericDate(time.Now()),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ID:        uuid.NewString(),
		},
		PlayId:       PlayId,
		ArcadeGameId: arcadeGameId,
	}
	jwtSecret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &signedToken, nil
}
func GenerateJwtWithOldPlayId(userId string, playId string, arcadeGameId int) (*string, error) {
	lifetimeString := os.Getenv("GAME_ARCADE_ACCESS_TOKEN_LIFETIME")
	lifetime, err := strconv.Atoi(lifetimeString)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	claims := constant.ArcadeUserClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "Clever Platform",
			Subject:   userId,
			Audience:  []string{"api"},
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(lifetime) * time.Second)),
			NotBefore: jwt.NewNumericDate(time.Now()),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ID:        uuid.NewString(),
		},
		PlayId:       playId,
		ArcadeGameId: arcadeGameId,
	}
	jwtSecret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &signedToken, nil
}

func ValidateJwtArcadeGame(tokenString string) (*constant.ArcadeUserClaims, error) {
	// tokenParts := strings.Split(tokenString, " ")
	// if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
	// 	log.Printf("Invalid authorization header format")
	// 	return nil, helper.NewHttpError(http.StatusUnauthorized, nil)
	// }

	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.ParseWithClaims(tokenString, &constant.ArcadeUserClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		log.Printf("%+v", errors.WithStack(err))
		return nil, helper.NewHttpError(http.StatusUnauthorized, nil)
	}

	claims, ok := token.Claims.(*constant.ArcadeUserClaims)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return nil, helper.NewHttpError(http.StatusUnauthorized, nil)
	}

	return claims, nil
}
func ValidateJwtArcadeGameBaerer(tokenString string) (*constant.ArcadeUserClaims, error) {

	tokenParts := strings.Split(tokenString, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		log.Printf("Invalid authorization header format")
		return nil, helper.NewHttpError(http.StatusUnauthorized, nil)
	}
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.ParseWithClaims(tokenParts[1], &constant.ArcadeUserClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		log.Printf("%+v", errors.WithStack(err))
		return nil, helper.NewHttpError(http.StatusUnauthorized, nil)
	}

	claims, ok := token.Claims.(*constant.ArcadeUserClaims)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return nil, helper.NewHttpError(http.StatusUnauthorized, nil)
	}

	return claims, nil
}
