package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SeedSubjectGroupUpdate(seedSubjectGroup *constant.SeedSubjectGroupEntity) error {
	baseQuery := `
		UPDATE "curriculum_group"."seed_subject_group" SET
`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if seedSubjectGroup.Name != "" {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, seedSubjectGroup.Name)
	}

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, seedSubjectGroup.Id)

	_, err := postgresRepository.Database.Exec(baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
