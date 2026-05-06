import RestAPIUpload from './group/upload/restapi';
import { UploadRepository } from './repository';

// ======================= Environment Import ================================
let uploadAPI: UploadRepository = RestAPIUpload;

// ===========================================================================
const API = {
  Upload: uploadAPI,
};

export default API;
