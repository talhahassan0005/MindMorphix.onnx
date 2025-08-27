const express = require("express");
const next = require("next");
const http = require("http");
const compression = require("compression");
const helmet = require("helmet");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Security headers
  server.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        scriptSrc: ["'self'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Compression middleware
  server.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));

  // Caching headers
  server.use((req, res, next) => {
    // Cache static assets
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Cache API responses for short time
    else if (req.url.startsWith('/api/') && req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
    }
    // No cache for dynamic content
    else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    next();
  });

  // Rate limiting for API routes
  const rateLimit = require('express-rate-limit');
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  server.use('/api/', apiLimiter);

  // Body parsing middleware
  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Custom routes
  server.get("/p/:id", (req, res) => {
    const actualPage = "/post";
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });

  server.get("/api/custom", (req, res) => {
    res.json({ message: "Custom API response" });
  });

  // Health check endpoint
  server.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Performance monitoring endpoint
  server.get("/api/performance", (req, res) => {
    const memUsage = process.memoryUsage();
    res.json({
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      },
      uptime: process.uptime(),
      cpu: process.cpuUsage()
    });
  });

  // Fallback to Next.js handler
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Error handling middleware
  server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      error: 'Something went wrong!',
      message: dev ? err.message : 'Internal server error'
    });
  });

  // Function to check if the port is already in use and switch ports
  const checkPort = (port, callback) => {
    const serverTest = http.createServer();
    serverTest.listen(port, () => {
      serverTest.close();
      callback(null, port);
    });

    serverTest.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        callback(null, 4000);
      } else {
        callback(err);
      }
    });
  };

  // Check if port 3000 is available, if not, use 4000
  checkPort(3000, (err, portToUse) => {
    if (err) {
      console.error("Error checking port:", err);
      return;
    }
    
    server.listen(portToUse, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${portToUse}`);
      console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`> Health check: http://localhost:${portToUse}/api/health`);
    });
  });
});
