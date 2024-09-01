// src/maquinas/maquinas.service.ts
import { Injectable } from '@nestjs/common';
import { Maquina } from './entities/maquina.entity';

@Injectable()
export class MaquinasService {
  private readonly maquinas = [
    {
      id: 1,
      latitude: -23.55052,
      longitude: -46.633308,
      tempo_preparo: '5 minutos',
    },
    {
      id: 2,
      latitude: -22.906847,
      longitude: -43.172896,
      tempo_preparo: '10 minutos',
    },
    {
      id: 3,
      latitude: -19.916681,
      longitude: -43.934493,
      tempo_preparo: '15 minutos',
    },
  ];

  findAll(userLatitude: number, userLongitude: number): Maquina[] {
    return this.maquinas
      .map((maquina) => ({
        ...maquina,
        distance: this.calculateDistance(
          userLatitude,
          userLongitude,
          maquina.latitude,
          maquina.longitude,
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  // Método para calcular a distância entre dois pontos (fórmula de Haversine)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
