
export const logMiddleWare = store => next => action => {
    console.log("Middleware triggered:", action);
    next(action);
}

