import { Controller } from ".";
import { Request, Response } from "express";
import { Ad } from "../entities/Ad";
import { validate } from "class-validator";
import { In, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";

import data from "../data/data.json";

export class AdsController extends Controller {
  getAll = async (req: Request, res: Response) => {
    // req.params : /ads/:id. Non
    // req.body : POST/PUT/PATCH. Non
    // req.query : /ads?categoryId=12. Oui
    const where: any = {};

    if (typeof req.query.categoryIn === "string") {
      where.category = { id: In(req.query.categoryIn.split(",")) };
    }

    if (req.query.searchTitle) {
      where.title = Like(`%${req.query.searchTitle}%`);
    }

    if (req.query.priceGte) {
      where.price = MoreThanOrEqual(Number(req.query.priceGte));
    }

    if (req.query.priceLte) {
      where.price = LessThanOrEqual(Number(req.query.priceLte));
    }

    const order: any = {};
    if (
      typeof req.query.orderByTitle === "string" &&
      ["ASC", "DESC"].includes(req.query.orderByTitle)
    ) {
      order.title = req.query.orderByTitle; // req.query.orderByTitle = ASC | DESC
    }

    if (
      typeof req.query.orderByPrice === "string" &&
      ["ASC", "DESC"].includes(req.query.orderByPrice)
    ) {
      order.price = req.query.orderByPrice; // req.query.orderByTitle = ASC | DESC
    }

    const ads = await Ad.find({
      where,
      order,
      relations: {
        category: true,
        tags: true,
      },
    });
    res.send(ads);
  };

  getAllByTitle = async (req: Request, res: Response) => {
    const title = req.query.title as string | undefined;
    if (title) {
      try {
        const ads = await Ad.find({
          relations: {
            category: true,
            tags: true,
          },
          where: { title: Like(`%${title}%`) },
          order: { createdAt: "DESC" },
          take: 5,
        });
        res.send(ads);
      } catch (err) {
        console.error(err);
        res.status(500).send();
      }
    } else {
      res.status(400).send("Le paramètre 'title' est manquant ou vide.");
    }
  };

  getOne = async (req: Request, res: Response) => {
    const ad = await Ad.findOne({
      where: { id: Number(req.params.id) },
      relations: {
        category: true,
        tags: true,
      },
    });
    res.send(ad);
  };

  createOne = async (req: Request, res: Response) => {
    const newAd = new Ad();
    newAd.title = req.body.title;
    newAd.description = req.body.description;
    newAd.owner = req.body.owner;
    newAd.price = req.body.price;
    newAd.imgUrl = req.body.imgUrl;
    newAd.location = req.body.location;
    newAd.createdAt = req.body.createdAt;
    newAd.category = req.body.category;
    newAd.tags = req.body.tags;

    const errors = await validate(newAd);
    if (errors.length === 0) {
      await newAd.save();
      res.send(newAd);
    } else {
      res.status(400).json({ errors: errors });
    }
  };

  deleteOne = async (req: Request, res: Response) => {
    const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });
    if (ad) {
      await ad.remove();
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  };

  patchOne = async (req: Request, res: Response) => {
    const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });

    if (ad) {
      Object.assign(ad, req.body, { id: ad.id });
      const errors = await validate(ad);
      if (errors.length === 0) {
        await ad.save();
        res.status(204).send();
      } else {
        res.status(400).json({ errors: errors });
      }
    } else {
      res.status(404).send();
    }
  };

  async resetAllAds(req: Request, res: Response) {
    try {
      await Ad.clear();
      for (const adData of data) {
        const newAd = new Ad();
        newAd.title = adData.title;
        newAd.description = adData.description;
        newAd.owner = adData.owner;
        newAd.price = adData.price;
        // newAd.imgUrl = adData.imgUrl;
        newAd.location = adData.location;
        // newAd.category = adData.category;
        await newAd.save();
      }
      res.status(201).send(Ad);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send("Une erreur s'est produite lors de la réinitialisation.");
    }
  }
}
