package postgres

import (
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
)

func (postgresRepository *postgresRepository) SchoolUpdateCSV(c constant.SchoolUpdateRequest, txs ...*sqlx.Tx) error {
	var QueryMethod sqlx.Ext
	if len(txs) > 0 {
		QueryMethod = txs[0]
	} else {
		QueryMethod = postgresRepository.Database
	}
	query := `UPDATE "school"."school"
	SET
	name = $1,
	address = $2,
	code = $3,
	region = $4,
	province = $5,
	district = $6,
	sub_district = $7,
	post_code = $8,
	latitude = $9,
	longtitude = $10,
	director = $11,
	director_phone_number = $12,
	registrar = $13,
	registrar_phone_number = $14,
	academic_affair_head = $15,
	academic_affair_head_phone_number = $16,
	advisor = $17,
	advisor_phone_number = $18,
	status = $19,
	updated_at = $20,
	updated_by = $21

	WHERE id = $22
	`
	result, err := QueryMethod.Exec(query,
		c.Name,
		c.Address,
		c.Code,
		c.Region,
		c.Province,
		c.District,
		c.SubDistrict,
		c.PostCode,
		c.Latitude,
		c.Longtitude,
		c.Director,
		c.DirectorPhone,
		c.Registrar,
		c.RegistrarPhone,
		c.AcademicAffairHead,
		c.AcademicAffairHeadPhone,
		c.Advisor,
		c.AdvisorPhone,
		c.Status,
		time.Now().UTC(),
		c.UpdatedBy,
		c.Id,
	)
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

	querySchoolAffiliation := `UPDATE "school_affiliation"."school_affiliation_school"
	SET school_affiliation_id = $1
	WHERE school_id = $2
	`
	_, err = QueryMethod.Exec(querySchoolAffiliation, c.SchoolAffiliationId, c.Id)
	if err != nil {
		return err
	}
	return nil
}
