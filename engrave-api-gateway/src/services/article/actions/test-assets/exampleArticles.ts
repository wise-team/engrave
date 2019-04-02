import { PostStatus } from "../../../../submodules/engrave-shared/enums/PostStatus";

const withValidMention:any = {
    blogId: 'string',
    created: new Date(),
    username: 'engrave',
    scheduled: new Date(),
    title: 'Test article',
    body: 'This is just a test with a user @engrave mention',
    categories: [],
    tags: [],
    status: PostStatus.DRAFT,
    decline_reward: false,
    permlink: 'test-permlink',
    parent_category: 'string'
}

const withTags:any = {
    blogId: 'string',
    created: new Date(),
    username: 'engrave',
    scheduled: new Date(),
    title: 'Test article',
    body: 'This is just a test with tags in meta',
    categories: [],
    tags: ['first-tag', 'second-tag'],
    status: PostStatus.DRAFT,
    decline_reward: false,
    permlink: 'test-permlink',
    parent_category: 'string'
}

const withInvalidMention:any = {
    blogId: 'string',
    created: new Date(),
    username: 'engrave',
    scheduled: new Date(),
    title: 'Test article',
    body: 'This is just a test with an invalid user @(engrave) mention',
    categories: [],
    tags: [],
    status: PostStatus.DRAFT,
    decline_reward: false,
    permlink: 'test-permlink',
    parent_category: 'string'
}

const withImage: any = {
    blogId: 'string',
    created: new Date(),
    username: 'engrave',
    scheduled: new Date(),
    title: 'Test article',
    body: 'This is just a test with additional image which is https://test.imgur.com/test.jpg',
    categories: [],
    tags: [],
    featured_image: 'https://example.com/featured-image.png',
    status: PostStatus.DRAFT,
    decline_reward: false,
    permlink: 'test-permlink',
    parent_category: 'string'
}

const withLink: any = {
    blogId: 'string',
    created: new Date(),
    username: 'engrave',
    scheduled: new Date(),
    title: 'Test article',
    body: 'This is just a test with a link inside to https://example.org',
    categories: ['test-category'],
    tags: [],
    status: PostStatus.DRAFT,
    decline_reward: false,
    permlink: 'test-permlink',
    parent_category: 'string'
}

const withMentionImageAndLink: any = {
    blogId: 'string',
    created: new Date(),
    username: 'engrave',
    scheduled: new Date(),
    title: 'Test article',
    body: 'This is just a test with a link inside to https://example.org and additional image which is https://test.imgur.com/test.jpg and @engrave mantion.',
    categories: [],
    tags: [],
    featured_image: 'https://example.com/featured-image.png',
    status: PostStatus.DRAFT,
    decline_reward: false,
    permlink: 'test-permlink',
    parent_category: 'string'
}

const exampleArticles = {
    withValidMention,
    withInvalidMention,
    withTags,
    withImage,
    withLink,
    withMentionImageAndLink
}

export default exampleArticles;