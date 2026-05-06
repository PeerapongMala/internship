package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-02-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetStudentGroupMembersByStudentGroupID(
	studyGroup constant.StudyGroup,
	option *constant.GetStudentGroupMembersSearchOption,
	pagination *helper.Pagination,
) ([]constant.StudentGroupMember, error) {
	query := `
		SELECT
			"c"."academic_year",
			"c"."year",
			"c"."name" AS "room",
			"cs"."student_id" AS "student_user_uuid",
			"st"."student_id" AS "student_id",
			"u"."title",
			"u"."first_name",
			"u"."last_name",
			"u"."last_login" AS "latest_login_at",
			CASE WHEN "sgs"."study_group_id" IS NOT NULL THEN true ELSE false END AS is_member
		FROM 
			"class"."study_group" sg
			INNER JOIN "class"."class" c ON "sg"."class_id" = "c"."id"
			LEFT JOIN "school"."class_student" cs ON "sg"."class_id" = "cs"."class_id"
			LEFT JOIN "user"."user" u ON "cs"."student_id" = "u"."id"
			LEFT JOIN "user"."student" st ON "u"."id" = "st"."user_id"
			LEFT JOIN "class"."study_group_student" sgs ON "cs"."student_id" = "sgs"."student_id" AND "sgs"."study_group_id" = $1
		WHERE 
			"sg"."id" = $1
	`
	args := []interface{}{studyGroup.Id}
	argsIndex := len(args) + 1

	if option.Search != "" {
		query += fmt.Sprintf(`
		AND (
			"u"."first_name" ILIKE $%d
			OR "u"."last_name" ILIKE $%d
			OR "u"."title" ILIKE $%d
			OR "st"."student_id" ILIKE $%d
		)
	`, argsIndex, argsIndex, argsIndex, argsIndex)
		args = append(args, fmt.Sprintf("%%%s%%", option.Search))
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
		query += fmt.Sprintf(` ORDER BY "u"."id" ASC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	members := []constant.StudentGroupMember{}
	err := postgresRepository.Database.Select(&members, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
		SELECT
			"id",
			"name"
		FROM "class"."study_group_student" sgs
		INNER JOIN "class"."study_group" sg ON "sgs"."study_group_id" = "sg"."id" AND "sg"."status" != 'disabled'
		WHERE "sgs"."student_id" = $1 AND "sg"."subject_id" = $2 AND "sg"."class_id" = $3
	`
	for i, member := range members {
		studyGroups := []constant.StudyGroup{}
		err := postgresRepository.Database.Select(&studyGroups, query, member.StudentUserUUID, studyGroup.SubjectId, studyGroup.ClassId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		members[i].StudyGroups = studyGroups
	}
	return members, nil
}
