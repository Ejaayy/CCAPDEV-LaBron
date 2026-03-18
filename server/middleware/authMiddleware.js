//checker if user is logged in or not
//used to redirect to main page pag di logged in
export const isAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next(); // User is logged in, proceed to the controller
    } else {
        res.status(401).json({ message: "Unauthorized: Please log in" });
    }
};