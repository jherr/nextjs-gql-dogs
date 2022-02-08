import { Resolver, Query, Arg, Float } from "type-graphql";

import { Dog } from "./dogs";
import dogs from "./dogs.json";

@Resolver(Dog)
export class DogsResolver {
  @Query(() => Dog, { nullable: true })
  dog(@Arg("name", () => String) name: string): Dog | undefined {
    const dog = dogs.find((dog) => dog.name === name);
    if (dog === undefined) {
      throw new Error("Dog not found");
    }
    return dog;
  }

  @Query(() => [Dog])
  dogs(
    @Arg("minWeight", () => Float, { nullable: true }) minWeight: number,
    @Arg("maxWeight", () => Float, { nullable: true }) maxWeight: number,
    @Arg("sex", () => String, { nullable: true }) sex: string,
    @Arg("minAgeInWeeks", () => Float, { nullable: true })
    minAgeInWeeks: number,
    @Arg("maxAgeInWeeks", () => Float, { nullable: true }) maxAgeInWeeks: number
  ): Dog[] {
    let filteredDogs = [...dogs];

    filteredDogs =
      minAgeInWeeks !== undefined
        ? filteredDogs.filter(({ ageInWeeks }) => ageInWeeks >= minAgeInWeeks)
        : filteredDogs;
    filteredDogs =
      maxAgeInWeeks !== undefined
        ? filteredDogs.filter(({ ageInWeeks }) => ageInWeeks <= maxAgeInWeeks)
        : filteredDogs;
    filteredDogs =
      sex !== undefined
        ? filteredDogs.filter(({ sex: dogSex }) => sex == dogSex)
        : filteredDogs;
    filteredDogs =
      minWeight !== undefined
        ? filteredDogs.filter(({ weight }) => weight >= minWeight)
        : filteredDogs;
    filteredDogs =
      maxWeight !== undefined
        ? filteredDogs.filter(({ weight }) => weight <= maxWeight)
        : filteredDogs;

    return filteredDogs;
  }
}
