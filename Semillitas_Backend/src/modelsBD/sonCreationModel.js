const pool = require('../config/db.js');

const findFather = async (account_id) =>{

    try {
        const sqlFind = "SELECT * FROM padres WHERE account_id = ?";

        const [rows] = await pool.query(sqlFind, [account_id]); 

        return rows.length > 0 ? rows[0] : null;

    } catch (error){
        console.error("Error al buscar al padre con el id: ", error);
        throw error;
    }
}

const createSon = async (name, age, modulesArray, account_id, padre_id, avatar_url) => {
    let connection;

    const DEFAULT_AVATAR = 'https://pub-b8d90bf906d3498aa934aae83a10a3d3.r2.dev/basicAvatar.PNG';
    const avatarToUse = avatar_url || DEFAULT_AVATAR;

    try {
        connection = await pool.getConnection(); 
        await connection.beginTransaction(); 

        // 1. Insertar al hijo en sons_users
        const sqlCreateSon = "INSERT INTO sons_users (son_name, nickname, age, avatar_url, total_time_played, current_streak, last_played_date, dateCreation, father_id, account_id) VALUES(?, ?, ?, ?, 0, 0, NULL, NOW(), ?, ?)";
        const [result] = await connection.query(sqlCreateSon, [name, null, age, avatarToUse, padre_id, account_id ]);
        
        const newSonId = result.insertId;

        // 2. Insertar los módulos seleccionados en sons_modules
        // modulesArray debe ser algo como ['Matemáticas', 'Español']
        if (modulesArray && modulesArray.length > 0) {
            
            // Primero buscamos los IDs de esos módulos en la tabla modules
            // Usamos una consulta con IN (?)
            const sqlFindModules = "SELECT id FROM modules WHERE module_name IN (?)";
            const [modulesFound] = await connection.query(sqlFindModules, [modulesArray]);

            // Ahora insertamos en la tabla intermedia sons_modules
            if (modulesFound.length > 0) {
                const sqlInsertRelation = "INSERT INTO sons_modules (son_id, module_id) VALUES ?";
                
                // Preparamos los datos para inserción masiva: [[sonId, modId1], [sonId, modId2]]
                const valuesToInsert = modulesFound.map(m => [newSonId, m.id]);
                
                await connection.query(sqlInsertRelation, [valuesToInsert]);
            }
        }

        await connection.commit(); 

        return {
            userID: newSonId,
        }
    } catch (error){
        if (connection){ 
            await connection.rollback(); 
        }
        console.error("Error al crear al hijo:", error);
        throw error;
    } finally {
        if (connection){ 
            connection.release();
        }
    }
}

const getSonsByAccount = async (account_id) => {
    try {
        const sqlGetSons = `
            SELECT 
                su.id,
                su.son_name as name,
                su.age,
                su.avatar_url,
                su.dateCreation,
                su.nickname,
                su.coins,
                su.exp_points
            FROM sons_users su 
            WHERE su.account_id = ? 
            ORDER BY su.dateCreation DESC
        `;

        const [rows] = await pool.query(sqlGetSons, [account_id]);
        
        // Para cada hijo, obtener sus módulos activos
        for (let son of rows) {
            const sqlGetModules = `
                SELECT m.module_name 
                FROM sons_modules sm
                JOIN modules m ON sm.module_id = m.id
                WHERE sm.son_id = ?
            `;
            const [modules] = await pool.query(sqlGetModules, [son.id]);
            son.modules = modules.map(m => m.module_name);
        }
        
        return rows;

    } catch (error) {
        console.error("Error al obtener los hijos:", error);
        throw error;
    }
}
module.exports = {
    findFather,
    createSon,
    getSonsByAccount
};