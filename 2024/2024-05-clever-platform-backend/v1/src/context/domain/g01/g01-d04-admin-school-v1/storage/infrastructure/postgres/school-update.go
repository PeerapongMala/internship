package postgres

import (
	"fmt"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
)

func (postgresRepository *postgresRepository) SchoolUpdate(c constant.SchoolUpdateRequest) error {
	query := `UPDATE "school"."school" SET `
	args := []interface{}{}
	argsI := 1
	comma := ""

	if c.ImageUrl != nil {
		query += fmt.Sprintf(`%simage_url = $%d`, comma, argsI)
		args = append(args, c.ImageUrl)
		argsI++
		comma = ", "
	}
	if c.Name != "" {
		query += fmt.Sprintf(`%sname = $%d`, comma, argsI)
		args = append(args, c.Name)
		argsI++
		comma = ", "
	}
	if c.Address != "" {
		query += fmt.Sprintf(`%saddress = $%d`, comma, argsI)
		args = append(args, c.Address)
		argsI++
		comma = ", "
	}
	if c.Region != "" {
		query += fmt.Sprintf(`%sregion = $%d`, comma, argsI)
		args = append(args, c.Region)
		argsI++
		comma = ", "
	}
	if c.Province != "" {
		query += fmt.Sprintf(`%sprovince = $%d`, comma, argsI)
		args = append(args, c.Province)
		argsI++
		comma = ", "
	}
	if c.District != "" {
		query += fmt.Sprintf(`%sdistrict = $%d`, comma, argsI)
		args = append(args, c.District)
		argsI++
		comma = ", "
	}
	if c.SubDistrict != "" {
		query += fmt.Sprintf(`%ssub_district = $%d`, comma, argsI)
		args = append(args, c.SubDistrict)
		argsI++
		comma = ", "
	}
	if c.PostCode != "" {
		query += fmt.Sprintf(`%spost_code = $%d`, comma, argsI)
		args = append(args, c.PostCode)
		argsI++
		comma = ", "
	}
	if c.Latitude != nil {
		query += fmt.Sprintf(`%slatitude = $%d`, comma, argsI)
		args = append(args, c.Latitude)
		argsI++
		comma = ", "
	}
	if c.Longtitude != nil {
		query += fmt.Sprintf(`%slongtitude = $%d`, comma, argsI)
		args = append(args, c.Longtitude)
		argsI++
		comma = ", "
	}
	if c.Director != nil {
		query += fmt.Sprintf(`%sdirector = $%d`, comma, argsI)
		args = append(args, c.Director)
		argsI++
		comma = ", "
	}
	if c.DirectorPhone != nil {
		query += fmt.Sprintf(`%sdirector_phone_number = $%d`, comma, argsI)
		args = append(args, c.DirectorPhone)
		argsI++
		comma = ", "
	}
	if c.DeputyDirector != nil {
		query += fmt.Sprintf(`%sdeputy_director = $%d`, comma, argsI)
		args = append(args, c.DeputyDirector)
		argsI++
		comma = ", "
	}
	if c.DeputyDirectorPhone != nil {
		query += fmt.Sprintf(`%sdeputy_director_phone = $%d`, comma, argsI)
		args = append(args, c.DeputyDirectorPhone)
		argsI++
		comma = ", "
	}
	if c.Registrar != nil {
		query += fmt.Sprintf(`%sregistrar = $%d`, comma, argsI)
		args = append(args, c.Registrar)
		argsI++
		comma = ", "
	}
	if c.RegistrarPhone != nil {
		query += fmt.Sprintf(`%sregistrar_phone_number = $%d`, comma, argsI)
		args = append(args, c.RegistrarPhone)
		argsI++
		comma = ", "
	}
	if c.AcademicAffairHead != nil {
		query += fmt.Sprintf(`%sacademic_affair_head = $%d`, comma, argsI)
		args = append(args, c.AcademicAffairHead)
		argsI++
		comma = ", "
	}
	if c.AcademicAffairHeadPhone != nil {
		query += fmt.Sprintf(`%sacademic_affair_head_phone_number = $%d`, comma, argsI)
		args = append(args, c.AcademicAffairHeadPhone)
		argsI++
		comma = ", "
	}
	if c.Advisor != nil {
		query += fmt.Sprintf(`%sadvisor = $%d`, comma, argsI)
		args = append(args, c.Advisor)
		argsI++
		comma = ", "
	}
	if c.AdvisorPhone != nil {
		query += fmt.Sprintf(`%sadvisor_phone_number = $%d`, comma, argsI)
		args = append(args, c.AdvisorPhone)
		argsI++
		comma = ", "
	}
	if c.Status != "" {
		query += fmt.Sprintf(`%sstatus = $%d`, comma, argsI)
		args = append(args, c.Status)
		argsI++
		comma = ", "
	}

	query += fmt.Sprintf(`%supdated_at = $%d`, comma, argsI)
	args = append(args, time.Now().UTC())
	argsI++
	comma = ", "

	if c.UpdatedBy != "" {
		query += fmt.Sprintf(`%supdated_by = $%d`, comma, argsI)
		args = append(args, c.UpdatedBy)
		argsI++
	}
	if c.Code != nil {
		query += fmt.Sprintf(`%scode = $%d`, comma, argsI)
		args = append(args, c.Code)
		argsI++
	}

	query += fmt.Sprintf(` WHERE id = $%d`, argsI)
	args = append(args, c.Id)

	result, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		return err
	}
	RowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if RowsAffected == 0 {
		return fmt.Errorf("school id is not exist")
	}

	SubQuery := `
		INSERT INTO "school_affiliation"."school_affiliation_school" (school_id, school_affiliation_id) 
             VALUES ($1, $2)
             ON CONFLICT (school_id) 
             DO UPDATE SET school_affiliation_id = $2 
	`
	SubArgs := []interface{}{c.Id, c.SchoolAffiliationId}
	SubI := len(SubArgs) + 1

	SubQuery += fmt.Sprintf(`  WHERE school_affiliation_school.school_id = $%d`, SubI)
	SubArgs = append(SubArgs, c.Id)
	SubI++
	_, err = postgresRepository.Database.Exec(SubQuery, SubArgs...)
	if err != nil {
		return err
	}
	return nil
}
