package service

func (service *serviceStruct) ConvertLevelType(cleverLevelType string, difficulty string) string {
	const (
		PrePostTest       = "pre-post-test"
		SubLessonPostTest = "sub-lesson-post-test"
		Easy              = "easy"
		Medium            = "medium"
		Hard              = "hard"
	)

	levelTypes := map[string]string{
		PrePostTest:       "ด่านทดสอบก่อนเรียน",
		SubLessonPostTest: "ด่านทดสอบบทเรียนย่อยก่อนเรียน",
	}

	difficulties := map[string]string{
		Easy:   "ด่านง่าย",
		Medium: "ด่านปานกลาง",
		Hard:   "ด่านยาก",
	}

	if translated, found := levelTypes[cleverLevelType]; found {
		return translated
	}

	if translated, found := difficulties[difficulty]; found {
		return translated
	}

	return ""
}
