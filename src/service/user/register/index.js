

const { makeToken } = require("../../../lib/jwt");
const { config, prefixes } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { addUser } = require("../../../dataBase/user/put");
const { getUsers } = require("../../../dataBase/user/get");

const { putFirstIndexData } = require("../../../dataBase/index/put");

// new non Relational DB model 
const { getUsers_NonRelational } = require("../../../dataBaseNonRelational/user/get");
const { addUser_NonRelational, addUserSourceReletion_NonRelational, putSourceAndIndexInitial_NonRelational, setUserSubscribed_NonRelational }
    = require("../../../dataBaseNonRelational/user/put");
// -------------------------------------------------------//

const { updateUsersSubscribed } = require("../../../dataBase/user/update");
const { addNewUserToConfig, generateSubscribed, getUserSourcesArr } = require("../_utils/subscribed");
const { bodyEncrypted } = require('../../../lib/crypto');


const register = async ({ event }) => {
    let address, encryptedWif, userName, salt, verifier, subscribed, usersList, source, usersSubscribedList_NonRelational;
    let response = {
        'statusCode': 403,
        'body': `Error was occurred [addUser]`
    };
    try {
        ({ address, encryptedWif, userName, salt, verifier, source } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[register][bodyEncrypted]', e);
    }
    const accessToken = makeToken({ type: "access" });

    try {
        await addNewUserToConfig({ source });
    } catch (e) {
        console.warn("[register][updateUserConfig]", e);
    }

    try {
        usersSubscribedList_NonRelational = await getUsers_NonRelational({ tableName: config.signedTableName, source_relation: prefixes.source });

    } catch (e) {
        console.warn("[register][usersList_NonRelational]", e);
    }

    const resSetSubscribed = await Promise.allSettled(
        usersSubscribedList_NonRelational.map(async (user) => {
            const address = user.PK.slice(`${prefixes.source}-`.length);
            console.log('address', address);
            try {
                await setUserSubscribed_NonRelational({
                    tableName: config.signedTableName,
                    currentUserName: userName,
                    subscribedAddress: address,
                    subscribed_relation: prefixes.subscribed,
                    user_relation: prefixes.user,
                });
            } catch (e) {
                console.warn('[register][setUserSubscribed]', e);
            }
        })
    );

    try {
        const sourceJson = stringify(source);

        await putSourceAndIndexInitial_NonRelational({
            tableName: config.signedTableName,
            address: address,
            indexJsonInitial: stringify([]),
            sourceJson: sourceJson,
            version: 0
        });
    }
    catch (e) {
        console.warn('[updateIndex][putFirstIndexData_NonRelational]', e);
    }

    try {
        await addUser_NonRelational({
            tableName: config.signedTableName,
            address,
            encryptedWif,
            salt,
            verifier,
            login: userName,
            accessToken,
            source: stringify(source)
        });

    }
    catch (e) {
        console.warn("[register][addUser_NonRelational]", e);
    }


    try {
        await addUserSourceReletion_NonRelational({
            tableName: config.signedTableName,
            address,
            login: userName,
        });
    }
    catch (e) {
        console.warn("[register][addUserSourceReletion_NonRelational]", e);
    }










    try {
        usersList = await getUsers({ tableName: config.userTableName });
        subscribed = generateSubscribed({ usersList });
    } catch (e) {
        console.warn("[register][updateUserConfig]", e);
    }

    try {
        await putFirstIndexData({
            tableName: config.indexTableName,
            address: address,
            firstData: { posts: [], source: source }
        });
    }
    catch (e) {
        console.warn('[updateIndex][putFirstData]', e);
    }

    try {
        await addUser({
            tableName: config.userTableName,
            address,
            encryptedWif,
            salt,
            verifier,
            login: userName,
            accessToken,
            subscribed,
            source: stringify(source)
        });

        const resData = {
            accessToken,
            subscribed,
        };

        response = {
            'statusCode': 200,
            'body': stringify(resData)
        };
    }
    catch (e) {
        console.warn("[register][addUser]", e);
    }

    return response;
};

module.exports = {
    register
};






