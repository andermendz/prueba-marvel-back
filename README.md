# Marvel Comics Backend

## Requisitos
- Node.js (v16.20.1 o superior)
- MongoDB
- npm (incluido con Node.js)

## Instalación
1. Clonar el repositorio
    ```bash
    git clone https://github.com/andermendz/prueba-marvel-back.git
    ```

2. Instalar dependencias
    ```bash
    cd prueba-marvel-back
    npm install
    ```

3. Crear archivo `.env` en la raíz del proyecto con el siguiente contenido:
    ```env
    MONGODB_URI=mongodb://localhost:27017/marvel-comics
    JWT_SECRET=tu_secreto_jwt
    MARVEL_API_KEY=tu_api_key_publica
    MARVEL_PRIVATE_KEY=tu_api_key_privada
    ```

4. Iniciar el servidor
    ```bash
    node index.js
    ```

5. Verificar el funcionamiento del servidor
    El servidor estará disponible en http://localhost:5000
