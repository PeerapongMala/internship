package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"

func (postgresRepository *postgresRepository) GetSubLessonsFromLessonIds(lessonIds []int) (entities []constant.SubLessonEntity, err error) {
	query := `
		SELECT
			sl.*
		FROM
			subject.sub_lesson AS sl
				LEFT JOIN subject.lesson AS l ON sl.lesson_id = l.id
		WHERE
			l.id = ANY($1)
	`
	args := []interface{}{lessonIds}
	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	entities = []constant.SubLessonEntity{}
	for rows.Next() {
		item := constant.SubLessonEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
