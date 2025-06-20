module.exports.validateRequestBody = (req, res, next) => {
    try {
      const scriptTagRegex = /<script.?>.?<\/script.?>|<.?>/gi;
  
      // Function to decode basic HTML entities
      const decodeHtmlEntities = (str) => {
        return str
          .replace(/</g, '<')
          .replace(/>/g, '>')
          .replace(/&/g, '&')
          .replace(/"/g, '"')
          .replace(/'/g, "'");
      };
  
      const containsScriptTags = (obj) => {
        if (typeof obj === 'object' && obj !== null) {
          return Object.values(obj).some(containsScriptTags);
        }
        if (Array.isArray(obj)) {
          return obj.some(containsScriptTags);
        }
        if (typeof obj === 'string') {
          // Decode HTML entities and test with regex
          const decodedValue = decodeHtmlEntities(obj);
          return scriptTagRegex.test(decodedValue);
        }
        return false;
      };
  
      if (containsScriptTags(req.body)) {
        // Send response with error message directly in the top-level fields
        res.setHeader('Response-Description', 'Request body contains invalid HTML/script tags.');
        res.statusCode = 400;
        res.end();
        return;
      }
  
      next(); // Validation passed
    } catch (err) {
      console.error('Validation Middleware Error:', err);
  
      // Handle unexpected errors in the same flat format
      res.status(500).json({
        code: 500,
        customHeader: undefined,
        message: 'Something went wrong #NRMF1',
        response: null,
      });
    }
  };