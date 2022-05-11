import React, { useState, useMemo } from "react";
import Link from "next/link";
import { dehydrate, useQuery } from "react-query";
import {
  Grid,
  Card,
  Image,
  Text,
  Select,
  Title,
  TextInput,
} from "@mantine/core";

import { queryClient, getDogs } from "../src/api";
import { weeksToString } from "../src/utilities";

export async function getServerSideProps() {
  await queryClient.prefetchQuery("dogs", () => getDogs());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const ageFilters = [
  { minAgeInWeeks: 0, maxAgeInWeeks: 24, label: "0-6 Months" },
  { minAgeInWeeks: 24, maxAgeInWeeks: 104, label: "6 Months - 2 Years" },
  { minAgeInWeeks: 104, maxAgeInWeeks: 260, label: "2 Years - 5 Years" },
  { minAgeInWeeks: 260, maxAgeInWeeks: 1040, label: "5+ Years" },
];

const weightFilters = [
  { minWeight: 0, maxWeight: 20, label: "Up to 20 lbs" },
  { minWeight: 20, maxWeight: 50, label: "20 - 50 lbs" },
  { minWeight: 50, maxWeight: 500, label: "50+ lbs" },
];

const Home: React.FunctionComponent = () => {
  const [sex, setSex] = useState<string>("");
  const [ageFilter, setAgeFilter] = useState<string>("");
  const [weightFilter, setWeightFilter] = useState<string>("");
  const searchArgs = useMemo(
    () => ({
      ...(ageFilter !== ""
        ? ageFilters.find(({ label }) => label === ageFilter)
        : {}),
      ...(weightFilter !== ""
        ? weightFilters.find(({ label }) => label === weightFilter)
        : {}),
      sex: sex !== "" ? sex : undefined,
    }),
    [sex, ageFilter, weightFilter]
  );
  const { data } = useQuery(
    ["dogs", { sex, ageFilter, weightFilter }],
    () => getDogs(searchArgs),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const [textFilter, setTextFilter] = useState("");
  const dogs = useMemo(
    () => data?.dogs.filter(({ name }) => name.includes(textFilter)) ?? [],
    [data, textFilter]
  );

  return (
    <div>
      <Grid>
        <Grid.Col xs={12} md={3}>
          <Select
            id="sexSelect"
            value={sex}
            label="Sex"
            onChange={setSex}
            data={[
              { value: "", label: "Any", id: "sexAny" },
              { value: "Male", label: "Male", id: "sexMale" },
              { value: "Female", label: "Female", id: "sexFemale" },
            ]}
          />
        </Grid.Col>

        <Grid.Col xs={12} md={3}>
          <Select
            id="age-select"
            value={ageFilter}
            label="Age"
            onChange={setAgeFilter}
            data={[
              { value: "", label: "Any" },
              ...ageFilters.map(({ label }) => ({ value: label, label })),
            ]}
          />
        </Grid.Col>

        <Grid.Col xs={12} md={3}>
          <Select
            value={weightFilter}
            label="Weight"
            onChange={setWeightFilter}
            data={[
              { value: "", label: "Any" },
              ...weightFilters.map(({ label }) => ({ value: label, label })),
            ]}
          />
        </Grid.Col>

        <Grid.Col xs={12} md={3}>
          <TextInput
            id="textFilter"
            placeholder="Name"
            label="Name"
            value={textFilter}
            onChange={(evt) => setTextFilter(evt.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Grid mt={10}>
        {dogs.map((f, i) => (
          <Grid.Col
            className="dog"
            xs={12}
            md={6}
            lg={4}
            key={[f.name, i].join(":")}
            p={5}
          >
            <Link href={`/dog/${f.name}`} passHref>
              <Card>
                <Card.Section>
                  <Image height={350} src={f.image} alt="green iguana" />
                </Card.Section>
                <Title order={3}>{f.name}</Title>
                <Text>
                  {f.weight} pound {weeksToString(f.ageInWeeks)} old{" "}
                  {f.sex.toLowerCase()} {f.breed.toLowerCase()}
                </Text>
              </Card>
            </Link>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
