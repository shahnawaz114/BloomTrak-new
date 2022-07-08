export const Patterns = {
    email: "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}",
    password: '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}',
    number : (/^\(\d{3}\)\s\d{3}-\d{4}$/)
}