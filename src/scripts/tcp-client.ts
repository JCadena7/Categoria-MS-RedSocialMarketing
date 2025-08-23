import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const client = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: { host: '127.0.0.1', port: 3001 },
});

async function main() {
  try {
    const res = await firstValueFrom(
      client.send('updateCategoria', { id: 5, nombre: 'Hola', descripcion: 'es nuevo' })
    );
    console.log(res);
  } finally {
    await client.close();
  }
}
main();