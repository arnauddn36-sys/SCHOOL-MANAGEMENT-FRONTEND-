let currentUser = null;

export function setUser(user) {
    currentUser = user;
}

export function getUser() {
    return currentUser;
}

export function logout() {
    currentUser = null;
}

//cette fonction me permet de savoir quel utilisateurs est connecter 