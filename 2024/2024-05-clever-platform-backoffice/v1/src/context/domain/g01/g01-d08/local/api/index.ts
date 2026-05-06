import AdminFamilyRestAPI from '@domain/g01/g01-d08/local/api/group/admin-family/restapi';
import { AdminFamilyRepository } from '@domain/g01/g01-d08/local/api/repository/admin-family.ts';

// ======================= Environment Import ================================
const adminFamilyAPI: AdminFamilyRepository = AdminFamilyRestAPI;

// ===========================================================================
const API = {
  adminFamily: adminFamilyAPI,
};

export default API;
