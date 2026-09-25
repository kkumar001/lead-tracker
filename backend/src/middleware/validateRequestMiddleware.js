export const validateRequestMiddleware = (schema) => {
    return async (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errorMessages = result.error.issues.map((issue) => issue.message).join(", ");
            return res.status(400).json({
                status: 400,
                message: errorMessages,
                data: null
            })
        }

        next();
    }
}