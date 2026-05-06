package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresTeacherChatRepository *postgresTeacherChatRepository) ClassListStudent(classId, academicYear int, searchText string, pagination *helper.Pagination) ([]constant.Member, error) {
	query := `
		SELECT
		    u.id,
			u.title,
			u.first_name,
			u.last_name,
			u.image_url
		FROM	
		    "school"."class_student" ct
		INNER JOIN "user"."user" u ON "ct"."student_id" = u.id
		INNER JOIN "class"."class" c ON "ct"."class_id" = c.id
		WHERE ct.class_id = $1
	`
	args := []interface{}{classId}
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
