import db from './pool.js';

const tokenLoggedOut = async (token: string) => {
  const sql = `
    SELECT *
    FROM tokens
    WHERE token = ?
  `;

  const result = await db.query(sql, [token]);

  return result?.length > 0;
};

export default tokenLoggedOut;
