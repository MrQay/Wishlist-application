// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import AxiosMockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// Create a new instance of axios-mock-adapter for all HTTP requests
const axiosMock = new AxiosMockAdapter(axios);

// Export axiosMock for use in our tests
export { axiosMock };
