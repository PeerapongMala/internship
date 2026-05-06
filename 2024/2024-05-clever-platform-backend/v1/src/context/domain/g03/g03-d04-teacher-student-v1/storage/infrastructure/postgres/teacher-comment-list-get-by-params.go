package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) TeacherCommentListGetByParams(in constant.TeacherCommentFilter) ([]constant.TeacherCommentEntity, error) {

	stm := `
		WITH user_subquery AS (
		SELECT
			u.id,
			u.first_name,
			u.last_name,
			u.first_name || ' ' || u.last_name AS fullname,
			u.image_url
		FROM "user".user AS u
	)

		SELECT
			comment.id,
			comment.teacher_id,
			u.fullname AS teacher,
			COALESCE(u.image_url, '') AS "image_url",
			comment.academic_year,
			comment.created_at,
			sy.short_name AS year,
			s.name AS subject_name,
			l.name AS lesson_name,
			l.index AS lesson_index,
			sl.name AS sub_lesson_name,
			sl.index AS sub_lesson_index,
			lvl.index AS level_index,
			comment.text

		FROM level.teacher_note AS comment
		INNER JOIN user_subquery AS u ON u.id = comment.teacher_id
		INNER JOIN level.level AS lvl ON lvl.id = comment.level_id
		INNER JOIN subject.sub_lesson sl ON sl.id = lvl.sub_lesson_id
		INNER JOIN subject.lesson l ON l.id = sl.lesson_id
		INNER JOIN subject.subject s ON s.id = l.subject_id
		INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
		INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
		INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
		WHERE
			comment.student_id = $1 AND
			comment.academic_year = $2

	`

	queryBuilder := helper.NewQueryBuilder(stm, in.Student.UserId, in.AcademicYear)

	if len(in.Search) != 0 {
		searchCols := []string{
			"u.first_name",
			"u.last_name",
			"u.fullname",
			"comment.text",
			"comment.academic_year",
			"lvl.index",
			"sl.name",
			"l.name",
			"s.name",
			"sy.short_name",
		}
		queryBuilder.ApplySearch(searchCols, in.Search)
	}

	if in.StartDate != nil {
		queryBuilder.AddFilter("AND comment.updated_at >=", in.StartDate)

	}

	if in.EndDate != nil {
		queryBuilder.AddFilter("AND comment.updated_at <=", in.EndDate)

	}

	if in.CurriculumGroupId != 0 {
		queryBuilder.AddFilter("AND y.curriculum_group_id =", in.CurriculumGroupId)
	}

	if in.SubjectId != 0 {
		queryBuilder.AddFilter("AND s.id =", in.SubjectId)
	}

	if in.LessonId != 0 {
		queryBuilder.AddFilter("AND l.id =", in.LessonId)
	}

	if in.SubLessonId != 0 {
		queryBuilder.AddFilter("AND sl.id =", in.SubLessonId)
	}

	closingQuery := "ORDER BY comment.updated_at DESC"

	queryBuilder.AddClosingQuery(closingQuery)
	query, args := queryBuilder.Build()

	var data []constant.TeacherCommentEntity
	if err := postgresRepository.Database.Select(&data, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return data, nil
}
