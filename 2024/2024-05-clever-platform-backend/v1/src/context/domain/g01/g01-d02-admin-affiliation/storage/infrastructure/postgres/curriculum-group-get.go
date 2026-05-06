package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) CurriculumGroupGet(curriculumGroupId int) (*constant.CurriculumGroupEntity, error) {
	query := `
		SELECT
			"cg"."id",
			"cg"."name",
			"cg"."short_name",
			"cg"."status",
			"cg"."created_at",
			"cg"."created_by",
			"cg"."updated_at",
			"u"."first_name" AS "updated_by"
		FROM
			"curriculum_group"."curriculum_group" cg
		LEFT JOIN
			"user"."user" u
			ON "cg"."updated_by" = "u"."id"
		WHERE
			"cg"."id" = $1
	`
	curriculumGroupEntity := constant.CurriculumGroupEntity{}
	err := postgresRepository.Database.QueryRowx(query, curriculumGroupId).StructScan(&curriculumGroupEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &curriculumGroupEntity, nil
}
