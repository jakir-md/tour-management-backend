import { Query } from "mongoose";
import { excludedFields } from "./constant";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>; // ei query er return kora result hobe jar jonne call kora hoyche(T) tar array => T[], ar document gula hobe akta T
  public query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query }; // we have made a copy of the full query object. so that we can eliminate other things except filter
    for (const field of excludedFields) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this; //means full class
  }

  search(searchableFields:string[]): this {
    const searchTerm = this.query.searchTerm || "";
    const searchObject = {
      $or: searchableFields.map(field => ({[field]:{$regex:searchTerm, $options:'i'}}))
    }
    this.modelQuery = this.modelQuery.find(searchObject);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  fields():this {
    //field filtering
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields); //sometimes we don't need all of the fields of a data
    return this;
  }

  paginate():this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    //now calculate the skip
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  async getMeta () {
    const allDocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(allDocuments / limit);
    return {total:allDocuments, page, limit, totalPage}
  }

  build(){
    return this.modelQuery;
  }
}