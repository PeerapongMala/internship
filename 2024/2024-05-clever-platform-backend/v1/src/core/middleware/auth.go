package middleware

import (
	"net/http"

	arcadehelper "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/arcade-helper"
	authMiddlewareStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d06-auth-middleware-v1/storage/storage-repository"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

const (
	LOCALS_KEY_SUBJECT_ID string = "subjectId"
)

type AuthMiddleware struct {
	AuthMiddlewareStorage authMiddlewareStorage.Repository
}

func AuthMiddlewareNew(authMiddlewareStorageInstance authMiddlewareStorage.Repository) *AuthMiddleware {
	return &AuthMiddleware{
		AuthMiddlewareStorage: authMiddlewareStorageInstance,
	}
}

func (authMiddleware *AuthMiddleware) CheckRoles(allowedRoles ...constant.Role) fiber.Handler {
	return func(context *fiber.Ctx) error {
		tokenString := context.Get("Authorization")
		claims, err := helper.ValidateJwt(tokenString)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
		context.Locals(LOCALS_KEY_SUBJECT_ID, claims.Subject)

		roles, err := authMiddleware.AuthMiddlewareStorage.UserRoleList(claims.Subject)
		context.Locals("roles", roles)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
		for _, allowedRole := range allowedRoles {
			for _, role := range roles {
				if constant.Role(role) == allowedRole {
					return context.Next()
				}
			}
		}

		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusForbidden, nil))
	}
}
func (authMiddleware *AuthMiddleware) CheckRolesArcade(allowedRoles ...constant.Role) fiber.Handler {
	return func(context *fiber.Ctx) error {
		tokenString := context.Get("Authorization")
		claims, err := arcadehelper.ValidateJwtArcadeGameBaerer(tokenString)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
		context.Locals(LOCALS_KEY_SUBJECT_ID, claims.Subject)

		roles, err := authMiddleware.AuthMiddlewareStorage.UserRoleList(claims.Subject)
		context.Locals("roles", roles)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
		for _, allowedRole := range allowedRoles {
			for _, role := range roles {
				if constant.Role(role) == allowedRole {
					return context.Next()
				}
			}
		}

		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusForbidden, nil))
	}
}

func (authMiddleware *AuthMiddleware) CheckRolesChat(allowedRoles ...constant.Role) fiber.Handler {
	return func(context *fiber.Ctx) error {
		tokenString := context.Query("token")
		claims, err := helper.ValidateJwtChat(tokenString)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
		context.Locals(LOCALS_KEY_SUBJECT_ID, claims.Subject)

		roles, err := authMiddleware.AuthMiddlewareStorage.UserRoleList(claims.Subject)
		context.Locals("roles", roles)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
		for _, allowedRole := range allowedRoles {
			for _, role := range roles {
				if constant.Role(role) == allowedRole {
					return context.Next()
				}
			}
		}

		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusForbidden, nil))
	}
}
