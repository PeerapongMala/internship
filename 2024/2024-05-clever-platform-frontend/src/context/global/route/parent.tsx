// import { Navigate, Outlet, Route } from 'react-router-dom';
import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';
// // P200
// import P200ParentDashboard from '@domain/p200-parent-dashboard';
// import P201ParentStudentAdd from '@domain/p201-parent-student-add';
// // P210
// import P210ParentHomework from '@domain/p210-parent-homework';
// // P220
// import P220ParentChat from '@domain/p220-parent-chat';
// import P221ParentChatMessage from '@domain/p221-parent-chat-message';
// // P240
// import P240ParentMenu from '@domain/p240-parent-menu';
// //
// import RouteRole from '../component/atoms/route-role';
// import TemplateParent from '../component/templates/template-parent';

const i18nList: HelperI18NextInterface['I18NDomainInterface'][] = [
  // P200
  // P200ParentDashboard.I18N,
  // P201ParentStudentAdd.I18N,
  // // P210
  // P210ParentHomework.I18N,
  // // P220
  // P220ParentChat.I18N,
  // P221ParentChatMessage.I18N,
  // // P240
  // P240ParentMenu.I18N,
];

//  const MappingIDtoRouteName = {
//   // P200
//   p200: 'parent/dashboard',
//   // P210
//   p210: 'parent/homework',
//   p211: 'parent/homework/detail',
//   // P220
//   p220: 'parent/chat',
//   // P240
//   p240: 'parent/menu',
// };

// const sRole = 'parent';
const JSX = (
  <></>
  // <Route
  //   path="parent"
  //   element={
  //     <RouteRole sRole={sRole}>
  //       <TemplateParent>
  //         <Outlet />
  //       </TemplateParent>
  //     </RouteRole>
  //   }
  // >
  //   <Route index element={<Navigate replace to="dashboard" />} />
  //   <Route path="dashboard">
  //     <Route index element={<P200ParentDashboard.JSX />} />
  //   </Route>
  //   <Route path="student/add">
  //     <Route index element={<P201ParentStudentAdd.JSX />} />
  //   </Route>
  //   <Route path="classroom/:teacherID">
  //     <Route index element={<Navigate replace to="../.." />} />
  //     <Route path="student">
  //       <Route index element={<Navigate replace to="../.." />} />
  //       <Route path=":studentID" element={<P210ParentHomework.JSX />} />
  //     </Route>
  //   </Route>

  //   <Route path="chat">
  //     <Route index element={<P220ParentChat.JSX />} />
  //     <Route path=":chatID" element={<P221ParentChatMessage.JSX />} />
  //   </Route>

  //   <Route path="menu" element={<P240ParentMenu.JSX />} />
  // </Route>
);

export default { JSX, i18nList };
