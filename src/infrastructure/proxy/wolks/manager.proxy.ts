import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WolksProxy {
  async health() {
    try {
      const response = await axios.get(`https://wolks-api.onrender.com`);

      return response.data;
    } catch (error) {
      console.log('Error: ', error);
      throw new Error(error.message);
    }
  }
}
