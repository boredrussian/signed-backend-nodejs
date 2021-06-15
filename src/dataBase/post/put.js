const AWS = require("aws-sdk");
const { config } = require('../../config');
const stringify = require("fast-json-stable-stringify");
 


AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.putFirstDataPost = async ({
    tableName,
    post
}) => {

    const firstData = {
        posts: [post]
    };


    try {
        const params = {
            TableName: tableName,
            Item: {
                address: post.source.address,
                index: stringify(firstData),
                version: 0,
            },
        };
        await dynamoDb.put(params).promise();
    }

    catch (e) {
        console.warn("[updateIndex][putFirstDataPost]", e);
    }

};