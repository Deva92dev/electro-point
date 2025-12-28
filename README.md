#### Touch-First Interactions (active:scale, touch-manipulation) to make the web app feel native.

### why unified motion system

1. You must keep it purely compositional — no internal business logic, no state
   mutation, no animations inside it.
   Just reactive signals → combined interface.
   Think of it as a motion data bus, not a logic brain.

   That gives you the ability to build virtually any interactive component that depends on motion input, without ever attaching new raw event listeners inside the component itself. (all those 3 providers and 2 zones)

2. The perspective value (e.g., 1000, 500, 2000) is the distance in pixels from
   the viewer to the object:

   Lower values (100-500): More dramatic, exaggerated 3D effect (closer to viewer)
   Higher values (1000-2000): Subtle, realistic 3D effect (farther from viewer)
   Very high (3000+): Almost flat, minimal 3D effect.
   Perspective must be on the parent element, not the element being transformed.
   You can also control where the viewer is looking from using perspectiveOrigin.

3. Wrap with these (other than 3 global providers) where they actually needed example
   in cards where text is only use there

4. scrollYProgress from Lenis is very useful for:
   Global Progress Bar (Common Use Case)
   Navbar that Changes Based on Total Page Scroll
   Multi-Section Page Color Change
   Footer That Fades In at Bottom

5. For using (useScrollSegment) the scroll progress range you care about,
   not the full scroll of the page.
   If you only want a motion to happen while the container is visible, this ensures the value only changes within that segment.
   Outside that range, the value is clamped, so your element doesn’t overshoot or behave unexpectedly.
   Lets multiple scroll-driven animations coexist independently on the same page.

### Color Design system

    Core Color Application Strategy
    Here is a breakdown of which elements should use which color variables.

## Primary Colors (The "Action" Colors)

--primary (Amethyst: #7C3AED / #A78BFA)
Use: This is your main "action" color. Use it for the most important interactive elements that you want users to click.
Elements:
Buttons: "Add to Cart," "Buy Now," "Sign Up," "Checkout."
Links: Active navigation links (e.g., the page you are currently on).
Headlines: Main section titles (e.g., "Featured Laptops") for extra visual punch.
Key Icons: Cart icon, user profile icon.

--primary-foreground (White / Dark Slate)
Use: The text/icon color that sits on top of --primary.
Elements: Text inside your main buttons.

--secondary (Light Purple: #F5F3FF / #2D2D3A)
Use: For secondary actions or highlighting related information without competing with the primary color.
Elements:
Buttons: "View Details," "Compare," "Add to Wishlist."
Filters: Active filter tags (e.g., "Brand: Apple
Backgrounds: Subtle info boxes or "Quick Look" pop-ups.

--secondary-foreground (Amethyst / Light Gray)
Use: The text color that sits on top of --secondary.
Elements: Text inside secondary buttons.

## Accent & Utility Colors

--accent (Light Cyan: #ECFEFF / #2D2D3A)
Use: This is your "callout" color. It's great for drawing attention to special information that isn't a primary action.
Elements:
Badges: "New," "On Sale," "Featured."
Banners: "Free Shipping on orders over $50."
Alerts: Informational messages (not errors).

--destructive (Red: #EF4444 / #F87171)
Use: Only for negative or "danger" actions.
Elements:
"Remove from Cart" button/icon.
Error messages (e.g., "Payment failed").
"Out of Stock" labels.

Neutral Colors (The "Structure")
--background & --foreground
Use: The main page background and default text color. These create your site's main canvas.

--card & --card-foreground
Use: The background for all "contained" elements. This is critical for making your UI look clean and organized.
Elements:
Product cards.
Navbar and Footer (in dark mode).
Modal dialogs and popovers.
Sidebar.

--muted & --muted-foreground
Use: For less important text that provides context but shouldn't be distracting.
Elements:
Product specs (e.g., "Screen Size," "Storage").
Breadcrumbs.
Helper text under form fields (e.g., "Password must be 8 characters").
Disabled buttons or states.

--border & --input
Use: For structural separation and form fields.
Elements:
The border around product cards (subtle).
Input fields (Search bar, forms).
Dividers (e.g., <hr> tags).

### Cache Life

Profile Use Case stale revalidate expire
default Standard content 5 minutes 15 minutes 1 year
seconds Real-time data 30 seconds 1 second 1 minute
minutes Frequently updated content 5 minutes 1 minute 1 hour
hours Content updated multiple times per day 5 minutes 1 hour 1 day
days Content updated daily 5 minutes 1 day 1 week
weeks Content updated weekly 5 minutes 1 week 30 days
max Stable content that rarely changes 5 minutes 30 days 1 year

### Database performance

- Use db.query (Relational API) for fetching data to display on your frontend (e.g., Product Details Page, User Profile). It's cleaner, type-safe, and easier to read.

- Use db.select() for complex aggregations, analytics, or when performance is absolutely critical and you only need 2 columns out of 50.

### System Performance

- If you mark a data fetch as "use server", technically anyone can send a POST request to that function. If you write it in a normal file, it is internal only. It can never be called from the outside world.

- Import (src/assets): Optimization works + Automatic Size + Automatic Blur + Cache Busting. Superior. for static images

- performance.now();
- end = performance.now();

  console.log(
  `⚡ [Database] getProductsByColor took ${(end - start).toFixed(2)}ms`
  );
  console.log(`   📦 Items fetched: ${allProducts.length}`);

- If you are using glassmorphism, it is must to have something in background, a parent element, blob, image etc

- If you make a div with a gradient, it’s still a square (or circle) with hard edges. It looks like a sticker. To make it look like light (atmosphere), you need a Blur Filter.

- In a Server Component page, you can access search parameters using the "searchParams" prop:

- ALWAYS use the "columns": filter.
  If you use db.query without filtering columns, it is slow. If you use it with filtering, it is effectively as fast as db.select but with much better Developer Experience (DX).

  ### PostgreSQL Operators (The Logic)

  - The "sql "tag is a template literal. It does not "know" SQL. It just safely packages variables to send to the database.

  - The symbol @> is not TypeScript. It is PostgreSQL. To expand your filtering, you must learn Postgres Operators.

  - @> (Contains): Used for JSONB. "Does the array on the left contain the array on the right?"

  - ? (Exists): "Does this key string exist in the JSONB object?"

  - ilike (Case-insensitive Like): Used for search text. name ilike '%macbook%'.

  - > = / <=: Standard math for prices.

  - SQL Injection: Never write ${value} inside a raw string. Always use the ${value} interpolation provided by sql tag so Drizzle sanitizes it.

  - drizzle-orm/neon-http, The HTTP driver is "stateless"—it fires a request and forgets about it immediately. It cannot "hold the phone line open" to perform a transaction.

## Random for now
