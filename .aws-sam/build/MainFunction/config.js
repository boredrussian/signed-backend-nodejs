exports.config = {
    bucket: 'kuku-staging',
    savePostFile: 'public/file_storage',
    saveImgFile: 'public/static/img',
    configFile: 'public/config.json',
    region: "us-west-2",
    inboxTableName: "inbox",
    indexTableName: "signed-index",
    userTableName: "users",
    jwtSecret: "JWT_SECRET_ACCESS",
    publicApiHost: "https://v6i481ta1m.execute-api.us-west-2.amazonaws.com/prod"
};

exports.httpApi = {
    savePost: {
        method: 'post',
        path: '/post'
    },
    // getIndex: {
    //     method: 'get',
    //     path: '/book'
    // },
    register: {
        method: 'post',
        path: '/register'
    },
    registerCheckLogin: {
        method: 'post',
        path: '/register/checkLogin'
    },
    exchangeEphemeralKeysFirstStepLogin: {
        method: 'post',
        path: '/login/exchangeEphemeralKeys'
    },
    validateSessionProofsSecondStepLogin: {
        method: 'post',
        path: '/login/validateSessionProofs'
    },
    getUserThirdStepLogin: {
        method: 'post',
        path: '/login/getUserToken'
    },
    getUser: {
        method: 'post',
        path: '/user'
    },
    userUpdate: {
        method: 'post',
        path: '/user/update'
    },
    userFollow: {
        method: 'post',
        path: '/user/follow'
    },
    fileUpload: {
        method: 'post',
        path: '/file/upload'
    },
    addInbox: {
        method: 'post',
        path: '/inbox'
    },
    updateInbox: {
        method: 'post',
        path: '/inbox/'
    },
    
    
    getSubscribed: {
        method: 'get',
        path: '/subscribed'
    },
    getInbox: {
        method: 'get',
        path: '/inbox'
    },
};