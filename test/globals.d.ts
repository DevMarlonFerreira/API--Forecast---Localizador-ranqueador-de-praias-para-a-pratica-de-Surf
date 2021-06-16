declare namespace NodeJS {
  interface Global {
    testRequest: import('Supertest').SuperTest<import('supertest').Test>;
  }
}
