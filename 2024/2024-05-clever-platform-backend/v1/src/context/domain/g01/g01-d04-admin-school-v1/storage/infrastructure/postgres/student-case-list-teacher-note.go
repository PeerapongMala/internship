package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseListTeacherNote(userId string, filter *constant.TeacherNoteFilter, pagination *helper.Pagination) ([]constant.TeacherNoteEntity, error) {
	query := `
		SELECT
			CONCAT_WS(' ', "u"."title", "u"."first_name", "u"."last_name") AS "teacher",
			"u"."image_url",
			"tn"."academic_year",
			"tn"."created_at",
			"sy"."short_name" AS "year",	
			"s"."name" AS "subject",
			"ls"."name" AS "lesson",
			"ls"."index" AS "lesson_index",
			"sl"."name" AS "sub_lesson",
			"sl"."index" AS "sub_lesson_index",
			"l"."index" AS "level_index",
			"tn"."text" AS "text"
		FROM
			"level"."teacher_note" tn
		LEFT JOIN
			"user"."user" u ON "tn"."teacher_id" = "u"."id"
		LEFT JOIN
			"user"."student" st ON "tn"."student_id" = "st"."user_id"
		LEFT JOIN
			"level"."level" l ON "tn"."level_id" = "l"."id"
		LEFT JOIN
			"subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN
			"subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN
			"subject"."subject" s ON "ls"."subject_id" = "s"."id"
		LEFT JOIN
			"curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN
			"curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		LEFT JOIN
			"curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
		WHERE
			"tn"."student_id" = $1
	`
	args := []interface{}{userId}
	argsIndex := 2

	if filter.StartDate != "" {
		query += fmt.Sprintf(` AND "tn"."created_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != "" {
		query += fmt.Sprintf(` AND "tn"."created_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}
	if filter.AcademicYear != 0 {
		query += fmt.Sprintf(` AND "tn"."academic_year" = $%d`, argsIndex)
		args = append(args, filter.AcademicYear)
		argsIndex++
	}
	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "y"."curriculum_group_id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	if filter.SubjectId != 0 {
		query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
		args = append(args, filter.SubjectId)
		argsIndex++
	}
	if filter.LessonId != 0 {
		query += fmt.Sprintf(` AND "ls"."id" = $%d`, argsIndex)
		args = append(args, filter.LessonId)
		argsIndex++
	}
	if filter.SubLessonId != 0 {
		query += fmt.Sprintf(` AND "sl"."id" = $%d`, argsIndex)
		args = append(args, filter.SubLessonId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	args = append(args, pagination.Offset, pagination.Limit)

	teacherNoteEntities := []constant.TeacherNoteEntity{}
	err := postgresRepository.Database.Select(&teacherNoteEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teacherNoteEntities, nil
}
