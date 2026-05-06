// import { Navigate, Outlet, Route } from 'react-router-dom';
import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';
// // P100
// import P100TeacherDashboard from '@domain/p100-teacher-dashboard';
// // P110
// import P110TeacherHomework from '@domain/p110-teacher-homework';
// import P111TeacherHomeworkDetail from '@domain/p111-teacher-homework-detail';
// import P112TeacherHomeworkCreate from '@domain/p112-teacher-homework-create';
// // P120
// import P120TeacherScore from '@domain/p120-teacher-score';
// // P130
// import P130TeacherStudent from '@domain/p130-teacher-student';
// import P131TeacherStudentDetail from '@domain/p131-teacher-student-detail';
// // P140
// import P140TeacherChat from '@domain/p140-teacher-chat';
// import P141TeacherChatMessage from '@domain/p141-teacher-chat-message';
// // P160
// import P160TeacherMenu from '@domain/p160-teacher-menu';
// //
// import RouteRole from '../component/atoms/route-role';
// import TemplateTeacher from '../component/templates/template-teacher';

const i18nList: HelperI18NextInterface['I18NDomainInterface'][] = [
  // // P100
  // P100TeacherDashboard.I18N,
  // // P110
  // P110TeacherHomework.I18N,
  // P111TeacherHomeworkDetail.I18N,
  // P112TeacherHomeworkCreate.I18N,
  // // P120
  // P120TeacherScore.I18N,
  // // P130
  // P130TeacherStudent.I18N,
  // P131TeacherStudentDetail.I18N,
  // // P140
  // P140TeacherChat.I18N,
  // P141TeacherChatMessage.I18N,
  // // P160
  // P160TeacherMenu.I18N,
];

// const sRole = 'teacher';
const JSX = (
  <></>
  // <Route
  //   path="teacher"
  //   element={
  //     <RouteRole sRole={sRole}>
  //       <TemplateTeacher>
  //         <Outlet />
  //       </TemplateTeacher>
  //     </RouteRole>
  //   }
  // >
  //   <Route index element={<Navigate replace to="dashboard" />} />
  //   <Route path="dashboard">
  //     <Route index element={<P100TeacherDashboard.JSX />} />
  //   </Route>

  //   <Route path="classroom/:teacherID/group">
  //     <Route index element={<Navigate replace to="../.." />} />
  //     <Route path=":groupID">
  //       <Route index element={<Navigate replace to="homework" />} />
  //       {/* // ================= */}
  //       <Route path="homework">
  //         <Route index element={<P110TeacherHomework.JSX />} />
  //         <Route path=":missionID" element={<P111TeacherHomeworkDetail.JSX />} />
  //         <Route path="create" element={<P112TeacherHomeworkCreate.JSX />} />
  //       </Route>

  //       <Route path="score" element={<P120TeacherScore.JSX />} />

  //       <Route path="student">
  //         <Route index element={<P130TeacherStudent.JSX />} />
  //         <Route path=":studentID" element={<P131TeacherStudentDetail.JSX />} />
  //       </Route>
  //     </Route>
  //   </Route>

  //   <Route path="chat">
  //     <Route index element={<P140TeacherChat.JSX />} />
  //     <Route path=":chatID" element={<P141TeacherChatMessage.JSX />} />
  //   </Route>
  //   <Route path="menu" element={<P160TeacherMenu.JSX />} />
  // </Route>
);

export default { JSX, i18nList };
