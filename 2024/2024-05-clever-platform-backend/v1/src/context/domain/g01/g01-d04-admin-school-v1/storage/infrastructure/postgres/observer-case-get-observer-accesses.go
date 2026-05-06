package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ObserverCaseGetObserverAccesses(userId string) ([]constant.ObserverAccessEntity, error) {
	query := `
		SELECT
			"auth"."observer_access"."access_name",
			"user"."user_observer_access"."observer_access_id"
		FROM "user"."user_observer_access"
		LEFT JOIN "auth"."observer_access"
			ON "user"."user_observer_access"."observer_access_id" = "auth"."observer_access"."id" 
		WHERE "user"."user_observer_access"."user_id" = $1	
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
