HTTP proxy (soon to support SSL and auth) for S3 buckets

## Building


```bash
docker build --build-arg AWS_ACCESS_KEY_ID=AKIA.... --build-arg AWS_SECRET_ACCESS_KEY=1234.... -t s3-proxy .
```

## Running

```bash
docker run -p 0.0.0.0:3000:3000 -t s3-proxy
```
