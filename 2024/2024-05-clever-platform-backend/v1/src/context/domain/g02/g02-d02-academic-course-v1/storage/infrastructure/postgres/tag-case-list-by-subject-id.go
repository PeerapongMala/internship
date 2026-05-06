package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TagCaseListBySubjectId(subjectId int) ([]constant.TagGroupWithTagsEntity, error) {
	tagGroupQuery := `
		SELECT
			*
		FROM "subject"."tag_group"	
		WHERE	
			"subject_id" = $1
		ORDER BY
			"index" ASC
	`
	tagGroupEntities := []constant.TagGroupEntity{}
	err := postgresRepository.Database.Select(&tagGroupEntities, tagGroupQuery, subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	tagQuery := `
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
		FROM "subject"."tag" t
		LEFT JOIN "user"."user" u
			ON "t"."updated_by" = "u"."id"
		WHERE
			"t"."tag_group_id" = $1
		ORDER BY "t"."id" 
	`

	tagGroupWithTagEntities := []constant.TagGroupWithTagsEntity{}
	for _, tagGroupEntity := range tagGroupEntities {
		tagGroupWithTagEntity := constant.TagGroupWithTagsEntity{}
		tagEntities := []constant.TagEntity{}
		err := postgresRepository.Database.Select(&tagEntities, tagQuery, tagGroupEntity.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		tagGroupWithTagEntity.TagGroupEntity = &tagGroupEntity
		tagGroupWithTagEntity.Tags = tagEntities
		tagGroupWithTagEntities = append(tagGroupWithTagEntities, tagGroupWithTagEntity)
	}

	return tagGroupWithTagEntities, nil
}
