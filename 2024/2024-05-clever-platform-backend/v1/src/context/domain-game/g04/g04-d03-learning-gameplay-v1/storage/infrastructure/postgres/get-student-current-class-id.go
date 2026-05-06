package postgres

func (postgresRepository *postgresRepository) GetStudentCurrentClassId(studentId string) (classId *int, err error) {
	type queryResult struct {
		ClassID int `db:"class_id"`
	}
	query := `
		SELECT
			class_id
		FROM
			"school"."class_student" LEFT JOIN "class"."class" ON "school"."class_student"."class_id" = "class"."class"."id"
		WHERE
			student_id = $1
		ORDER BY academic_year DESC
		LIMIT 1
	`
	result := queryResult{}
	err = postgresRepository.Database.QueryRowx(query, studentId).StructScan(&result)
	if err != nil {
		return
	}
	classId = &result.ClassID
	return
}
