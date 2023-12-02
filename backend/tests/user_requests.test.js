const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/userModel');
const {
  entryUserCredentials,
  standardUserInfo,
  adminUserInfo,
  getStandardUserCredentials,
  getAdminUserCredentials,
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

    // all the same values out that we put in
    expect(returnedUser.username).toEqual(standardUserInfo.username);
    expect(returnedUser.displayname).toEqual(standardUserInfo.displayname);
    expect(returnedUser.email).toEqual(standardUserInfo.email);
    expect(returnedUser.isAdmin).toEqual(false);

    // returns an id
    expect(returnedUser.id).toBeDefined();

    // doesn't return password or admin hash
    expect(returnedUser.passwordHash).toBeUndefined();
    expect(returnedUser.adminHash).toBeUndefined();
  });

  // note that this requires the previous test to run first
  // it won't work as test.only()
  test('fails with duplicate username and email', async () => {
    const response = await api
        .post('/api/users')
        .send(standardUserInfo)
        .expect(400);

    expect(response.body.error)
        .toContain('expected `username` to be unique');

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
  });
});

describe('login requests', () => {
  // setup test DB
  beforeAll(async () => {
    // clear users from DB
    await User.deleteMany({});

    // add entry 'user'
    const entryUser = new User(entryUserCredentials);
    await entryUser.save();

    // add standard user
    const standardUserCredentials = await getStandardUserCredentials();
    const standardUser = new User(standardUserCredentials);
    await standardUser.save();

    // add 'imposter' admin user

    // add valid admin user
    const adminUserCredentials = await getAdminUserCredentials();
    const adminUser = new User(adminUserCredentials);
    await adminUser.save();
  });

  test('dummy', () => {
    expect('1').toEqual('1');
  });
});

// logins: entry, regular, "imposter" admin, valid admin

afterAll(async () => {
  await mongoose.connection.close();
});
