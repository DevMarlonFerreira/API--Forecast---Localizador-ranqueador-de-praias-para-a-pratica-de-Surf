import './util/module-alias';
import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import { ForecastController } from './controllers/forecast';
import * as database from '@src/database';
import { BeachesController } from './controllers/beaches';
import { UserstController } from './controllers/users';
import logger from './logger';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UserstController();
    this.addControllers([forecastController, beachesController, usersController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server listening of port: ' + this.port);
    });
  }
}
