/*
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */


/// <reference path="../../../../../../externs/ts/node/node.d.ts" />
/// <reference path="../../../../../../externs/ts/express/express.d.ts" />
import express = require('express');


/**
 * Storage management HTTP API
 *
 * Handles CRUD operations for file/object-based resources (e.g., notebooks)
 */
export class StorageApi {

  _storage: app.IStorage;

  constructor (storage: app.IStorage) {
    this._storage = storage;
  }

  list (request: express.Request, response: express.Response) {

  }

  get (request: express.Request, response: express.Response) {

  }

  /**
   * Puts a new file/object in the storage
   *
   * Will overwrite any existing file/object
   */
  put (request: express.Request, response: express.Response) {

  }

  delete (request: express.Request, response: express.Response) {

  }

}
