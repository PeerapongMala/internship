package service

import (
	"encoding/json"
	"fmt"
	"log"
	"sort"
	"strconv"
	"time"

	gradeFormConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	dataEntryConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

type StudentPorphor6Data struct {
	SchoolName string `json:"school_name"`
	SchoolArea string `json:"school_area"` //สำนักงานเขตพื้นที่การศึกษาประถมศึกษานนทบุรี เขต 1

	EvaluationStudentID int    `json:"evaluation_student_id"`
	CitizenNo           string `json:"citizen_no"`
	Title               string `json:"title"`
	ThaiFirstName       string `json:"thai_first_name"`
	ThaiLastName        string `json:"thai_last_name"`
	EngFirstName        string `json:"eng_first_name"`
	EngLastName         string `json:"eng_last_name"`
	Number              int    `json:"number"`
	StudentID           string `json:"student_id"`
	BirthDate           string `json:"birth_date"`
	Nationality         string `json:"nationality"`
	Religion            string `json:"religion"`
	ParentMaritalStatus string `json:"parent_marital_status"`
	Gender              string `json:"gender"`
	Ethnicity           string `json:"ethnicity"`

	ScorePercentage      float64 `json:"score_percentage"`
	TotalScoreRank       int     `json:"total_score_rank"`
	AverageLearningScore float64 `json:"average_learning_score"` //เกรดเฉลี่ย
	AverageLearningRank  int     `json:"average_learning_rank"`

	Subject []Porphor6Subject `json:"subject"`
	General []Porphor6General `json:"general"`

	SubjectTeacher string `json:"subject_teacher"`
	HeadOfSubject  string `json:"head_of_subject"`
	Principal      string `json:"principal"`
	Registrar      string `json:"registrar"`
	SignDate       string `json:"sign_date"`
	IssueDate      string `json:"issue_date"`

	FatherTitle        string `json:"father_title"`
	FatherFirstName    string `json:"father_first_name"`
	FatherLastName     string `json:"father_last_name"`
	FatherOccupation   string `json:"father_occupation"`
	MotherTitle        string `json:"mother_title"`
	MotherFirstName    string `json:"mother_first_name"`
	MotherLastName     string `json:"mother_last_name"`
	MotherOccupation   string `json:"mother_occupation"`
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

	DocumentNumber string `json:"document_number"`

	AdditionalField map[string]any `json:"additional_field"`
}

func (service *serviceStruct) prepareDataForPorphor6(in *Porphor5CreateRequest, form *gradeFormConstant.GradeEvaluationFormEntity, sheets []dataEntryConstant.EvaluationSheetListEntity) ([]*constant.Porphor6DataEntity, error) {

	evaluationStudent, err := service.gradePorphor5Storage.GetListEvaluationStudent(*form.Id)
	if err != nil {
		log.Printf("gradePorphor5Storage.GetListEvaluationStudent err %s", err.Error())
		return nil, errors.Wrap(err, "get list evaluation student")
	}

	formDetail, err := service.gradePorphor5Storage.FormInfoByFormID(*form.Id)
	if err != nil {
		log.Printf("FormInfoByFormID err %s", err.Error())
		return nil, errors.Wrap(err, fmt.Sprintf("get data from form id %d", form.Id))
	}

	sort.SliceStable(evaluationStudent, func(i, j int) bool {
		return helper.HandleStringPointerField(evaluationStudent[i].StudentID) <= helper.HandleStringPointerField(evaluationStudent[j].StudentID)
	})

	studentData := []StudentPorphor6Data{}
	for i, student := range evaluationStudent {
		studentData = append(studentData, StudentPorphor6Data{
			SchoolName:           helper.HandleStringPointerField(formDetail.SchoolName),
			SchoolArea:           helper.HandleStringPointerField(formDetail.SchoolArea),
			EvaluationStudentID:  student.ID,
			CitizenNo:            helper.HandleStringPointerField(student.CitizenNo),
			Title:                helper.HandleStringPointerField(student.Title),
			ThaiFirstName:        helper.HandleStringPointerField(student.ThaiFirstName),
			ThaiLastName:         helper.HandleStringPointerField(student.ThaiLastName),
			EngFirstName:         helper.HandleStringPointerField(student.EngFirstName),
			EngLastName:          helper.HandleStringPointerField(student.EngLastName),
			Number:               i + 1,
			StudentID:            helper.HandleStringPointerField(student.StudentID),
			BirthDate:            helper.HandleStringPointerField(student.BirthDate),
			Nationality:          helper.HandleStringPointerField(student.Nationality),
			Religion:             helper.HandleStringPointerField(student.Religion),
			ParentMaritalStatus:  helper.HandleStringPointerField(student.ParentMaritalStatus),
			Gender:               helper.HandleStringPointerField(student.Gender),
			Ethnicity:            helper.HandleStringPointerField(student.Ethnicity),
			ScorePercentage:      0,
			TotalScoreRank:       0,
			AverageLearningScore: 0,
			AverageLearningRank:  0,
			Subject:              nil,
			General:              nil,
			SubjectTeacher:       in.SubjectTeacher,
			HeadOfSubject:        in.HeadOfSubject,
			Principal:            in.Principal,
			Registrar:            in.Registrar,
			SignDate:             in.SignDate,
			IssueDate:            in.IssueDate,
			FatherTitle:          helper.HandleStringPointerField(student.FatherTitle),
			FatherFirstName:      helper.HandleStringPointerField(student.FatherFirstName),
			FatherLastName:       helper.HandleStringPointerField(student.FatherLastName),
			FatherOccupation:     "-",
			MotherTitle:          helper.HandleStringPointerField(student.MotherTitle),
			MotherFirstName:      helper.HandleStringPointerField(student.MotherFirstName),
			MotherLastName:       helper.HandleStringPointerField(student.MotherLastName),
			MotherOccupation:     "-",
			GuardianTitle:        helper.HandleStringPointerField(student.GuardianTitle),
			GuardianFirstName:    helper.HandleStringPointerField(student.GuardianFirstName),
			GuardianLastName:     helper.HandleStringPointerField(student.GuardianLastName),
			GuardianRelation:     helper.HandleStringPointerField(student.GuardianRelation),
			GuardianOccupation:   "-",
			AddressNo:            helper.HandleStringPointerField(student.AddressNo),
			AddressMoo:           helper.HandleStringPointerField(student.AddressMoo),
			AddressSubDistrict:   helper.HandleStringPointerField(student.AddressSubDistrict),
			AddressDistrict:      helper.HandleStringPointerField(student.AddressDistrict),
			AddressProvince:      helper.HandleStringPointerField(student.AddressProvince),
			AddressPostalCode:    helper.HandleStringPointerField(student.AddressPostalCode),
			DocumentNumber:       incrementDocumentNumber(in.DocumentNumberStart, i),
			AdditionalField:      nil,
		})
	}

	studentData, err = service.porphor6AddSubject(studentData, sheets)
	if err != nil {
		log.Printf("porphor 6 add subject %+v", errors.WithStack(err))
		return nil, err
	}
	studentData, err = service.porphor6AddGeneral(studentData, sheets)
	if err != nil {
		log.Printf("porphor 6 add general %+v", errors.WithStack(err))
		return nil, err
	}
	studentData, err = service.porphor6AddScoreData(studentData)
	if err != nil {
		log.Printf("porphor 6 add score %+v", errors.WithStack(err))
		return nil, err
	}

	result := []*constant.Porphor6DataEntity{}
	for i, v := range studentData {
		b, err := json.Marshal(v)
		if err != nil {
			log.Printf("json marshal error : %s", err.Error())
			return nil, err
		}

		result = append(result, &constant.Porphor6DataEntity{
			ID:        0,
			FormID:    *form.Id,
			Order:     i,
			StudentID: v.EvaluationStudentID,
			DataJson:  string(b),
		})
	}

	return result, nil
}

type Porphor6Subject struct {
	SubjectCode  string  `json:"subject_code"`
	LearningArea string  `json:"learning_area"`
	SubjectName  string  `json:"subject_name"`
	Hours        int     `json:"hours"`
	Credits      int     `json:"credits"`
	TotalScore   float64 `json:"total_score"`
	AvgScore     float64 `json:"avg_score"`
	Score        float64 `json:"score"`
	Grade        string  `json:"grade"`
	Note         string  `json:"note"`
	SheetID      int     `json:"sheet_id"`
	Type         string  `json:"type"`
}

func (service *serviceStruct) porphor6AddSubject(data []StudentPorphor6Data, sheets []dataEntryConstant.EvaluationSheetListEntity) ([]StudentPorphor6Data, error) {

	subjects := []Porphor6Subject{}
	totalScore := map[int]float64{}
	for _, sheet := range sheets {
		if sheet.EvaluationFormSubjectID == nil {
			log.Printf("sheet id %d is not subject sheet", sheet.ID)
			continue
		}

		subjectDetail, err := service.gradePorphor5Storage.SubjectInfoBySheetID(sheet.ID)
		if err != nil {
			log.Printf("GetEvaluationDataBySheetId err %s", err.Error())
			return nil, errors.Wrap(err, fmt.Sprintf("get data from sheet id %d", sheet.ID))
		}

		subjects = append(subjects, Porphor6Subject{
			SubjectCode:  helper.Deref(subjectDetail.Code),
			LearningArea: helper.Deref(subjectDetail.LearningArea),
			SubjectName:  helper.HandleStringPointerField(subjectDetail.SubjectName),
			Hours:        helper.Deref(subjectDetail.Hours),
			TotalScore:   subjectDetail.TotalScore,
			SheetID:      sheet.ID,
			Credits:      subjectDetail.Credits,
			Type:         helper.Deref(subjectDetail.Type),
		})
		totalScore[sheet.ID] = subjectDetail.TotalScore
	}
	subjects = service.porphor6SortSubject(subjects)

	mStudentScoreData := make(map[int]map[int]Porphor6Subject)
	mAvgScore := make(map[int]float64)
	for _, sheet := range sheets {
		if sheet.EvaluationFormSubjectID == nil {
			//log.Printf("sheet id %d is not subject sheet", sheet.ID)
			continue
		}

		sheetData, err := service.gradeDataEntryStorage.GetEvaluationDataBySheetId(sheet.ID, "")
		if err != nil {
			log.Printf("GetEvaluationDataBySheetId err %s", err.Error())
			return nil, errors.Wrap(err, fmt.Sprintf("get data from sheet id %d", sheet.ID))
		}
		var avgScore float64
		var sum float64

		for _, v := range sheetData.StudentScoreData {
			//totalScore, _ := v.AdditionalFields[constant.FieldTotalScore].(float64)
			//sum += totalScore
			for _, indicator := range v.StudentIndicatorData {
				if floatVal, ok := indicator.Value.(float64); ok {
					sum += floatVal
				}
			}
		}
		if len(sheetData.StudentScoreData) > 0 {
			avgScore = sum / float64(len(sheetData.StudentScoreData))
		}
		mAvgScore[sheet.ID] = avgScore

		studentScoreDataMap := map[int]float64{}
		for _, studentScore := range sheetData.StudentScoreData {
			_, ok := studentScoreDataMap[studentScore.EvaluationStudentID]
			z := 0.00
			for _, indicator := range studentScore.StudentIndicatorData {
				value, _ := indicator.Value.(float64)
				z += value
			}
			if !ok {
				studentScoreDataMap[studentScore.EvaluationStudentID] = z
			} else {
				studentScoreDataMap[studentScore.EvaluationStudentID] += z
			}
		}

		for _, v := range sheetData.StudentScoreData {
			mStudent, ok := mStudentScoreData[v.EvaluationStudentID]
			if !ok || mStudent == nil {
				mStudent = make(map[int]Porphor6Subject)
			}
			//mStudent[sheet.ID] = v
			//totalScore, _ := v.AdditionalFields[constant.FieldTotalScore].(float64)
			//grade, _ := v.AdditionalFields[constant.FieldGrade].(string)

			gradeValue := 0.00
			maxScore := totalScore[sheet.ID]
			if maxScore != 0 {
				gradeValue = studentScoreDataMap[v.EvaluationStudentID] * 100 / maxScore
			}

			if gradeValue > 100 {
				gradeValue = 100
			}

			grade := service.calculateGrade(gradeValue)

			mStudent[sheet.ID] = Porphor6Subject{
				//Score: totalScore,
				Score: studentScoreDataMap[v.EvaluationStudentID],
				Grade: strconv.FormatFloat(grade, 'f', 4, 64),
				Note:  "",
			}

			mStudentScoreData[v.EvaluationStudentID] = mStudent
		}
	}

	//add subject data to student and mapping score
	for i, v := range data {
		mStudent, ok := mStudentScoreData[v.EvaluationStudentID]
		if !ok || mStudent == nil {
			log.Printf("StudentScoreData of evaluation student id %d is empty", v.EvaluationStudentID)
			//return nil, fmt.Errorf("StudentScoreData of evaluation student id %d is empty", v.EvaluationStudentID)
		}

		for _, j := range subjects {
			scoreData := mStudent[j.SheetID]
			v.Subject = append(v.Subject, Porphor6Subject{
				SubjectCode:  j.SubjectCode,
				LearningArea: j.LearningArea,
				SubjectName:  j.SubjectName,
				Credits:      j.Credits,
				Hours:        j.Hours,
				TotalScore:   j.TotalScore,
				AvgScore:     mAvgScore[j.SheetID],
				Score:        scoreData.Score,
				Grade:        scoreData.Grade,
				Note:         "",
				Type:         j.Type,
			})
		}

		data[i].Subject = v.Subject
	}

	return data, nil
}

type Porphor6General struct {
	SubjectName *string `json:"subject_name"`
	GeneralType *string `json:"general_type"`
	GeneralName *string `json:"general_name"`
	dataEntryConstant.StudentScoreData
	MaxAttendance map[string]float64 `json:"max_attendance"`
	Nutrition     json.RawMessage    `json:"nutrition"`
}

func (service *serviceStruct) porphor6AddGeneral(data []StudentPorphor6Data, sheets []dataEntryConstant.EvaluationSheetListEntity) ([]StudentPorphor6Data, error) {
	m := make(map[int]map[int]Porphor6General)
	for _, sheet := range sheets {
		if sheet.EvaluationFormGeneralEvalID == nil {
			//log.Printf("sheet id %d is not general sheet", sheet.ID)
			continue
		}

		sheetData, err := service.gradeDataEntryStorage.GetEvaluationDataBySheetId(sheet.ID, "")
		if err != nil {
			log.Printf("GetEvaluationDataBySheetId err %s", err.Error())
			return nil, errors.Wrap(err, fmt.Sprintf("get data from sheet id %d", sheet.ID))
		}

		maxAttendance := map[string]float64{}
		if helper.Deref(sheet.GeneralType) == string(constant.Attendance) {
			maxAttendance = findMaxAttendance(sheetData.StudentScoreData)
		}
		for _, v := range sheetData.StudentScoreData {
			mStudent, ok := m[v.EvaluationStudentID]
			if !ok || mStudent == nil {
				mStudent = make(map[int]Porphor6General)
			}
			if helper.Deref(sheet.GeneralType) == string(constant.Attendance) {
				v.StudentIndicatorData, err = groupByYearMonth(v.StudentIndicatorData)
				if err != nil {
					return nil, err
				}

			}
			mStudent[sheet.ID] = Porphor6General{
				SubjectName:      sheet.SubjectName,
				GeneralType:      sheet.GeneralType,
				GeneralName:      sheet.GeneralName,
				StudentScoreData: v,
				MaxAttendance:    maxAttendance,
			}
			if helper.Deref(sheet.GeneralType) == string(constant.NutritionalStatus) {
				type DateEntry struct {
					Date string `json:"date"`
				}
				type NutritionWrapper struct {
					Nutrition [][]DateEntry `json:"nutrition"`
				}

				var wrapper NutritionWrapper
				err := json.Unmarshal(helper.Deref(sheetData.AdditionalData), &wrapper)
				if err != nil {
					return nil, err
				}

				nutritionJson, err := json.Marshal(wrapper.Nutrition)
				if err != nil {
					return nil, err
				}
				pp := mStudent[sheet.ID]
				pp.Nutrition = nutritionJson
				mStudent[sheet.ID] = pp

			}

			m[v.EvaluationStudentID] = mStudent
		}
	}

	for i, v := range data {
		l := m[v.EvaluationStudentID]
		for _, vv := range l {
			data[i].General = append(data[i].General, vv)
		}
	}

	return data, nil
}

func (service *serviceStruct) porphor6AddScoreData(data []StudentPorphor6Data) ([]StudentPorphor6Data, error) {
	for i, v := range data {
		data[i].ScorePercentage = service.porphor6CalculateScorePercentage(v.Subject)
		data[i].AverageLearningScore = service.porphor6CalculateAverageLearningScore(v.Subject)
	}

	assignRank(&data, "total")
	assignRank(&data, "average")

	return data, nil
}

// TODO implement me
func (service *serviceStruct) porphor6SortSubject(data []Porphor6Subject) []Porphor6Subject {
	return data
}

func (service *serviceStruct) porphor6CalculateScorePercentage(data []Porphor6Subject) float64 {
	var score, total float64
	for _, v := range data {
		score += v.Score
		total += v.TotalScore
	}

	if total == 0 {
		return 0
	}
	return score / total * 100
}

func (service *serviceStruct) porphor6CalculateAverageLearningScore(data []Porphor6Subject) float64 {
	if len(data) == 0 {
		return 0
	}
	var sum float64
	for _, v := range data {
		grade, _ := strconv.ParseFloat(v.Grade, 64)
		sum += grade
	}
	return sum / float64(len(data))
}

func assignRank(data *[]StudentPorphor6Data, rankType string) {
	// 1) Build a slice of all indices: [0, 1, 2, ...]
	n := len(*data)
	indices := make([]int, n)
	for i := 0; i < n; i++ {
		indices[i] = i
	}

	// 2) Decide which field to sort by
	var getScore func(StudentPorphor6Data) float64
	switch rankType {
	case "total":
		getScore = func(s StudentPorphor6Data) float64 { return s.ScorePercentage }
	case "average":
		getScore = func(s StudentPorphor6Data) float64 { return s.AverageLearningScore }
	default:
		// If an invalid rankType is given, do nothing
		return
	}

	// 3) Sort indices by descending score
	sort.Slice(indices, func(i, j int) bool {
		return getScore((*data)[indices[i]]) > getScore((*data)[indices[j]])
	})

	// 4) Assign “competition” ranks
	//    - If same score as previous, same rank
	//    - Otherwise rank = (i + 1)
	if len(indices) > 0 {
		setRankForIndex(data, indices[0], rankType, 1) // First item always rank 1
	}
	for i := 1; i < n; i++ {
		currentIdx := indices[i]
		prevIdx := indices[i-1]

		currentScore := getScore((*data)[currentIdx])
		prevScore := getScore((*data)[prevIdx])

		if currentScore == prevScore {
			// tie => same rank as previous
			copyRank(data, currentIdx, prevIdx, rankType)
		} else {
			// new rank => i+1
			setRankForIndex(data, currentIdx, rankType, i+1)
		}
	}
}

// Helper to set a specific rank field
func setRankForIndex(data *[]StudentPorphor6Data, idx int, rankType string, rank int) {
	switch rankType {
	case "total":
		(*data)[idx].TotalScoreRank = rank
	case "average":
		(*data)[idx].AverageLearningRank = rank
	}
}

// Helper to copy rank from src item to dst item
func copyRank(data *[]StudentPorphor6Data, dstIdx, srcIdx int, rankType string) {
	switch rankType {
	case "total":
		(*data)[dstIdx].TotalScoreRank = (*data)[srcIdx].TotalScoreRank
	case "average":
		(*data)[dstIdx].AverageLearningRank = (*data)[srcIdx].AverageLearningRank
	}
}

func incrementDocumentNumber(numStr string, increase int) string {
	num, err := strconv.Atoi(numStr) // Convert string to integer
	if err != nil {
		return numStr // should not happen
	}

	num += increase
	newStr := fmt.Sprintf("%0*d", len(numStr), num) // Convert back with leading zeros

	return newStr
}

func groupByYearMonth(data []dataEntryConstant.StudentIndicatorData) ([]dataEntryConstant.StudentIndicatorData, error) {
	grouped := make(map[string]*dataEntryConstant.StudentIndicatorData)

	for _, item := range data {
		if item.IndicatorGeneralName == nil {
			continue
		}

		dateStr := *item.IndicatorGeneralName
		t, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			return nil, err
		}

		yearMonth := t.Format("2006-01")

		if _, exists := grouped[yearMonth]; !exists {
			grouped[yearMonth] = &dataEntryConstant.StudentIndicatorData{
				IndicatorGeneralName: &yearMonth,
				Value:                0,
			}
		}

		switch v := item.Value.(type) {
		case int:
			if v > 0 {
				v = 1
			}
			switch current := grouped[yearMonth].Value.(type) {
			case int:
				grouped[yearMonth].Value = current + v
			case float64:
				grouped[yearMonth].Value = current + float64(v)
			}
		case float64:
			if v > 0 {
				v = 1
			}
			switch current := grouped[yearMonth].Value.(type) {
			case int:
				grouped[yearMonth].Value = float64(current) + v
			case float64:
				grouped[yearMonth].Value = current + v
			}
		}
	}

	result := make([]dataEntryConstant.StudentIndicatorData, 0, len(grouped))
	for _, v := range grouped {
		result = append(result, *v)
	}

	return result, nil
}

func findMaxAttendance(data dataEntryConstant.StudentScoreDataList) map[string]float64 {
	maxAttendance := map[string]float64{}
	for _, student := range data {
		studentAttendance := map[string]float64{}
		for _, indicator := range student.StudentIndicatorData {
			key := helper.Deref(indicator.IndicatorGeneralName)
			_, ok := studentAttendance[key]
			if !ok {
				studentAttendance[key] = 0
				continue
			}
			if floatVal, ok := indicator.Value.(float64); ok {
				if floatVal > 0 {
					floatVal = 1
				}
				studentAttendance[key] += floatVal
			} else {
				continue
			}
		}
		for month, attendance := range studentAttendance {
			_, ok := maxAttendance[month]
			if !ok {
				maxAttendance[month] = attendance
				continue
			}
			if attendance > maxAttendance[month] {
				maxAttendance[month] = attendance
			}
		}
	}
	return maxAttendance
}
