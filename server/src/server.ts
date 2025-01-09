import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { register, login, forgotPassword, resetPassword, confirmEmail, sendConfirmationEmail } from './auth';
import { initializeDB } from './databaseInitializer';
import dotenv from 'dotenv';
import { createProjectGroup, createProject, editProjectGroup, editProject,getProjectGroups, getProjects, getSemesters, joinProject, leaveProject, getUserProjects, getUserProjectGroups, getUsersByStatus, updateUserStatus, updateAllConfirmedUsers } from './projectManagement';
import { sendStandupsEmail, saveHappinessMetric, createSprints, getProjectHappinessMetrics, getSprints, getProjectCurrentSprint, getProjectURL } from './projectFeatures';
import { changeEmail, changePassword, setUserGitHubUsername, getUserGitHubUsername, setUserProjectURL, getUserProjectURL } from './userConfig';
import { ObjectHandler } from './ObjectHandler';
import { User } from './shared_models/User';
import { Course } from './shared_models/Course';
import { CourseProject } from './shared_models/CourseProject';
import { join } from 'path';
import { aw } from 'vitest/dist/chunks/reporters.D7Jzd9GS.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

initializeDB().then((db) => {


  
  const objectHandler = new ObjectHandler(db);
  console.log("Database initialized, starting server...");

  app.get('/', (req, res) => {
    res.send('Server is running!');
  });

  app.get('/semesters', (req, res) => { getSemesters(req, res, db) });
  app.get('/project-groups', (req, res) => { getProjectGroups(req, res, db) });
  app.get('/projects', (req, res) => { getProjects(req, res, db) });
  app.get('/userProjects', (req, res) => { getUserProjects(req, res, db) });
  app.get('/getHappinessData', (req, res) => { getProjectHappinessMetrics(req, res, db) });
  app.get('/sprints', (req, res) => { getSprints(req, res, db) });
  app.get('/currentSprint', (req, res) => { getProjectCurrentSprint(req, res, db) });
  app.get('/getGitURL', (req, res) => { getUserProjectURL(req, res, db) });
  app.get('/getUserGitHubUsername', (req, res) => { getUserGitHubUsername(req, res, db) });
  app.get('/getUserProjectGroups', (req, res) => { getUserProjectGroups(req, res, db) });
  app.get('/getProjectGitHubURL', (req, res) => { getProjectURL(req, res, db) });
  app.get('/getUserStatus', (req, res) => { getUsersByStatus(req, res, db) });


  app.post('/user', (req, res) => register(req, res, db));
  app.post('/courseProject/:courseProjectId/user/:userId', async (req, res) => {
    //   const user = await objectHandler.getUser(req.params.userId);
    //   const courseProject = await objectHandler.getCourseProject(req.params.courseProjectId);
    //   if (!user || !courseProject) { return; }
    // if (!user.joinProject(courseProject)) { 
    //   res.status(400).json({ message: 'Project join failed' });
    //   return;
    // }
    // res.status(200).json({ message: 'Project join successful' });
    joinProject(req, res, db);
  });

  app.delete('/courseProject/:courseProjectId/user/:userId', async (req, res) => {
    // const user = await objectHandler.getUser(req.params.userId);
    // const courseProject = await objectHandler.getCourseProject(req.params.courseProjectId);
    // if (!user || !courseProject) { return; }
    // if (!user.leaveProject(courseProject)) { 
    //   res.status(400).json({ message: 'Project leave failed' });
    //   return;
    // }
    // res.status(200).json({ message: 'Project leave successful' });
    leaveProject(req, res, db)
    }
  );

  app.post('/user/:userId/email', async (req, res) => {
    // const user = await objectHandler.getUser(req.params.userId);
    // if (!user) { res.status(400).json({ message: 'User not found' }); return; }
    // user.changeEmail(req.body.email);
    changeEmail(req, res, db)
  });

  app.post('/user/password', (req, res) => changePassword(req, res, db));
  app.post('/session', (req, res) => login(req, res, db));
  app.post('/user/password/forgotMail', (req, res) => forgotPassword(req, res, db));
  app.post('/user/password', (req, res) => resetPassword(req, res, db));
  app.post('/course', (req, res) => createProjectGroup(req, res, db));
  app.post('/project', (req, res) => createProject(req, res, db));
  app.put('/course', (req, res) => editProjectGroup(req, res, db));
  app.put('/courseProject', (req, res) => editProject(req, res, db));
  app.post('/user/githubUsername', (req, res) => setUserGitHubUsername(req, res, db));
  app.post('/project/standupsEmail', (req, res) => sendStandupsEmail(req, res, db));
  app.post('/happiness', (req, res) => saveHappinessMetric(req, res, db));
  app.post('/happiness/sprint', (req, res) => createSprints(req, res, db));
  app.post('/user/project/url', (req, res) => setUserProjectURL(req, res, db));
  app.post('/user/confirmation/email', (req, res) => confirmEmail(req, res, db));
  app.post('/user/status', (req, res) => updateUserStatus(req, res, db));
  app.post('/user/confirmation/trigger', (req, res) => sendConfirmationEmail(req, res, db))
  app.post('/user/status', (req, res) => updateAllConfirmedUsers(req, res, db));

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to initialize the database:', error);
});
