package service

import (
	"encoding/json"
	"fmt"
	"log"
	"sort"
	"strings"

	gradeFormConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	dataEntryConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/lib/pq"
	"github.com/pkg/errors"
)

func (service *serviceStruct) orderPorphor5Data(porphor5Data []*constant.Porphor5DataEntity) []*constant.Porphor5DataEntity {
	categoryOrder := []constant.Porphor5Category{
		constant.SubjectCategory,
		constant.ReportCoverByGrade,
		constant.ReportCoverBySubject,
		constant.StudentNames,
		constant.ParentInfo,
		constant.GuardianInfo,
		constant.Attendance,
		constant.NutritionSummary,
		constant.NutritionalStatus,
		constant.AcademicAchievement,
		constant.DesirableTraits,
		constant.Competency,
		constant.StudentDevelopment,
	}

	categoryIndex := make(map[constant.Porphor5Category]int)
	for i, category := range categoryOrder {
		categoryIndex[category] = i
	}

	sort.SliceStable(porphor5Data, func(i, j int) bool {
		indexI, foundI := categoryIndex[porphor5Data[i].Name]
		indexJ, foundJ := categoryIndex[porphor5Data[j].Name]

		if foundI && foundJ {
			return indexI < indexJ
		} else if foundI {
			return true
		} else if foundJ {
			return false
		}
		return porphor5Data[i].Name < porphor5Data[j].Name
	})

	for i := range porphor5Data {
		porphor5Data[i].Order = i
	}

	return porphor5Data
}

func (service *serviceStruct) prepareDataForPorphor5(in *Porphor5CreateRequest, form *gradeFormConstant.GradeEvaluationFormEntity, sheets []dataEntryConstant.EvaluationSheetListEntity) ([]*constant.Porphor5DataEntity, error) {
	porphor5Data := []*constant.Porphor5DataEntity{}
	formId := *form.Id

	evaluationStudent, err := service.gradePorphor5Storage.GetListEvaluationStudent(formId)
	if err != nil {
		log.Printf("gradePorphor5Storage.GetListEvaluationStudent err %s", err.Error())
		return nil, errors.Wrap(err, "get list evaluation student")
	}

	subject, err := service.subject(formId, sheets)
	if err != nil {
		log.Printf("subject err %s", err.Error())
		return nil, err
	}
	porphor5Data = append(porphor5Data, subject)

	gradeLevel, err := service.porphor5GradeLevel(in, formId, sheets, evaluationStudent)
	if err != nil {
		log.Printf("porphor5GradeLevel err %s", err.Error())
		return nil, err
	}
	porphor5Data = append(porphor5Data, gradeLevel)

	subjectCover, err := service.porphor5SubjectCover(in, formId, sheets, evaluationStudent)
	if err != nil {
		log.Printf("porphor5SubjectCover err %s", err.Error())
		return nil, err
	}
	porphor5Data = append(porphor5Data, subjectCover)

	academicAchievement, err := service.porphor5AcademicAchievement(in, formId, sheets, evaluationStudent)
	if err != nil {
		log.Printf("porphor5AcademicAchievement err %s", err.Error())
		return nil, err
	}
	porphor5Data = append(porphor5Data, academicAchievement)

	studentName, err := service.studentNames(formId, evaluationStudent)
	if err != nil {
		log.Printf("studentNames err %s", err.Error())
		return nil, err
	}
	porphor5Data = append(porphor5Data, studentName)

	parentInfo, err := service.parentsInfo(formId, evaluationStudent)
	if err != nil {
		log.Printf("parentInfo err %s", err.Error())
		return nil, err
	}
	porphor5Data = append(porphor5Data, parentInfo)

	guardianInfo, err := service.guardianInfo(formId, evaluationStudent)
	if err != nil {
		log.Printf("guardianInfo err %s", err.Error())
		return nil, err
	}
	porphor5Data = append(porphor5Data, guardianInfo)

	generalInfo, err := service.generalInfo(formId, sheets, evaluationStudent)
	if err != nil {
		log.Printf("generalInfo err %s", err.Error())
		return nil, err
	}
	porphor5Data = append(porphor5Data, generalInfo...)

	return service.orderPorphor5Data(porphor5Data), nil
}

type subjectData struct {
	AcademicYear string                        `json:"academic_year"`
	Year         string                        `json:"year"`
	Subjects     []*constant.SubjectDataDetail `json:"subjects"`
}

func (service *serviceStruct) subject(formID int, sheets []dataEntryConstant.EvaluationSheetListEntity) (*constant.Porphor5DataEntity, error) {
	data := subjectData{
		AcademicYear: helper.HandleStringPointerField(sheets[0].AcademicYear),
		Year:         helper.HandleStringPointerField(sheets[0].Year),
		Subjects:     nil,
	}
	for _, sheet := range sheets {
		if sheet.EvaluationFormSubjectID == nil || sheet.EvaluationFormGeneralEvalID != nil {
			continue
		}

		subjectDetail, err := service.gradePorphor5Storage.SubjectInfoBySheetID(sheet.ID)
		if err != nil {
			log.Printf("GetEvaluationDataBySheetId err %s", err.Error())
			return nil, errors.Wrap(err, fmt.Sprintf("get data from sheet id %d", sheet.ID))
		}
		subjectDetail.LearningGroup = subjectDetail.LearningArea

		data.Subjects = append(data.Subjects, subjectDetail)
	}

	b, err := json.Marshal(data)
	if err != nil {
		log.Printf("json.Marshal err %s", err.Error())
		return nil, err
	}

	return &constant.Porphor5DataEntity{
		FormID:   formID,
		Name:     constant.SubjectCategory,
		DataJson: string(b),
	}, nil
}

func (service *serviceStruct) porphor5GradeLevel(in *Porphor5CreateRequest, formID int, sheets []dataEntryConstant.EvaluationSheetListEntity, evaluationStudent []constant.EvaluationStudentEntity) (*constant.Porphor5DataEntity, error) {
	data, err := service.calculateStudentGradeSubject(in, sheets, evaluationStudent)
	if err != nil {
		log.Printf("calculateStudentGradeSubject err %s", err.Error())
		return nil, err
	}

	b, err := json.Marshal(data)
	if err != nil {
		log.Printf("json.Marshal err %s", err.Error())
		return nil, err
	}

	return &constant.Porphor5DataEntity{
		FormID:   formID,
		Name:     constant.ReportCoverByGrade,
		DataJson: string(b),
	}, nil
}

func (service *serviceStruct) porphor5SubjectCover(in *Porphor5CreateRequest, formID int, sheets []dataEntryConstant.EvaluationSheetListEntity, evaluationStudent []constant.EvaluationStudentEntity) (*constant.Porphor5DataEntity, error) {
	data, err := service.calculateStudentGradeSubject(in, sheets, evaluationStudent)
	if err != nil {
		log.Printf("calculateStudentGradeSubject err %s", err.Error())
		return nil, err
	}

	b, err := json.Marshal(data)
	if err != nil {
		log.Printf("json.Marshal err %s", err.Error())
		return nil, err
	}

	return &constant.Porphor5DataEntity{
		FormID:   formID,
		Name:     constant.ReportCoverBySubject,
		DataJson: string(b),
	}, nil
}

type studentNameData struct {
	ID        int    `json:"id"`
	No        int    `json:"no"`
	StudentID string `json:"student_id"`
	Title     string `json:"title"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	CitizenNo string `json:"citizen_no"`
	BirthDate string `json:"birth_date"`
}

func (service *serviceStruct) studentNames(formID int, evaluationStudent []constant.EvaluationStudentEntity) (*constant.Porphor5DataEntity, error) {
	data := []*studentNameData{}
	for i, v := range evaluationStudent {
		data = append(data, &studentNameData{
			ID:        v.ID,
			No:        i + 1,
			StudentID: helper.HandleStringPointerField(v.StudentID),
			Title:     helper.HandleStringPointerField(v.Title),
			FirstName: helper.HandleStringPointerField(v.ThaiFirstName),
			LastName:  helper.HandleStringPointerField(v.ThaiLastName),
			CitizenNo: helper.HandleStringPointerField(v.CitizenNo),
			BirthDate: helper.HandleStringPointerField(v.BirthDate),
		})
	}

	b, err := json.Marshal(data)
	if err != nil {
		log.Printf("json.Marshal err %s", err.Error())
		return nil, errors.Wrap(err, "marshal data")
	}

	return &constant.Porphor5DataEntity{
		FormID:   formID,
		Name:     constant.StudentNames,
		DataJson: string(b),
	}, nil
}

type parentInfoData struct {
	ID               int    `json:"id"`
	No               int    `json:"no"`
	StudentID        string `json:"student_id"`
	Title            string `json:"title"`
	FirstName        string `json:"first_name"`
	LastName         string `json:"last_name"`
	Number           string `json:"number"`
	FatherTitle      string `json:"father_title"`
	FatherFirstName  string `json:"father_first_name"`
	FatherLastName   string `json:"father_last_name"`
	FatherOccupation string `json:"father_occupation"`
	MotherTitle      string `json:"mother_title"`
	MotherFirstName  string `json:"mother_first_name"`
	MotherLastName   string `json:"mother_last_name"`
	MotherOccupation string `json:"mother_occupation"`
}

func (service *serviceStruct) parentsInfo(formID int, evaluationStudent []constant.EvaluationStudentEntity) (*constant.Porphor5DataEntity, error) {
	data := []*parentInfoData{}
	for i, v := range evaluationStudent {
		data = append(data, &parentInfoData{
			ID:               v.ID,
			No:               i + 1,
			StudentID:        helper.HandleStringPointerField(v.StudentID),
			Title:            helper.HandleStringPointerField(v.Title),
			FirstName:        helper.HandleStringPointerField(v.ThaiFirstName),
			LastName:         helper.HandleStringPointerField(v.ThaiLastName),
			Number:           "",
			FatherTitle:      helper.HandleStringPointerField(v.FatherTitle),
			FatherFirstName:  helper.HandleStringPointerField(v.FatherFirstName),
			FatherLastName:   helper.HandleStringPointerField(v.FatherLastName),
			FatherOccupation: "-",
			MotherTitle:      helper.HandleStringPointerField(v.MotherTitle),
			MotherFirstName:  helper.HandleStringPointerField(v.MotherFirstName),
			MotherLastName:   helper.HandleStringPointerField(v.MotherLastName),
			MotherOccupation: "-",
		})
	}

	b, err := json.Marshal(data)
	if err != nil {
		log.Printf("json.Marshal err %s", err.Error())
		return nil, errors.Wrap(err, "marshal data")
	}

	return &constant.Porphor5DataEntity{
		FormID:   formID,
		Name:     constant.ParentInfo,
		DataJson: string(b),
	}, nil
}

type guardianInfoData struct {
	ID                 int    `json:"id"`
	No                 int    `json:"no"`
	StudentID          string `json:"student_id"`
	Title              string `json:"title"`
	FirstName          string `json:"first_name"`
	LastName           string `json:"last_name"`
	Number             string `json:"number"`
	GuardianTitle      string `json:"guardian_title"`
	GuardianFirstName  string `json:"guardian_first_name"`
	GuardianLastName   string `json:"guardian_last_name"`
	GuardianRelation   string `json:"guardian_relation"`
	GuardianOccupation string `json:"guardian_occupation"`
	AddressNo          string `json:"address_no"`
	AddressMoo         string `json:"address_moo"`
	AddressSubDistrict string `json:"address_sub_district"`
	AddressDistrict    string `json:"address_district"`
	AddressProvince    string `json:"address_province"`
	AddressPostalCode  string `json:"address_postal_code"`
}

func (service *serviceStruct) guardianInfo(formID int, evaluationStudent []constant.EvaluationStudentEntity) (*constant.Porphor5DataEntity, error) {
	data := []*guardianInfoData{}
	for i, v := range evaluationStudent {
		data = append(data, &guardianInfoData{
			ID:                 v.ID,
			No:                 i + 1,
			StudentID:          helper.HandleStringPointerField(v.StudentID),
			Title:              helper.HandleStringPointerField(v.Title),
			FirstName:          helper.HandleStringPointerField(v.ThaiFirstName),
			LastName:           helper.HandleStringPointerField(v.ThaiLastName),
			Number:             "",
			GuardianTitle:      helper.HandleStringPointerField(v.GuardianTitle),
			GuardianFirstName:  helper.HandleStringPointerField(v.GuardianFirstName),
			GuardianLastName:   helper.HandleStringPointerField(v.GuardianLastName),
			GuardianRelation:   helper.HandleStringPointerField(v.GuardianRelation),
			GuardianOccupation: "-",
			AddressNo:          helper.HandleStringPointerField(v.AddressNo),
			AddressMoo:         helper.HandleStringPointerField(v.AddressMoo),
			AddressSubDistrict: helper.HandleStringPointerField(v.AddressSubDistrict),
			AddressDistrict:    helper.HandleStringPointerField(v.AddressDistrict),
			AddressProvince:    helper.HandleStringPointerField(v.AddressProvince),
			AddressPostalCode:  helper.HandleStringPointerField(v.AddressPostalCode),
		})
	}

	b, err := json.Marshal(data)
	if err != nil {
		log.Printf("json.Marshal err %s", err.Error())
		return nil, errors.Wrap(err, "marshal data")
	}

	return &constant.Porphor5DataEntity{
		FormID:   formID,
		Name:     constant.GuardianInfo,
		DataJson: string(b),
	}, nil
}

func (service *serviceStruct) generalInfo(formID int, sheets []dataEntryConstant.EvaluationSheetListEntity, evaluationStudent []constant.EvaluationStudentEntity) ([]*constant.Porphor5DataEntity, error) {
	list := []*constant.Porphor5DataEntity{}

	mStudent := make(map[int]constant.EvaluationStudentEntity)
	for _, v := range evaluationStudent {
		mStudent[v.ID] = v
	}

	for _, sheet := range sheets {
		if sheet.EvaluationFormGeneralEvalID == nil {
			log.Printf("sheet id %d is not general sheet", sheet.ID)
			continue
		}

		sheetData, err := service.gradeDataEntryStorage.GetEvaluationDataBySheetId(sheet.ID, "")
		if err != nil {
			log.Printf("GetEvaluationDataBySheetId err %s", err.Error())
			return nil, errors.Wrap(err, fmt.Sprintf("get data from sheet id %d", sheet.ID))
		}

		data := sheetData.StudentScoreData
		for i, v := range data {
			addtionalField := service.generalInfoSetStudentData(v.AdditionalFields, mStudent[v.EvaluationStudentID])
			data[i].AdditionalFields = addtionalField
		}

		b, err := json.Marshal(data)
		if err != nil {
			log.Printf("json.Marshal err %s", err.Error())
			return nil, errors.Wrap(err, "marshal data")
		}

		list = append(list, &constant.Porphor5DataEntity{
			FormID:   formID,
			Name:     constant.Porphor5Category(helper.HandleStringPointerField(sheet.GeneralType)),
			DataJson: string(b),
		})
	}

	return list, nil
}

func (service *serviceStruct) generalInfoSetStudentData(baseData map[string]interface{}, student constant.EvaluationStudentEntity) map[string]interface{} {
	if student.ID == 0 { // skip if not have student id
		return baseData
	}

	if baseData == nil {
		baseData = map[string]interface{}{}
	}
	baseData["id"] = student.ID
	baseData["student_id"] = student.StudentID
	baseData["title"] = student.Title
	baseData["thai_first_name"] = student.ThaiFirstName
	baseData["thai_last_name"] = student.ThaiLastName
	baseData["eng_first_name"] = student.EngFirstName
	baseData["eng_last_name"] = student.EngLastName
	return baseData
}

type GradeLevelInfo struct {
	SchoolName    string                      `json:"school_name"`
	SchoolArea    string                      `json:"school_area"` //สำนักงานเขตพื้นที่การศึกษาประถมศึกษานนทบุรี เขต 1
	AcademicYear  string                      `json:"academic_year"`
	Year          string                      `json:"year"`
	Subject       []GradeLevelInfoSubject     `json:"subject"`
	StudentStatus GradeLevelInfoStudentStatus `json:"student_status"`
	Approval      GradeLevelInfoApproval      `json:"approval"`
}

type GradeLevelInfoSubject struct {
	Id             int             `json:"id" db:"id"`
	Code           string          `json:"code" db:"code"`
	Name           string          `json:"name" db:"name"`
	Hours          int             `json:"hours" db:"hours"`
	MaxScore       float64         `json:"max_score"`
	LearningGroup  string          `json:"learning_group" db:"learning_group"`
	Teacher        pq.StringArray  `json:"teacher" db:"teacher"`
	TeacherAdvisor pq.StringArray  `json:"teacher_advisor" db:"teacher_advisor"`
	Scores         map[string]int  `json:"scores"` //เกรด, คะแนน
	ClassScore     json.RawMessage `json:"class_score"`
	GradeScore     json.RawMessage `json:"grade_score"`
	IsSubject      bool            `json:"is_subject" db:"is_subject"` //เป็นวิชาไหม
}

type GradeLevelInfoStudentStatus struct {
	StartTotal  int `json:"start_total"`
	StartMale   int `json:"start_male"`
	StartFemale int `json:"start_female"`

	EndTotal  int `json:"end_total"`
	EndMale   int `json:"end_male"`
	EndFemale int `json:"end_female"`

	TransferInTotal  int `json:"transfer_in_total"`
	TransferInMale   int `json:"transfer_in_male"`
	TransferInFemale int `json:"transfer_in_female"`

	TransferOutTotal  int `json:"transfer_out_total"`
	TransferOutMale   int `json:"transfer_out_male"`
	TransferOutFemale int `json:"transfer_out_female"`
}

type GradeLevelInfoApproval struct {
	SubjectTeacher string `json:"subject_teacher"`
	HeadOfSubject  string `json:"head_of_subject"`
	DeputyDirector string `json:"deputy_director"`
	Principal      string `json:"principal"`
	Approved       bool   `json:"approved"`
	Date           string `json:"date"`
}

func (service *serviceStruct) calculateStudentGradeSubject(in *Porphor5CreateRequest, sheets []dataEntryConstant.EvaluationSheetListEntity, evaluationStudent []constant.EvaluationStudentEntity) (*GradeLevelInfo, error) {
	var gradeLevelInfo GradeLevelInfo

	gradeLevelInfo.Approval = GradeLevelInfoApproval{
		SubjectTeacher: in.SubjectTeacher,
		HeadOfSubject:  in.HeadOfSubject,
		DeputyDirector: in.DeputyDirector,
		Principal:      in.Principal,
		Approved:       true,
		Date:           in.SignDate,
	}

	for _, v := range evaluationStudent {
		gender := helper.HandleStringPointerField(v.Gender)
		if gender == "ช" || strings.Contains(gender, "ชาย") || strings.ToLower(gender) == "male" {
			gradeLevelInfo.StudentStatus.StartMale++
			gradeLevelInfo.StudentStatus.EndMale++
		} else {
			gradeLevelInfo.StudentStatus.StartFemale++
			gradeLevelInfo.StudentStatus.EndFemale++
		}

		//TODO add counting transfer in and out
	}

	gradeLevelInfo.StudentStatus.StartTotal = gradeLevelInfo.StudentStatus.StartMale + gradeLevelInfo.StudentStatus.StartFemale
	gradeLevelInfo.StudentStatus.EndTotal = gradeLevelInfo.StudentStatus.EndMale + gradeLevelInfo.StudentStatus.EndFemale
	gradeLevelInfo.StudentStatus.TransferInTotal = gradeLevelInfo.StudentStatus.TransferInMale + gradeLevelInfo.StudentStatus.TransferInFemale
	gradeLevelInfo.StudentStatus.TransferOutTotal = gradeLevelInfo.StudentStatus.TransferOutMale + gradeLevelInfo.StudentStatus.TransferOutFemale

	for _, sheet := range sheets {
		if sheet.EvaluationFormSubjectID != nil && sheet.EvaluationFormGeneralEvalID != nil {
			continue
		}

		subjectDetail, err := service.gradePorphor5Storage.SubjectInfoBySheetID(sheet.ID)
		if err != nil {
			log.Printf("GetEvaluationDataBySheetId err %s", err.Error())
			return nil, errors.Wrap(err, fmt.Sprintf("get data from sheet id %d", sheet.ID))
		}

		name := subjectDetail.GeneralName
		learningGroup := subjectDetail.GeneralType
		if sheet.EvaluationFormSubjectID != nil {
			name = subjectDetail.SubjectName
			learningGroup = subjectDetail.LearningArea
		}

		sheetData, err := service.gradeDataEntryStorage.GetEvaluationDataBySheetId(sheet.ID, "")
		if err != nil {
			log.Printf("GetEvaluationDataBySheetId err %s", err.Error())
			return nil, errors.Wrap(err, fmt.Sprintf("get data from sheet id %d", sheet.ID))
		}

		defaultGrade := "0"
		if sheet.EvaluationFormSubjectID == nil {
			defaultGrade = "มผ"
		}
		mGrade := make(map[string]int)
		//set default
		if sheet.EvaluationFormSubjectID != nil {
			defaultListGrade := []string{"มส", "ร", "0", "1", "1.5", "2", "2.5", "3", "3.5", "4"}
			for _, g := range defaultListGrade {
				mGrade[g] = 0
			}
		}

		if sheet.EvaluationFormSubjectID == nil {
			switch helper.Deref(learningGroup) {
			case string(constant.Competency):
				for _, v := range sheetData.StudentScoreData {
					grade, ok := (v.StudentIndicatorData[1].Value).(float64)
					if ok {
						mGrade[service.competencyConvert(grade)]++
					} else {
						mGrade[service.competencyConvert(grade)] = 1
					}
				}
			case string(constant.DesirableTraits):
				for _, v := range sheetData.StudentScoreData {
					firstEvaluationValue, ok := (v.StudentIndicatorData[8].Value).(float64)
					if ok {
						mGrade[service.desirableTraitsConvert(firstEvaluationValue, 1)]++
					} else {
						mGrade[service.desirableTraitsConvert(firstEvaluationValue, 1)] = 1
					}

					secondEvaluationValue, ok := (v.StudentIndicatorData[14].Value).(float64)
					if ok {
						mGrade[service.desirableTraitsConvert(secondEvaluationValue, 2)]++
					} else {
						mGrade[service.desirableTraitsConvert(secondEvaluationValue, 2)] = 1
					}
				}
			default:
				for _, v := range sheetData.StudentScoreData {
					if grade, ok := v.AdditionalFields[constant.FieldGrade].(string); ok {
						mGrade[grade]++
					} else {
						mGrade[defaultGrade]++
					}
				}
			}
		} else if sheet.EvaluationFormSubjectID != nil && sheet.EvaluationFormGeneralEvalID == nil {
			maxScore := 0.00
			//studentScoreMap := map[int]float64{}
			s, err := service.gradeFormStorage.GradeEvaluationSubjectGetBySheetId(sheet.ID, true)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

			for _, indicator := range s.Indicator {
				maxScore += helper.Deref(indicator.MaxValue)
			}

			for _, v := range sheetData.StudentScoreData {
				gradeValue := v.StudentIndicatorData[0].Value.(float64) * 100 / maxScore
				grade := service.calculateGrade(gradeValue)
				mGrade[fmt.Sprintf("%g", grade)]++
				gradeStatus, ok := v.AdditionalFields[constant.FieldGradeStatus].(string)
				if !ok {
					continue
				}
				mGrade[gradeStatus]++
			}
		}

		gradeLevelInfo.SchoolName = helper.HandleStringPointerField(subjectDetail.SchoolName)
		gradeLevelInfo.SchoolArea = helper.HandleStringPointerField(subjectDetail.SchoolArea)
		gradeLevelInfo.AcademicYear = helper.HandleStringPointerField(sheet.AcademicYear)
		gradeLevelInfo.Year = helper.HandleStringPointerField(sheet.Year)
		gradeLevelInfo.Subject = append(gradeLevelInfo.Subject, GradeLevelInfoSubject{
			Id:             subjectDetail.Id,
			Code:           helper.Deref(subjectDetail.Code),
			Name:           helper.HandleStringPointerField(name),
			Hours:          helper.Deref(subjectDetail.Hours),
			LearningGroup:  helper.HandleStringPointerField(learningGroup),
			Teacher:        subjectDetail.Teacher,
			TeacherAdvisor: subjectDetail.TeacherAdvisor,
			Scores:         mGrade,
			IsSubject:      sheet.EvaluationFormSubjectID != nil,
		})
	}

	return &gradeLevelInfo, nil
}

type AcademicAchievement struct {
	SchoolName    string                  `json:"school_name"`
	SchoolArea    string                  `json:"school_area"` //สำนักงานเขตพื้นที่การศึกษาประถมศึกษานนทบุรี เขต 1
	AcademicYear  string                  `json:"academic_year"`
	Year          string                  `json:"year"`
	Subject       []GradeLevelInfoSubject `json:"subject"`
	MaleCount     int                     `json:"male_count"`
	FemaleCount   int                     `json:"female_count"`
	TotalCount    int                     `json:"total_count"`
	StudentList   []studentNameData       `json:"student_list"`
	GradeOverview json.RawMessage         `json:"grade_overview"`
}

func (service *serviceStruct) porphor5AcademicAchievement(in *Porphor5CreateRequest, formID int, sheets []dataEntryConstant.EvaluationSheetListEntity, evaluationStudent []constant.EvaluationStudentEntity) (*constant.Porphor5DataEntity, error) {
	gradeLevelInfo, err := service.calculateStudentGradeSubject(in, sheets, evaluationStudent)
	if err != nil {
		log.Printf("calculateStudentGradeSubject err %s", err.Error())
		return nil, err
	}

	maleCount, femaleCount, totalCount := service.countStudent(evaluationStudent)
	studentList := []studentNameData{}
	for i, student := range evaluationStudent {
		studentList = append(studentList, studentNameData{
			ID:        student.ID,
			No:        i + 1,
			CitizenNo: helper.HandleStringPointerField(student.CitizenNo),
			StudentID: helper.HandleStringPointerField(student.StudentID),
			Title:     helper.HandleStringPointerField(student.Title),
			FirstName: helper.HandleStringPointerField(student.ThaiFirstName),
			LastName:  helper.HandleStringPointerField(student.ThaiLastName),
		})
	}

	data := AcademicAchievement{
		SchoolName:   gradeLevelInfo.SchoolName,
		SchoolArea:   gradeLevelInfo.SchoolArea,
		AcademicYear: gradeLevelInfo.AcademicYear,
		Year:         gradeLevelInfo.Year,
		MaleCount:    maleCount,
		FemaleCount:  femaleCount,
		TotalCount:   totalCount,
		StudentList:  studentList,
	}

	studentTotalGrade := map[int]float64{}
	for _, student := range studentList {
		studentTotalGrade[student.ID] = 0.00
	}
	subjectCount := 0
	for _, subject := range gradeLevelInfo.Subject {
		if !subject.IsSubject {
			continue
		}
		subjectCount++

		sheetData, err := service.gradeDataEntryStorage.GetEvaluationDataBySheetId(subject.Id, "")
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		s, err := service.gradeFormStorage.GradeEvaluationSubjectGetBySheetId(subject.Id, true)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		jsonStudentScoreData, jsonStudentGradeData, maxScore, err := service.calculateSubjectScore(studentTotalGrade, s, sheetData.JsonStudentScoreData, evaluationStudent)
		if err != nil {
			return nil, err
		}
		subject.ClassScore = json.RawMessage(jsonStudentScoreData)
		subject.GradeScore = json.RawMessage(jsonStudentGradeData)
		subject.MaxScore = maxScore

		data.Subject = append(data.Subject, subject)
	}
	type StudentTotalGrade struct {
		EvaluationStudentID int     `json:"evaluation_student_id"`
		AverageGrade        float64 `json:"average_grade"`
		Rank                int     `json:"rank"`
	}
	studentTotalGrades := []StudentTotalGrade{}
	for k, v := range studentTotalGrade {
		studentTotalGrades = append(studentTotalGrades, StudentTotalGrade{
			EvaluationStudentID: k,
			AverageGrade:        helper.Round(v / float64(subjectCount)),
		})
	}
	sort.Slice(studentTotalGrades, func(i, j int) bool {
		return studentTotalGrades[i].AverageGrade > studentTotalGrades[j].AverageGrade
	})

	rank := 1
	for i := 0; i < len(studentTotalGrades); i++ {
		if i > 0 && studentTotalGrades[i].AverageGrade < studentTotalGrades[i-1].AverageGrade {
			rank = i + 1
		}
		studentTotalGrades[i].Rank = rank
	}
	jsonStudentTotalGrades, err := json.Marshal(studentTotalGrades)
	if err != nil {
		return nil, err
	}
	data.GradeOverview = jsonStudentTotalGrades

	b, err := json.Marshal(data)
	if err != nil {
		log.Printf("json.Marshal err %s", err.Error())
		return nil, err
	}

	return &constant.Porphor5DataEntity{
		FormID:   formID,
		Name:     constant.AcademicAchievement,
		DataJson: string(b),
	}, nil
}

func (service *serviceStruct) calculateSubjectScore(studentTotalGrade map[int]float64, subjectData *gradeFormConstant.GradeEvaluationFormSubjectWithNameEntity, studentScore string, students []constant.EvaluationStudentEntity) (string, string, float64, error) {
	studentScoreDataList := []constant.StudentScoreData{}
	studentScoreDataMap := map[int]float64{}
	maxScore := 0.00
	err := json.Unmarshal([]byte(studentScore), &studentScoreDataList)
	if err != nil {
		return "", "", maxScore, err
	}

	for _, student := range students {
		studentScoreDataMap[student.ID] = 0.0
	}

	for _, indicator := range subjectData.Indicator {
		maxScore += helper.Deref(indicator.MaxValue)
	}

	for _, studentScore := range studentScoreDataList {
		_, ok := studentScoreDataMap[studentScore.EvaluationStudentID]
		z := 0.00
		for _, indicator := range studentScore.StudentIndicatorData {
			z += indicator.Value
		}
		if !ok {
			studentScoreDataMap[studentScore.EvaluationStudentID] = z
		} else {
			studentScoreDataMap[studentScore.EvaluationStudentID] += z
		}
	}

	type StudentScore struct {
		EvaluationStudentID int     `json:"evaluation_student_id"`
		Score               float64 `json:"score"`
	}
	type StudentGrade struct {
		EvaluationStudentId int     `json:"evaluation_student_id"`
		Grade               float64 `json:"grade"`
	}

	scores := []StudentScore{}
	grades := []StudentGrade{}
	for k, v := range studentScoreDataMap {
		scores = append(scores, StudentScore{
			EvaluationStudentID: k,
			Score:               v,
		})

		gradeValue := 0.00
		if maxScore != 0 {
			gradeValue = v * 100 / maxScore
		}

		if gradeValue > 100 {
			gradeValue = 100
		}

		grade := service.calculateGrade(gradeValue)
		grades = append(grades, StudentGrade{
			EvaluationStudentId: k,
			Grade:               grade,
		})
		studentTotalGrade[k] += grade
	}

	studentGradeJson, err := json.Marshal(grades)
	if err != nil {
		return "", "", maxScore, err
	}
	studentScoreJson, err := json.Marshal(scores)
	if err != nil {
		return "", "", maxScore, err
	}

	return string(studentScoreJson), string(studentGradeJson), maxScore, nil
}

func (service *serviceStruct) countStudent(students []constant.EvaluationStudentEntity) (int, int, int) {
	maleCount, femaleCount, totalCount := 0, 0, 0
	for _, student := range students {
		gender := helper.HandleStringPointerField(student.Gender)
		if gender == constant.Male {
			maleCount++
		} else if gender == constant.Female {
			femaleCount++
		}
		totalCount++
	}

	return maleCount, femaleCount, totalCount
}

func (service *serviceStruct) calculateGrade(gradeValue float64) float64 {
	if gradeValue >= 80 { // 80 - 100
		return 4
	}
	if gradeValue >= 75 { // 75 - 79
		return 3.5
	}
	if gradeValue >= 70 { // 70 - 74
		return 3
	}
	if gradeValue >= 65 { // 65 - 69
		return 2.5
	}
	if gradeValue >= 60 { // 60 - 64
		return 2
	}
	if gradeValue >= 55 { // 55 - 59
		return 1.5
	}
	if gradeValue >= 50 { // 50 - 54
		return 1
	}
	return 0
}

func (service *serviceStruct) competencyConvert(value float64) string {
	switch value {
	case 1:
		return constant.Passed
	case 2:
		return constant.Failed
	case 3:
		return constant.Good
	case 4:
		return constant.Excellent
	}
	return constant.Failed
}

func (service *serviceStruct) desirableTraitsConvert(value float64, evaluationIndex int) string {
	if evaluationIndex == 1 {
		switch value {
		case 1:
			return constant.Passed
		case 2:
			return constant.Failed
		case 3:
			return constant.Good
		case 4:
			return constant.Excellent
		}
	} else if evaluationIndex == 2 {
		switch value {
		case 1:
			return constant.Passed2
		case 2:
			return constant.Failed2
		case 3:
			return constant.Good2
		case 4:
			return constant.Excellent2
		}
	}
	return ""
}

func calcMode(data map[string][]float64) map[string][]int {
	result := map[string][]int{}

	for competency, numbers := range data {
		if len(numbers) == 0 {
			result[competency] = []int{}
			continue
		}

		frequency := map[int]int{}
		maxCount := 0

		for _, num := range numbers {
			frequency[int(num)]++
			if frequency[int(num)] > maxCount {
				maxCount = frequency[int(num)]
			}
		}

		if len(frequency) == 1 {
			result[competency] = []int{}
			continue
		}

		modeValues := []int{}
		for num, count := range frequency {
			if count == maxCount {
				modeValues = append(modeValues, num)
			}
		}

		if len(modeValues) > 2 {
			modeValues = []int{}
		}

		result[competency] = modeValues
	}

	return result
}
