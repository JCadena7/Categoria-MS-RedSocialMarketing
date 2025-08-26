// src/scripts/tcp-update-test.ts
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const client = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: { host: '127.0.0.1', port: 3001 }, // usa el puerto de tu micro
});

async function main() {
  try {
    // 1) Crear para asegurar un id válido
    const creada = await firstValueFrom(
      client.send('createCategoria', { nombre: 'Prueba', descripcion: 'Init' })
    );
    console.log('Creada:', creada);

    // 2) Actualizar usando el id recién creado
    const actualizada = await firstValueFrom(
      client.send('updateCategoria', {
        id: creada.id, // <- id numérico
        nombre: 'Prueba Actualizada',
        descripcion: 'Actualizada',
      })
    );
    console.log('Actualizada:', actualizada);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await client.close();
  }
}

main();