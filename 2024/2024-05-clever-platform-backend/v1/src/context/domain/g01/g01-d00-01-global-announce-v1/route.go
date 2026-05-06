package g01D0001globalannounceV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1/service"

	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	//// TEST ครบทุกเส่นแล้ว ////

	app.Post(path+"/v1/announcements", api.CreateAnnounce)
	app.Delete(path+"/v1/delete", api.DeleteAnnounce)
	app.Post(path+"/v1/update", api.UpdateAnnounce)
	app.Get(path+"/v1/announces", api.GetAnnounce)
	app.Post(path+"/v1/system-announce", api.SystemDailyAnnounce)
	app.Post(path+"/v1/teacher-announce", api.TeacherDailyAnnounce)

}
