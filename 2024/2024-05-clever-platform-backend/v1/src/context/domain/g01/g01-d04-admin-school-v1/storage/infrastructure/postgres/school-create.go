package postgres

import (
	"github.com/jmoiron/sqlx"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
)

func (postgresRepository *postgresRepository) SchoolCreate(r constant.SchoolCreateRequest, txs ...*sqlx.Tx) error {
	var QueryMethod sqlx.Ext
	if len(txs) > 0 {
		QueryMethod = txs[0]
	} else {
		QueryMethod = postgresRepository.Database
	}
	query := `INSERT INTO "school"."school"
	(
	image_url,
	name,
	address,
	region,
	province,
	district,
	sub_district,
	post_code,
	latitude,
	longtitude,
	director,
	director_phone_number,
	deputy_director,
	deputy_director_phone,
	registrar,
	registrar_phone_number,
	academic_affair_head,
	academic_affair_head_phone_number,
	advisor,
	advisor_phone_number,
	status,
	created_at,
	created_by,
	code
	)
	VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
	RETURNING id

	`
	var id int
	err := QueryMethod.QueryRowx(query,
		r.ImageUrl,
		r.Name,
		r.Address,
		r.Region,
		r.Province,
		r.District,
		r.SubDistrict,
		r.PostCode,
		r.Latitude,
		r.Longtitude,
		r.Director,
		r.DirectorPhone,
		r.DeputyDirector,
		r.DeputyDirectorPhone,
		r.Registrar,
		r.RegistrarPhone,
		r.AcademicAffairHead,
		r.AcademicAffairHeadPhone,
		r.Advisor,
		r.AdvisorPhone,
		r.Status,
		time.Now().UTC(),
		r.CreatedBy,
		r.Code,
	).Scan(&id)
	if err != nil {
		return err
	}

	querySchoolAffiliation := ` INSERT INTO "school_affiliation"."school_affiliation_school"
	(
	school_affiliation_id,
	school_id
	)
	VALUES($1,$2)
	`
	_, err = QueryMethod.Exec(querySchoolAffiliation, r.SchoolAffiliationId, id)
	if err != nil {
		return err
	}
	return nil
}
