package postgres

import (
	"encoding/json"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (p *postgresRepository) GetStudentStatByStudentIds(levelID int, studentIds []string) ([]constant.PrePostTestStudentByStudentStatEntity, error) {

	whereQuery := ""
	whereQuery = concatMatchSqlInt(whereQuery, "ll.id", levelID)
	whereQuery = concatMatchInListSql(whereQuery, "llpl.student_id", studentIds)

	query := fmt.Sprintf(`
		SELECT
		COALESCE(jsonb_agg(cte.*), '[]') 
		FROM (
			SELECT
				ranked.student_id,
				ranked.id,
				ranked.star
			FROM (
					 SELECT
						 llpl.id,
						 llpl.student_id,
						 llpl.star,
						 RANK() OVER (
							 PARTITION BY llpl.student_id
							 ORDER BY llpl.star DESC, llpl.id DESC
							 ) AS rnk
					 FROM level.level_play_log llpl
							  INNER JOIN level.level ll ON ll.id = llpl.level_id
					 %s
				 ) ranked
			WHERE ranked.rnk = 1
			ORDER BY ranked.star DESC
		) as cte
	`, whereQuery)

	var jsonData []byte

	// Scan JSON result into a byte slice
	if err := p.Database.QueryRowx(query).Scan(&jsonData); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	// Unmarshal JSON into entity slice
	var entity []constant.PrePostTestStudentByStudentStatEntity
	if err := json.Unmarshal(jsonData, &entity); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entity, nil
}
