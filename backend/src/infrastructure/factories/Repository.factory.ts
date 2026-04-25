import type { IUserRepository } from "../../core/interfaces/IUserRepository.js";
import type { IStationRequestRepository } from "../../core/interfaces/IStationRequestRepository.js";
import type { IStationRepository } from "../../core/interfaces/IStationRepository.js";
import { UserRepository } from "../repositories/User.repository.js";
import { StationRequestRepository } from "../repositories/StationRequest.repository.js";
import { StationRepository } from "../repositories/Station.repository.js";

export class RepositoryFactory {
    private static userRepository: IUserRepository;
    private static stationRequestRepository: IStationRequestRepository;
    private static stationRepository: IStationRepository;

    static getUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }

  static getStationRequestRepository(): IStationRequestRepository {
    if(!this.stationRequestRepository) {
      this.stationRequestRepository = new StationRequestRepository();
    }
    return this.stationRequestRepository;
  }

  static getStationRepository(): IStationRepository {
    if(!this.stationRepository) {
      this.stationRepository = new StationRepository();
    }
    return this.stationRepository;
  }
}