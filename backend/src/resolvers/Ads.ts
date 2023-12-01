import { Arg, ID, Mutation, Query, Resolver, Int } from "type-graphql";
import { Ad, AdCreatedInput, AdUpdatedInput, AdsWhere } from "../entities/Ad";
import { validate } from "class-validator";
import { In, Like, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { merge } from "../utils";

export function getAdQueryWhere(graphqlWhere?: AdsWhere): {
  [key: string]: unknown;
} {
  const where: any = {};

  if (graphqlWhere?.categoryIn) {
    where.category = { id: In(graphqlWhere.categoryIn) };
  }

  if (graphqlWhere?.searchTitle) {
    where.title = Like(`%${graphqlWhere.searchTitle}%`);
  }

  if (graphqlWhere?.priceGte) {
    where.price = MoreThanOrEqual(Number(graphqlWhere.priceGte));
  }

  if (graphqlWhere?.priceLte) {
    where.price = LessThanOrEqual(Number(graphqlWhere.priceLte));
  }

  return where;
}

@Resolver(Ad)
export class AdsResolver {
  @Query(() => [Ad])
  async allAds(
    @Arg("where", { nullable: true }) where?: AdsWhere,
    @Arg("priceSort", { nullable: true }) priceSort?: "ASC" | "DESC",
    @Arg("take", () => Int, { nullable: true }) take?: number,
    @Arg("skip", () => Int, { nullable: true }) skip?: number
  ): Promise<Ad[]> {
    const queryWhere = getAdQueryWhere(where);

    const order: { [key: string]: "ASC" | "DESC" } = {};

    if (priceSort) {
      order.price = priceSort;
    }

    const ads = await Ad.find({
      where: queryWhere,
      order,
      skip,
      take: take ?? 50,
      relations: {
        category: true,
        tags: true,
      },
    });
    return ads;
  }

  @Query(() => Int)
  async allAdsCount(
    @Arg("where", { nullable: true }) where?: AdsWhere
  ): Promise<number> {
    const queryWhere = getAdQueryWhere(where);

    const count = await Ad.count({
      where: queryWhere,
    });
    return count;
  }

  @Query(() => Ad, { nullable: true })
  async ad(@Arg("id", () => ID) id: number): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id: id },
      relations: { category: true, tags: true },
    });
    return ad;
  }

  @Mutation(() => Ad)
  async createAd(
    @Arg("data", () => AdCreatedInput) data: AdCreatedInput
  ): Promise<Ad> {
    const newAd = new Ad();
    Object.assign(newAd, data);

    const errors = await validate(newAd);
    if (errors.length === 0) {
      await newAd.save();
      return newAd;
    } else {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }
  }

  @Mutation(() => Ad, { nullable: true })
  async updateAd(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: AdUpdatedInput
  ): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id: id },
      relations: { tags: true },
    });

    if (ad) {
      merge(ad, data);

      const errors = await validate(ad);
      if (errors.length === 0) {
        await Ad.save(ad);
        return await Ad.findOne({
          where: { id: id },
          relations: {
            category: true,
            tags: true,
          },
        });
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`);
      }
    }
    return ad;
  }

  @Mutation(() => Ad, { nullable: true })
  async deleteAd(@Arg("id", () => ID) id: number): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id: id },
    });
    if (ad) {
      await ad.remove();
      ad.id = id;
    }
    return ad;
  }
}
