require('./helpers');
const chai = require('chai');
const spies = require('chai-spies');
const nock = require('nock');
chai.use(spies);

const rando = Math.ceil(Math.random() * 1000);

describe('submitData()', () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = chai.spy.on(window, 'fetch');
  });

  afterEach(() => {
    chai.spy.restore(window, 'fetch');
  });

  it('makes a POST request to /users with a name and email', async () => {
    const reqBody = { name: 'Steve', email: 'steve@steve.com' };
    const expectedHeaders = {
      'content-type': 'application/json',
      'accept': 'application/json',
    };

    nock('http://localhost:3000')
      .post('/users', reqBody)
      .reply(201, { id: rando, ...reqBody });

    await submitData('Steve', 'steve@steve.com');

    expect(fetchSpy).to.have.been.called.with('http://localhost:3000/users', {
      method: 'POST',
      headers: expectedHeaders,
      body: JSON.stringify(reqBody),
    });
  });

  it('handles the POST request response, retrieves the new id value and appends it to the DOM', async () => {
    const reqBody = { name: 'Sam', email: 'sam@sam.com' };

    nock('http://localhost:3000')
      .post('/users', reqBody)
      .reply(201, { id: rando, ...reqBody });

    await submitData('Sam', 'sam@sam.com');

    expect(document.body.innerHTML).to.include(rando);
  });

  it('handles a failed POST request using catch, appends the error message to the DOM', async () => {
    const errorMessage = 'Unauthorized Access';
    const reqBody = { name: 'Jim', email: 'jim@jim.com' };

    nock('http://localhost:3000')
      .post('/users', reqBody)
      .replyWithError({
        message: errorMessage,
        code: '401',
      });

    await submitData('Jim', 'jim@jim.com');

    expect(document.body.innerHTML).to.include(errorMessage);
  });
});
