export const hasRole = (user, role) => {
    if (!user || !user.roles) return false;
    return user.roles.some((userRole) => userRole.name === role);
};

export const hasAnyRole = (user, roles) => {
    if (!user || !user.roles) return false;
    return roles.some((role) =>
        user.roles.some((userRole) => userRole.name === role)
    );
};

export const hasAllRoles = (user, roles) => {
    if (!user || !user.roles) return false;
    return roles.every((role) =>
        user.roles.some((userRole) => userRole.name === role)
    );
};


// {hasAnyRole(auth.user, ["super-admin", "admin"]) && (

// {hasRole(auth.user, "super-admin") && (