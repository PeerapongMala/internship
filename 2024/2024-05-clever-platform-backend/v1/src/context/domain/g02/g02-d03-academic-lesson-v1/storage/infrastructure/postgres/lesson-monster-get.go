package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgres postgresRepository) LessonMonsterGet(lessonID int, levelType string, pagination *helper.Pagination) ([]constant.LessonMonsterImageEntity, error) {
	query := `
		SELECT 
			monster.id,
			monster.image_path,
			monster.lesson_id,
			monster.level_type
		FROM subject.lesson_monster_image monster
		WHERE monster.lesson_id = $1`

	args := []interface{}{lessonID}
	argsIndex := 2

	if levelType != "" {
		query += fmt.Sprintf(" AND monster.level_type = $%d", argsIndex)
		args = append(args, levelType)
		argsIndex++
	}

	if pagination != nil {
		query += fmt.Sprintf(" ORDER BY monster.id LIMIT $%d OFFSET $%d", argsIndex, argsIndex+1)
		args = append(args, pagination.Limit, pagination.Offset)
	}

	results := make([]constant.LessonMonsterImageEntity, 0)
	err := postgres.Database.Select(&results, query, args...)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func (postgres postgresRepository) LessonMonsterGetCount(lessonID int, levelType string) (int, error) {
	query := `
		SELECT COUNT(*)
		FROM subject.lesson_monster_image
		WHERE lesson_id = $1`

	args := []interface{}{lessonID}
	argsIndex := 2

	if levelType != "" {
		query += fmt.Sprintf(" AND level_type = $%d", argsIndex)
		args = append(args, levelType)
		argsIndex++
	}

	var count int
	err := postgres.Database.Get(&count, query, args...)
	if err != nil {
		return 0, err
	}

	return count, nil
}
