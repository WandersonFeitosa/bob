import { client } from 'src/main';

export async function getUserById(userId: any) {
  const user = await client.users.fetch(userId);
  return user;
}
