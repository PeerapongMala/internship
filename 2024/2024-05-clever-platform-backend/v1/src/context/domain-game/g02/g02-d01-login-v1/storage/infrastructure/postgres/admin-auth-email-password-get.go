package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) AdminAuthEmailPasswordGet(email string) (*constant.AuthEmailPasswordEntity, error) {
	query := `
		    SELECT
				"u"."id" AS "user_id",    
				"aep"."password_hash" AS "password_hash"
		    FROM	
		    	"user"."user" u
		    LEFT JOIN 
		    	"auth"."auth_email_password" aep
		    	ON "u"."id" = "aep"."user_id"
		    LEFT JOIN
		    	"user"."user_role" ur
		    	ON "u"."id" = "ur"."user_id"
		    WHERE
		        "u"."email" = $1
		   		AND 
		        "ur"."role_id" = $2
	`
	var authEmailPassword constant.AuthEmailPasswordEntity
	err := postgresRepository.Database.QueryRowx(query, email, constant.Admin).StructScan(&authEmailPassword)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &authEmailPassword, nil
}
