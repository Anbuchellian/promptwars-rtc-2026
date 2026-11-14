const fs = require('fs');

// Exact vector reproduction of the PathForge AI official emblem
// Burgundy Anvil + Turquoise Diagonal Career Arrow (Dual-facet 3D) + Navigation Compass
const officialSvg = `<svg
  width="100%"
  height="100%"
  viewBox="0 0 400 400"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <!-- Arrow Left Facet (Dark Teal / Cyan-Blue) -->
    <linearGradient id="pf-arrow-left" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#00695C" />
      <stop offset="60%" stop-color="#00838F" />
      <stop offset="100%" stop-color="#0097A7" />
    </linearGradient>

    <!-- Arrow Right Facet (Bright Turquoise / Mint) -->
    <linearGradient id="pf-arrow-right" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#00897B" />
      <stop offset="50%" stop-color="#00BFA5" />
      <stop offset="100%" stop-color="#1DE9B6" />
    </linearGradient>

    <!-- Anvil Deep Burgundy Body -->
    <linearGradient id="pf-burgundy-body" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6B1935" />
      <stop offset="100%" stop-color="#4F1126" />
    </linearGradient>

    <!-- Horn Top Bevel Highlights -->
    <linearGradient id="pf-horn-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8B2649" />
      <stop offset="100%" stop-color="#6B1935" />
    </linearGradient>
  </defs>

  <!-- ========================================== -->
  <!-- 1. COMPASS & NAVIGATION (Behind Anvil)     -->
  <!-- ========================================== -->
  <g id="compass-nav">
    <!-- Turquoise Arc Ring -->
    <path
      d="M 162 165 A 46 46 0 0 1 238 165"
      fill="none"
      stroke="#00A896"
      stroke-width="10"
      stroke-linecap="round"
    />

    <!-- Vertical Compass Needle (North Navigation Pointer) -->
    <!-- Needle Left Half (Dark Teal) -->
    <polygon points="200,120 190,175 197,184 200,182" fill="#00796B" />
    <!-- Needle Right Half (Bright Turquoise) -->
    <polygon points="200,120 210,175 203,184 200,182" fill="#00BFA5" />

    <!-- Center Lower Needle Diamond Tip (peeking through) -->
    <polygon points="200,182 191,196 199,200 200,198" fill="#00796B" />
    <polygon points="200,182 209,196 201,200 200,198" fill="#00BFA5" />
  </g>

  <!-- ========================================== -->
  <!-- 2. ANVIL (Deep Burgundy #6D1A36)           -->
  <!-- Cut cleanly around the diagonal arrow      -->
  <!-- ========================================== -->
  <g id="anvil-forge">
    <!-- Left Horn & Body -->
    <!-- Top step + Horn + Waist + Bottom cutout -->
    <path
      d="M 148 171
         L 100 177
         C 97 177, 96 181, 101 184
         C 122 196, 138 205, 149 215
         L 149 223
         C 149 231, 153 238, 163 245
         L 171 234
         L 186 212
         L 186 171
         Z"
      fill="url(#pf-burgundy-body)"
    />
    <!-- Left Horn Top Highlight Bevel -->
    <path
      d="M 102 178
         C 99 179, 101 181, 108 183
         C 122 186, 137 186, 148 184
         L 148 178
         Z"
      fill="url(#pf-horn-highlight)"
      opacity="0.9"
    />

    <!-- Right Horn, Waist & Right Foot -->
    <path
      d="M 214 171
         L 252 171
         L 300 177
         C 303 177, 304 181, 299 184
         C 278 196, 262 205, 251 215
         L 251 223
         C 251 233, 248 243, 238 252
         C 246 262, 254 272, 264 284
         L 225 284
         C 211 273, 196 268, 180 278
         L 210 227
         L 214 171
         Z"
      fill="url(#pf-burgundy-body)"
    />
    <!-- Right Horn Top Highlight Bevel -->
    <path
      d="M 298 178
         C 301 179, 299 181, 292 183
         C 278 186, 263 186, 252 184
         L 252 178
         Z"
      fill="url(#pf-horn-highlight)"
      opacity="0.9"
    />

    <!-- Center Raised Anvil Blocks (Step) -->
    <rect x="148" y="171" width="38" height="10" fill="#5A142B" />
    <rect x="214" y="171" width="38" height="10" fill="#5A142B" />
  </g>

  <!-- ========================================== -->
  <!-- 3. CAREER TRAJECTORY ARROW (Turquoise 3D)  -->
  <!-- ========================================== -->
  <g id="career-arrow">
    <!-- Arrow Left Facet (Darker Teal / Cyan-Blue) -->
    <!-- Base Foot + Left Shaft + Left Arrowhead -->
    <path
      d="M 136 284
         L 136 266
         L 204 146
         L 228 146
         L 170 284
         Z"
      fill="url(#pf-arrow-left)"
    />
    <!-- Arrowhead Left Barb -->
    <path
      d="M 228 146
         L 198 168
         L 262 118
         Z"
      fill="url(#pf-arrow-left)"
    />

    <!-- Arrow Right Facet (Bright Turquoise / Mint) -->
    <!-- Right Shaft + Right Arrowhead -->
    <path
      d="M 170 284
         L 228 146
         L 252 146
         L 194 284
         Z"
      fill="url(#pf-arrow-right)"
    />
    <!-- Arrowhead Right Barb -->
    <path
      d="M 228 146
         L 262 118
         L 258 168
         L 240 159
         Z"
      fill="url(#pf-arrow-right)"
    />
  </g>
</svg>`;

fs.writeFileSync('starter-app/public/logo.svg', officialSvg, 'utf8');
fs.writeFileSync('public/logo.svg', officialSvg, 'utf8');
console.log('Saved starter-app/public/logo.svg and public/logo.svg successfully!');
