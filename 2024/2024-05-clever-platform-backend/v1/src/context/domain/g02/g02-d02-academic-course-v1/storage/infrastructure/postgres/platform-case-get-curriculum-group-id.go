package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) PlatformCaseGetCurriculumGroupId(platformId int) (*int, error) {
	query := `
		SELECT
			"p"."curriculum_group_id"
		FROM
			"curriculum_group"."platform" p
		WHERE
			"p"."id" = $1
	`
	var curriculumGroupId int
	err := postgresRepository.Database.QueryRowx(
		query,
		platformId,
	).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &curriculumGroupId, nil
}
