package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
)

func (postgres postgresRepository) LessonMonsterCreate(lessonID int, monsters []constant.MonsterCreateItem) error {
	if len(monsters) == 0 {
		return nil
	}

	query := `
	INSERT INTO subject.lesson_monster_image 
	(image_path, lesson_id, level_type) 
	VALUES `
	values := []string{}
	args := []interface{}{}
	argIndex := 1

	for _, monster := range monsters {
		values = append(values, fmt.Sprintf("($%d, $%d, $%d)", argIndex, argIndex+1, argIndex+2))
		args = append(args, monster.ImagePath, lessonID, monster.LevelType)
		argIndex += 3
	}

	query += strings.Join(values, ",")
	_, err := postgres.Database.Exec(query, args...)
	if err != nil {
		return err
	}

	return nil
}
