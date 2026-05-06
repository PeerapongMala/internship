package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ObserverAccessList(filter *constant.ObserverAccessFilter, pagination *helper.Pagination) ([]constant.ObserverAccessEntity, error) {
	query := `
		SELECT
			"oa"."id" AS "observer_access_id",
			"oa"."name",
			"oa"."updated_at",
			"u"."first_name" AS "updated_by"
		FROM
			"auth"."observer_access" oa
		LEFT JOIN
			"user"."user" u
			ON "oa"."updated_by" = "u"."id"
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.ObserverAccessId != nil && *filter.ObserverAccessId != 0 {
		query += fmt.Sprintf(` AND "oa"."id" = $%d`, argsIndex)
		argsIndex++
		args = append(args, filter.ObserverAccessId)
	}
	if filter.Name != nil && *filter.Name != "" {
		query += fmt.Sprintf(` AND "oa"."name" ILIKE $%d`, argsIndex)
		argsIndex++
		args = append(args, "%"+*filter.Name+"%")
	}
	if filter.AccessName != nil {
		query += fmt.Sprintf(` AND "oa"."access_name" = $%d`, argsIndex)
		argsIndex++
		args = append(args, filter.AccessName)
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "oa"."id" LIMIT $%d OFFSET $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Limit, pagination.Offset)
	}

	observerAccessEntities := []constant.ObserverAccessEntity{}
	err := postgresRepository.Database.Select(&observerAccessEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return observerAccessEntities, nil
}
