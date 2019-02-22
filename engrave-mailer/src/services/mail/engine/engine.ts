const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const secrets = require('@cloudreach/docker-secrets');

const auth = {
    auth: {
        api_key: secrets.MAILGUN_API_KEY,
        domain: secrets.MAILGUN_DOMAIN
    }
}

const engine = nodemailer.createTransport(mg(auth));

const sender_name = process.env.MAILGUN_SENDER_NAME;
const sender_address = process.env.MAILGUN_SENDER_ADDRESS;

export {
    engine,
    sender_address,
    sender_name
};