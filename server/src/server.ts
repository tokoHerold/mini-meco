import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { register, login, forgotPassword, resetPassword, confirmEmail, sendConfirmationEmail } from './auth';
import { initializeDB } from './databaseInitializer';
import dotenv from 'dotenv';
import { createProjectGroup, createProject, editProjectGroup, editProject,getProjectGroups, getProjects, getSemesters, joinProject, leaveProject, getUserProjects, getUserProjectGroups, getUsersByStatus, updateUserStatus, updateAllConfirmedUsers } from './projectManagement';
import { sendStandupsEmail, saveHappinessMetric, createSprints, getProjectHappinessMetrics, getSprints, getProjectCurrentSprint, getProjectURL } from './projectFeatures';
import { changeEmail, changePassword, setUserGitHubUsername, getUserGitHubUsername, setUserProjectURL, getUserProjectURL, changeUserProjectURL } from './userConfig';

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

initializeDB().then((db) => {
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
  app.post('/user/project', (req, res) => joinProject(req, res, db));
  app.delete('/user/project', (req, res) => leaveProject(req, res, db));
  app.post('/user/email', (req, res) => changeEmail(req, res, db));
  app.post('/user/password', (req, res) => changePassword(req, res, db));
  app.post('/session', (req, res) => login(req, res, db));
  app.post('/user/password/forgotMail', (req, res) => forgotPassword(req, res, db));
  app.post('/user/password', (req, res) => resetPassword(req, res, db));
  app.post('/course', (req, res) => createProjectGroup(req, res, db));
  app.post('/project', (req, res) => createProject(req, res, db));
  app.put('/course', (req, res) => editProjectGroup(req, res, db));
  app.put('/project', (req, res) => editProject(req, res, db));
  app.post('/user/githubUsername', (req, res) => setUserGitHubUsername(req, res, db));
  app.post('/project/standupsEmail', (req, res) => sendStandupsEmail(req, res, db));
  app.post('/happiness', (req, res) => saveHappinessMetric(req, res, db));
  app.post('/happiness/sprint', (req, res) => createSprints(req, res, db));
  app.post('/user/project/url', (req, res) => setUserProjectURL(req, res, db));
  app.post('/confirmEmail', (req, res) => confirmEmail(req, res, db));
  app.post('/updateUserStatus', (req, res) => updateUserStatus(req, res, db));
  app.post('/sendConfirmationEmail', (req, res) => sendConfirmationEmail(req, res, db))
  app.post('/updateAllConfirmedUsers', (req, res) => updateAllConfirmedUsers(req, res, db));

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to initialize the database:', error);
});
