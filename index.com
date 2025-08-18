<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ConnSimple Insurance</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- Header -->
  <header>
    <h1>ConnSimple Insurance</h1>
    <nav>
      <a href="about.html">About</a>
      <a href="services.html">Services</a>
      <a href="quotes.html">Quote</a>
      <a href="contact.html">Contact</a>
    </nav>
  </header>

  <!-- Hero Section -->
  <section id="hero">
    <h2>Simple, Affordable Insurance Coverage</h2>
    <p>Protect what matters most with flexible plans tailored for you.</p>
    <a href="quotes.html" class="btn">Get a Quote</a>
  </section>

  <!-- Footer -->
  <footer>
    <p>&copy; 2025 ConnSimple Insurance. All Rights Reserved.</p>
  </footer>
</body>
</html>
