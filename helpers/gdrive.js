const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const stream = require('stream');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';

function uploadGDrive(req, res, next) {

    if (!req.file) {
        return res.status(200).json({
            link: ''
        })
    }

    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err)
        authorize(JSON.parse(content), uploadFile)
    })

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.installed
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
    
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    /**
     * Lists the names and IDs of up to 10 files.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function uploadFile(auth) {
    
        const drive = google.drive({
            version: 'v3',
            auth
        });

        let fileObject = req.file;
        let bufferStream = new stream.PassThrough();
        bufferStream.end(fileObject.buffer);

        drive.files.create({
            media: {
                mimeType: 'image/jpeg',
                body: bufferStream
            },
            requestBody: {
                name: req.file.originalname,
                mimeType: 'image/jpeg',
            },
            fields: 'id',
            resource : {
                // 'name': 'motorcycle.jpg',
                parents:['1WUoAOs_xsRb_wddoETMLajhqlyHgF9vL'],
            }
        })
        .then(function (resp) {
            console.log('fileUrl: ', 'http://drive.google.com/uc?id='+resp.data.id)
            res.status(201).json({
                link: 'http://drive.google.com/uc?id='+resp.data.id
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    
    }

}


module.exports = {uploadGDrive}





// fs.readFile('credentials.json', (err, content) => {
//     if (err) return console.log('Error loading client secret file:', err)
//     authorize(JSON.parse(content), logging)
// })

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//     const {client_secret, client_id, redirect_uris} = credentials.installed
//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

//     fs.readFile(TOKEN_PATH, (err, token) => {
//         if (err) return getAccessToken(oAuth2Client, callback);
//         oAuth2Client.setCredentials(JSON.parse(token));
//         callback(oAuth2Client);
//     });
// }

// function logging(object) {
//     console.log(object)
// }

// function getAccessToken(oAuth2Client, callback) {
//     const authUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: SCOPES,
//     });
//     console.log('Authorize this app by visiting this url:', authUrl);
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });
//     rl.question('Enter the code from that page here: ', (code) => {
//         rl.close();
//         oAuth2Client.getToken(code, (err, token) => {
//             if (err) return console.error('Error retrieving access token', err);
//             oAuth2Client.setCredentials(token);
//             fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//                 if (err) return console.error(err);
//                 console.log('Token stored to', TOKEN_PATH);
//             });
//             callback(oAuth2Client);
//         });
//     });
// }