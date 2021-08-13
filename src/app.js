const { savePost } = require('./service/post/savePost');
const { fileUpload } = require('./service/post/fileUpload');
const { register } = require('./service/user/register');
const { checkLogin } = require('./service/user/register/checkLogin');
const { getEphemeralKeys } = require('./service/user/login/getEphemeralKeys');
const { getSessionProofs } = require('./service/user/login/getSessionProofs');
const { getUserLogin } = require('./service/user/login/getUserLogin');
const { getUser } = require('./service/user/getUser');
const { userUpdate } = require('./service/user/userUpdate');
const { getSubscribed } = require('./service/user/getSubscribed');
const { changeFollowing } = require('./service/user/changeFollowing');
const { addInbox, getInbox, updateInbox } = require('./service/inbox');
 
 


const { httpApi } = require('./config');

exports.lambdaHandler = async (event, context) => {
    let response;
    const { method, path } = event.requestContext.http;
    const notFoundResponse = {
        'statusCode': 404,
    };

    console.log('path---', path);
    console.log('method---', method);

if(method === 'POST'){
   switch (path) {
        case httpApi.savePost.path:
            response = await savePost({ event });
            break;
        case httpApi.registerCheckLogin.path:
            response = await checkLogin({ event });
            break;
        case httpApi.register.path:
            response = await register({ event });
            break;
        case httpApi.exchangeEphemeralKeysFirstStepLogin.path:
            response = await getEphemeralKeys({ event });
            break;
        case httpApi.validateSessionProofsSecondStepLogin.path:
            response = await getSessionProofs({ event });
            break;
        case httpApi.getUserThirdStepLogin.path:
            response = await getUserLogin({ event });
            break;
        case httpApi.getUser.path:
            response = await getUser({ event });
            break;
        case httpApi.userUpdate.path:
            response = await userUpdate({ event });
            break;
       case httpApi.fileUpload.path:
            response = await fileUpload({ event });
            break;
        case httpApi.userFollow.path:
              response = await changeFollowing({ event });
            break;
        case httpApi.addInbox.path:
              response = await addInbox({ event });
            break;
        case httpApi.updateInboxStatus.path:
              response = await updateInbox({ event });
            break;
        default:
            response = notFoundResponse;
    } 
}

else if (method === 'GET'){
      switch (path) {
       case httpApi.getInbox.path:
            response = await getInbox({ event });
            break;
       case httpApi.getSubscribed.path:
            response = await getSubscribed({ event });
            break;
       default:
            response = notFoundResponse;
    } 
}

    if (!response) {
        response = notFoundResponse;
    }

    return response;
};



