-- Update user information
UPDATE users 
SET name = $2, email = $3, updated_at = $4
WHERE id = $1
RETURNING *;
