# GFLBans Web

The Web Frontend for GFLBans. This project, although public, is likely not useful to most as the Python API server component (which coordinates with game servers and interacts with the database) is currently private.

### Configuration

The configuration for the application is defined in `src/globals.ts`. Set `INSTANCE` to the location that the GFLBans API server can be found at and `PUBLIC_URI` to the location the app is to be hosted.

### Building

You will need NPM installed to build the application.

To host the application locally for development:

```
npm run serve
```

To build the application for production and output the production files to `dist/`:

```
npm run build
```

The files in the `dist/` directory can then be served by any standard web server, such as NGINX.

### License

GFLBans Web
Copyright (C) 2021  Aurora McGinnis

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License **version 3 ONLY** as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.