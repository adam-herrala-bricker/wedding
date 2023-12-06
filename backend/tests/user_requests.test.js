const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/userModel');
const {ENTRY_KEY} = require('../utils/config');
const {
  entryUserCredentials,
  standardUserInfo,
  adminUserInfo,
  imposterInfo,
  getStandardUserCredentials,
  getAdminUserCredentials,
  getImposterCredentials,
} = require('../utils/test_constants');

describe('user creation', () => {
  // need to clear out the DB before testing adding users
  beforeAll(async () => {
    await User.deleteMany({});
  });

  test('fails without username', async () => {
    // don't want thisUser refering to the same object
    const thisUser = {...standardUserInfo};
    delete thisUser.username;
    await api
        .post('/api/users')
        .send(thisUser)
        .expect(400);
  });

  test('fails without password', async () => {
    const thisUser = {...standardUserInfo};
    delete thisUser.password;

    const response = await api
        .post('/api/users')
        .send(thisUser)
        .expect(400);

    expect(response.body.error).toEqual('password required');
  });

  test('fails if password < 3 characters', async () => {
    const thisUser = {...standardUserInfo, password: 'OG'};

    const response = await api
        .post('/api/users')
        .send(thisUser)
        .expect(400);

    expect(response.body.error)
        .toEqual('password must be at least 3 characters long!');
  });

  test('fails with malformated email', async () => {
    const thisUser = {...standardUserInfo, email: 'Joshua_beans'};

    const response = await api
        .post('/api/users')
        .send(thisUser)
        .expect(400);

    expect(response.body.error)
        .toContain('Validator failed for path `email`');
  });

  test('succeeds for valid standard user', async () => {
    const response = await api
        .post('/api/users')
        .send(standardUserInfo)
        .expect(201);

    const returnedUser = response.body;

    // returns all the same values out that we put in
    expect(returnedUser.username).toEqual(standardUserInfo.username);
    expect(returnedUser.displayname).toEqual(standardUserInfo.displayname);
    expect(returnedUser.email).toEqual(standardUserInfo.email);
    expect(returnedUser.isAdmin).toEqual(false);

    // returns an id
    expect(returnedUser.id).toBeDefined();

    // doesn't return password or admin hash
    expect(returnedUser.passwordHash).toBeUndefined();
    expect(returnedUser.adminHash).toBeUndefined();

    // plus user is in database as expected
    const userDB = await User.findById(returnedUser.id);
    expect(userDB.username).toEqual(standardUserInfo.username);
    expect(userDB.displayname).toEqual(standardUserInfo.displayname);
    expect(userDB.email).toEqual(standardUserInfo.email);
    expect(userDB.isAdmin).toEqual(false);
    expect(userDB.passwordHash).toBeTruthy();
    expect(userDB.adminHash).toEqual('');
  });

  // note that the next two require the previous test to run first
  // and won't work as test.only()
  test('fails with duplicate username', async () => {
    const response = await api
        .post('/api/users')
        .send(standardUserInfo)
        .expect(400);

    expect(response.body.error)
        .toContain('expected `username` to be unique');
  });

  test('fails with duplicate email', async () => {
    const response = await api
        .post('/api/users')
        .send(standardUserInfo)
        .expect(400);

    expect(response.body.error)
        .toContain('expected `email` to be unique');
  });

  test('fails to create admin without valid admin key', async () => {
    const thisUser = {...adminUserInfo, adminKey: 'back2gas'};

    const response = await api
        .post('/api/users')
        .send(thisUser)
        .expect(400);

    expect(response.body.error)
        .toEqual('vaild admin key required for admin status');
  });

  test('succeeds with valid admin user', async () => {
    const response = await api
        .post('/api/users')
        .send(adminUserInfo)
        .expect(201);

    const returnedUser = response.body;

    // all the same values out that we put in
    expect(returnedUser.username).toEqual(adminUserInfo.username);
    expect(returnedUser.displayname).toEqual(adminUserInfo.displayname);
    expect(returnedUser.email).toEqual(adminUserInfo.email);
    expect(returnedUser.isAdmin).toEqual(true);

    // returns an id
    expect(returnedUser.id).toBeDefined();

    // doesn't return password or admin hash
    expect(returnedUser.passwordHash).toBeUndefined();
    expect(returnedUser.adminHash).toBeUndefined();

    // plus user is in the database as expected
    const userDB = await User.findById(returnedUser.id);
    expect(userDB.username).toEqual(adminUserInfo.username);
    expect(userDB.displayname).toEqual(adminUserInfo.displayname);
    expect(userDB.email).toEqual(adminUserInfo.email);
    expect(userDB.isAdmin).toEqual(true);
    expect(userDB.passwordHash).toBeTruthy();
    expect(userDB.adminHash).toBeTruthy();
  });
});

describe('login requests', () => {
  // setup test DB
  beforeAll(async () => {
    // clear users from DB
    await User.deleteMany({});

    // entry 'user'
    const entryUser = new User(entryUserCredentials);

    // standard user
    const standardUserCredentials = await getStandardUserCredentials();
    const standardUser = new User(standardUserCredentials);

    // 'imposter' admin user
    const imposterCredentials = await getImposterCredentials();
    const imposterUser = new User(imposterCredentials);

    // valid admin user
    const adminUserCredentials = await getAdminUserCredentials();
    const adminUser = new User(adminUserCredentials);

    // fulfil all promises at once
    const promiseArray = [
      entryUser.save(),
      standardUser.save(),
      imposterUser.save(),
      adminUser.save(),
    ];

    await Promise.all(promiseArray);
  }, 10000);

  test('entry "user" returns user token only', async () => {
    const response = await api
        .post('/api/login')
        .send({
          username: 'entry',
          password: ENTRY_KEY})
        .expect(200);

    expect(response.body.token).toBeTruthy();
    expect(response.body.adminToken).toEqual(null);
    expect(response.body.isAdmin).toEqual(false);
  });

  test('standard user returns user token only', async () => {
    const response = await api
        .post('/api/login')
        .send({
          username: standardUserInfo.username,
          password: standardUserInfo.password})
        .expect(200);

    expect(response.body.token).toBeTruthy();
    expect(response.body.adminToken).toEqual(null);
    expect(response.body.isAdmin).toEqual(false);
  });

  test('admin user returns user + admin tokens', async () => {
    const response = await api
        .post('/api/login')
        .send({
          username: adminUserInfo.username,
          password: adminUserInfo.password})
        .expect(200);

    expect(response.body.token).toBeTruthy();
    expect(response.body.adminToken).toBeTruthy();
    expect(response.body.isAdmin).toEqual(true);
  });

  test('"imposter" login attempt fails', async () => {
    const response = await api
        .post('/api/login')
        .send({
          username: imposterInfo.username,
          password: imposterInfo.password})
        .expect(401);

    expect(response.body.error)
        .toEqual('invalid admin key used to create user');
  });

  test('unknown user login attempt fails', async () => {
    const response = await api
        .post('/api/login')
        .send({
          username: 'mystery.user',
          password: 'example'})
        .expect(401);

    expect(response.body.error)
        .toEqual('invalid username or password');
  });

  test('known user login attempt with incorrect password fails', async () => {
    const response = await api
        .post('/api/login')
        .send({
          username: standardUserInfo.username,
          password: 'this_is_the_wrong_password'})
        .expect(401);

    expect(response.body.error)
        .toEqual('invalid username or password');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
