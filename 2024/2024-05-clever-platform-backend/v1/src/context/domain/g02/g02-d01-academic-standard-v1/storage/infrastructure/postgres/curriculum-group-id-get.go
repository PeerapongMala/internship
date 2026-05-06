package postgres

import (
	"database/sql"
	"fmt"
	"log"
)

// /FOR CONTENT API ///
func (postgresRepository *postgresRepository) GetBylearningAreaId(LearningAreaId int) (int, error) {
	query := `SELECT
	"cg"."id"
	FROM "curriculum_group"."learning_area" la
		LEFT JOIN "curriculum_group"."curriculum_group" cg
		ON "la"."curriculum_group_id" = "cg"."id"
	WHERE "la"."id" = $1
	
	
	`
	var curriculumgroupid int
	err := postgresRepository.Database.QueryRow(query, LearningAreaId).Scan(&curriculumgroupid)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("learning area id is not exist")
		}
		return 0, err
	}
	return curriculumgroupid, nil
}

/// FOR CRITERIA API///

func (postgresRepository *postgresRepository) GetByContentId(ContentId int) (int, error) {
	query := `
	SELECT
	"cg"."id"
	FROM "curriculum_group"."content"ct
	LEFT JOIN "curriculum_group"."learning_area" la
		ON "ct"."learning_area_id" = "la"."id"
	LEFT JOIN "curriculum_group"."curriculum_group" cg
		ON "la"."curriculum_group_id" = "cg"."id"
	WHERE "ct"."id" = $1
		
		
	
	`

	var curriculumgroupid int
	err := postgresRepository.Database.QueryRow(query, ContentId).Scan(&curriculumgroupid)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("content id is not exist")
		}
		return 0, err
	}
	return curriculumgroupid, nil
}

// /FOR LEARNING-CONTENT API///
func (postgresRepository *postgresRepository) GetByCriteriaId(CriteriaId int) (int, error) {
	query := `SELECT
	"cg"."id"
	FROM"curriculum_group"."criteria" ctr
	LEFT JOIN "curriculum_group"."content" ct
		ON "ctr"."content_id" = "ct"."id"
	LEFT JOIN "curriculum_group"."learning_area" la
		ON "ct"."learning_area_id" = "la"."id"
	LEFT JOIN "curriculum_group"."curriculum_group" cg
		ON "la"."curriculum_group_id" = "cg"."id"
	WHERE "ctr"."id" = $1
	`
	var curriculumgroupid int
	err := postgresRepository.Database.QueryRow(query, CriteriaId).Scan(&curriculumgroupid)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("criteria id is not exist")
		}
		return 0, err
	}
	return curriculumgroupid, nil
}

// /FOR INDICATOR API///
func (postgresRepository *postgresRepository) GetByLearningContentId(LearningContentId int) (int, error) {
	query := `
	SELECT
	"cg"."id"
	FROM"curriculum_group"."learning_content" lc
	LEFT JOIN "curriculum_group"."criteria" ctr
		ON "lc"."criteria_id" = "ctr"."id"
	LEFT JOIN "curriculum_group"."content" ct
		ON "ctr"."content_id" = "ct"."id"
	LEFT JOIN "curriculum_group"."learning_area" la
		ON "ct"."learning_area_id" = "la"."id"
	LEFT JOIN "curriculum_group"."curriculum_group" cg
		ON "la"."curriculum_group_id" = "cg"."id"
	WHERE "lc"."id" = $1
	
		`
	var curriculumgroupid int
	err := postgresRepository.Database.QueryRow(query, LearningContentId).Scan(&curriculumgroupid)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("learning content id is not exist")
		}
		return 0, err
	}
	return curriculumgroupid, nil
}

func (postgresRepository *postgresRepository) GetBySubCriteriaId(SubCriteriaId int) (int, error) {
	query := `
	SELECT
	"cg"."id"
	FROM 
		"curriculum_group"."sub_criteria" sc
		LEFT JOIN "curriculum_group"."curriculum_group" cg
		ON "sc"."curriculum_group_id" = "cg"."id"
	WHERE "sc"."id" = $1
	LIMIT 1
	`
	var curriculumgroupid int
	err := postgresRepository.Database.QueryRow(query, SubCriteriaId).Scan(&curriculumgroupid)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Print(err)
			return 0, fmt.Errorf("sub criteria id is not exist")
		}
		return 0, err
	}
	return curriculumgroupid, nil

}
