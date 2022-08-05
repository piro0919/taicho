export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '0b29432374cab14492408d3a1644f8b9'),
  },
});
