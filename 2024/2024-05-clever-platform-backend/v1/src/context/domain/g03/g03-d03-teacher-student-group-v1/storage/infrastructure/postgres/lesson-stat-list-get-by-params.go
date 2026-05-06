package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
	domainutil "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/util"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

// LessonStatListGetByParams implements storageRepository.Repository.
func (p *postgresRepository) LessonStatListGetByParams(in constant.LessonStatFilter) ([]constant.LessonStatEntity, error) {
	var (
		args                = make([]any, 0, len(in.StudentIds)+2)
		studentIdArgHolders = make([]string, len(in.StudentIds))
	)
	args = []any{in.TeacherId, in.StudyGroupId}
	for i, v := range in.StudentIds {
		args = append(args, v)
		studentIdArgHolders[i] = fmt.Sprintf("$%v", len(args))
	}
	studentIdArgs := strings.Join(studentIdArgHolders, ",")

	statStm, args := domainutil.GetStatStmByStudentIdAndLevelId(in.DateFilterBase, args)
	statStm = fmt.Sprintf(statStm, studentIdArgs)
	levelStm := fmt.Sprintf(`
		SELECT
			sl.lesson_id,
			COUNT(DISTINCT(level.id)) AS total_level,
            COUNT(CASE WHEN stat.score > 0 THEN 1 END) AS total_passed_level,
			SUM(stat.score) AS score,
			SUM(stat.total_attempt) AS total_attempt,
			MAX(last_played_at) as last_played_at,
			SUM(avg_time_used) as avg_time_used
		FROM level.level level
		INNER JOIN subject.sub_lesson sl ON sl.id = level.sub_lesson_id
		LEFT JOIN (%s) stat ON stat.level_id = level.id
		GROUP BY sl.lesson_id
	`, statStm)

	stm := fmt.Sprintf(`
		SELECT
			cg.short_name AS curriculum_group_short_name,
			s.name AS subject_name,
			ls.id AS lesson_id,
			ls.index AS lesson_index,
			ls.name AS lesson_name,
			compose.total_level,
			compose.total_passed_level,
			compose.score,
			compose.total_attempt,
			compose.last_played_at,
			compose.avg_time_used

		FROM subject.lesson ls
		INNER JOIN subject.subject s ON s.id = ls.subject_id
		INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
		INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
		INNER JOIN curriculum_group.curriculum_group cg ON cg.id = y.curriculum_group_id
		INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
		INNER JOIN class.class c ON c."year" = sy.short_name
		INNER JOIN (%s) compose ON compose.lesson_id = ls.id
		INNER JOIN class.study_group stg ON stg.class_id = c.id AND stg.subject_id = s.id
		WHERE stg.id = $2 AND $1 = $1
-- 		AND c.id IN (
-- 			SELECT ct.class_id
-- 			FROM school.class_teacher ct
-- 			WHERE ct.teacher_id = $1
-- 		)
	`, levelStm)

	closingQuery := "ORDER BY curriculum_group_short_name, subject_name, ls.index"
	queryBuilder := helper.NewQueryBuilder(stm, args...)

	if len(in.Search) != 0 {
		searchCols := []string{"cg.short_name", "s.name", "ls.index", "ls.name"}
		queryBuilder.ApplySearch(searchCols, in.Search)
	}

	if in.AcademicYear != nil {
		queryBuilder.AddFilter("AND c.academic_year =", in.AcademicYear)
	}

	if in.SubjectId != nil {
		queryBuilder.AddFilter("AND s.id =", in.SubjectId)

	}

	if in.LessonId != nil {
		queryBuilder.AddFilter("AND ls.id =", in.LessonId)

	}

	queryBuilder.AddClosingQuery(closingQuery)
	if in.Pagination != nil {
		countQuery, countArgs := queryBuilder.GetTotalCountQueryBuild()
		if err := p.Database.QueryRowx(countQuery, countArgs...).Scan(&in.Pagination.TotalCount); err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	query, args := queryBuilder.Build()
	if in.Pagination != nil && in.Pagination.Limit.Valid {
		limit := in.Pagination.Limit.Int64
		offset := in.Pagination.Offset
		if offset < 0 {
			offset = 0
		}
		query += fmt.Sprintf(` LIMIT %d OFFSET %d`, limit, offset)
	}

	ents := []constant.LessonStatEntity{}
	if err := p.Database.Select(&ents, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return ents, nil

}
