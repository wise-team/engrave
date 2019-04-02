import { describe, it } from 'mocha';
import { expect } from 'chai';

import prepareJsonMetadata from './prepareJsonMetadata';
import exampleArticles from './test-assets/exampleArticles';
import exampleBlogs from './test-assets/exampleBlogs';

describe('prepareJsonMetadata', async () => {
    it('should find valid mention', async () => {
        
        const result = await prepareJsonMetadata(exampleArticles.withValidMention, exampleBlogs[0]);
        
        expect(result).to.deep.equal({
            format: 'markdown',
            app: 'engrave',
            tags: [],
            image: [],
            links: [],
            users: ['@engrave']
        })
    })
    
    it('should not find invalid mention', async () => {
        
        const result = await prepareJsonMetadata(exampleArticles.withInvalidMention, exampleBlogs[0]);
        
        expect(result).to.deep.equal({
            format: 'markdown',
            app: 'engrave',
            tags: [],
            image: [],
            links: [],
            users: []
        })
    })

    it('should find valid link', async () => {

        const result = await prepareJsonMetadata(exampleArticles.withLink, exampleBlogs[0]);

        expect(result).to.deep.equal({
            format: 'markdown',
            app: 'engrave',
            tags: [],
            image: [],
            links: ['https://example.org'],
            users: []
        })
    })

    it('should find valid image', async () => {

        const result = await prepareJsonMetadata(exampleArticles.withImage, exampleBlogs[0]);

        expect(result).to.deep.equal({
            format: 'markdown',
            app: 'engrave',
            tags: [],
            image: ['https://example.com/featured-image.png', 'https://test.imgur.com/test.jpg'],
            links: [],
            users: []
        })
    })

    it('should find valid tags', async () => {

        const result = await prepareJsonMetadata(exampleArticles.withTags, exampleBlogs[0]);

        expect(result).to.deep.equal({
            format: 'markdown',
            app: 'engrave',
            tags: ['first-tag', 'second-tag'],
            image: [],
            links: [],
            users: []
        })
    })

    it('should find link, image and mention', async () => {
        
        const result = await prepareJsonMetadata(exampleArticles.withMentionImageAndLink, exampleBlogs[0]);
        
        expect(result).to.deep.equal({
            format: 'markdown',
            app: 'engrave',
            tags: [],
            image: ['https://example.com/featured-image.png', 'https://test.imgur.com/test.jpg'],
            links: ['https://example.org'],
            users: ['@engrave']
        })
    })
})