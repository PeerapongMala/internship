package postgres

import (
	"encoding/json"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (p *postgresRepository) GetSubLessonByLessonId(lessonId int) ([]constant.SubLessonParamsEntity, error) {

	query := fmt.Sprintf(`
		select 
		    COALESCE(jsonb_agg(cte.*), '[]') 
		from (
		    select 
				ssl.id,
				ssl.index,
				ssl.name as label,
				ssl.status
			from  subject.sub_lesson ssl
				left join subject.lesson sl on sl.id = ssl.lesson_id
			WHERE
				sl.id = $1
		) as cte
	`)

	var jsonData []byte

	// Scan JSON result into a byte slice
	if err := p.Database.QueryRowx(query, lessonId).Scan(&jsonData); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	// Unmarshal JSON into entity slice
	var entity []constant.SubLessonParamsEntity
	if err := json.Unmarshal(jsonData, &entity); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entity, nil
}
