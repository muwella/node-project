export const no_token_required_paths = [
    /(\/api\/v1\/account\/login)/i,
    /(\/api\/v1\/account\/new)/i,
    /(\/api\/v1\/account\/confirmation\/\w)/i,
    /(\/api\/v1\/account\/recoverAccount\/\w)/i,
];
// WIP regex w/human like explanation
export const username_regex = /[A-Za-z][A-Za-z0-9_]+/;
// FIXME email regex allows spaces
export const email_regex = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/;
export const password_regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}/;
