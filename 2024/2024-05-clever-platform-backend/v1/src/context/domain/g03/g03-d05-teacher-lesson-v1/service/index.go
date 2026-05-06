package service

import teacherLessonStorage "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/storage/storage-repository"

type serviceStruct struct {
	teacherLessonStorage teacherLessonStorage.Repository
}

func ServiceNew(teacherLessonStorage teacherLessonStorage.Repository) ServiceInterface {
	return &serviceStruct{
		teacherLessonStorage: teacherLessonStorage,
	}
}

type APIStruct struct {
	Service ServiceInterface
}
