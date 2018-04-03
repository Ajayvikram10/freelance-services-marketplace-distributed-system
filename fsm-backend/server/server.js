const connection        = new require('../resources/kafka-setup/Connection');
const mongoose          = require('../database/mongo/mongoose');
const userService       = require('../services/user/user.service');
const producer          = connection.getProducer();
// const profileService    = require('../services/user/profile.service');
// const projectService    = require('../services/user/project.service');

// Consumers: [naming - consumer_service_topic]...Topics: [naming - service_function_topic]
const consumer_user_register        = connection.getConsumer('user_register_topic');
const consumer_user_login           = connection.getConsumer('user_login_topic');
const consumer_user_authenticate    = connection.getConsumer('user_authenticate_topic');


// Server and Database Logs
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection error: '));
db.once('open', function() { console.log("MongoDB Connection Successful!"); });
console.log('Backend Server is running!');

// Consumers
// ************** User **************
consumer_user_register.on('message', function (message) {

    console.log('User register message received.');
    console.log(JSON.stringify(message.value));

    const data = JSON.parse(message.value);

    userService.handle_register_request(data.data, function(err,result){
        console.log('Register request handle: ' + JSON.stringify(result));
        let payloads = [{
                topic   : data.replyTo,
                messages: JSON.stringify
                ({
                    correlationId: data.correlationId,
                    data: result
                }),
                partition: 0
            }];
        producer.send(payloads, function(err, data){
            console.log(data);
            console.log();
        });
        return;
    });
});

consumer_user_login.on('message', function (message) {

    console.log('User login message received');
    console.log(JSON.stringify(message.value));

    const data = JSON.parse(message.value);

    userService.handle_login_request(data.data, function(err,result){
        console.log('Login request handle: ' + JSON.stringify(result));
        let payloads = [{
            topic   : data.replyTo,
            messages: JSON.stringify
            ({
                correlationId: data.correlationId,
                data: result
            }),
            partition: 0
        }];
        producer.send(payloads, function(err, data){
            console.log(data);
            console.log();
        });
        return;
    });
});

consumer_user_authenticate.on('message', function (message) {

    console.log('User authenticate message received.');
    console.log(JSON.stringify(message.value));

    const data = JSON.parse(message.value);

    userService.handle_authenticate_request(data.data, function(err,result){
        console.log('Authenticate request handle: ' + JSON.stringify(result));
        let payloads = [{
            topic   : data.replyTo,
            messages: JSON.stringify
            ({
                correlationId: data.correlationId,
                data: result
            }),
            partition: 0
        }];
        producer.send(payloads, function(err, data){
            console.log(data);
            console.log();
        });
        return;
    });
});

// ************** Profile **************


// ************** Project **************