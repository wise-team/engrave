import { IExtendedRequest } from '../IExtendedRequest';
import { DashboardSteemConnect } from '../../modules/SteemConnect';
import * as express from 'express';
import { GetValidators } from '../../validators/GetValidators';

let steem = require('steem');
let router = express.Router();

router.get('/wallet', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    DashboardSteemConnect.setAccessToken(req.session.access_token);
    DashboardSteemConnect.me(function (err: Error, user: any) {
        if (!err && user) {
            steem.api.getDynamicGlobalProperties((err: Error, result: any) => {
                // var accountValue = steem.formatter.estimateAccountValue(req.session.steemconnect.name);
                var steemPower = steem.formatter.vestToSteem(user.account.vesting_shares, result.total_vesting_shares, result.total_vesting_fund_steem);
                res.render('dashboard/wallet.pug', { blogger: req.session.blogger, user: user, steemPower: steemPower, url: 'wallet' });
            });
        } else {
            res.redirect('/');
        }
    })

});

router.post('/claim', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    DashboardSteemConnect.setAccessToken(req.session.access_token);
    DashboardSteemConnect.me(function (err: Error, user: any) {
        if (err) {
            res.json({ error: "Error while claiming rewards" })
        } else {
            DashboardSteemConnect.claimRewardBalance(user.name, user.account.reward_steem_balance, user.account.reward_sbd_balance, user.account.reward_vesting_balance, function (err: Error) {
                if (err) {
                    res.json({ error: "Error while claiming rewards" })
                } else {
                    res.json({ success: "All rewards claimed" })
                }
            });
        }
    });
});

module.exports = router;