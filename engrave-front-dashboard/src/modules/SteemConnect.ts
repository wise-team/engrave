import { Config, IConfig } from "../config";

const sc2 = require('steemconnect');

const config: IConfig = Config.GetConfig();

export const DashboardSteemConnect = sc2.Initialize({
    app: config.steemconnect_id,
    callbackURL: config.steemconnect_redirect_uri,
    scope: ['login', 'vote', 'comment', 'comment_options', 'claim_reward_balance','delete_comment']
});

export const ReaderSteemConnect = sc2.Initialize({
    app: config.steemconnect_id,
    callbackURL: config.steemconnect_redirect_uri,
    scope: ['login', 'vote', 'comment']
});