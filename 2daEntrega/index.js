import ProductManager from "./manager/ProductManager.js";

const manager = new ProductManager();

const env = async () => {
    try {
        let productToAdd = {
            nombre: 'Suzuki Dr350',
            categoria: 'Motocicletas',
            cantidad: 10,
        };
        let addedProduct = await manager.addProduct(productToAdd);
        console.log('Producto agregado:', addedProduct);

        let allProducts = await manager.getProducts();
        console.log('Todos los productos:', allProducts);

        let productIdToQuery = 1;
        let productById = await manager.getProductById(productIdToQuery);
        console.log('Producto por ID:', productById);

        let productIdToUpdate = 1;
        let updatedFields = {
            cantidad: 10,
        };
        let updateResult = await manager.updateProduct(productIdToUpdate, updatedFields);
        console.log('Resultado de la actualización:', updateResult);

        let productIdToDelete = 1;
        let deleteResult = await manager.deleteProduct(productIdToDelete);
        console.log('Resultado de la eliminación:', deleteResult);

        let remainingProducts = await manager.getProducts();
        console.log('Productos restantes:', remainingProducts);
    } catch (error) {
        console.error('Error:', error);
    }
};

env();
