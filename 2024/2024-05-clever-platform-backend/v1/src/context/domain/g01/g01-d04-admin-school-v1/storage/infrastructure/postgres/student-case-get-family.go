package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseGetFamily(userId string) (*constant.FamilyEntity, error) {
	query := `
		SELECT
			"fm1"."family_id" AS "id",	
			CONCAT_WS(' ', "u"."title", "u"."first_name", "u"."last_name") AS "owner"
		FROM
			"family"."family_member" fm1
		LEFT JOIN
			"family"."family_member" fm2
			ON "fm1"."family_id" = "fm2"."family_id"
		LEFT JOIN
			"user"."user" u
			ON "fm2"."user_id" = "u"."id"
		WHERE
			"fm1"."user_id" = $1	
			AND
			"fm2"."is_owner" = TRUE
	`

	familyEntity := constant.FamilyEntity{}
	err := postgresRepository.Database.QueryRowx(query, userId).StructScan(&familyEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &familyEntity, nil
}
