import RestAPIDasboard from './group/gamification/restapi';
import { DashboardRepository } from './repository';

// ======================= Environment Import ================================
let dashboardAPI: DashboardRepository = RestAPIDasboard;

// ===========================================================================
const API = { dashboard: dashboardAPI };

export default API;
