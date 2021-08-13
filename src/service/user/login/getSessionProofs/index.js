
const { getUserByLogin } = require('../../../../dataBase/user/get');
const { updateServerSessionProof } = require('../../../../dataBase/user/update');
const srp = require('secure-remote-password/server');
// const parseJson = require("parse-json");
const stringify = require('fast-json-stable-stringify');
const { config, prefixes } = require('../../../../config');
const { bodyEncrypted } = require('../../../../lib/crypto');
const { getUserByUserName_NonRelational } = require('../../../../dataBaseNonRelational/user/get');
const { updateServerSessionProof_NonRelational } = require('../../../../dataBaseNonRelational/user/update');


module.exports.getSessionProofs = async ({ event }) => {
    let userName, clientSessionProof, clientEphemeralPublic, user, user_NonRelational;
    let response = {
        'statusCode': 404,
        'body': 'Login or password is invalid'
    };


    try {
        ({ userName, clientSessionProof, clientEphemeralPublic } = bodyEncrypted({ event }));
    } catch (e) {
        console.warn('[getSessionProofs][bodyEncrypted]', e);
    }

    try {
        user = await getUserByLogin({ tableName: config.userTableName, login: userName });
    } catch (e) {
        console.warn('[sessionProof][getUserByLogin]', e);
    }

    try {
        user_NonRelational = await getUserByUserName_NonRelational({ tableName: config.signedTableName, userName: userName, user_relation: prefixes.user });
        // if (!user_NonRelational) {
        //     return response;
        // }
    } catch (e) {
        console.warn("[getEphemeralKeys][getUserByLogin_NonRelational]", e);
        return response;
    }

    if (user) {
        try {
            const { serverEphemeralSecret, salt, verifier } = user;

            const serverSession = srp.deriveSession(
                serverEphemeralSecret,
                clientEphemeralPublic,
                salt,
                userName,
                verifier,
                clientSessionProof
            );

            await updateServerSessionProof({
                tableName: config.userTableName,
                address: user.address,
                serverSessionProof: serverSession.proof,
            });

            await updateServerSessionProof_NonRelational({
                tableName: config.signedTableName,
                userName: userName,
                serverSessionProof: serverSession.proof,
                user_relation: prefixes.user
            });

            response = {
                statusCode: 200,
                body: stringify({ serverSessionProof: serverSession.proof })
            }

        } catch (e) {
            console.warn("[sessionProof]", e);
            return response;
        }
    }

    return response;
};
