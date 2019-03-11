import { IBlog } from "../../../submodules/engrave-shared/interfaces/IBlog";
import { IDraft } from "../../../submodules/engrave-shared/interfaces/IDraft";
import prepareJsonMetadata from "./prepareJsonMetadata";

export default (article: IDraft, scope: string, blog: IBlog, user: any) => {

    const json_metadata = prepareJsonMetadata(article, blog);

    let operations: any[] = [
        ['comment',
            {
                parent_author: "",
                parent_permlink: article.parent_category ? article.parent_category : article.tags[0],
                author: blog.owner,
                permlink: article.permlink,
                title: article.title,
                body: article.body,
                json_metadata: JSON.stringify(json_metadata)
            }
        ]
    ];

    switch(scope) {
        case 'edit':
        return operations;

        case 'publish':

        let extensions: any = [];

        if(!user.adopter) {
            extensions = [
                [0, {
                    beneficiaries: [
                        { account: 'engrave', weight: 15 * 100 }
                    ]
                }]
            ];
        }
        
        operations.push(
            ['comment_options', {
                author: blog.owner,
                permlink: article.permlink,
                max_accepted_payout: article.decline_reward ? '0.000 SBD' : '1000000.000 SBD',
                percent_steem_dollars: 10000,
                allow_votes: true,
                allow_curation_rewards: true,
                extensions: extensions
            }
            ]);

        return operations;

        default:
        throw new Error('Invalid operations scope');
    }
}