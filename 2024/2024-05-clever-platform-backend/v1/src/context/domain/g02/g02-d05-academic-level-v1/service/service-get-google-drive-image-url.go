package service

import "os"

type GetGoogleDriveImageUrlInput struct {
	FileName     string
	RootFolderId string
}

type GetGoogleDriveImageUrlOutput struct {
	FileUrl string
}

func (service *serviceStruct) GetGoogleDriveImageUrl(in *GetGoogleDriveImageUrlInput) (*GetGoogleDriveImageUrlOutput, error) {
	bucketName := os.Getenv("OBS_BUCKET_NAME")
	return &GetGoogleDriveImageUrlOutput{
		FileUrl: "https://" + bucketName + ".obs.ap-southeast-2.myhuaweicloud.com/Artwork%20clever%20math%20_%20Nextgen-20250313T081933Z-001/Artwork%20clever%20math%20_%20Nextgen/" + in.FileName,
	}, nil
}

//func recursiveSearch(srv *drive.Service, fileName string, parentFolderId string) (*string, error) {
//	query := fmt.Sprintf("name='%s' and '%s' in parents and trashed=false", fileName, parentFolderId)
//	files, err := srv.Files.List().Q(query).Fields("files(id, name)").Do()
//	if err != nil {
//		return nil, err
//	}
//
//	if len(files.Files) > 0 {
//
//		//fileURL := fmt.Sprintf("https://drive.google.com/file/d/%s/view?usp=sharing", files.Files[0].Id)
//		fileURL := fmt.Sprintf("https://lh3.google.com/u/0/d/%s", files.Files[0].Id)
//		return &fileURL, nil
//	}
//
//	query = fmt.Sprintf("'%s' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false", parentFolderId)
//	childFolders, err := srv.Files.List().Q(query).Fields("files(id)").Do()
//	if err != nil {
//		return nil, err
//	}
//
//	for _, folder := range childFolders.Files {
//		log.Println(folder.Id)
//		foundFile, err := recursiveSearch(srv, fileName, folder.Id)
//		if err != nil {
//			return nil, err
//		}
//		if foundFile != nil {
//			return foundFile, nil
//		}
//	}
//
//	return nil, nil
//}
