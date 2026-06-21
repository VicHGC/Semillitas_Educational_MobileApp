const pool = require('../config/db');

const getPurchasedItems = async (sonId) => {
    try {
        const [son] = await pool.query(
            'SELECT purchased_items FROM sons_users WHERE id = ?',
            [sonId]
        );
        
        if (son.length === 0 || !son[0].purchased_items) {
            return [];
        }
        
        // Manejar tanto arrays como strings JSON
        const purchased = son[0].purchased_items;
        if (Array.isArray(purchased)) {
            return purchased;
        }
        
        if (typeof purchased === 'string') {
            try {
                return JSON.parse(purchased);
            } catch (e) {
                return [];
            }
        }
        
        return [];
    } catch (error) {
        console.error("Error en getPurchasedItems:", error);
        return [];
    }
};

const hasPurchasedItem = async (sonId, itemId) => {
    try {
        const purchased = await getPurchasedItems(sonId);
        return purchased.includes(parseInt(itemId));
    } catch (error) {
        console.error("Error en hasPurchasedItem:", error);
        return false;
    }
};

const getShopItems = async () => {
    try {
        const [items] = await pool.query(`
            SELECT id, item_name, item_type, image_url, price, is_active
            FROM shop_items
            WHERE is_active = TRUE
            ORDER BY price ASC
        `);
        return items;
    } catch (error) {
        console.error("Error en getShopItems:", error);
        throw error;
    }
};

const purchaseItem = async (sonId, itemId, itemPrice) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // 1. Verificar que el niño tenga suficientes monedas
        const [son] = await connection.query(
            'SELECT coins FROM sons_users WHERE id = ?',
            [sonId]
        );

        if (son.length === 0) {
            return { success: false, message: "Hijo no encontrado" };
        }

        if (son[0].coins < itemPrice) {
            return { success: false, message: "Monedas insuficientes" };
        }

        // 2. Descontar monedas
        await connection.query(
            'UPDATE sons_users SET coins = coins - ? WHERE id = ?',
            [itemPrice, sonId]
        );

        // 3. Obtener la URL del item comprado
        const [item] = await connection.query(
            'SELECT image_url FROM shop_items WHERE id = ?',
            [itemId]
        );

        // 4. Obtener items comprados actualmente
        const [sonData] = await connection.query(
            'SELECT purchased_items FROM sons_users WHERE id = ?',
            [sonId]
        );
        
        // Asegurar que purchasedItems siempre sea un array
        let purchasedItems = [];
        if (sonData[0]?.purchased_items) {
            if (Array.isArray(sonData[0].purchased_items)) {
                purchasedItems = sonData[0].purchased_items;
            } else if (typeof sonData[0].purchased_items === 'string') {
                try {
                    purchasedItems = JSON.parse(sonData[0].purchased_items);
                } catch (e) {
                    purchasedItems = [];
                }
            }
        }
        
        // 5. Agregar el nuevo item al array (si no existe)
        const itemIdInt = parseInt(itemId);
        if (!purchasedItems.includes(itemIdInt)) {
            purchasedItems.push(itemIdInt);
            
            // 6. Actualizar el campo JSON con los items comprados
            await connection.query(
                'UPDATE sons_users SET purchased_items = ? WHERE id = ?',
                [JSON.stringify(purchasedItems), sonId]
            );
        }

        // 7. Actualizar el avatar del niño
        if (item.length > 0) {
            await connection.query(
                'UPDATE sons_users SET avatar_url = ? WHERE id = ?',
                [item[0].image_url, sonId]
            );
        }

        return { success: true, message: "Compra exitosa" };

    } catch (error) {
        console.error("Error en purchaseItem:", error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    getShopItems,
    purchaseItem,
    getPurchasedItems,
    hasPurchasedItem
};