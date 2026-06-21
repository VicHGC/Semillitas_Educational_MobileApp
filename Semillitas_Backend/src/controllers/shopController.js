const { getShopItems, purchaseItem, getPurchasedItems, hasPurchasedItem } = require('../modelsBD/shopModel');

const getItems = async (req, res) => {
    try {
        const { sonId } = req.query;
        const items = await getShopItems();
        
        // Si tenemos sonId, agregamos el flag isPurchased
        let itemsWithPurchased = items;
        
        if (sonId) {
            const purchasedIds = await getPurchasedItems(sonId);
            itemsWithPurchased = items.map(item => ({
                ...item,
                isPurchased: purchasedIds.includes(item.id)
            }));
        }
        
        res.status(200).json({ success: true, items: itemsWithPurchased });
    } catch (error) {
        console.error("Error en getItems:", error);
        res.status(500).json({ success: false, message: "Error al obtener items" });
    }
};

const buyItem = async (req, res) => {
    try {
        const { sonId, itemId, price } = req.body;

        if (!sonId || !itemId || !price) {
            return res.status(400).json({ success: false, message: "Faltan datos" });
        }

        const result = await purchaseItem(sonId, itemId, price);

        if (result.success) {
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }

    } catch (error) {
        console.error("Error en buyItem:", error);
        res.status(500).json({ success: false, message: "Error al comprar" });
    }
};

module.exports = {
    getItems,
    buyItem
};