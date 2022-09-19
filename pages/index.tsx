import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import type { NextPage } from "next";
import Head from "next/head";
import pinataSDK from "@pinata/sdk";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");
  const [cid, setCID] = useState("");
  const [IpfsHash, setIpfsHash] = useState("");
  const [pinataURL, setPinataURL] = useState("");

  useEffect(() => {
    if (IpfsHash) {
      const base = "https://gateway.pinata.cloud/ipfs/";
      setPinataURL(base + IpfsHash);
    } else {
      setPinataURL("");
    }
  }, [IpfsHash]);

  const generateCID = async () => {
    const Hash = require("ipfs-only-hash");
    const body = { name, logo, description };

    const hash = await Hash.of(JSON.stringify(body));
    setCID(hash);
  };

  const pinData = () => {
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
    const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET as string;
    const pinata = pinataSDK(API_KEY, API_SECRET);

    const body = { name, logo, description };
    const options = {
      pinataMetadata: {
        name: `Calculate The IPFS Hash - ${name}`,
      },
      pinataOptions: {
        cidVersion: 0 as 0 | 1 | undefined,
      },
    };

    pinata
      .pinJSONToIPFS(body, options)
      .then((result) => {
        //handle results here
        console.log(result);
        setIpfsHash(result.IpfsHash);
      })
      .catch((err) => {
        //handle error here
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Calculate The IPFS Hash</title>
      </Head>

      <main className={styles.main}>
        <h1>Calculate The IPFS Hash</h1>
        <Grid
          container
          spacing={2}
          sx={{
            maxWidth: "800px",
          }}
        >
          <Grid item xs={6}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Logo"
              variant="outlined"
              fullWidth
              type="url"
              onChange={(e) => setLogo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              size="large"
              fullWidth
              variant="contained"
              onClick={generateCID}
            >
              Hash Of Data
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button size="large" fullWidth variant="outlined" onClick={pinData}>
              Pin Data
            </Button>
          </Grid>
        </Grid>

        {cid && <pre>cid: {cid}</pre>}
        {IpfsHash && <pre>IpfsHash: {IpfsHash}</pre>}
        {pinataURL && (
          <pre>
            PinataURL:{" "}
            <a
              rel="noreferrer"
              href={pinataURL}
              target="_blank"
              style={{
                textDecoration: "underline",
              }}
            >
              {pinataURL}
            </a>
          </pre>
        )}
      </main>
    </div>
  );
};

export default Home;
