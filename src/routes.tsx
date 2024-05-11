import express, { Request, Response, Router, NextFunction } from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import parseurl from "parseurl";
import stream from "stream";
import path from "path";

import {routerLocationAsyncLocalStorage} from '@mfng/core/router-location-async-local-storage';
import {
  createRscActionStream,
  createRscAppStream,
  createRscFormState,
} from '@mfng/core/server/rsc';
import {createHtmlStream} from '@mfng/core/server/ssr';
import * as React from 'react';
import type {ReactFormState} from 'react-dom/server';

import {
  jsManifest,
  reactClientManifest,
  reactServerManifest,
  reactSsrManifest,
} from './handler/manifests.js';

//console.log("manifests", manifests);

import {Url} from "url";
import {App} from "./components/App";

export function getUiRouter() {
  const router = Router();
  router.use(cookieParser());
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(multer().none()); // Don't handle file uploads
  router.use(express.text());

  router.use("/client", express.static(path.join(__dirname, "static/client")));

  // FIXME: routes
  router.get("/", async (req, res, next) => { await renderApp(req, res, next); });
  router.post("/", async (req, res, next) => { await handlePost(req, res, next); });

  return router;
}

const oneDay = 60 * 60 * 24;

async function renderApp(
  req: Request,
  res: Response,
  next: NextFunction,
  formState?: ReactFormState,
) {
  const {pathname, search} = parseurl(req) as Url;


  return routerLocationAsyncLocalStorage.run({pathname, search}, async () => {
    const rscAppStream = createRscAppStream(<App />, {
      reactClientManifest,
      formState,
    });

    if (req.get('accept') === `text/x-component`) {
      res.set({
        'Content-Type': `text/x-component; charset=utf-8`,
        'Cache-Control': `s-maxage=60, stale-while-revalidate=${oneDay}`,
      });
      res.status(200);
      await stream.Readable.fromWeb(rscAppStream).pipe(res);
      return;
    }

    console.log("ssr manifest", reactSsrManifest);

    const htmlStream = await createHtmlStream(rscAppStream, {
      reactSsrManifest,
      bootstrapScripts: [jsManifest[`main.js`]!],
      formState,
    });

    res.set({
      'Content-Type': `text/html; charset=utf-8`,
      'Cache-Control': `s-maxage=60, stale-while-revalidate=${oneDay}`,
    });
    res.status(200);
    await stream.Readable.fromWeb(htmlStream).pipe(res);
  });
}

async function handlePost(req: Request, res: Response, next: NextFunction) {
  const serverReferenceId = req.get(`x-rsc-action`);

  if (serverReferenceId) {
    // POST via callServer:

    const contentType = req.get(`content-type`);

    const body = await (contentType?.startsWith(`multipart/form-data`)
      ? req.body
      : req.body);

    const rscActionStream = await createRscActionStream({
      body,
      serverReferenceId,
      reactClientManifest,
      reactServerManifest,
    });

    res.set({'Content-Type': `text/x-component`});
    res.status(rscActionStream ? 200 : 500);
    await stream.Readable.fromWeb(rscActionStream).pipe(res);
    return;
  } else {
    // POST before hydration (progressive enhancement):

    const formData = req.body;
    const formState = await createRscFormState(formData, reactServerManifest);

    return renderApp(req, res, next, formState);
  }
}