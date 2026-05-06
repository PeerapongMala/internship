package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) PlatformGet(platformId int) (*constant.PlatformEntity, error) {
	query := `
		SELECT
			"p"."id",
			"p"."curriculum_group_id",
			"p"."seed_platform_id",
			"sp"."name" AS "seed_platform_name",
			"p"."status",
			"p"."created_at",
			"p"."created_by",
			"p"."updated_at",
			"u"."first_name" AS "updated_by",
			"p"."admin_login_as"
		FROM
			"curriculum_group"."platform" p
		LEFT JOIN
			"user"."user" u
			ON "p"."updated_by" = "u"."id"
		LEFT JOIN
			"platform"."seed_platform" sp
			ON "p"."seed_platform_id" = "sp"."id"
		WHERE
		    "p"."id" = $1
	`
	platformEntity := constant.PlatformEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		platformId,
	).StructScan(&platformEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &platformEntity, nil
}
