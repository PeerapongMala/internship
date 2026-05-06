package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TagCaseListBySubject(subjectId int) ([]constant.TagGroupEntity, error) {
	tagGroupQuery := `
		SELECT
			"id",
			"index",
			"name"
		FROM "subject"."tag_group" tg
		WHERE
			"tg"."subject_id" = $1
	`
	tagGroupEntities := []constant.TagGroupEntity{}
	err := postgresRepository.Database.Select(&tagGroupEntities, tagGroupQuery, subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	tagQuery := `
		SELECT
			"id",
			"name"	
		FROM "subject"."tag" t
		WHERE
			"t"."tag_group_id" = $1
			AND
			"t"."status" = $2
	`
	for i, tagGroupEntity := range tagGroupEntities {
		tagEntities := []constant.TagEntity{}
		err := postgresRepository.Database.Select(&tagEntities, tagQuery, tagGroupEntity.Id, constant.Enabled)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		tagGroupEntities[i].Tags = tagEntities
	}

	return tagGroupEntities, nil
}
