import { HttpException, Injectable } from '@nestjs/common';
import compute, { InstancesClient } from '@google-cloud/compute';
import { GetInstancesDTO } from './dto/compute-engine.dto';

@Injectable()
export class ComputeEngineService {
  computeClient: InstancesClient;
  constructor() {
    this.computeClient = new compute.InstancesClient({
      keyFilename: process.env.KEY_FILE,
    });
  }

  async getInstances(dto: GetInstancesDTO) {
    try {
      const instancesList = await this.computeClient.list({
        project: process.env.PROJECT_ID,
        zone: dto.region,
      });

      return instancesList[0].map((instance) => {
        return {
          name: instance.name,
          status: instance.status,
          zone: instance.zone,
        };
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
