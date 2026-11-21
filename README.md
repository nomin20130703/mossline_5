# Mossline

Environmental intelligence landing experience localized in Mongolian (Cyrillic), featuring a pinned 5-beat scroll story and interactive ecosystem telemetry.

## Development

```bash
npm install
npm run dev
```

## Analytics

Google Analytics 4 (GA4) tracking is optional and disabled by default.

### Configuration

1. Set `VITE_GA_MEASUREMENT_ID` in a local `.env` file (or in your hosting provider's build environment variables):

   ```env
   VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
   ```

   See `.env.example` for reference. Only valid GA4 measurement IDs matching `/^G-[A-Z0-9]{6,14}$/` are accepted. When `VITE_GA_MEASUREMENT_ID` is empty or invalid, no `gtag.js` script tag is injected, no network requests are made to `googletagmanager.com`, and all tracking calls are silent no-ops.

2. **Build-time baking:** Vite statically replaces `import.meta.env.VITE_*` values during compilation. Make sure `VITE_GA_MEASUREMENT_ID` is configured in the environment **before** running `npm run build` on your host.

### Tracked Events

All event parameters use fixed English `snake_case` keys (never user-facing text or personal data):

- `page_view`: Fired once on initial application load (`page_path`, `page_title`).
- `story_beat`: Fired at most once per page load when entering each scroll-story beat (`beat_name`, `beat_index`):
  - `hero` (`0`) — on load
  - `vision` (`1`) — scroll progress `sp >= 0.16`
  - `accounting` (`2`) — scroll progress `sp >= 0.45`
  - `field_station` (`3`) — scroll progress `sp >= 0.72`
  - `solutions` (`4`) — when the solutions panel enters the viewport (`top <= 60vh`)
- `hotspot_click`: Fired when a landscape hotspot is opened (`hotspot`: `soil_carbon`, `canopy_moisture`, `species_index`, `microclimate`).
- `feature_row_click`: Fired when a field-station feature row is clicked (`row`: `observation_system`, `atmospheric_monitoring`, `algorithmic_processing`, `blockchain_traceability`, `built_for_scale`).
- `solution_card_click`: Fired when a solution card is clicked (`card`: `forest_peatland`, `scope3_sourcing`, `biodiversity_credits`).
- `nav_menu_click`: Fired when a top navigation item is clicked (`item`: `solutions`, `our_tech`, `company`, `resources`).
- `nav_cta_click`: Fired when the primary navigation CTA button is clicked.

### Verifying in GA4

Open your Google Analytics 4 property and navigate to **Reports → Realtime** while browsing and scrolling through the deployed build. Events appear within a few seconds under the *Event count by Event name* card.
