/* eslint-disable @next/next/no-img-element */
import React from "react";
import { dehydrate, useQuery } from "react-query";
import { Grid, Typography, Button } from "@mui/material";

import { weeksToString } from "../../src/utilities";
import { queryClient, dogByName } from "../../src/api";

export async function getServerSideProps({ params }) {
  await queryClient.prefetchQuery("dog", () =>
    dogByName({ name: params.name })
  );

  return {
    props: {
      name: params.name,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const Home: React.FunctionComponent<{
  name: string;
}> = ({ name }) => {
  const { data } = useQuery("dog", () => dogByName({ name }), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (!data.dog) {
    return <div>No dog found</div>;
  }

  return (
    <Grid container gap={2}>
      <Grid item xs={4}>
        <img src={data.dog.image} alt={data.dog.name} width="100%" />
      </Grid>
      <Grid item xs={3}>
        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
          {data.dog.name}
        </Typography>

        <Grid container>
          <Grid item xs={4}>
            <Typography variant="h5">Age</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {weeksToString(data.dog.ageInWeeks)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Breed</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {data.dog.breed}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Sex</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {data.dog.sex}
            </Typography>
          </Grid>
          {data.dog.color && (
            <>
              <Grid item xs={4}>
                <Typography variant="h5">Color</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {data.dog.color}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Button variant="contained" fullWidth>
          Adopt {data.dog.name}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
