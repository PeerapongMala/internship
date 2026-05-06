package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TagGet(tagId int) (*constant.TagEntity, error) {
	query := `
		SELECT
			"t"."id",
			"t"."tag_group_id",
			"t"."name",
			"t"."status",
			"t"."created_at",
			"t"."created_by",
			"t"."updated_at",
			"u"."first_name" AS "updated_by",
			"t"."admin_login_as"
		FROM
			"subject"."tag"	t
		LEFT JOIN 
			"user"."user" u
			ON "t"."updated_by" = "u"."id"
		WHERE
			"t"."id" = $1
	`
	tagEntity := constant.TagEntity{}
	err := postgresRepository.Database.QueryRowx(query, tagId).StructScan(&tagEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &tagEntity, nil
}
