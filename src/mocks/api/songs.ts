import { http, HttpResponse } from 'msw';

export default [
  http.get('/songs', () => {
    return HttpResponse.json(['Tom', 'Jerry', 'Spike']);
  }),
];
