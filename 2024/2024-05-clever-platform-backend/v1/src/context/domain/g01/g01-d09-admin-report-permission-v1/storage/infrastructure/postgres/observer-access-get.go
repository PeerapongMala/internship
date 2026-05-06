package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ObserverAccessGet(observerAccessId *int) (*constant.ObserverAccessEntity, error) {
	query := `
		SELECT
			"oa"."id",
			"oa"."name",
			"oa"."access_name",
			"oa"."district_zone",
			"oa"."area_office",	
			"oa"."district_group",
			"oa"."district",
			"oa"."school_affiliation_id",
			"oa"."status",
			"oa"."updated_at",
			"u"."first_name" AS "updated_by"
		FROM
			"auth"."observer_access" oa
		LEFT JOIN 
			"user"."user" u
			ON "oa"."updated_by" = "u"."id"
		WHERE
			"oa"."id" = $1
`
	observerAccessEntity := constant.ObserverAccessEntity{}
	err := postgresRepository.Database.QueryRowx(query, observerAccessId).StructScan(&observerAccessEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &observerAccessEntity, nil
}
