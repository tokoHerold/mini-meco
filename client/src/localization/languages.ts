enum Language {
    ENGLISH,
    GERMAN,
}

 const paths: { [key in Language]: string } = {
    [Language.ENGLISH]: 'configs/english.json',
    [Language.GERMAN]: 'configs/german.json',
}

function getConfigPath(language: Language): string {
    return paths[language];
}