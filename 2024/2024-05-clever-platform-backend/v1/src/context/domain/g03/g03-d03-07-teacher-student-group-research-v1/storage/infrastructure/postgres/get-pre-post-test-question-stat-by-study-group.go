package postgres

import (
	"encoding/json"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (p *postgresRepository) GetQuestionStatByLevelIDAndStudentIds(levelID int, studentIds []string, searchStr *string) ([]constant.StudentQuestionStatEntity, error) {

	whereQuery := ""
	whereQuery = concatMatchSqlInt(whereQuery, "ll.id", levelID)
	whereQuery = concatMatchInListSql(whereQuery, "llpl.student_id", studentIds)

	tempQuery := ""
	if searchStr != nil {
		tempQuery = concatContainSqlOr(tempQuery, []string{"cte.student_id", "cte.student_title", "cte.student_firstname", "cte.student_lastname"}, *searchStr)
	}

	studentIdsValues := ""
	for i, id := range studentIds {
		if i > 0 {
			studentIdsValues += ", "
		}
		studentIdsValues += fmt.Sprintf("('%s')", id)
	}

	query := fmt.Sprintf(`
		WITH student_ids_cte AS (
			SELECT id AS student_id FROM (VALUES %s) AS s(id)
		),
		ranked_logs AS (
			SELECT
				llpl.id AS level_play_log_id,
				llpl.student_id,
				RANK() OVER (
					PARTITION BY llpl.student_id
					ORDER BY llpl.star DESC, llpl.id DESC
					) AS rnk
			FROM level.level_play_log llpl
					 JOIN level.level ll ON ll.id = llpl.level_id
			%s
		 ),
		 filtered_logs AS (
			 SELECT
				 level_play_log_id,
				 student_id
			 FROM ranked_logs
			 WHERE rnk = 1
		 ),
		 question_scores AS (
			 SELECT
				 fl.student_id,
				 json_agg(
						 json_build_object(
								 'question_index', q.index,
								 'score', CASE WHEN qpl.is_correct THEN 1 ELSE 0 END
						 )
						 ORDER BY q.index
				 ) AS questions,
				 SUM(CASE WHEN qpl.is_correct THEN 1 ELSE 0 END) AS total_score
			 FROM filtered_logs fl
             JOIN level.level_play_log llpl ON llpl.id = fl.level_play_log_id
			 JOIN question.question q ON q.level_id = llpl.level_id
             LEFT JOIN question.question_play_log qpl ON qpl.level_play_log_id = llpl.id AND qpl.question_id = q.id
			 GROUP BY fl.student_id
		 ),
		cte as (
			SELECT
				sid.student_id,
				qs.questions,
				COALESCE(qs.total_score, 0) as score_sum,
				uu.title as student_title,
				uu.first_name as student_firstname,
				uu.last_name as student_lastname
			FROM 
				student_ids_cte sid
			LEFT JOIN question_scores qs ON sid.student_id = qs.student_id
			LEFT JOIN "user"."user" uu ON uu.id = sid.student_id 
		)
		SELECT
		COALESCE(jsonb_agg(cte.*), '[]') 
		FROM cte
		%s
	`, studentIdsValues, whereQuery, tempQuery)

	var jsonData []byte

	// Scan JSON result into a byte slice
	if err := p.Database.QueryRowx(query).Scan(&jsonData); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	// Unmarshal JSON into entity slice
	var entity []constant.StudentQuestionStatEntity
	if err := json.Unmarshal(jsonData, &entity); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entity, nil
}
