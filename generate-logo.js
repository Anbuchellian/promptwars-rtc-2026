const fs = require('fs');

const svgContent = `<svg
  width="100%"
  height="100%"
  viewBox="0 0 500 500"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <!-- Arrow Left Facet (Dark Teal) -->
    <linearGradient id="pf-teal-dark" x1="0%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="#00695C" />
      <stop offset="50%" stop-color="#00796B" />
      <stop offset="100%" stop-color="#00897B" />
    </linearGradient>

    <!-- Arrow Right Facet (Bright Turquoise / Mint) -->
    <linearGradient id="pf-teal-bright" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#009688" />
      <stop offset="40%" stop-color="#00BFA5" />
      <stop offset="100%" stop-color="#1DE9B6" />
    </linearGradient>

    <!-- Anvil Deep Burgundy -->
    <linearGradient id="pf-burgundy" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#671934" />
      <stop offset="100%" stop-color="#4E1026" />
    </linearGradient>

    <!-- Horn Bevel Highlight -->
    <linearGradient id="pf-horn-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8B2748" />
      <stop offset="100%" stop-color="#671934" />
    </linearGradient>
  </defs>

  <!-- ========================================== -->
  <!-- 1. COMPASS & NAVIGATION (Behind Anvil)     -->
  <!-- ========================================== -->
  <g id="compass-nav">
    <!-- Turquoise Arc Ring -->
    <path
      d="M 203 207 A 58 58 0 0 1 297 207"
      fill="none"
      stroke="#009688"
      stroke-width="12"
      stroke-linecap="round"
    />
    
    <!-- Vertical Compass Needle (North / Navigation) -->
    <!-- Needle Left (Darker Teal) -->
    <polygon points="250,152 238,222 246,232 250,230" fill="#00796B" />
    <!-- Needle Right (Brighter Teal) -->
    <polygon points="250,152 262,222 254,232 250,230" fill="#00BFA5" />

    <!-- Needle Lower Tip (Center behind anvil waist) -->
    <polygon points="250,230 240,248 249,252 250,250" fill="#00796B" />
    <polygon points="250,230 260,248 251,252 250,250" fill="#00BFA5" />
  </g>

  <!-- ========================================== -->
  <!-- 2. ANVIL BODY (Deep Burgundy)              -->
  <!-- ========================================== -->
  <g id="anvil-body">
    <!-- Left Horn & Left Anvil Half -->
    <path
      d="M 186 214
         L 124 221
         C 120 221, 120 225, 126 228
         C 152 242, 172 252, 186 264
         L 186 274
         L 210 274
         L 230 240
         L 236 214
         Z"
      fill="url(#pf-burgundy)"
    />
    <!-- Left Horn Top Highlight Sliver -->
    <path
      d="M 126 222
         C 122 223, 124 225, 134 227
         C 152 230, 172 230, 186 228
         L 186 220
         Z"
      fill="url(#pf-horn-highlight)"
      opacity="0.9"
    />

    <!-- Right Horn, Body & Right Foot -->
    <path
      d="M 264 214
         L 314 214
         L 376 221
         C 380 221, 380 225, 374 228
         C 348 242, 328 252, 314 264
         L 314 274
         C 314 286, 310 298, 298 310
         C 308 322, 318 335, 330 350
         L 282 350
         C 264 336, 246 330, 226 342
         L 262 278
         L 264 214
         Z"
      fill="url(#pf-burgundy)"
    />
    <!-- Right Horn Top Highlight Sliver -->
    <path
      d="M 374 222
         C 378 223, 376 225, 366 227
         C 348 230, 328 230, 314 228
         L 314 220
         Z"
      fill="url(#pf-horn-highlight)"
      opacity="0.9"
    />

    <!-- Center Anvil Block (Raised Step) -->
    <rect x="186" y="214" width="50" height="12" fill="#5A142B" />
    <rect x="264" y="214" width="50" height="12" fill="#5A142B" />
  </g>

  <!-- ========================================== -->
  <!-- 3. UPWARD CAREER ARROW (Turquoise 3D)      -->
  <!-- With white protective cutout border       -->
  <!-- ========================================== -->
  <g id="career-arrow">
    <!-- Clean negative space separation halo -->
    <!-- Arrow Left Facet (Dark Teal) -->
    <path
      d="M 170 350
         L 170 328
         L 254 180
         L 285 180
         L 212 350
         Z"
      fill="url(#pf-teal-dark)"
    />
    <!-- Arrowhead Left Half -->
    <path
      d="M 285 180
         L 248 206
         L 327 146
         Z"
      fill="url(#pf-teal-dark)"
    />

    <!-- Arrow Right Facet (Bright Turquoise / Mint) -->
    <path
      d="M 212 350
         L 285 180
         L 316 180
         L 244 350
         Z"
      fill="url(#pf-teal-bright)"
    />
    <!-- Arrowhead Right Half -->
    <path
      d="M 285 180
         L 327 146
         L 324 206
         L 302 195
         Z"
      fill="url(#pf-teal-bright)"
    />
  </g>
</svg>`;

fs.writeFileSync('starter-app/public/test-logo2.svg', svgContent, 'utf8');
console.log('Saved test-logo2.svg');
