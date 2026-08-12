import { setupWorker } from 'msw/browser';
import { userHandlers } from './handlers/users';
import { analyticsHandlers } from './handlers/analytics';

export const worker = setupWorker(...userHandlers, ...analyticsHandlers);
