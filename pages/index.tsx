import React, { useState, useMemo } from "react";
import Link from "next/link";
import { dehydrate, useQuery } from "react-query";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

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

  return (
    <div>
      <Grid container gap={2}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="sex-label">Sex</InputLabel>
            <Select
              labelId="sex-label"
              id="sex-select"
              value={sex}
              label="Sex"
              onChange={(evt) => setSex(evt.target.value)}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="sex-label">Age</InputLabel>
            <Select
              labelId="age-label"
              id="age-select"
              value={ageFilter}
              label="Age"
              onChange={(evt) => setAgeFilter(evt.target.value)}
            >
              <MenuItem value="">Any</MenuItem>
              {ageFilters.map((filter) => (
                <MenuItem value={filter.label} key={filter.label}>
                  {filter.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="sex-label">Weight</InputLabel>
            <Select
              labelId="weight-label"
              id="weight-select"
              value={weightFilter}
              label="Weight"
              onChange={(evt) => setWeightFilter(evt.target.value)}
            >
              <MenuItem value="">Any</MenuItem>
              {weightFilters.map((filter) => (
                <MenuItem value={filter.label} key={filter.label}>
                  {filter.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container>
        {data?.dogs.map((f, i) => (
          <Grid item xs={4} key={[f.name, i].join(":")} sx={{ p: 2 }}>
            <Link href={`/dog/${f.name}`} passHref>
              <Card>
                <CardMedia
                  component="img"
                  height={350}
                  image={f.image}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    sx={{ fontWeight: "bold" }}
                  >
                    {f.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.weight} pound {weeksToString(f.ageInWeeks)} old{" "}
                    {f.sex.toLowerCase()} {f.breed.toLowerCase()}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
