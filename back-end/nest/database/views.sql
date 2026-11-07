CREATE VIEW users_with_roles AS
    SELECT
        users.user_id,
        users.avatar,
        users.username,
        users.email,
        roles.name as role,
        users.created_date,
        users.modified_date
            FROM users
            LEFT JOIN roles ON users.role_id = roles.role_id