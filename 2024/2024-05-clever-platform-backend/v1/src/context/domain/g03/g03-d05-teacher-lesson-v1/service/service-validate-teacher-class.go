package service

type ValidateTeacherClassInput struct {
	SubjectId string
	ClassId   int
}

func (service *serviceStruct) ValidateTeacherClass(in *ValidateTeacherClassInput) error {
	//isExists, err := service.teacherLessonStorage.ClassTeacherCaseExistence(in.ClassId, in.SubjectId)
	//if err != nil {
	//	return err
	//}
	//
	//if !*isExists {
	//	msg := fmt.Sprintf("Teacher is not in charge of this class")
	//	return helper.NewHttpError(http.StatusBadRequest, &msg)
	//}

	return nil
}
