module.exports = function requestLogger(req, res, next) {
  // only active in development to avoid leaking sensitive data
  if (process.env.NODE_ENV === 'production') return next();

  const shouldLog = req.method === 'POST' && req.path.match(/\/api\/rewards\/admin\/users\/.*\/add-teas$/);
  if (!shouldLog) return next();

  try {
    const chunks = [];
    const oldSend = res.send.bind(res);

    // capture request body (if parsed already)
    console.log('[req-logger] Incoming', req.method, req.originalUrl);
    console.log('[req-logger] Headers:', req.headers);
    try { console.log('[req-logger] Body:', req.body); } catch (e) { console.log('[req-logger] Body: <unavailable>'); }

    // wrap send to capture response body
    res.send = function (body) {
      try {
        console.log('[req-logger] Response status:', res.statusCode);
        // try stringify safely
        if (body && typeof body === 'object') console.log('[req-logger] Response body:', JSON.stringify(body));
        else console.log('[req-logger] Response body:', String(body));
      } catch (e) {
        console.log('[req-logger] Response body: <could not stringify>');
      }
      return oldSend(body);
    };
  } catch (e) {
    console.error('requestLogger error', e);
  }
  return next();
};
