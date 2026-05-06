package postgres

import (
	"fmt"
	"strings"
)

func (postgres postgresRepository) LessonMonsterDeleteByIDs(monsterIDs []int) error {
	if len(monsterIDs) == 0 {
		return nil
	}

	query := `DELETE FROM subject.lesson_monster_image WHERE id IN (`
	placeholders := []string{}
	args := []interface{}{}

	for i, id := range monsterIDs {
		placeholders = append(placeholders, fmt.Sprintf("$%d", i+1))
		args = append(args, id)
	}

	query += strings.Join(placeholders, ",") + ")"

	_, err := postgres.Database.Exec(query, args...)
	if err != nil {
		return err
	}

	return nil
}
