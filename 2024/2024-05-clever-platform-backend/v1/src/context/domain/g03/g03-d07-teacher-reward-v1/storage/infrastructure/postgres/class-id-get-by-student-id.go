package postgres

func (postgresRepository *postgresRepository) GetClassByStudentId(studentId string) (int, error) {
	query := `
		SELECT 
			cs.class_id
		FROM "school"."class_student" cs
		INNER JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
		WHERE "cs"."student_id" = $1
		ORDER BY "c"."academic_year" DESC
		LIMIT 1	
	`
	var ClassId int
	err := postgresRepository.Database.QueryRow(query, studentId).Scan(&ClassId)
	if err != nil {
		return 0, err
	}
	return ClassId, nil
}
