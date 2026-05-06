package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
	domainutil "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/util"

	"github.com/pkg/errors"
)

// LevelStatListGetByParams implements storageRepository.Repository.
func (p *postgresRepository) LevelStatListGetByParams(in constant.LevelStatFilter) ([]constant.LevelStatEntity, error) {
	var (
		args                = make([]any, 0, len(in.StudentIds)+3)
		studentIdArgHolders = make([]string, len(in.StudentIds))
		whereClauses        = []string{
			//"c.id IN (SELECT ct.class_id FROM school.class_teacher ct WHERE ct.teacher_id = $1)",
			"$1 = $1",
			"stg.id = $2",
			"level.sub_lesson_id = $3",
		}
	)

	args = []any{in.TeacherId, in.StudyGroupId, in.SubLessonId}
	for i, v := range in.StudentIds {
		args = append(args, v)
		studentIdArgHolders[i] = fmt.Sprintf("$%v", len(args))
	}
	studentIdArgs := strings.Join(studentIdArgHolders, ",")

	statStm, args := domainutil.GetStatStmByStudentIdAndLevelId(in.DateFilterBase, args)
	statStm = fmt.Sprintf(statStm, studentIdArgs)
	levelStm := fmt.Sprintf(`
		SELECT
			level.id AS level_id,
			COUNT(DISTINCT(stat.student_id)) AS user_play_count,
			SUM(stat.score) AS score,
			SUM(stat.total_attempt) AS total_attempt,
			MAX(last_played_at) as last_played_at,
			SUM(avg_time_used) as avg_time_used
		FROM level.level level
		LEFT JOIN (%s) stat ON stat.level_id = level.id
		WHERE level.sub_lesson_id = $3
		GROUP BY level.id
	`, statStm)

	if in.AcademicYear != nil {
		whereClauses = append(whereClauses, fmt.Sprintf("c.academic_year = $%d", len(args)+1))
		args = append(args, *in.AcademicYear)
	}
	if in.Difficulty != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("level.difficulty = $%d", len(args)+1))
		args = append(args, in.Difficulty)
	}
	if in.LevelType != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("level.level_type = $%d", len(args)+1))
		args = append(args, in.LevelType)
	}
	if in.Search != "" {
		searchClause := `
			(
				CAST(level.index AS TEXT) ILIKE $%d OR 
				level.question_type ILIKE $%d OR 
				level.level_type ILIKE $%d OR 
				level.difficulty ILIKE $%d
			)
		`
		searchParam := "%" + in.Search + "%"
		whereClauses = append(whereClauses, fmt.Sprintf(searchClause, len(args)+1, len(args)+2, len(args)+3, len(args)+4))
		args = append(args, searchParam, searchParam, searchParam, searchParam)
	}

	whereSQL := strings.Join(whereClauses, " AND ")

	dataQuery := fmt.Sprintf(`
		SELECT
			level.id,
			level.index,
			level.level_type,
			level.question_type,
			level.difficulty,
			compose.score,
			compose.user_play_count,
			compose.total_attempt,
			compose.last_played_at,
			compose.avg_time_used
		FROM level.level level
		INNER JOIN subject.sub_lesson sl ON sl.id = level.sub_lesson_id
		INNER JOIN subject.lesson ls ON ls.id = sl.lesson_id
		INNER JOIN subject.subject s ON s.id = ls.subject_id
		INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
		INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
		INNER JOIN curriculum_group.curriculum_group cg ON cg.id = y.curriculum_group_id
		INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
		INNER JOIN class.class c ON c."year" = sy.short_name
		INNER JOIN (%s) compose ON compose.level_id = level.id
		INNER JOIN class.study_group stg ON stg.class_id = c.id AND stg.subject_id = s.id
		WHERE %s
		ORDER BY level.index ASC
	`, levelStm, whereSQL)

	if in.Pagination != nil {
		offset := (in.Pagination.Page - 1) * in.Pagination.LimitResponse
		dataQuery += fmt.Sprintf(" LIMIT %d OFFSET %d", in.Pagination.LimitResponse, offset)
	}

	// Pagination
	if in.Pagination != nil {
		countArgs := []any{in.TeacherId, in.StudyGroupId, in.SubLessonId}
		countWhereClauses := []string{
			//"c.id IN (SELECT ct.class_id FROM school.class_teacher ct WHERE ct.teacher_id = $1)",
			"$1 = $1",
			"stg.id = $2",
			"level.sub_lesson_id = $3",
		}

		argIdx := 4 // start from next index

		if in.AcademicYear != nil {
			countWhereClauses = append(countWhereClauses, fmt.Sprintf("c.academic_year = $%d", argIdx))
			countArgs = append(countArgs, *in.AcademicYear)
			argIdx++
		}
		if in.Difficulty != "" {
			countWhereClauses = append(countWhereClauses, fmt.Sprintf("level.difficulty = $%d", argIdx))
			countArgs = append(countArgs, in.Difficulty)
			argIdx++
		}
		if in.LevelType != "" {
			countWhereClauses = append(countWhereClauses, fmt.Sprintf("level.level_type = $%d", argIdx))
			countArgs = append(countArgs, in.LevelType)
			argIdx++
		}
		if in.Search != "" {
			searchClause := `
				(
					CAST(level.index AS TEXT) ILIKE $%d OR 
					level.question_type ILIKE $%d OR 
					level.level_type ILIKE $%d OR 
					level.difficulty ILIKE $%d
				)
			`
			countWhereClauses = append(countWhereClauses, fmt.Sprintf(searchClause, argIdx, argIdx+1, argIdx+2, argIdx+3))
			searchParam := "%" + in.Search + "%"
			countArgs = append(countArgs, searchParam, searchParam, searchParam, searchParam)
		}

		countWhereSQL := strings.Join(countWhereClauses, " AND ")

		countQuery := fmt.Sprintf(`
			SELECT COUNT(*)
			FROM level.level level
			INNER JOIN subject.sub_lesson sl ON sl.id = level.sub_lesson_id
			INNER JOIN subject.lesson ls ON ls.id = sl.lesson_id
			INNER JOIN subject.subject s ON s.id = ls.subject_id
			INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
			INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
			INNER JOIN curriculum_group.curriculum_group cg ON cg.id = y.curriculum_group_id
			INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
			INNER JOIN class.class c ON c."year" = sy.short_name
			INNER JOIN class.study_group stg ON stg.class_id = c.id AND stg.subject_id = s.id
			WHERE %s
		`, countWhereSQL)

		var total int
		if err := p.Database.Get(&total, countQuery, countArgs...); err != nil {
			log.Printf("count error: %+v", errors.WithStack(err))
			return nil, err
		}
		in.Pagination.TotalCount = total
	}

	ents := []constant.LevelStatEntity{}
	if err := p.Database.Select(&ents, dataQuery, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return ents, nil
}
