package postgres

import (
	"encoding/json"
	"fmt"
	levelConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (p *postgresRepository) GetLevelsBySubLessonId(subLessonId int) ([]constant.LevelParamsEntity, error) {

	query := fmt.Sprintf(`
		select 
		    COALESCE(jsonb_agg(cte.*), '[]') 
		from (
			select 
				ll.id, 
				ll.index,
				ll.question_type,
				ll.level_type,
				ll.status
			from  level.level ll
			WHERE
				ll.sub_lesson_id = $1 AND
				(ll.level_type = $2 OR ll.level_type = $3)
		) as cte
	`)

	var jsonData []byte

	// Scan JSON result into a byte slice
	if err := p.Database.QueryRowx(query, subLessonId, levelConstant.PrePostTest, levelConstant.SubLessonPostTest).Scan(&jsonData); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	// Unmarshal JSON into entity slice
	var entity []constant.LevelParamsEntity
	if err := json.Unmarshal(jsonData, &entity); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entity, nil
}
