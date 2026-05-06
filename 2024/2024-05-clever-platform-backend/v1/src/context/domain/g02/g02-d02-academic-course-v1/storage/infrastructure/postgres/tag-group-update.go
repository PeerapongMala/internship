package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TagGroupUpdate(tagGroup *constant.TagGroupEntity) (*constant.TagGroupEntity, error) {
	baseQuery := `
		UPDATE "subject"."tag_group" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if tagGroup.Name != "" {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, tagGroup.Name)
	}

	tagGroupEntity := constant.TagGroupEntity{}
	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, tagGroup.Id)

		err := postgresRepository.Database.QueryRowx(
			baseQuery,
			args...,
		).StructScan(&tagGroupEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	} else {
		baseQuery = `
			SELECT
				*
			FROM "subject"."tag_group"
			WHERE
				"id" = $1	
		`
		err := postgresRepository.Database.QueryRowx(baseQuery, tagGroup.Id).StructScan(&tagGroupEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &tagGroupEntity, nil
}
