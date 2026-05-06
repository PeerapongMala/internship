package postgres

import (
	"fmt"
	academicLevelConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (p *postgresRepository) GetTTestPairModelStatListByParams(studentIds []string, in *constant.GetTTestPairModelStatListAndCsvParams) ([]constant.TTestPairModelStatEntity, error) {
	if len(studentIds) == 0 {
		return nil, nil
	}

	prePlayLogCteWhere := ""
	prePlayLogCteWhere = concatMatchSql(prePlayLogCteWhere, "ll.level_type", academicLevelConstant.PrePostTest)
	prePlayLogCteWhere = concatMatchInListSql(prePlayLogCteWhere, "llpl.student_id", studentIds)

	if in != nil {
		prePlayLogCteWhere = concatMatchSqlInt(prePlayLogCteWhere, "sl.id", in.LessonId)
		prePlayLogCteWhere = concatMatchSqlInt(prePlayLogCteWhere, "ssl.id", in.SubLessonId)
		prePlayLogCteWhere = concatGreaterThanEqualDatetime(prePlayLogCteWhere, "llpl.played_at", in.StartDate)
		prePlayLogCteWhere = concatLessThanDatetime(prePlayLogCteWhere, "llpl.played_at", in.EndDate)
	}

	postPlayLogCteWhere := ""
	postPlayLogCteWhere = concatMatchSql(postPlayLogCteWhere, "ll.level_type", academicLevelConstant.SubLessonPostTest)
	postPlayLogCteWhere = concatMatchInListSql(postPlayLogCteWhere, "llpl.student_id", studentIds)

	if in != nil {
		postPlayLogCteWhere = concatMatchSqlInt(postPlayLogCteWhere, "sl.id", in.LessonId)
		postPlayLogCteWhere = concatMatchSqlInt(postPlayLogCteWhere, "ssl.id", in.SubLessonId)
		postPlayLogCteWhere = concatGreaterThanEqualDatetime(postPlayLogCteWhere, "llpl.played_at", in.StartDate)
		postPlayLogCteWhere = concatLessThanDatetime(postPlayLogCteWhere, "llpl.played_at", in.EndDate)
	}

	tempQuery := ""
	if in != nil && in.Search != nil {
		searchCols := []string{"uu.first_name", "uu.last_name"}
		tempQuery = concatContainSqlOr(tempQuery, searchCols, *in.Search)
	}

	studentIdsValues := ""
	for i, id := range studentIds {
		if i > 0 {
			studentIdsValues += ", "
		}
		studentIdsValues += fmt.Sprintf("('%s')", id)
	}

	query := fmt.Sprintf(`
		WITH subject AS (
			SELECT "subject_id"
			FROM "class"."study_group" sg
			WHERE sg.id = $1
		),
		student_ids_cte AS (
			SELECT id AS student_id FROM (VALUES %s) AS s(id)
       	),
		cte as (
			WITH pre_play_log_cte as (
				SELECT
					llpl.student_id,
					llpl.star,
					ROW_NUMBER() OVER (PARTITION BY llpl.student_id ORDER BY llpl.star ASC) AS rn_asc,
					ROW_NUMBER() OVER (PARTITION BY llpl.student_id ORDER BY llpl.star DESC) AS rn_desc
				FROM level.level_play_log llpl
					LEFT JOIN level.level ll ON ll.id = llpl.level_id
					LEFT JOIN subject.sub_lesson ssl ON ssl.id = ll.sub_lesson_id
					LEFT JOIN subject.lesson sl ON sl.id = ssl.lesson_id
					INNER JOIN "subject" s ON "s"."subject_id" = "sl"."subject_id"
				%s
			),
			post_play_log_cte as (
				SELECT
					llpl.student_id,
					llpl.star,
					ROW_NUMBER() OVER (PARTITION BY llpl.student_id ORDER BY llpl.star ASC) AS rn_asc,
					ROW_NUMBER() OVER (PARTITION BY llpl.student_id ORDER BY llpl.star DESC) AS rn_desc
				FROM level.level_play_log llpl
					LEFT JOIN level.level ll ON ll.id = llpl.level_id
					LEFT JOIN subject.sub_lesson ssl ON ssl.id = ll.sub_lesson_id
					LEFT JOIN subject.lesson sl ON sl.id = ssl.lesson_id
					INNER JOIN "subject" s ON "s"."subject_id" = "sl"."subject_id"
				%s
			)
			SELECT
				sid.student_id,
				MAX(CASE WHEN pl.rn_desc = 1 THEN pl.star END) AS pre_test_score,
				MAX(CASE WHEN pl2.rn_desc = 1 THEN pl2.star END) AS post_test_score
			FROM 
            	student_ids_cte sid
          	LEFT JOIN pre_play_log_cte pl ON sid.student_id = pl.student_id
			LEFT JOIN post_play_log_cte pl2 ON sid.student_id = pl2.student_id
          	GROUP BY sid.student_id
		)
		SELECT 
			   CONCAT(uu.first_name, ' ', uu.last_name) AS student_fullname,
				uu.first_name AS "student_first_name",
				uu.last_name AS "student_last_name",
			   cte.pre_test_score,
			   cte.post_test_score
		FROM cte
		LEFT JOIN "user"."user" uu on uu.id = cte.student_id
		%s
		ORDER BY cte.student_id
	`, studentIdsValues, prePlayLogCteWhere, postPlayLogCteWhere, tempQuery)

	ents := make([]constant.TTestPairModelStatEntity, 0)
	if err := p.Database.Select(&ents, query, in.StudyGroupId); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return ents, nil
}
