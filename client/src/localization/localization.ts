

export class Localization {

    protected language : Language = Language.ENGLISH;

    protected static LOCALIZATION : Localization = new Localization();

    public Localization() {
        this.language = Language.ENGLISH;
    }

    public getLanguage() : Language {
        return this.language;
    }

    public static getLocalization() : Localization {
        return this.LOCALIZATION;
    }

}