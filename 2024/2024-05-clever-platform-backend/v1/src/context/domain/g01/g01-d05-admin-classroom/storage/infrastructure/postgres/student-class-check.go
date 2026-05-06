package postgres

func (postgresRepository *postgresRepository) StudentClassCheck(studentId string, academicYear int) (*int, error) {
	query := `
		SELECT
			"c"."id"
		FROM "school"."class_student" cs		   	 
		INNER JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
		WHERE "cs"."student_id" = $1 AND "c"."academic_year" = $2
	`
	var classId int
	err := postgresRepository.Database.Get(&classId, query, studentId, academicYear)
	if err != nil {
		return nil, err
	}
	return &classId, nil
}
