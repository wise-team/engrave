import { Themes } from './../../src/modules/Themes';
import { describe } from "mocha";
import { expect } from 'chai';
import * as path from 'path';
import * as fse from 'fs-extra';

const themesDirectoryPath = path.join(__dirname, '..', '..', 'blog', 'views', 'main');

describe("Themes", function () {

    describe("getInstalledThemes", function () {
        this.timeout(5000);

        it("Should return array with three themes", () => {

            const themes = Themes.getInstalledThemes();

            expect(themes).to.be.an('array');
            expect(themes.length).to.be.equal(3);
        });
    });

    describe("verifyTheme", function () {
        this.timeout(5000);

        it("Should verify theme 'default'", () => {
            expect(Themes.verifyTheme('default')).to.be.true;
        });

        it("Should verify theme 'clean-blog'", () => {
            expect(Themes.verifyTheme('default')).to.be.true;
        });

        it("Should verify theme 'stellar'", () => {
            expect(Themes.verifyTheme('default')).to.be.true;
        });

        it("Should verify temporary theme copied from default", async () => {
            try {
                await copyDefaultTheme('invalid');
                expect(Themes.verifyTheme('invalid')).to.be.true;
            } finally {
                await removeTemporaryTheme('invalid');
            }
        });

        it("Should not verify non-existing theme", () => {
            expect(Themes.verifyTheme('notexisting')).to.be.false;
        });

        it("Should not verify theme without public directory", async () => {
            try {
                await prepareThemeWithoutPublicDirectory('invalid');
                expect(Themes.verifyTheme('invalid')).to.be.false;       
            } finally {
                await removeTemporaryTheme('invalid');
            }
        });

        it("Should not verify theme without theme directory", async () => {
            try {
                await prepareThemeWithoutThemeDirectory('invalid');
                expect(Themes.verifyTheme('invalid')).to.be.false;
            } finally {
                await removeTemporaryTheme('invalid');
            }
        });

        it("Should not verify theme without manifest file", async () => {
            try {
                await prepareThemeWithoutManifest('invalid');
                expect(Themes.verifyTheme('invalid')).to.be.false;
            } finally {
                await removeTemporaryTheme('invalid');
            }
        });

        it("Should not verify theme with empty manifest file", async () => {
            try {
                await prepareThemeWithCorrupedManifest('invalid');
                expect(Themes.verifyTheme('invalid')).to.be.false;
            } finally {
                await removeTemporaryTheme('invalid');
            }
        });

    });
    
});

async function prepareThemeWithoutManifest(name: string) {
    const invalidThemePath = path.join(themesDirectoryPath, name);
    await copyDefaultTheme(name);
    await fse.writeJson(path.join(invalidThemePath, 'manifest.json'), {});
}

async function prepareThemeWithCorrupedManifest(name: string) {
    const invalidThemePath = path.join(themesDirectoryPath, name);
    await copyDefaultTheme(name);
    await fse.unlink(path.join(invalidThemePath, 'manifest.json'));
}

async function prepareThemeWithoutPublicDirectory(name: string) {
    const invalidThemePath = path.join(themesDirectoryPath, name);
    await copyDefaultTheme(name);
    await fse.remove(path.join(invalidThemePath, 'public'));
}

async function prepareThemeWithoutThemeDirectory(name: string) {  
    const invalidThemePath = path.join(themesDirectoryPath, name);
    await copyDefaultTheme(name);
    await fse.remove(path.join(invalidThemePath, 'theme'));
}

async function removeTemporaryTheme(name:string) {
    const temporaryThemePath = path.join(themesDirectoryPath, name);
    await fse.remove(temporaryThemePath);
}

async function copyDefaultTheme(name:string) {
    const defaultThemePath = path.join(themesDirectoryPath, 'default');
    const temporaryThemePath = path.join(themesDirectoryPath, name);

    if (!fse.existsSync(temporaryThemePath)) {
        fse.mkdirSync(temporaryThemePath);
    }

    await fse.copy(defaultThemePath, temporaryThemePath);
}