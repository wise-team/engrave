import * as fs from 'fs';
import * as path from 'path';

export interface ITheme {
    name: string
    slug: string
}

export class Themes {

    private static themesRootDirectory = path.join(__dirname, '..', '..', 'blog', 'views', 'main');
    private static themes: ITheme[] = [];

    private static searchForPublicDirectory(dirListing: string[]) {
        let passed = false;
        dirListing.forEach(element => {
            if (element == 'public') {
                passed = true;
            }
        })
        return passed;
    }

    private static searchForThemeDirectory(dirListing: string[]) {
        let passed = false;
        dirListing.forEach(element => {
            if (element == 'theme') {
                passed = true;
            }
        })
        return passed;
    }

    static verifyTheme(themeName: string) {

        try {
            if (themeName !== themeName.toLowerCase()) throw new Error('Theme name contains upper case');

            const themeDirectoryContent = fs.readdirSync(path.join(this.themesRootDirectory, themeName));

            if (Themes.searchForPublicDirectory(themeDirectoryContent)) {
                if (Themes.searchForThemeDirectory(themeDirectoryContent)) {
                    return true;
                }
            }

            return false;

        } catch (error) {
            return false
        }
    }

    private static SearchForAllThemes() {

        const themesDirectoryContent = fs.readdirSync(this.themesRootDirectory);

        themesDirectoryContent.forEach( (dir) => {
            try {
                if (Themes.verifyTheme(dir)) {
                    Themes.themes.push(this.getTheme(dir));
                }    
            } catch (error) {
                
            }
        });
    }

    private static getTheme(dirname: string) {
        const themeManifestContent = fs.readFileSync(path.join(this.themesRootDirectory, dirname, 'manifest.json'), 'utf8');
        
        if(!this.verifyThemeManifest(themeManifestContent)) throw new Error("Manifest incorrect");
        
        const manifest = JSON.parse(themeManifestContent);
        const theme: ITheme = {
            name: manifest.name,
            slug: dirname
        }
        return theme;   
    }

    public static getInstalledThemes() {
        return Themes.themes;
    }

    public static Initialize() {
        Themes.SearchForAllThemes();
    }

    private static verifyThemeManifest(manifestContent: string) {
        try {
            const manifest = JSON.parse(manifestContent);
            if(!manifest.name) return false;
            return true;
            
        } catch (error) {
            return false;
        }
    }
}

