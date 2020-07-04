/**
 * Middleware function to manage try/catch logic for routes. 
 * This helps us focus on only the route handler logic within route code blocks.
 * @param { Function Ref } handler Asynchronous request/response route handler logic
 * @return { Function Ref } Asynchronous request/response logic augmented with try/catch logic 
 *                          that leverages the custom error middleware with next().
 */
module.exports = function asyncMiddleware (routeHandler) {
    // Return an asynchronous function reference that's meant to be the route handler
    return async (req, res, next) => {
        try {
            await routeHandler(req, res);
        }
        catch (ex) {
            next(ex);
        }
    };
}