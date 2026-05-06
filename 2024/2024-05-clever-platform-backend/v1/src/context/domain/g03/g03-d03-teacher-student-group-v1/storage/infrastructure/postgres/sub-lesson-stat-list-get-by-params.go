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

// SubLessonStatListGetByParams implements storageRepository.Repository.
func (p *postgresRepository) SubLessonStatListGetByParams(in constant.SubLessonStatFilter) ([]constant.SubLessonStatEntity, error) {
	var (
		args                = make([]any, 0, len(in.StudentIds)+3)
		studentIdArgHolders = make([]string, len(in.StudentIds))
	)

	args = []any{in.TeacherId, in.StudyGroupId, in.LessonId}
	for i, v := range in.StudentIds {
		args = append(args, v)
		studentIdArgHolders[i] = fmt.Sprintf("$%v", len(args))
	}
	studentIdArgs := strings.Join(studentIdArgHolders, ",")

	statStm, args := domainutil.GetStatStmByStudentIdAndLevelId(in.DateFilterBase, args)
	statStm = fmt.Sprintf(statStm, studentIdArgs)
	levelStm := fmt.Sprintf(`
		SELECT
			level.sub_lesson_id,
			COUNT(DISTINCT(level.id)) AS total_level,
            COUNT(CASE WHEN stat.score > 0 THEN 1 END) AS total_passed_level,
			SUM(stat.score) AS score,
			SUM(stat.total_attempt) AS total_attempt,
			MAX(last_played_at) as last_played_at,
			SUM(avg_time_used) as avg_time_used,
			MIN(level.index) as min_level_group,
			MAX(level.index) as max_level_group
		FROM level.level level
		LEFT JOIN (%s) stat ON stat.level_id = level.id
		GROUP BY level.sub_lesson_id
	`, statStm)

	stm := fmt.Sprintf(`
		SELECT
			sl.id,
			sl.index,
			sl.name,
			compose.total_level,
			compose.total_passed_level,
			compose.score,
			compose.total_attempt,
			compose.last_played_at,
			compose.avg_time_used,
			compose.min_level_group,
			compose.max_level_group

		FROM subject.sub_lesson sl
		INNER JOIN subject.lesson ls ON ls.id = sl.lesson_id
		INNER JOIN subject.subject s ON s.id = ls.subject_id
		INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
		INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
		INNER JOIN curriculum_group.curriculum_group cg ON cg.id = y.curriculum_group_id
		INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
		INNER JOIN class.class c ON c."year" = sy.short_name
		INNER JOIN (%s) compose ON compose.sub_lesson_id = sl.id
		INNER JOIN class.study_group stg ON stg.class_id = c.id AND stg.subject_id = s.id
		WHERE 
-- 		c.id IN (
-- 			SELECT ct.class_id
-- 			FROM school.class_teacher ct
-- 			WHERE ct.teacher_id = $1
-- 		)
		$1 = $1
		AND sl.lesson_id = $3 AND stg.id = $2
	`, levelStm)

	closingQuery := "ORDER BY sl.index, sl.name"
	queryBuilder := helper.NewQueryBuilder(stm, args...)

	if len(in.Search) != 0 {
		searchCols := []string{"sl.index", "sl.name"}
		queryBuilder.ApplySearch(searchCols, in.Search)
	}

	if in.AcademicYear != nil {
		queryBuilder.AddFilter("AND c.academic_year =", in.AcademicYear)
	}

	if in.SubLessonId != nil {
		queryBuilder.AddFilter("AND s.id =", in.SubLessonId)

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

	ents := []constant.SubLessonStatEntity{}
	if err := p.Database.Select(&ents, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return ents, nil

}
