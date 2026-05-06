import { lazy } from 'react';
// import EditAchievement from '../pages/GM/Achievement/components/template/EditAchievement';
import TemplateSubject from '../pages/Teacher/Homework/components/template/Template/TemplateSubject';
import EditTemplate from '../pages/Teacher/Homework/components/template/Template/EditTemplate';
import EditHomework from '../pages/Teacher/Homework/components/template/Homework/Edit/EditHomework';
import HomeworkSubject from '../pages/Teacher/Homework/components/template/Homework/HomeworkSubject';

import Sublesson from '@/pages/Teacher/Lesson/Sublesson';
import AddHomework from '@/pages/Teacher/Homework/components/template/Homework/Post';

import Phorpor6 from '@/pages/Teacher/Phorpor6';
// import GetByHomework from '../pages/Teacher/Homework/components/template/Homework/Edit/GetByHomework';

const Index = lazy(() => import('../pages/Index'));
const CreateQuestion = lazy(() => import('../pages/ContentCreator/CreateQuestion'));
const CreateSetting = lazy(() => import('../pages/ContentCreator/CreateSetting'));
const CreateTranslate = lazy(() => import('../pages/ContentCreator/CreateTranslate'));
const CreateSound = lazy(() => import('../pages/ContentCreator/CreateSound'));
const CreatePublic = lazy(() => import('../pages/ContentCreator/CreatePublic'));
// const CreateQuiz = lazy(() => import('../pages/ContentCreator/CreateQuiz'));
// const Achievement = lazy(() => import('../pages/GM/Achievement/Achievement'));
const Template = lazy(() => import('../pages/Teacher/Homework/TemplatePage'));
const Homework = lazy(() => import('../pages/Teacher/Homework/HomeworkPage'));
const Lesson = lazy(() => import('../pages/Teacher/Lesson/'));
const GradeManagement = lazy(() => import('@/pages/Teacher/GradeManagement'));
const ManageGroup = lazy(() => import('../pages/Teacher/ManageGroup/'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '/content-creator/create-setting',
        element: <CreateSetting />,
    },
    {
        path: '/content-creator/create-question',
        element: <CreateQuestion />,
    },
    {
        path: '/content-creator/create-translate',
        element: <CreateTranslate />,
    },
    {
        path: '/content-creator/create-sound',
        element: <CreateSound />,
    },
    {
        path: '/content-creator/create-public',
        element: <CreatePublic />,
    },
    // {
    //     path: '/gm/achievement',
    //     element: <Achievement />,
    // },
    // {
    //     path: '/gm/achievement/:checkpointId',
    //     element: <EditAchievement />,
    // },
    {
        path: '/teacher/template',
        element: <Template />,
    },
    {
        path: '/teacher/template/:subjectId',
        element: <TemplateSubject />,
    },
    {
        path: '/teacher/edittemplate/:subjectId',
        element: <EditTemplate />,
    },
    {
        path: '/teacher/homework',
        element: <Homework />,
    },
    {
        path: '/teacher/homework/:subjectId',
        element: <HomeworkSubject />,
    },
    {
        path: '/teacher/addhomework/',
        element: <AddHomework />,
    },
    {
        path: '/teacher/edithomework/:subjectId',
        element: <EditHomework />,
    },
    // {
    //     path: '/teacher/gethomework/:id',
    //     element: <GetByHomework />,
    // },
    {
        path: '/teacher/peplohomework/:id',
        element: <EditHomework />,
    },
    {
        path: '/teacher/lesson',
        element: <Lesson />,
    },
    {
        path: '/teacher/sublesson/:subjectId',
        element: <Sublesson />,
    },
    {
        path: '/teacher/grade-management',
        element: <GradeManagement />,
    },
    {
        path: '/teacher/managegroup',
        element: <ManageGroup />,
    },
    {
        path: '/teacher/phorpor6',
        element: <Phorpor6 />,
    },
];

export { routes };
