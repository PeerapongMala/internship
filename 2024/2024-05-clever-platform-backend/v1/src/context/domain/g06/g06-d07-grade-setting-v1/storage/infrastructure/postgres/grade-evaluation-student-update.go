package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"log"
)

func (postgresRepository *postgresRepository) GradeEvaluationStudentUpdate(entity constant.EvaluationStudent) error {
	query := "UPDATE grade.evaluation_student SET "
	params := []interface{}{}
	paramCounter := 1

	if entity.CitizenNo != nil {
		query += fmt.Sprintf("citizen_no = $%d, ", paramCounter)
		params = append(params, entity.CitizenNo)
		paramCounter++
	}
	if entity.StudentID != nil {
		query += fmt.Sprintf("student_id = $%d, ", paramCounter)
		params = append(params, entity.StudentID)
		paramCounter++
	}
	if entity.Gender != nil {
		query += fmt.Sprintf("gender = $%d, ", paramCounter)
		params = append(params, entity.Gender)
		paramCounter++
	}
	if entity.Title != nil {
		query += fmt.Sprintf("title = $%d, ", paramCounter)
		params = append(params, entity.Title)
		paramCounter++
	}
	if entity.ThaiFirstName != nil {
		query += fmt.Sprintf("thai_first_name = $%d, ", paramCounter)
		params = append(params, entity.ThaiFirstName)
		paramCounter++
	}
	if entity.ThaiLastName != nil {
		query += fmt.Sprintf("thai_last_name = $%d, ", paramCounter)
		params = append(params, entity.ThaiLastName)
		paramCounter++
	}
	if entity.EngFirstName != nil {
		query += fmt.Sprintf("eng_first_name = $%d, ", paramCounter)
		params = append(params, entity.EngFirstName)
		paramCounter++
	}
	if entity.EngLastName != nil {
		query += fmt.Sprintf("eng_last_name = $%d, ", paramCounter)
		params = append(params, entity.EngLastName)
		paramCounter++
	}
	if entity.BirthDate != nil {
		query += fmt.Sprintf("birth_date = $%d, ", paramCounter)
		params = append(params, entity.BirthDate)
		paramCounter++
	}
	if entity.Ethnicity != nil {
		query += fmt.Sprintf("ethnicity = $%d, ", paramCounter)
		params = append(params, entity.Ethnicity)
		paramCounter++
	}
	if entity.Nationality != nil {
		query += fmt.Sprintf("nationality = $%d, ", paramCounter)
		params = append(params, entity.Nationality)
		paramCounter++
	}
	if entity.Religion != nil {
		query += fmt.Sprintf("religion = $%d, ", paramCounter)
		params = append(params, entity.Religion)
		paramCounter++
	}
	if entity.ParentMaritalStatus != nil {
		query += fmt.Sprintf("parent_marital_status = $%d, ", paramCounter)
		params = append(params, entity.ParentMaritalStatus)
		paramCounter++
	}
	if entity.FatherTitle != nil {
		query += fmt.Sprintf("father_title = $%d, ", paramCounter)
		params = append(params, entity.FatherTitle)
		paramCounter++
	}
	if entity.FatherFirstName != nil {
		query += fmt.Sprintf("father_first_name = $%d, ", paramCounter)
		params = append(params, entity.FatherFirstName)
		paramCounter++
	}
	if entity.FatherLastName != nil {
		query += fmt.Sprintf("father_last_name = $%d, ", paramCounter)
		params = append(params, entity.FatherLastName)
		paramCounter++
	}
	if entity.MotherTitle != nil {
		query += fmt.Sprintf("mother_title = $%d, ", paramCounter)
		params = append(params, entity.MotherTitle)
		paramCounter++
	}
	if entity.MotherFirstName != nil {
		query += fmt.Sprintf("mother_first_name = $%d, ", paramCounter)
		params = append(params, entity.MotherFirstName)
		paramCounter++
	}
	if entity.MotherLastName != nil {
		query += fmt.Sprintf("mother_last_name = $%d, ", paramCounter)
		params = append(params, entity.MotherLastName)
		paramCounter++
	}
	if entity.GuardianRelation != nil {
		query += fmt.Sprintf("guardian_relation = $%d, ", paramCounter)
		params = append(params, entity.GuardianRelation)
		paramCounter++
	}
	if entity.GuardianTitle != nil {
		query += fmt.Sprintf("guardian_title = $%d, ", paramCounter)
		params = append(params, entity.GuardianTitle)
		paramCounter++
	}
	if entity.GuardianFirstName != nil {
		query += fmt.Sprintf("guardian_first_name = $%d, ", paramCounter)
		params = append(params, entity.GuardianFirstName)
		paramCounter++
	}
	if entity.GuardianLastName != nil {
		query += fmt.Sprintf("guardian_last_name = $%d, ", paramCounter)
		params = append(params, entity.GuardianLastName)
		paramCounter++
	}
	if entity.AddressNo != nil {
		query += fmt.Sprintf("address_no = $%d, ", paramCounter)
		params = append(params, entity.AddressNo)
		paramCounter++
	}
	if entity.AddressMoo != nil {
		query += fmt.Sprintf("address_moo = $%d, ", paramCounter)
		params = append(params, entity.AddressMoo)
		paramCounter++
	}
	if entity.AddressSubDistrict != nil {
		query += fmt.Sprintf("address_sub_district = $%d, ", paramCounter)
		params = append(params, entity.AddressSubDistrict)
		paramCounter++
	}
	if entity.AddressDistrict != nil {
		query += fmt.Sprintf("address_district = $%d, ", paramCounter)
		params = append(params, entity.AddressDistrict)
		paramCounter++
	}
	if entity.AddressProvince != nil {
		query += fmt.Sprintf("address_province = $%d, ", paramCounter)
		params = append(params, entity.AddressProvince)
		paramCounter++
	}
	if entity.AddressPostalCode != nil {
		query += fmt.Sprintf("address_postal_code = $%d, ", paramCounter)
		params = append(params, entity.AddressPostalCode)
		paramCounter++
	}
	if entity.IsOut != nil {
		query += fmt.Sprintf("is_out = $%d, ", paramCounter)
		params = append(params, entity.IsOut)
		paramCounter++
	}

	if len(params) == 0 {
		return nil
	}
	// remove last comma in Query
	query = query[:len(query)-2]

	query += fmt.Sprintf(" WHERE id = $%d", paramCounter)
	params = append(params, entity.ID)

	_, err := postgresRepository.Database.Exec(query, params...)
	if err != nil {
		log.Println("[ERROR] Grade Evaluation Student Update:", err)
		return err
	}

	return nil
}
