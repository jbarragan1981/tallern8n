import app from './app';
import { AppDataSource } from './config/db';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Conexión con base de datos establecida y mapeada.');
    app.listen(PORT, () => {
      console.log(`Servidor backend ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Fallo de inicialización de la base de datos:', error);
    process.exit(1);
  });
