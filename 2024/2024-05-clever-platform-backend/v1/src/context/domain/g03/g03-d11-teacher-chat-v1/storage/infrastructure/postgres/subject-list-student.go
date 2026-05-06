package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresTeacherChatRepository *postgresTeacherChatRepository) SubjectListStudent(subjectId, academicYear int, schoolId int, searchText string, pagination *helper.Pagination) ([]constant.Member, error) {
	query := `
		SELECT
			u.id,
			u.title,
			u.first_name,
			u.last_name,
			u.image_url
		FROM
		    "subject"."subject" s
		INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"	
		INNER JOIN "class"."class" c ON "c"."year" = "sy"."short_name"
		INNER JOIN "school"."class_student" cs ON "cs"."class_id" = "c"."id"
		INNER JOIN "user"."user" u ON "cs"."student_id" = "u"."id"
		WHERE
			"s"."id" = $1
			AND "c"."school_id" = $2
	`
	args := []interface{}{subjectId, schoolId}
	argsIndex := len(args) + 1

	if academicYear != 0 {
		query += fmt.Sprintf(` AND "c"."academic_year" = $%d`, argsIndex)
		args = append(args, academicYear)
		argsIndex++
	}
	if searchText != "" {
		query += fmt.Sprintf(` AND (u.first_name ILIKE $%d OR u.last_name ILIKE $%d)`, argsIndex, argsIndex+1)
		args = append(args, "%"+searchText+"%", "%"+searchText+"%")
		argsIndex += 2
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresTeacherChatRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "u"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	members := []constant.Member{}
	err := postgresTeacherChatRepository.Database.Select(&members, query, args...)
	if err != nil {
		return nil, err
	}

	return members, nil
}
