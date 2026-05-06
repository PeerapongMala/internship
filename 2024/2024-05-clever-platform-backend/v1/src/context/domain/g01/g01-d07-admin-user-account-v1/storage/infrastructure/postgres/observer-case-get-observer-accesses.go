package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ObserverCaseGetObserverAccesses(userId string) ([]constant.ObserverAccessEntity, error) {
	query := `
		SELECT
			"uoa"."observer_access_id",
			"oa"."name",
			"oa"."updated_at",
			"u"."first_name" AS "updated_by"
		FROM 
			"user"."user_observer_access" uoa
		LEFT JOIN 
			"auth"."observer_access" oa
			ON "uoa"."observer_access_id" = "oa"."id" 
		LEFT JOIN 
			"user"."user" u
			ON "oa"."updated_by" = "u"."id" 
		WHERE
			"uoa"."user_id" = $1	
	`
	observerAccesses := []constant.ObserverAccessEntity{}
	err := postgresRepository.Database.Select(
		&observerAccesses,
		query,
		userId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return observerAccesses, nil
}
