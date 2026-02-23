module.exports = function requestLogger(req, res, next) {
  // only active in development to avoid leaking sensitive data
  if (process.env.NODE_ENV === 'production') return next();

  // log admin config updates and admin add-teas operations
  const shouldLog = req.method === 'POST' && req.path.match(/\/api\/rewards\/admin\/(users\/.*\/add-teas|config)$/);
  if (!shouldLog) return next();

  try {
    const start = Date.now();
    const oldSend = res.send.bind(res);

    // wrap send to capture response body and elapsed time
    res.send = function (body) {
      try {
        const elapsed = Date.now() - start;
        console.log('[req-logger] %s %s -> status=%d elapsed=%dms', req.method, req.path, res.statusCode, elapsed);
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
